const { app, BrowserWindow, ipcMain } = require("electron");
const electron = require("electron");
const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const userDataPath = (electron.app || electron.remote.app).getPath("userData");
const isDev = require("electron-is-dev");

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
app.on("ready", () => {
  // INITIALIZE THE MENU
  createWindow();
});

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

const appDataAdapter = new FileSync(path.join(userDataPath, "app-data.json"));
const appdb = low(appDataAdapter);

ipcMain.on("get-app-data", async (event, arg) => {
  let data = null;
  try {
    appdb.defaults({ files: [] }).write();
    data = await appdb.find;
  } catch (e) {
    console.error(e);
  }
});

ipcMain.on("create-file", async (event, fileName) => {
  const fsp = require("fs").promises;
  const entriesPath = path.join(userDataPath, "entries");

  try {
    await fsp.mkdir(entriesPath, { recursive: true });
  } catch (e) {
    console.error(e);
  } finally {
    try {
      const adapter = new FileSync(path.join(entriesPath, `${fileName}.json`));
      const db = low(adapter);
      db.defaults({ entries: [] }).write();
      event.reply(
        "create-file-reply",
        `Successfully created new file: ${fileName}`
      );
    } catch (e) {
      event.reply(
        "create-file-error",
        `Sorry, an error has occured: ${e.message}`
      );
    }
  }
});

ipcMain.on("get-all-entries", async (event, fileName) => {
  // REFACTOR TO ACCESS THE LATEST OPEN FILE FROM ENTRIES DIR
  let adapter = new FileSync(path.join(userDataPath, `${fileName}.json`));
  let db = low(adapter);
  try {
    const entries = await db.get("entries").value();
    console.log(entries);
    event.reply("get-all-entries-reply", entries);
  } catch (e) {
    event.sender.send(
      "get-all-entries-error",
      `Sorry, an error has occured: ${e.message}`
    );
  }
});

ipcMain.on("final-save", async (event, data) => {
  const { file, entries } = data;
  let adapter = new FileSync(path.join(userDataPath, `${file}.json`));
  let db = low(adapter);
  try {
    await db.set("entries", entries).write();
    event.reply("final-save-reply", `Successfully saved file: ${file}`);
  } catch (e) {
    event.sender.send(
      "final-save-error",
      `Sorry, an error has occured: ${e.message}`
    );
  }
});

// SAVE DATA ABOUT THE LAST OPENED FILE
// ENABLE OR DISABLE SPACES IN THE FILENAMES?
// CAN USER RENAME THE DB ?
