const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const electron = require("electron");
const path = require("path");
const userDataPath = (electron.app || electron.remote.app).getPath("userData");
const isDev = require("electron-is-dev");
const menu = require("./menu");

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
  Menu.setApplicationMenu(menu);
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

// ======================================================================
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

// APP-DATA DB
const appDataAdapter = new FileSync(path.join(userDataPath, "app-data.json"));
const appdb = low(appDataAdapter);

// HELPERS
const createFile = async fileName => {
  const entriesPath = path.join(userDataPath, "entries");
  try {
    // SET THE CURRENT FILE
    await appdb.set("currentFile", fileName).write();
    // PUSH TO THE APPDB ARRAY
    await appdb
      .get("files")
      .push(fileName)
      .write();
    // INITIALIZE FILE IN ENTRIES
    const adapter = new FileSync(path.join(entriesPath, `${fileName}.json`));
    const db = low(adapter);
    await db.defaults({ entries: [] }).write();
  } catch (e) {
    console.error(e);
  }
};

const initAppData = async () => {
  const fsp = require("fs").promises;
  await appdb.defaults({ currentFile: "" }).write();
  await appdb.defaults({ files: [] }).write();
  const entriesPath = path.join(userDataPath, "entries");
  await fsp.mkdir(entriesPath, { recursive: true });
};

const appDataExists = async () => {
  const files = await appdb.get("files").value();
  return files !== undefined;
};

const fileExists = async fileName => {
  const files = await appdb.get("files").value();
  return files.includes(fileName);
};

const getData = async fileName => {
  const adapter = new FileSync(
    path.join(userDataPath, "entries", `${fileName}.json`)
  );
  const db = low(adapter);
  const entries = await db.get("entries").value();
  const files = await appdb.get("files").value();
  const data = {
    entries,
    currentFile: fileName,
    files
  };
  return JSON.stringify(data);
};

// ON APP LAUNCH
ipcMain.on("get-all-entries", async (event, currentFile = null) => {
  let firstLaunch;
  let isFile;
  let data;

  try {
    // see if app-data exists
    firstLaunch = !(await appDataExists());
    // see if the file exists
    isFile = currentFile !== null ? await fileExists(currentFile) : false;
    if (firstLaunch) {
      try {
        await initAppData();
        await createFile("My journal");
        data = await getData("My journal");
        event.reply("get-all-entries-reply", data);
      } catch (e) {
        console.error(e);
        event.reply(
          "get-all-entries-error",
          `Sorry, an error has occured: ${e.message}`
        );
      }
    }
    if (currentFile === null) {
      try {
        currentFile = await appdb.get("currentFile").value();
        data = await getData(currentFile);
        event.reply("get-all-entries-reply", data);
      } catch (e) {
        console.error(e);
        event.reply(
          "get-all-entries-error",
          `Sorry, an error has occured: ${e.message}`
        );
      }
    } else if (currentFile !== null) {
      if (!fileExists) {
        try {
          await createFile(currentFile);
          data = await getData(currentFile);
          event.reply("get-all-entries-reply", data);
        } catch (e) {
          console.error(e);
          event.reply(
            "get-all-entries-error",
            `Sorry, an error has occured: ${e.message}`
          );
        }
      } else if (fileExists) {
        try {
          data = await getData(currentFile);
          event.reply("get-all-entries-reply", data);
        } catch (e) {
          console.error(e);
          event.reply(
            "get-all-entries-error",
            `Sorry, an error has occured: ${e.message}`
          );
        }
      }
    }
  } catch (e) {
    console.error(e);
    event.reply(
      "get-all-entries-error",
      `Sorry, an error has occured: ${e.message}`
    );
  }
});

ipcMain.on("create-file", async (event, fileName) => {
  try {
    await createFile(fileName);
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
});

ipcMain.on("final-save", async (event, data) => {
  const { file, entries } = JSON.parse(data);
  let adapter = new FileSync(
    path.join(userDataPath, "entries", `${file}.json`)
  );
  let db = low(adapter);
  try {
    await db.set("entries", entries).write();
    await appdb.set("currentFile", file).write();
    event.reply("final-save-reply", `Successfully saved file: ${file}`);
  } catch (e) {
    console.log(e);
    event.sender.send(
      "final-save-error",
      `Sorry, an error has occured: ${e.message}`
    );
  }
});
