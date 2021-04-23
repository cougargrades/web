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
    // subscribe to the upload_queue collection
    const unsubscribe = firestore.collection('upload_queue_backlog').onSnapshot(onCollectionSnapshot);

    return () => { unsubscribe() };
  }, []);

  /**
   * Methods
   */

  // What happens when the Upload button is clicked
  const handleClick = useCallback(() => {
    console.log(uploadStartedAt.valueOf());
    setUploadStartedAt(new Date());
    setAllowUploading(true);
    console.log('button was clicked!');
    console.log(loadedRecords);

    // TODO: "pop record queue" or start queue otherwise
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

    // Save reference to records
    acceptedFiles.forEach(file => {
      if(file.name === 'records.csv') {
        setRecordsFile(_ => {
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
    
              console.log(validated);
              console.log('All done!')
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
   * NOTE: ALL STATE READS FROM THIS CONTEXT WILL BE OUT OF DATE
   */ 
  const onCollectionSnapshot = (snapshot: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
    console.log('collection snapshot!');
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

  // Ran whenever one of these state values change
  useEffect(() => {
    // we might be able to do something here
    if(initialSnapshotLoaded) {
      // computes number of times we can add to the current queue
      console.log('recordConcurrencyLimit: ', recordConcurrencyLimit);
      console.log('recordConcurrencyCount: ', recordConcurrencyCount);
      const can_upload_next = recordConcurrencyLimit - recordConcurrencyCount;
      console.log('can_upload_next: ', can_upload_next);
      if(can_upload_next > 0 && loadedRecords.length > 0 && allowUploading) {
        // actually do the firestore upload
        firestore.collection('upload_queue_backlog').doc().set(popRecordFromQueue());
      }
      console.log('---');
    }
  }, [recordConcurrencyCount, recordConcurrencyLimit, initialSnapshotLoaded, allowUploading]);

  // Simulates queue traversal
  // useInterval(() => {
  //   // remove from beginning
  //   // setPendingUploads([...pendingUploads.slice(1), uuid()]);
  //   // generate random index
  //   let idx = Math.floor(Math.random()*pendingUploads.length);
  //   // remove random index, append new to end
  //   setPendingUploads([...pendingUploads.slice(0,idx).concat(pendingUploads.slice(idx+1)), uuid()])
  //   setUploadQueueProcessed(x => x + 1);
  // }, 100);

  return (
    <div>
      <h3>Database Uploader</h3>
      <p>To use, grab the latest <a href="https://github.com/cougargrades/publicdata/releases/latest">public data bundle</a>, unzip it, and drop the files onto this webpage.</p>
      <p>Public data bundles have <em>a lot</em> of files, so this will likely lag your web browser.</p>
      <Dropzone onDrop={handleDrop} />
      {
        false ? <></> :
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
        <div className="d-flex flex-row align-items-center" style={{ rowGap: '1rem' }}>
          <Button variant="adaptive" onClick={handleClick} disabled={!isButtonEnabled}>Start Upload</Button>
          <p className="mb-0">{uploadStartedAt.valueOf() > 0 ? <>Upload started at {uploadStartedAt.toLocaleString()} (<TimeAgo datetime={uploadStartedAt!} locale={'en'} />).</> : <></> }</p>
        </div>
        {/* Upload status area */}
        {
          uploadStartedAt.valueOf() === 0 && false ? <></> :
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