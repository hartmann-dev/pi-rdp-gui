"use strict";

const { app, BrowserWindow, ipcMain} = require("electron");
const path = require('path');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, process.env.NODE_ENV == 'dev' ? '/config/config.json' : '/resources/config/config.json')));


function createWindow() {
  // Erstelle das Browser-Fenster.
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true
    },
  });

  win.removeMenu();
  // and load the index.html of the app.
  win.loadFile("app/index.html");


  // Öffnen der DevTools.
  if(config.debug){
    win.webContents.openDevTools();
    win.maximize();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


ipcMain.on('get-config', (event) => {
  event.sender.send('send-config', config);
});




// In this file you can include the rest of your app's specific main process
// code. Sie können den Code auch
// auf mehrere Dateien aufteilen und diese hier einbinden.
