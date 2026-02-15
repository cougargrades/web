import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useQuery } from '@tanstack/react-query'
import { DocumentReferenceService } from '@cougargrades/services/DocumentReference'
import { SimpleSyllabusService } from '@cougargrades/services/SimpleSyllabusService'
import { Course } from '@cougargrades/models'

const documentReferenceService = new DocumentReferenceService();
const syllService = new SimpleSyllabusService();

function App() {
  const [count, setCount] = useState(0)

  const { isPending: isPendingDR, data: dataDR, error: errorDR } = useQuery({ 
    queryKey: ['data-example'],
    queryFn: async () => {
      return await documentReferenceService.GetDocumentByPath(`/catalog/ENGL 1301`, Course)
    },
  })

  const { isPending: isPendingSS, data: dataSS, error: errorSS } = useQuery({ 
    queryKey: ['api-example'],
    queryFn: async () => {
      return await syllService.search(`ENGL 1301`)
    },
  })

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p>DR, isPending? {JSON.stringify(isPendingDR)}, data? {typeof dataDR}, error? {JSON.stringify(errorDR)}</p>
      <pre>{JSON.stringify(dataDR, null, 2)}</pre>
      <p>SS, isPending? {JSON.stringify(isPendingSS)}, data? {typeof dataSS}, error? {JSON.stringify(errorSS)}</p>
      <pre>{JSON.stringify(dataSS, null, 2)}</pre>    </>
  )
}

export default App
