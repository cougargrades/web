import React, { useCallback, useEffect, useState } from 'react';
import prettyBytes from 'pretty-bytes';
import TimeAgo from 'timeago-react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { v4 as uuid } from 'uuid';
import Papa from 'papaparse';
import { useFirestore, useFirestoreCollection } from 'reactfire/dist/index';
import type { GradeDistributionCSVRow } from '@cougargrades/types/dist/GradeDistributionCSVRow';
import { tryFromRaw } from '@cougargrades/types/dist/GradeDistributionCSVRow';
import { useInterval } from '../useinterval';
import { Dropzone } from './dropzone';
import { Progress } from './progress';
import { Button } from '../homepage/button';

import './uploader.scss';

export default function Uploader() {

  /**
   * UI
   */
  const [uploadStartedAt, setUploadStartedAt] = useState<Date>(new Date(0));
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const [allowUploading, setAllowUploading] = useState<boolean>(false);
  const [showBundleInfo, setShowBundleInfo] = useState<boolean>(false);

  /**
   * Upload logic
   */
  // File handles
  const [recordsFile, setRecordsFile] = useState<File>();
  const [patchFiles, setPatchFiles] = useState<File[]>([]);

  // number of rows processed so far
  const [uploadQueueProcessed, setUploadQueueProcessed] = useState<number>(0);
  // total number of rows
  const [uploadQueueMax, setUploadQueueMax] = useState<number>(0);
  // number of PF processed so far
  //const [patchfilesProcessed, setPatchfilesProcessed] = useState<number>(0);
  // total number of PF
  //const [patchfilesMax, setPatchfilesMax] = useState<number>(0);
  // max number to do in parallel
  const [recordConcurrencyLimit, setRecordConcurrencyLimit] = useState<number>(2);
  // current amount pending
  const [recordConcurrencyCount, setRecordConcurrencyCount] = useState<number>(0);
  const [initialSnapshotLoaded, setInitialSnapshotLoaded] = useState<boolean>(false);
  // firebase document IDs of the pending uploads
  const [pendingUploads, setPendingUploads] = useState<string[]>([]);
  // decoded CSV
  const [loadedRecords, setLoadedRecords] = useState<GradeDistributionCSVRow[]>([]);

  /**
   * Firebase stuff
   */
  const firestore = useFirestore();
  useEffect(() => {
    /**
     * Subscribe to the upload_queue collection
     * 
     * We only want to subscribe once because we don't want to miss uploads. However, in order for React to
     * only run something once, we need to do `useEffect(..., [])` with an empty array. This means that whenever
     * `.onShapshot()` is called, we're reading the old/out-of-date values of the state. This means that in
     * `onCollectionSnapshot` we can only do WRITE operations, but no read operations. To respond to these write
     * operations with current/up-to-date state data, we use a separate `useEffect()` hook.
     */
    const unsubscribe = firestore.collection('upload_queue_backlog').onSnapshot(onCollectionSnapshot);

    return () => { unsubscribe() };
  }, []);

  /**
   * Methods
   */

  // What happens when the Upload button is clicked
  const handleClick = useCallback(() => {
    // This allows us to benchmark upload times
    setUploadStartedAt(new Date());
    // This triggers the useEffect() that listens to `allowUploading`, which will start the upload queue
    setAllowUploading(true);
  }, [ recordsFile, patchFiles ]);

  // What happens when files are dropped into the page
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    /**
     * we identify what a file is depending on its name,
     * because we don't have access to its full path
     * see: 
     * - https://stackoverflow.com/a/23005925/2275818
     * - https://developer.mozilla.org/en-US/docs/Web/API/File
     * 
     * then we save references to the native File so we can read it later
     */

    // Update UI
    setIsButtonEnabled(false);
    setShowBundleInfo(true);

    // Save reference to records
    acceptedFiles.forEach(file => {
      // identify primary CSV data source
      if(file.name === 'records.csv') {
        setRecordsFile(_ => {
          // parse CSV file
          Papa.parse(file, {
            worker: true,
            header: true,
            dynamicTyping: false,
            skipEmptyLines: true,
            complete: results => {
              // Reformat and validate decoded CSV
              let validated = results.data
                .map(e => tryFromRaw(e))
                .filter((e): e is GradeDistributionCSVRow => e !== null);
              
              // Update state
              setLoadedRecords(v => [...validated]);
              setUploadQueueMax(validated.length);
              setIsButtonEnabled(true);
    
              // console.log(validated);
              // console.log('All done!')
            },
          });
          return file;
        });
      }
    });

    // Save references to patchfiles
    setPatchFiles(pf => [
      // Set only the patchfiles, and in the correct order
      ...acceptedFiles
        .filter(e => e.name.startsWith('patch-') && e.name.endsWith('.json'))
        .sort((a,b) => a.name.localeCompare(b.name))
    ]);
  }, []);

  // Return a random entry from the loaded records, then delete it from our memory
  const popRecordFromQueue = (): GradeDistributionCSVRow => {
    // generate random index
    let idx = Math.floor(Math.random() * loadedRecords.length);
    // fetch random index
    let copy = loadedRecords[idx];
    // remove random index
    setLoadedRecords(x => [...x.slice(0, idx).concat(x.slice(idx + 1))]);
    // send back
    return copy;
  };

  /**
   * What happens whenever a new file enters or leaves the server-side processing queue
   * NOTE: ALL STATE READS FROM THIS CONTEXT WILL BE OUT OF DATE.
   * (see "Firebase stuff" above for details)
   */ 
  const onCollectionSnapshot = (snapshot: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
    // get the document IDs of the additions and removals
    let removals = snapshot.docChanges().filter(e => e.type === 'removed').map(e => e.doc.id);
    let additions = snapshot.docChanges().filter(e => e.type === 'added').map(e => e.doc.id);
    // adjust pending upload queue
    setPendingUploads(x => {
      let copy = x.slice();
      // remove all removals
      for(let r of removals) {
        copy.splice(copy.indexOf(r), 1);
      }
      // add all additions
      return [...copy, ...additions];
    });

    // Update count
    setRecordConcurrencyCount(x => x + additions.length - removals.length);
    setUploadQueueProcessed(x => x + removals.length);
    setInitialSnapshotLoaded(true);
  };

  /**
   * Ran whenever one of these state values change
   * Respond to vacancies in the upload_queue
   */
  useEffect(() => {
    // if the first snapshot has loaded already, then it's safe to trust the state data we have access to
    if(initialSnapshotLoaded) {
      // computes number of times we can add to the current queue
      console.log('recordConcurrencyLimit: ', recordConcurrencyLimit);
      console.log('recordConcurrencyCount: ', recordConcurrencyCount);
      const can_upload_next = recordConcurrencyLimit - recordConcurrencyCount;
      console.log('can_upload_next: ', can_upload_next);
      /**
       * if:
       * - there is room in the upload_queue
       * - if we have records loaded
       * - if we're allowed to upload
       */
      if(can_upload_next > 0 && loadedRecords.length > 0 && allowUploading) {
        // actually do the firestore upload
        firestore.collection('upload_queue_backlog').doc().set(popRecordFromQueue());
      }
      console.log('---');
    }
  }, [recordConcurrencyCount, recordConcurrencyLimit, initialSnapshotLoaded, allowUploading]);

  return (
    <div>
      <h3>Database Uploader</h3>
      <p>To use, grab the latest <a href="https://github.com/cougargrades/publicdata/releases/latest">public data bundle</a>, unzip it, and drop the files onto this webpage.</p>
      <p>Public data bundles have <em>a lot</em> of files, so this will likely lag your web browser.</p>
      <Dropzone onDrop={handleDrop} />
      {
        ! showBundleInfo ? <></> :
        <>
        {/* File info area */}
        <h4>Bundle info</h4>
        <ul>
          <li><code>{recordsFile?.name}</code></li>
          <ul>
            <li>File size: {prettyBytes(recordsFile ? recordsFile.size : 0)}</li>
            <li>Number of rows: {Number(uploadQueueMax).toLocaleString()}</li>
          </ul>
          <li>Loaded {patchFiles.length} Patchfiles</li>
        </ul>
        {/* Input area */}
        <label className="form-label">Concurrency Limit</label>
        <input className="form-control" type="number" min={1} max={10} value={recordConcurrencyLimit} onChange={e => setRecordConcurrencyLimit(e.target.valueAsNumber)} />
        <div className="form-text">
          Maximum number of documents allowed to be inside the <code>upload_queue</code> Firestore collection at once.
        </div>
        <br />
        <div className="d-flex flex-row align-items-center" style={{ columnGap: '1rem' }}>
          <Button variant="adaptive" onClick={handleClick} disabled={!isButtonEnabled}>Start Upload</Button>
          <p className="mb-0">{uploadStartedAt.valueOf() > 0 ? <>Upload started at {uploadStartedAt.toLocaleString()} (<TimeAgo datetime={uploadStartedAt!} locale={'en'} />).</> : <></> }</p>
        </div>
        {/* Upload status area */}
        {
          uploadStartedAt.valueOf() === 0 ? <></> :
          <>
          <h4>Uploading records</h4>
          <Progress value={uploadQueueProcessed} max={uploadQueueMax}>{`${Math.round(uploadQueueProcessed/uploadQueueMax*100)}%`}</Progress>
          <label>Row {Number(uploadQueueProcessed).toLocaleString()} of {Number(uploadQueueMax).toLocaleString()}</label>
          <h5>Debugging</h5>
          <ul>
            <li>recordConcurrencyCount: {recordConcurrencyCount}</li>
          </ul>
          <h4>Active Uploads</h4>
          <ul>
            <TransitionGroup>
              {pendingUploads.map(id => (
                <CSSTransition key={id} classNames="item" timeout={1000}>
                  <li>{id}</li>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </ul>
          </>
        }
        </>
      }
    </div>
  );
}