import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { spawn, ChildProcess } from 'child_process'
import { existsSync } from 'fs'

let backendProcess: ChildProcess | null = null
let mainWindow: BrowserWindow | null = null

function startBackend(): void {
  const jarPath = existsSync(join(process.resourcesPath, 'backend/bismuth93-backend.jar'))
    ? join(process.resourcesPath, 'backend/bismuth93-backend.jar')
    : join(__dirname, '../../backend/build/libs/bismuth93-backend-all.jar')

  if (!existsSync(jarPath)) {
    console.warn('⚠️  Backend JAR not found, assuming it is running externally on port 8765')
    return
  }

  backendProcess = spawn('java', ['-jar', jarPath], {
    stdio: ['ignore', 'pipe', 'pipe']
  })

  backendProcess.stdout?.on('data', (d) => process.stdout.write(`[backend] ${d}`))
  backendProcess.stderr?.on('data', (d) => process.stderr.write(`[backend] ${d}`))
  backendProcess.on('exit', (code) => console.log(`Backend exited with code ${code}`))
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#1e1e2e',
      symbolColor: '#cdd6f4',
      height: 32
    },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  })

  mainWindow.on('ready-to-show', () => mainWindow?.show())

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// IPC Handlers
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
  return result.filePaths
})

ipcMain.handle('shell:openExternal', (_e, url: string) => shell.openExternal(url))
ipcMain.handle('app:getVersion', () => app.getVersion())

app.whenReady().then(() => {
  startBackend()
  setTimeout(createWindow, backendProcess ? 1500 : 0)
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})

app.on('window-all-closed', () => {
  backendProcess?.kill()
  if (process.platform !== 'darwin') app.quit()
})
