const { app, BrowserWindow, ipcMain } = require("electron");
const electron = require("electron");
const path = require("path");
const fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const userDataPath = (electron.app || electron.remote.app).getPath("userData");
// const { entries } = require("../src/lowdb/db.json");
// const { tags } = require("../src/lowdb/db.json");
const isDev = require("electron-is-dev");

const adapter = new FileSync(path.join(userDataPath, "db.json"));
const db = low(adapter);

// db.defaults({ entries }).write();
// db.defaults({ tags }).write();

// require("./electron/menu.js")
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS
    } = require("electron-devtools-installer");
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log("An error occurred: ", err));
  }
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    //titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + "/preload.js"
    },
    minHeight: 550,
    minWidth: 650
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on("closed", () => (mainWindow = null));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("get-entry", async (event, entryId) => {
  try {
    const entry = await db
      .get("entries")
      .find({ id: entryId })
      .value();
    event.reply("get-entry-reply", entry);
  } catch (e) {
    event.sender.send("get-entry-error", e.message);
  }
});

ipcMain.on("get-entries-by-date", async event => {
  try {
    const entry = await db.get("entries").value();
    event.reply("get-entries-by-date-reply", entry);
  } catch (e) {
    event.sender.send("get-entries-by-date-error", e.message);
  }
});
//REFACTOR TO USE LOWDB:
// ipcMain.on("add-entry", async (event, entry) => {
//   try {
//     await entries.push(entry);
//     event.reply("add-entry-success", `successfully added ${entry.title}`);
//   } catch (e) {
//     event.reply("add-entry-error", e.message);
//   }
// });
