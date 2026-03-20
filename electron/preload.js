const { contextBridge, ipcRenderer } = require('electron')

// Expone solo los métodos necesarios al renderer (React)
// contextIsolation: true => el renderer NO tiene acceso directo a Node.js
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron:  true,
  loadData:    ()       => ipcRenderer.invoke('load-data'),
  saveData:    (data)   => ipcRenderer.invoke('save-data', data),
  getDataPath: ()       => ipcRenderer.invoke('get-data-path'),
})
