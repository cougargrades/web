import React, { useCallback, useEffect, useState } from 'react'
import prettyBytes from 'pretty-bytes'
import TimeAgo from 'timeago-react'
import * as timeago from 'timeago.js'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Papa from 'papaparse'
import { useFirestore } from 'reactfire'
import type { GradeDistributionCSVRow } from '@cougargrades/types/dist/GradeDistributionCSVRow'
import { tryFromRaw } from '@cougargrades/types/dist/GradeDistributionCSVRow'
import { executePatchFile } from '@cougargrades/types/dist/PatchfileUtil'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Alert from '@material-ui/core/Alert'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { Dropzone } from './dropzone'
import { LinearProgressWithLabel, SliderWithLabel } from './progress'
import { readPatchfile } from './AsyncFileReader'
import { AsyncSemaphore } from './AsyncSemaphore'
import { localeFunc } from './timeago'

//import styles from './uploader.module.scss'

export function Uploader() {
  timeago.register('en_US_custom', localeFunc);

  /**
   * UI
   */
  const [uploadStartedAt, setUploadStartedAt] = useState<Date>(new Date(0));
  const [uploadFinishedAt, setUploadFinishedAt] = useState<Date>(new Date(0));
  const [recordProcessingStartedAt, setRecordProcessingStartedAt] = useState<Date>(new Date(0));
  const [recordProcessingEstimate, setRecordProcessingEstimate] = useState<Date>(new Date(0));
  const [recordProcessingFinishedAt, setRecordProcessingFinishedAt] = useState<Date>(new Date(0));
  const [patchfileProcessingStartedAt, setPatchfileProcessingStartedAt] = useState<Date>(new Date(0));
  const [patchfileProcessingEstimate, setPatchfileProcessingEstimate] = useState<Date>(new Date(0));
  const [patchfileProcessingFinishedAt, setPatchfileProcessingFinishedAt] = useState<Date>(new Date(0));
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const [allowUploading, setAllowUploading] = useState<boolean>(false);
  const [showBundleInfo, setShowBundleInfo] = useState<boolean>(false);
  const [showPendingUploads, setShowPendingUploads] = useState<boolean>(false);

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
  const [patchfilesProcessed, setPatchfilesProcessed] = useState<number>(0);
  // total number of PF
  const [patchfilesMax, setPatchfilesMax] = useState<number>(0);
  // current phase of patchfiles
  const [patchfilesPhase, setPatchfilesPhase] = useState<number>(-1);
  // max number of phases
  const [patchfilesMaxPhase, setPatchfilesMaxPhase] = useState<number>(-1);
  // max number to do in parallel
  //const [patchfileConcurrencyLimit, setPatchfileConcurrencyLimit] = useState<number>(64);
  // max number to do in parallel (per phase)
  const [patchfileConcurrencyLimitPerPhase, setPatchfileConcurrencyLimitPerPhase] = useState<{ prefix: string, limit: number}[]>([]);
  // number of patchfiles which failed to execute
  const [patchfilesFailed, setPatchfilesFailed] = useState<number>(0);
  // easier to list why a patchfile failed
  const [patchfilesFailedReasons, setPatchfilesFailedReasons] = useState<string[]>([]);

  // max number to do in parallel
  const [recordConcurrencyLimit, setRecordConcurrencyLimit] = useState<number>(64);
  // current amount pending
  const [recordConcurrencyCount, setRecordConcurrencyCount] = useState<number>(0);
  // has the original snapshot loaded?
  const [initialSnapshotLoaded, setInitialSnapshotLoaded] = useState<boolean>(false);
  // firebase document IDs of the pending uploads
  const [pendingUploads, setPendingUploads] = useState<string[]>([]);
  // decoded CSV
  const [loadedRecords, setLoadedRecords] = useState<GradeDistributionCSVRow[]>([]);

  /**
   * Firebase stuff
   */
  const firestore = useFirestore();
  const FieldValue = useFirestore.FieldValue;
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

    console.log('another!', firestore);

    const unsubscribe = firestore.collection('upload_queue').onSnapshot(onCollectionSnapshot);

    return () => { unsubscribe() };
  }, [ firestore ]);
  useEffect(() => {
    /**
     * Do the same thing as above, but for the backlog
     */
    const unsubscribe = firestore.collection('upload_queue_backlog').onSnapshot(onAddedToBacklog);

    return () => { unsubscribe() };
  }, [ firestore ]);

  /**
   * Methods
   */

  // What happens when the Upload button is clicked
  const handleClick = () => {
    // run phase 0 before doing courses
    if(patchfilesMaxPhase > -1) {
      setPatchfilesPhase(0);
    }
    else {
      setAllowUploading(true);
    }
    // This allows us to benchmark upload times
    setUploadStartedAt(new Date());
    setRecordProcessingStartedAt(new Date());
    // This triggers the useEffect() that listens to `allowUploading`, which will start the upload queue
    // setAllowUploading(true); // this is done after phase 0 completes instead
    setIsButtonEnabled(false);
  };

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
      if(file.name.startsWith('records') && file.name.endsWith('.csv')) {
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
            },
          });
          return file;
        });
      }
    });

    // Set only the patchfiles, and in the correct order
    const temp = acceptedFiles
      .filter(e => e.name.startsWith('patch-') && e.name.endsWith('.json'))
      .sort((a,b) => a.name.localeCompare(b.name));

    if(temp.length > 0) {
      // get final patchfile phase
      setPatchfilesMaxPhase(x => Number( // convert to a number
        temp[temp.length - 1] // last patchfile after sorting
        .name // access name
        .split('-') // [ "patch", "0", "groupdefaults", "1617828381961927207.json" ]
        [1] // access phase
      ));
    }

    // Save references to patchfiles
    setPatchFiles(pf => [ ...temp ]);
    setPatchfilesMax(temp.length)
    setIsButtonEnabled(true);
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
   * Same as above
   */
  const onAddedToBacklog = async (snapshot: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
    // we want all the additions
    let additions = snapshot.docChanges().filter(e => e.type === 'added');

    // validate additions by attempting to map back to GradeDistributionCSVRow
    let validated = additions
      .map(e => tryFromRaw(e))
      .filter((e): e is GradeDistributionCSVRow => e !== null);

    // actually attempt to delete these from the upload_queue_backlog, because we've already staged them to be added again
    for(let item of additions) {
      await item.doc.ref.delete();
    }

    // Update state
    setLoadedRecords(v => [...v, ...validated]); // add backlogged records to end of loaded records
    setUploadQueueMax(x => x + validated.length); // expand the length of the queue because we're executing these again
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
        firestore.collection('upload_queue').doc().set(popRecordFromQueue());
      }
      console.log('---');
    }
  }, [recordConcurrencyCount, recordConcurrencyLimit, initialSnapshotLoaded, allowUploading]);

  /**
   * Detect when records upload is completed
   */
  useEffect(() => {
    // estimate when upload will be completed
    // (TimeTaken / linesProcessed) * linesLeft = timeLeft
    const now = new Date().valueOf();
    const timeTaken = now - recordProcessingStartedAt.valueOf();
    const itemsRemaining = uploadQueueMax - uploadQueueProcessed;
    const timeRemaining = (timeTaken / uploadQueueProcessed) * itemsRemaining;
    setRecordProcessingEstimate(new Date(now + timeRemaining));

    if(uploadStartedAt.valueOf() > 0 && ((uploadQueueMax > 0 && uploadQueueProcessed === uploadQueueMax) || (uploadQueueMax === 0))) {
      console.log('UPLOAD FINISHED MAYBE?');

      // mark records as completed
      setRecordProcessingFinishedAt(new Date());

      // update patchFile phase to begin processing patchfiles
      if(patchfilesPhase === 0 && patchfilesMaxPhase > 0) {
        setPatchfilesPhase(1)
      }
      else {
        console.log('no patchfiles to process after records');
        // mark all uploads as finished
        setUploadFinishedAt(new Date());
        setPatchfileProcessingFinishedAt(new Date());
      }
      setPatchfileProcessingStartedAt(new Date());
    }
  }, [ uploadQueueProcessed, uploadQueueMax, uploadStartedAt, patchfilesPhase, patchfilesMaxPhase ]);

  /**
   * Execute an individual patchfile
   */
  const processPatchfile = async (file: File) => {
    //console.log(`reading: ${file.name}`);
    const contents = await readPatchfile(file);
    //console.log(`read: ${file.name}`);
    if(contents !== null) {
      //console.log(`executing: ${file.name}`);
      try {
        await executePatchFile(firestore, FieldValue as any, contents);
        setPatchfilesProcessed(x => x + 1);
      }
      catch(err) {
        console.warn('Patchfile failed: ', err);
        setPatchfilesProcessed(x => x + 1);
        setPatchfilesFailed(x => x + 1);
        setPatchfilesFailedReasons(x => [...x, `For target '${contents.target.path}': ${err}`])
      }
      //console.log(`DONE: ${file.name}`);
    }
  }

  /**
   * Execute each Patchfile phase
   */
  useEffect(() => {
    (async () => {
      // phases start at 0
      if(patchfilesPhase >= 0 && patchfilesPhase <= patchfilesMaxPhase) {
        // only run phases which have patchfiles, skip phases that are missing them
        if(patchfileConcurrencyLimitPerPhase[patchfilesPhase] !== undefined) {
          //console.log(patchfilesPhase, 'well defined')
          const filesForCurrentPhase = patchFiles.filter(e => e.name.startsWith(`patch-${patchfilesPhase}`));

          // parallel processing
          const semaphore = new AsyncSemaphore(patchfileConcurrencyLimitPerPhase[patchfilesPhase].limit);

          for(let file of filesForCurrentPhase) {
            await semaphore.withLockRunAndForget(async () => await processPatchfile(file));
          }
          
          await semaphore.awaitTerminate();
          console.log(`phase ${patchfilesPhase} queue done!`);

          // remove current phase to prevent double executions
          setPatchFiles(x => [...patchFiles.filter(e => ! e.name.startsWith(`patch-${patchfilesPhase}`))]);
        }
        else {
          console.log('phase skipped: files for phase', patchfilesPhase, 'are missing');
        }

        // kick off to process next phase, but only 
        if(patchfilesPhase < patchfilesMaxPhase) {
          // but only if we've already done phase 0 (special phase)
          if(patchfilesPhase >= 1) {
            console.log('attempting kick off of next phase: ', patchfilesPhase + 1);
            setPatchfilesPhase(x => x + 1);
          }
          else {
            console.log(`phase kickoff skipped (finished phase ${patchfilesPhase})`)
            setAllowUploading(true);
          }
        }
        else {
          console.log('no more phases!');
          // mark all uploads as finished
          setUploadFinishedAt(new Date());
          setPatchfileProcessingFinishedAt(new Date());
        }
      }
    })();
    // do nothing if phase == -1
  }, [ patchfilesPhase, patchfilesMaxPhase, patchfileConcurrencyLimitPerPhase ])

  /**
   * Estimate when Patchfile queue will be completed
   */
  useEffect(() => {
    // (TimeTaken / linesProcessed) * linesLeft = timeLeft
    const now = new Date().valueOf();
    const timeTaken = now - patchfileProcessingStartedAt.valueOf();
    const itemsRemaining = patchfilesMax - patchfilesProcessed;
    const timeRemaining = (timeTaken / patchfilesProcessed) * itemsRemaining;
    setPatchfileProcessingEstimate(new Date(now + timeRemaining));
  }, [patchfilesProcessed, patchfilesMax, patchfileProcessingStartedAt])

  /**
   * 
   */
  useEffect(() => {
    if(patchfilesMaxPhase > 0 && patchfilesPhase === -1) {
      // temporarily get sorted list of patchfiles
      const temp = patchFiles.slice().sort((a,b) => a.name.localeCompare(b.name));
      // [ "patch", "0", "groupdefaults", "1617828381961927207.json" ]
      const prefixes = Array.from(new Set(temp.map(e => {
        const phase = e.name.split('-')[1]
        const prefix = e.name.split('-')[2]
        return `${phase}-${prefix}`
      })))
      // properly set the limits per phase if phases are missing
      const limitPerPhase: { prefix: string, limit: number}[] = [];
      for(const item of prefixes) {
        const [phase, prefix] = item.split('-'); 
        limitPerPhase[parseInt(phase)] = { prefix, limit: 64 };
      }

      setPatchfileConcurrencyLimitPerPhase([...limitPerPhase])
    }
  }, [patchFiles, patchfilesPhase, patchfilesMaxPhase])

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
        <div className="form-text">{Number(uploadQueueMax).toLocaleString()} rows ({prettyBytes(recordsFile ? recordsFile.size : 0)}), {Number(patchfilesMax).toLocaleString()} Patchfiles ({prettyBytes(patchFiles.length > 0 ? patchFiles.map(e => e.size).reduce((sum, x) => sum + x) : 0)})</div>
        <br />
        {/* Input area */}
        <div className="row">
          <TextField
            variant="outlined"
            label="Record Concurrency Limit"
            helperText={`Maximum number of documents allowed to be inside the "upload_queue" Firestore collection at once. Default: 64`}
            type="number"
            value={recordConcurrencyLimit}
            onChange={e => setRecordConcurrencyLimit(parseInt(e.target.value))}
          />
        </div>
        <div className="row">
          <h5>Patchfile Concurrency Limits</h5>
          <Typography variant="body2" color="text.secondary">
            Maximum number of patchfiles to process concurrently (the initial value of the semaphore), customizable per phase. Default: 64
          </Typography>
          {patchfileConcurrencyLimitPerPhase.map(({ prefix, limit }, index) => (
            <SliderWithLabel 
              key={index}
              label={prefix}
              valueLabelDisplay="auto"
              disabled={patchfilesPhase > -1}
              defaultValue={64}
              value={limit}
              onChange={(_, value) => setPatchfileConcurrencyLimitPerPhase(x => {
                const temp = x.slice();
                temp[index].limit = value as number;
                return temp;
              })}
              min={1}
              max={64}
              step={4}
              marks 
            />
          ))}
          {
          patchfileConcurrencyLimitPerPhase.length > 0 ? <></> : 
          <Box style={{ marginTop: 5 }}>
            <Alert severity="info">Patchfiles not added</Alert>
          </Box>
          }
        </div>
        <br />
        <div className="form-check form-switch">
          <FormControlLabel control={<Switch checked={showPendingUploads} onChange={e => setShowPendingUploads(e.target.checked)} />} label="Show pending uploads animation" />
        </div>
        <br />
        <div className="d-flex flex-row align-items-center" style={{ columnGap: '1rem', paddingBottom: '1rem' }}>
          <Button variant="contained" onClick={handleClick} disabled={!isButtonEnabled}>Start Upload</Button>
          <p className="mb-0">
            {
              uploadStartedAt.valueOf() === 0 || uploadFinishedAt.valueOf() > 0 ? <></> :
              <>
                Upload started at {uploadStartedAt.toLocaleString()} (<TimeAgo datetime={uploadStartedAt!} locale={'en_US'} />).
                <br />
              </> 
            }
            {
              uploadFinishedAt.valueOf() === 0 ? <></> :
              <>
                Upload finished <TimeAgo datetime={uploadFinishedAt} opts={{ relativeDate: uploadStartedAt }} locale={'en_US'} />.
              </> 
            }
          </p>
        </div>
        {/* Upload status area */}
        {
          uploadStartedAt.valueOf() === 0 ? <></> :
          <>
          <h4>Uploading records</h4>
          <LinearProgressWithLabel value={uploadQueueProcessed/uploadQueueMax*100} />
          {/* <Progress value={uploadQueueProcessed} max={uploadQueueMax} variant="bg-blue">{`${Math.round(uploadQueueProcessed/uploadQueueMax*100)}%`}</Progress> */}
          <label>
            Row {Number(uploadQueueProcessed).toLocaleString()} of {Number(uploadQueueMax).toLocaleString()}
            {
              recordProcessingFinishedAt.valueOf() > 0 ? <></> :
              <>
                , ETA <TimeAgo datetime={recordProcessingEstimate} opts={{ relativeDate: new Date() }} locale={'en_US_custom'} />
              </>
            }
          </label>
          <h4>Executing Patchfiles</h4>
          <LinearProgressWithLabel value={patchfilesProcessed/patchfilesMax*100} />
          {/* <Progress value={patchfilesProcessed} max={patchfilesMax} variant="bg-purple">{`${Math.round(patchfilesProcessed/patchfilesMax*100)}%`}</Progress> */}
          <label>
            Patchfile {Number(patchfilesProcessed).toLocaleString()} of {Number(patchfilesMax).toLocaleString()}
            {
              patchfileProcessingFinishedAt.valueOf() > 0 ? <></> :
              <>
                , ETA <TimeAgo datetime={patchfileProcessingEstimate} opts={{ relativeDate: new Date() }} locale={'en_US_custom'} />
              </>
            }
          </label>
          {
            patchfilesFailed === 0 ? <></> : 
            <>
              <Alert severity="warning">{patchfilesFailed} Patchfiles failed to execute.</Alert>
              <details>
                <summary>See reasons</summary>
                <ul>
                { patchfilesFailedReasons.map((value, index) => <li key={index}>{value}</li>)}
                </ul>
              </details>
            </>
          }
          <h5>Debugging</h5>
          <ul>
            <li>recordConcurrencyCount: {recordConcurrencyCount}</li>
            <li>patchfilesPhase: {patchfilesPhase}</li>
            <li>patchfilesMaxPhase: {patchfilesMaxPhase}</li>
          </ul>
          {
            ! showPendingUploads ? <></> : 
            <>
            <h4>Active Uploads</h4>
            <ul>
              <TransitionGroup>
                {pendingUploads.slice().sort().map(id => (
                  <CSSTransition key={id} classNames="upload-item" timeout={200}>
                    <li>{id}</li>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </ul>
            </>
          }
          </>
        }
        </>
      }
    </div>
  );
}