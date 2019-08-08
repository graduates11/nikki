const { Menu } = require("electron");
const createTemplate = require("./menuTemplate.js");

const createMenu = mainWindow => {
  const template = createTemplate(mainWindow);
  const menu = Menu.buildFromTemplate(template);
  return menu;
};

module.exports = createMenu;
