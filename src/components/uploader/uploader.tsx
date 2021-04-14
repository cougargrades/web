import React, { useCallback, useState } from 'react';
import prettyBytes from 'pretty-bytes';
import { useInterval } from '../useinterval';
import { Dropzone } from './dropzone';

//import './uploader.scss';

export default function Uploader() {

  const [recordsFile, setRecordsFile] = useState<File>();
  const [patchFiles, setPatchFiles] = useState<File[]>([]);

  const [progress, setProgress] = useState<number>(0);
  const max = 100;

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
  useInterval(() => {
    setProgress((current) => current + 1 === max ? 0 : current + 1);
  }, 100);

  return (
    <div>
      <h3>Database Uploader</h3>
      <p>To use, grab the latest <a href="https://github.com/cougargrades/publicdata/releases/latest">public data bundle</a>, unzip it, and drop the files onto this webpage.</p>
      <p>Public data bundles have <em>a lot</em> of files, so this will likely lag your web browser.</p>
      <Dropzone onDrop={handleDrop} />
      <h4>Bundle info</h4>
      <ul>
        <li><code>{recordsFile?.name}</code>, File size: {prettyBytes(recordsFile ? recordsFile.size : 0)}</li>
        <li>Loaded {patchFiles.length} Patchfiles</li>
      </ul>
      <h4>Upload progress</h4>
      <progress value={progress} max={max}></progress>
    </div>
  );
}