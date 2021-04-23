import React, { useCallback, useState } from 'react';
import prettyBytes from 'pretty-bytes';
import TimeAgo from 'timeago-react';
import Papa from 'papaparse';
import type { GradeDistributionCSVRow } from '@cougargrades/types/dist/GradeDistributionCSVRow';
import { tryFromRaw } from '@cougargrades/types/dist/GradeDistributionCSVRow';
import { useInterval } from '../useinterval';
import { Dropzone } from './dropzone';
import { MultiProgress, Progress } from './progress';
import { Button } from '../homepage/button';

import './uploader.scss';

export default function Uploader() {

  // UI
  const [uploadStartedAt, setUploadStartedAt] = useState<Date>(new Date(0));
  const [goodRead, setGoodRead] = useState<number>(0);
  const [badRead, setBadRead] = useState<number>(0);
  const [totalRead, setTotalRead] = useState<number>(0);

  // Upload logic
  const [recordsFile, setRecordsFile] = useState<File>();
  const [patchFiles, setPatchFiles] = useState<File[]>([]);

  const stepRow = useCallback(() => {

  }, []);

  const handleClick = useCallback(() => {
    setUploadStartedAt(new Date());
    console.log('button was clicked!');

    console.log(recordsFile)

    if(recordsFile) {
      Papa.parse<GradeDistributionCSVRow>(recordsFile, {
        worker: true,
        header: true,
        dynamicTyping: false,
        skipEmptyLines: true,
        // step: row => {
        //   if(tryFromRaw(row.data) !== null) {
        //     setGoodRead(x => x + 1);
        //   }
        //   else {
        //     setBadRead(x => x + 1);
        //   }
        //   setTotalRead(x => x + 1);
        //   //console.log('formatted: ', tryFromRaw(row.data), 'raw: ', row)
        // },
        complete: results => {
          let g = goodRead;
          let b = badRead;
          let t = totalRead;
          let bads = [];
          for(let i = 0; i < results.data.length; i++) {
            if(tryFromRaw(results.data[i]) !== null) {
              g++;
            }
            else {
              bads.push(results.data[i]);
              b++;
            }
            t++;
          }
          setGoodRead(g);
          setBadRead(b);
          setTotalRead(t);

          console.log(bads);
          console.log('All done!')
        },
      });
    }
  }, [ recordsFile, patchFiles ]);

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

    // Save reference to records
    acceptedFiles.forEach(file => {
      if(file.name === 'records.csv') {
        setRecordsFile(file);
      }
    });

    // Save references to patchfiles
    setPatchFiles(pf => [
      // Set only the patchfiles, and in the correct order
      ...acceptedFiles
        .filter(e => e.name.startsWith('patch-') && e.name.endsWith('.json'))
        .sort((a,b) => a.name.localeCompare(b.name))
    ]);
    
    
    // How to read
    // acceptedFiles.forEach((file) => {
    //   const reader = new FileReader()

    //   reader.onabort = () => console.log('file reading was aborted')
    //   reader.onerror = () => console.log('file reading has failed')
    //   reader.onload = () => {
    //   // Do whatever you want with the file contents
    //     const binaryStr = reader.result
    //     console.log(binaryStr)
    //   }
    //   //reader.readAsText(file)
    // })
  }, []);
  
  // do this every 100 ms
  // useInterval(() => {
  //   setProgress((current) => current + 1 === max ? 0 : current + 1);
  // }, 10);

  return (
    <div>
      <h3>Database Uploader</h3>
      <p>To use, grab the latest <a href="https://github.com/cougargrades/publicdata/releases/latest">public data bundle</a>, unzip it, and drop the files onto this webpage.</p>
      <p>Public data bundles have <em>a lot</em> of files, so this will likely lag your web browser.</p>
      <Dropzone onDrop={handleDrop} />
      {
        false ? <></> :
        <>
        <h4>Bundle info</h4>
        <ul>
          <li><code>{recordsFile?.name}</code>, File size: {prettyBytes(recordsFile ? recordsFile.size : 0)}</li>
          <li>Loaded {patchFiles.length} Patchfiles</li>
        </ul>
        <p>
          <Button variant="adaptive" onClick={handleClick} disabled={uploadStartedAt.valueOf() > 0}>Start Upload</Button>
        </p>
        {
          uploadStartedAt.valueOf() === 0 ? <></> :
          <>
          <p>
            Upload started at {uploadStartedAt.toLocaleString()} (<TimeAgo datetime={uploadStartedAt!} locale={'en'} />).
          </p>
          <h4>Uploading records</h4>
          <MultiProgress bars={[{ key: 'passes', value: goodRead, variant: 'bg-success'}, { key: 'fails', value: badRead, variant: 'bg-danger' }]} max={totalRead} />
          <label>Row {Number(0).toLocaleString()} of {Number(totalRead).toLocaleString()}</label>
          {/* <h4>Executing Patchfiles</h4>
          <Progress value={progress} max={max}>{`${Math.round(progress/max*100)}%`}</Progress>
          <label>Row {Number(progress).toLocaleString()} of {Number(max).toLocaleString()}</label> */}
          </>
        }
        </>
      }
    </div>
  );
}