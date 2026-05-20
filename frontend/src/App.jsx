// App.jsx
// Now tracks TWO things: the AI result AND the local image preview URL
// so we can show the uploaded photo on the result card

import { useState } from 'react'
import Dashboard from './Dashboard.jsx'
import Result from './Result.jsx'

export default function App() {
  const [result, setResult] = useState(null)
  const [preview, setPreview] = useState(null)   // ADD THIS — stores the blob URL
  const [loading, setLoading] = useState(false)

  const handleResult = (data, previewUrl) => {
    // we receive both the AI JSON AND the preview URL from Dashboard
    setResult({ ...data, image_url: previewUrl })
    // spread operator (...) copies all data fields, then we add image_url on top
    setLoading(false)
  }

  const handleBack = () => {
    setResult(null)
    setPreview(null)
  }

  return (
    <div>
      {result
        ? <Result data={result} onBack={handleBack} />
        : <Dashboard onResult={handleResult} setLoading={setLoading} loading={loading} />
      }
    </div>
  )
}