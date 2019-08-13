const electron = require("electron");
const path = require("path");
const userDataPath = (electron.app || electron.remote.app).getPath("userData");
const fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
// APP-DATA DB
const appDataAdapter = new FileSync(path.join(userDataPath, "app-data.json"));
const appdb = low(appDataAdapter);

module.exports = {
  createFile: async fileName => {
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
  },
  initAppData: async () => {
    const fsp = require("fs").promises;
    await appdb.defaults({ currentFile: "" }).write();
    await appdb.defaults({ files: [] }).write();
    const entriesPath = path.join(userDataPath, "entries");
    await fsp.mkdir(entriesPath, { recursive: true });
  },
  appDataExists: async () => {
    const files = await appdb.get("files").value();
    return files !== undefined;
  },
  fileExists: async fileName => {
    const files = await appdb.get("files").value();
    return files.includes(fileName);
  },
  getData: async fileName => {
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
  },
  getAllFiles: async () => {
    const files = await appdb.get("files").value();
    return files;
  },
  getAllFilesSync: () => {
    const files = appdb.get("files").value();
    return files;
  },
  getCurrentFile: async () => {
    const currentFile = await appdb.get("currentFile").value();
    return currentFile;
  },
  getCurrentFileSync: () => {
    const currentFile = appdb.get("currentFile").value();
    return currentFile;
  },
  setCurrentFile: async file => {
    await appdb.set("currentFile", file).write();
  },
  updateEntries: async data => {
    const { file, entries } = JSON.parse(data);
    let adapter = new FileSync(
      path.join(userDataPath, "entries", `${file}.json`)
    );
    let db = low(adapter);
    await db.set("entries", entries).write();
  },
  deleteFile: async fileName => {
    await appdb
      .get("files")
      .pull(fileName)
      .write();
    await fs.unlink(
      path.join(userDataPath, "entries", `${fileName}.json`),
      err => {
        if (err) {
          return err.message;
        } else {
          return `Notebook ${fileName} was successfully deleted.`;
        }
      }
    );
  }
};
