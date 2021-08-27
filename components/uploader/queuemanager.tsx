import React, { useState } from 'react'
import { useFirestore } from 'reactfire'
import Button from '@material-ui/core/Button'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { LinearProgressWithLabel } from './progress'

//import styles from './uploader.module.scss'

export function QueueManager() {
  /**
   * Firebase stuff
   */
  const firestore = useFirestore();
  const FieldValue = useFirestore.FieldValue;

  /**
   * UI
   */
  const [uploadQueueRecycleInProgress, setUploadQueueRecycleInProgress] = useState<boolean>(false)
  const [uploadQueueRecycleDone, setUploadQueueRecycleDone] = useState<number>(0);
  const [uploadQueueRecycleMax, setUploadQueueRecycleMax] = useState<number>(0);
  const [uploadQueueTripInProgress, setUploadQueueTripInProgress] = useState<boolean>(false)
  const [uploadQueueTripDone, setUploadQueueTripDone] = useState<number>(0);
  const [uploadQueueTripMax, setUploadQueueTripMax] = useState<number>(0);

  const handleClick = async () => {
    console.log('clicked')
    setUploadQueueRecycleInProgress(true)
    // get upload_queue docs
    const upload_queue_snap = await firestore.collection('upload_queue').get();
    setUploadQueueRecycleMax(upload_queue_snap.size)
    // save a copy of the data
    const data = upload_queue_snap.docs.map(e => e.data())
    // delete items in upload_queue
    for(const doc of upload_queue_snap.docs) {
      await doc.ref.delete()
    }
    // add extracted data to backlog
    for(const item of data) {
      await firestore.collection('upload_queue_backlog').add(item)
      setUploadQueueRecycleDone(x => x + 1)
    }
    setUploadQueueRecycleInProgress(false)
  }

  const handleClick2 = async () => {
    console.log('clicked')
    setUploadQueueTripInProgress(true)
    // get upload_queue docs
    const upload_queue_snap = await firestore.collection('upload_queue').get();
    setUploadQueueTripMax(upload_queue_snap.size)
    // save a copy of the data
    const data = upload_queue_snap.docs.map(e => e.data())
    // delete items in upload_queue
    for(const doc of upload_queue_snap.docs) {
      await doc.ref.delete()
    }
    // add extracted data to backlog
    for(const item of data) {
      await firestore.collection('upload_queue_backlog').add(item)
      setUploadQueueTripDone(x => x + 1)
    }
    setUploadQueueTripInProgress(false)
  }

  return (
    <div>
      <h3>Database Utilities</h3>
      <div className="d-flex flex-row align-items-center" style={{ columnGap: '1rem' }}>
        {/* upload_queue recycle */}
        <Button variant="contained" onClick={handleClick} disabled={uploadQueueRecycleInProgress}>upload_queue <ArrowForwardIcon /> upload_queue_backlog</Button>
        <p className="mb-0">
          Recycled {uploadQueueRecycleDone} of {uploadQueueRecycleMax}
        </p>
      </div>
      <LinearProgressWithLabel value={uploadQueueRecycleDone/uploadQueueRecycleMax*100} />

      <div className="d-flex flex-row align-items-center" style={{ columnGap: '1rem' }}>
        {/* upload_queue trip */}
        <Button variant="contained" onClick={handleClick2} disabled={uploadQueueTripInProgress}>upload_queue_backlog <ArrowForwardIcon /> upload_queue</Button>
        <p className="mb-0">
          Tripped {uploadQueueTripDone} of {uploadQueueTripMax}
        </p>
      </div>
      <LinearProgressWithLabel value={uploadQueueTripDone/uploadQueueTripMax*100} />

      {/* boop */}
    </div>
  );
}