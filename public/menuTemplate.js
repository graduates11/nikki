const { app } = require("electron");
const { getAllFilesSync, getCurrentFileSync } = require("./helpers.js");

const createTemplate = mainWindow => {
  const files = getAllFilesSync();

  let filesSubmenu;
  if (files) {
    filesSubmenu = files.map((file, i) => {
      return {
        label: file,
        click: () => changeFile(file)
      };
    });
  } else {
    filesSubmenu = [
      {
        label: "My journal",
        click: () => changeFile("My journal")
      }
    ];
  }

  const changeFile = async file => {
    mainWindow.webContents.send("change-file", file);
  };

  const saveFile = () => {
    const currentFile = getCurrentFileSync();
    mainWindow.webContents.send("menu-save-file", currentFile);
  };

  const createFile = () => {
    mainWindow.webContents.send("menu-create-file");
  };

  const fileMenu = {
    label: "File",
    submenu: [
      {
        label: "Save",
        click: saveFile
      },
      {
        label: "Create new file...",
        click: createFile
      },
      {
        type: "separator"
      },
      {
        label: "Your files...",
        submenu: filesSubmenu
      }
    ]
  };

  const template = [
    fileMenu,
    {
      label: "Edit",
      submenu: [
        {
          role: "undo"
        },
        {
          role: "redo"
        },
        {
          type: "separator"
        },
        {
          role: "cut"
        },
        {
          role: "copy"
        },
        {
          role: "paste"
        },
        {
          role: "pasteandmatchstyle"
        },
        {
          role: "delete"
        },
        {
          role: "selectall"
        }
      ]
    },

    {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload();
          }
        },
        {
          label: "Toggle Developer Tools",
          accelerator:
            process.platform === "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools();
          }
        },
        {
          type: "separator"
        },
        {
          role: "resetzoom"
        },
        {
          role: "zoomin"
        },
        {
          role: "zoomout"
        },
        {
          type: "separator"
        },
        {
          role: "togglefullscreen"
        }
      ]
    },
    {
      role: "window",
      submenu: [
        {
          role: "minimize"
        },
        {
          role: "close"
        }
      ]
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click() {
            require("electron").shell.openExternal("http://electron.atom.io");
          }
        }
      ]
    }
  ];

  if (process.platform === "darwin") {
    const name = app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          role: "about"
        },
        {
          type: "separator"
        },
        {
          role: "services",
          submenu: []
        },
        {
          type: "separator"
        },
        {
          role: "hide"
        },
        {
          role: "hideothers"
        },
        {
          role: "unhide"
        },
        {
          type: "separator"
        },
        {
          role: "quit"
        }
      ]
    });
    // Edit menu.
    template[1].submenu.push(
      {
        type: "separator"
      },
      {
        label: "Speech",
        submenu: [
          {
            role: "startspeaking"
          },
          {
            role: "stopspeaking"
          }
        ]
      }
    );
    // Window menu.
    template[3].submenu = [
      {
        label: "Close",
        accelerator: "CmdOrCtrl+W",
        role: "close"
      },
      {
        label: "Minimize",
        accelerator: "CmdOrCtrl+M",
        role: "minimize"
      },
      {
        label: "Zoom",
        role: "zoom"
      },
      {
        type: "separator"
      },
      {
        label: "Bring All to Front",
        role: "front"
      }
    ];
  }

  return template;
};

module.exports = createTemplate;
