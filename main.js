// Modules to control application life and create native browser window
const { app, BrowserWindow, webFrame, Menu, nativeTheme } = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

function createWindow () {

  // Electron App is always rendered in "dark mode"
  nativeTheme.themeSource = 'dark'

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    frame: false,
    useContentSize: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  mainWindow.setResizable(false)

  // Load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null)
    createWindow()

  mainWindow.setZoomFactor(1)
  mainWindow.setVisualZoomLevelLimits(1, 1)
  mainWindow.setLayoutZoomLevelLimits(0, 0)
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Enable live reload for Electron
require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
})
