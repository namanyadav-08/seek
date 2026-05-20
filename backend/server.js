// backend/server.js
// Middleman between React and Python. Serves API + frontend in production.

const express = require('express')
const cors = require('cors')
const multer = require('multer')
const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3001
const isProd = process.env.NODE_ENV === 'production'

const venvPython = path.join(__dirname, 'venv', 'bin', 'python')
const PYTHON = process.env.PYTHON || (fs.existsSync(venvPython) ? venvPython : 'python3')

app.use(cors())
app.use(express.json())

const upload = multer({
  dest: path.join(__dirname, 'uploads'),
  limits: { fileSize: 10 * 1024 * 1024 },
})

fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true })

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/identify', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' })
  }

  const imagePath = req.file.path

  exec(
    `"${PYTHON}" seek.py "${imagePath}"`,
    { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 },
    (error, stdout, stderr) => {
      fs.unlink(imagePath, () => {})

      if (error) {
        console.error('Python error:', stderr || error.message)
        let message = 'AI identification failed'
        if (stderr?.includes('RESOURCE_EXHAUSTED') || stderr?.includes('429')) {
          message = 'API quota exceeded. Wait a minute or try again later.'
        }
        try {
          const errBody = JSON.parse(stdout)
          if (errBody.error) message = errBody.error
        } catch (_) {}
        return res.status(500).json({ error: message })
      }

      try {
        const result = JSON.parse(stdout.trim())
        res.json(result)
      } catch (e) {
        console.error('Parse error. stdout:', stdout?.slice(0, 500))
        res.status(500).json({ error: 'Could not parse AI response' })
      }
    }
  )
})

if (isProd) {
  const frontendDist = path.join(__dirname, '..', 'frontend', 'dist')
  app.use(express.static(frontendDist))
  app.get(/^(?!\/identify|\/health).*/, (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`🌿 Seek server running on port ${PORT}`)
})
