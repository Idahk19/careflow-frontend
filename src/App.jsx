import { useEffect, useState } from 'react'
import api from './services/api'

function App() {
  const [message, setMessage] = useState('Testing connection...')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/appointments/')
      .then((response) => {
        console.log(response.data)
        setMessage('Connected to CareFlow API!')
      })
      .catch((error) => {
        console.error(error)

        if (error.response) {
          setError(
            `API responded with status ${error.response.status}`
          )
        } else {
          setError('Could not connect to the CareFlow API.')
        }
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600">
          CareFlow
        </h1>

        <p className="mt-4">
          {message}
        </p>

        {error && (
          <p className="mt-4 text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default App