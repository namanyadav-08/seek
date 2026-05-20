// Result.jsx - the redesigned species reveal page
// props: data (the JSON from Python), onBack (function to go back to dashboard)

import axios from 'axios'

export default function Result({ data, onBack }) {

  // if AI couldn't identify it, show error state
  if (data.error) {
    return (
      <div className="result-page">
        <p className="error-msg">😔 {data.error}</p>
        <button onClick={onBack} className="back-btn">try again</button>
      </div>
    )
  }

  // confidence dots — we show 5 dots, filled based on a "high/medium/low" string
  // this maps the word to how many dots to fill
  const confidenceMap = { 'High': 5, 'Medium': 3, 'Low': 1 }
  const filled = confidenceMap[data.confidence] ?? 4
  // ?? means "if null or undefined, use 4" — the nullish coalescing operator

  return (
    <div className="result-page">
      <div className="result-card">

        {/* LEFT COLUMN — image */}
        <div className="result-img-col">
          <img src={data.image_url ?? '/placeholder.jpg'} alt={data.name} />
          {/* 
            Wait — we don't have image_url yet! 
            We'll handle this below. For now this shows the uploaded preview.
            We'll pass it down from App.jsx using a second piece of state.
          */}
          <div className="result-img-overlay">
            <span className="result-class-badge">{data.class_name}</span>
            <p className="result-img-name">{data.name}</p>
          </div>
        </div>

        {/* RIGHT COLUMN — details */}
        <div className="result-detail-col">

          <div className="result-category-row">
            <span className="result-dot" />
            <span className="result-category-label">{data.species} · {data.habitat_type}</span>
          </div>

          <h1 className="result-main-name">{data.name}</h1>
          <p className="result-latin">{data.latin_name}</p>

          <div className="result-divider" />

          {/* 2x2 stat grid */}
          <div className="result-stat-grid">
            <div className="result-stat">
              <p className="stat-label">Native to</p>
              <p className="stat-value">{data.native_place}</p>
            </div>
            <div className="result-stat">
              <p className="stat-label">Family</p>
              <p className="stat-value">{data.family}</p>
            </div>
            <div className="result-stat">
              <p className="stat-label">Habitat</p>
              <p className="stat-value">{data.habitat}</p>
            </div>
            <div className="result-stat">
              <p className="stat-label">Conservation</p>
              <p className="stat-value">{data.conservation}</p>
            </div>
          </div>

          <p className="result-detail-text">{data.detail}</p>

          {/* confidence dots row */}
          <div className="result-footer">
            <div className="confidence-row">
              {/* Array(5) creates [undefined x5], .fill(0) fills it, .map gives index */}
              {Array(5).fill(0).map((_, i) => (
                <span key={i} className={`conf-dot ${i < filled ? 'filled' : ''}`} />
              ))}
              <span className="conf-label">{data.confidence ?? 'High'} confidence</span>
            </div>
          </div>

        </div>
      </div>

      <button onClick={onBack} className="back-btn">seek again 🌱</button>
    </div>
  )
}