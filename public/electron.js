const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const createMenu = require("./menu");
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
    height: 707,
    //titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + "/preload.js"
    },
    minHeight: 515,
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
app.on("ready", async () => {
  createWindow();
  const menu = createMenu(mainWindow);
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

const {
  createFile,
  initAppData,
  appDataExists,
  fileExists,
  getData,
  getCurrentFile,
  setCurrentFile,
  updateEntries,
  deleteFile
} = require("./helpers.js");

ipcMain.on("get-all-entries", async (event, currentFile = null) => {
  let firstLaunch;
  let isFile;
  let data;
  try {
    firstLaunch = !(await appDataExists());
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
        currentFile = await getCurrentFile();
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
          // add file to the menu bar
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
          await setCurrentFile(currentFile);
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
    const menu = createMenu(mainWindow);
    Menu.setApplicationMenu(menu);
    event.reply("create-file-reply", fileName);
  } catch (e) {
    event.reply(
      "create-file-error",
      `Sorry, an error has occured: ${e.message}`
    );
  }
});

ipcMain.on("final-save", async (event, data) => {
  const { file } = JSON.parse(data);
  try {
    await updateEntries(data);
    await setCurrentFile(file);
    event.reply("final-save-reply", `Successfully saved file: ${file}`);
  } catch (e) {
    console.error(e);
    event.sender.send(
      "final-save-error",
      `Sorry, an error has occured: ${e.message}`
    );
  }
});

ipcMain.on("delete-file", async (event, fileName) => {
  try {
    await deleteFile(fileName);
    const menu = createMenu(mainWindow);
    Menu.setApplicationMenu(menu);
    event.reply(
      "delete-file-reply",
      `Successfully deleted journal: ${fileName}`
    );
  } catch (e) {
    console.error(e);
    event.sender.send(
      "delete-file-error",
      `Sorry, an error has occured: ${e.message}`
    );
  }
});

module.exports = mainWindow;
