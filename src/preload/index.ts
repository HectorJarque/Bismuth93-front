import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url),
  getVersion: () => ipcRenderer.invoke('app:getVersion')
})
