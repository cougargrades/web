import { useState, useEffect, useRef } from 'react'
import { useRecoilState } from 'recoil'
import { useFirebaseApp, useFirestoreDoc as useFirestoreDocRF, useFirestoreDocData as useFirestoreDocDataRF } from 'reactfire'
import { usePrevious } from 'react-use'
import { DocumentReference as DocumentReferenceStub, Firestore as FirestoreStub } from '@cougargrades/types/dist/FirestoreStubs'
import { isFirestoreLoadedAtom } from './recoil'
import { Observable, ObservableStatus } from './data/Observable'

// export function useFirestoreDoc<T>(ref: string | undefined): Observable<firebase.default.firestore.DocumentSnapshot<T>> {
//   // try {
//   //   return useFirestoreDocRF<T>(ref as any)
//   // }
//   // catch(err) {
//   //   return {
//   //     data: undefined,
//   //     error: err,
//   //     status: 'error',
//   //   }
//   // }
//   const db = useFirestore()
//   //const [data, setData] = useState<firebase.default.firestore.DocumentSnapshot<T>>(undefined)
//   const dataRef = useRef<firebase.default.firestore.DocumentSnapshot<T>>(undefined)
//   const [error, setError] = useState(undefined)
//   const [status, setStatus] = useState<ObservableStatus>('loading')
//   // const [loaded, setLoaded] = useState<boolean>(false)
//   const refsLoaded = db['settings'] !== undefined && ref !== undefined
//   const previousRefPath = usePrevious(ref)
//   //console.log('previousRefPath?',previousRefPath)
//   console.log('fuckin anything')

//   useEffect(() => {
//     console.log('DB HOOK')
//   },[db])

//   //console.log('db?',db)
//   //console.log('ref?',ref)
//   //console.log('refsLoaded?',refsLoaded,'path different?',previousRefPath !== ref?.path)


//   useEffect(() => {
//     if(refsLoaded && previousRefPath !== ref) {
//       console.log('once pls: ',ref);
//       (async () => {
//         try {
//           console.log('ASKING AGAIN')
//           dataRef.current = await db.doc(ref).get() as firebase.default.firestore.DocumentSnapshot<T>
//           //setData(await db.doc(ref).get() as firebase.default.firestore.DocumentSnapshot<T>)
//           setStatus('success')
//         }
//         catch(err) {
//           console.error('ERROR',err)
//           setStatus('error')
//           setError(err)
//         }
//       })();
//     }
//   }, [refsLoaded, previousRefPath, ref, db])

//   return {
//     data: dataRef.current,
//     error,
//     status,
//   }
// }

// // firebase.default.firestore.DocumentReference | DocumentReferenceStub

// export function useFirestoreDocData<T>(ref: string | undefined): Observable<T> {
//   const { data: snap, status, error } = useFirestoreDoc<T>(ref)
  
//   return {
//     data: status === 'success' && snap.exists ? snap.data() : undefined,
//     error,
//     status,
//   }
  
//   // console.log(ref)
//   // try {
    
//   //   const obvs = useFirestoreDocDataRF<T>(ref)
//   //   console.log(obvs)
//   //   return obvs
//   // }
//   // catch(err) {
//   //   return {
//   //     data: undefined,
//   //     error: err,
//   //     status: 'error',
//   //   }
//   // }
// }
