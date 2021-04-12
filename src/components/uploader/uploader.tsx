import React, { useCallback, useMemo } from 'react';
//import { useUser, useIdTokenResult, useFirestore, useFirestoreDocData } from 'reactfire';
import { useDropzone } from 'react-dropzone';

import './uploader.scss';

export default function Uploader() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with files
    console.log(acceptedFiles)
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)
      }
      //reader.readAsText(file)
    })
  }, []);
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop });

  const activeStyle: React.CSSProperties = {
    borderColor: '#2196f3'
  };
  
  const acceptStyle: React.CSSProperties = {
    borderColor: '#00e676'
  };
  
  const rejectStyle: React.CSSProperties = {
    borderColor: '#ff1744'
  };

  const style = useMemo<React.CSSProperties>(() => ({
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [ isDragActive, isDragAccept, isDragReject]);

  return (
    <div>
      <h3>Database Uploader</h3>
      <p>To use, grab the latest <a href="https://github.com/cougargrades/publicdata/releases/latest">public data bundle</a>, unzip it, and drop the files onto this webpage.</p>
      <p>Public data bundles have <em>a lot</em> of files, so this will likely lag your web browser.</p>
      <div className="dropzone" {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <div className="droploc">Drop the files here</div> :
            <div className="droploc">Drag 'n' drop some files here, or click to select files</div>
        }
      </div>
      <h4>Bundle info</h4>
      <p>Bundle info</p>
      <h4>Upload progress</h4>
      <p>Upload progress</p>
    </div>
  );
}