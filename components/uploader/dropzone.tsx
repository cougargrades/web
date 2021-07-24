import React, { useMemo } from 'react'
import { useDropzone } from 'react-dropzone'

import styles from './dropzone.module.scss'

export function Dropzone(props: { onDrop: (acceptedFiles: File[]) => void }) {
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop: props.onDrop });

  const style = useMemo<React.CSSProperties>(() => {
    const activeStyle: React.CSSProperties = {
      borderColor: '#2196f3'
    };
    
    const acceptStyle: React.CSSProperties = {
      borderColor: '#00e676',
      backgroundColor: 'rgba(0, 230, 119, 0.2)'
    };
    
    const rejectStyle: React.CSSProperties = {
      borderColor: '#ff1744'
    };

    return ({
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    });
  }, [ isDragActive, isDragAccept, isDragReject ]);

  return (
    <div className={styles.dropzone} {...getRootProps({ style })}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <div className="droploc">Drop the files here</div> :
          <div className="droploc">Drag and drop some files here, or click to select files</div>
      }
    </div>
  );
}