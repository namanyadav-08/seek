// Dashboard.jsx
// One change from before: handleSeek now passes the preview URL up to App
// so the result card can show the photo the user uploaded

import { useState, useRef } from 'react'
import axios from 'axios'

export default function Dashboard({ onResult, setLoading, loading }) {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    // URL.createObjectURL — makes a temporary local URL like blob:// 
    // only lives in this browser tab, perfect for previewing before upload
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (!dropped) return
    setFile(dropped)
    setPreview(URL.createObjectURL(dropped))
  }

  const handleSeek = async () => {
    if (!file) return
    setLoading(true)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await axios.post('/identify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      // KEY CHANGE: pass preview as second argument so App can forward it to Result
      onResult(response.data, preview)
    } catch (err) {
      const message = err.response?.data?.error || 'Something went wrong. Try again!'
      onResult({ error: message }, null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <div className="logo-area">
        <span className="leaf">🌿</span>
        <h1>What you <span className="highlight">seek</span> is <span className="highlight">seeking</span> you!</h1>
        <p>point. discover. wonder.</p>
      </div>

      <div
        className={`dropzone ${preview ? 'has-preview' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current.click()}
      >
        {preview
          ? <img src={preview} alt="preview" className="preview-img" />
          : (
            <div className="drop-hint">
              <span>🍃</span>
              <p>drop an image or tap to browse</p>
            </div>
          )
        }
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        style={{ display: 'none' }}
      />

      <button
        className={`seek-btn ${loading ? 'loading' : ''}`}
        onClick={handleSeek}
        disabled={!file || loading}
      >
        {loading ? 'seeking...' : 'seek 🔍'}
      </button>
    </div>
  )
}