const { ipcMain, dialog, BrowserWindow } = require('electron')

ipcMain.on('open-dir-dialog', event => {
  dialog.showOpenDialog(
    BrowserWindow.getFocusedWindow(),
    {
      properties: ['openDirectory']
    },
    dirs => {
      if (Array.isArray(dirs) && dirs.length > 0) {
        event.sender.send('selected-directory', dirs[0])
      }
    }
  )
})

ipcMain.on('open-file-dialog', event => {
  dialog.showOpenDialog(
    BrowserWindow.getFocusedWindow(),
    {
      properties: ['openFile']
    },
    files => {
      if (Array.isArray(files) && files.length > 0) {
        event.sender.send('selected-file', files[0])
      }
    }
  )
})
