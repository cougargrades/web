import React, { useCallback, useState } from 'react';
import { Dropzone } from './dropzone';

//import './uploader.scss';

export default function Uploader() {

  const [recordsFile, setRecordsFile] = useState<File>();
  const [patchFiles, setPatchFiles] = useState<File[]>([]);

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
  

  return (
    <div>
      <h3>Database Uploader</h3>
      <p>To use, grab the latest <a href="https://github.com/cougargrades/publicdata/releases/latest">public data bundle</a>, unzip it, and drop the files onto this webpage.</p>
      <p>Public data bundles have <em>a lot</em> of files, so this will likely lag your web browser.</p>
      <Dropzone onDrop={handleDrop} />
      <h4>Bundle info</h4>
      {
        patchFiles.length > 0 ?
        <div>
          <h5>Primary files</h5>
          <ul>
            <li><code>{recordsFile?.name}</code>, File size: {recordsFile?.size}</li>
          </ul>
          <h5>Seconary files</h5>
          <p>There are {patchFiles.length} Patchfiles.</p>
          <ul>
            {patchFiles.map(e => 
              <li key={e.name}>{e.name}</li>
            )}
          </ul>
        </div> 
        : <></>
      }
      <h4>Upload progress</h4>
      <p>Upload progress</p>
    </div>
  );
}