const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs   = require('fs')

// Data file lives in %APPDATA%\cae-mastery\  (persists entre versiones)
const DATA_FILE = path.join(app.getPath('userData'), 'cae-mastery-data.json')

function createWindow() {
  const win = new BrowserWindow({
    width:  1150,
    height: 860,
    minWidth:  800,
    minHeight: 600,
    title: 'CAE Mastery',
    backgroundColor: '#0f172a',   // evita flash blanco al abrir
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration:  false,
      contextIsolation: true,
    },
  })

  // En producción carga el build estático; en dev carga el servidor Vite
  const isDev = process.env.NODE_ENV === 'development'
  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

// ─── IPC: almacenamiento en disco ─────────────────────────────────────────────

ipcMain.handle('load-data', () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
    }
  } catch { /* silent */ }
  return null
})

ipcMain.handle('save-data', (_event, data) => {
  try {
    // Asegura que el directorio exista
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch { return false }
})

ipcMain.handle('get-data-path', () => DATA_FILE)

// ─── Ciclo de vida ────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
