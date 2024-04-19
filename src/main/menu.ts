import { Menu, app } from "electron";
import { sendInstruction } from ".";
import { checkAvaliblePackageUpdateInProjects, checkForPackageDetails } from "./modules/project";

const relaunchApp = () => {
  app.relaunch();
  app.quit();
};

const template: Electron.MenuItemConstructorOptions[] = [
  {
    label: app.name,
    submenu: [
      { role: "about" as const },
      { type: "separator" as const },
      {
        label: "Relaunch",
        click: relaunchApp,
      },
      { role: "quit" },
    ],
  },
  ...(app.isPackaged
    ? []
    : [
        {
          label: "Dev",
          submenu: [
            {
              role: "reload" as const,
            },
            {
              role: "forceReload" as const,
            },
            {
              role: "toggleDevTools" as const,
            },
            {
              id: "throwError",
              label: "Throw Error",
              click: () => {
                throw new Error("Error From Menu");
              },
            },
          ],
        },
      ]),
  {
    label: "View",
    submenu: [
      {
        role: "togglefullscreen" as const,
      },
      {
        role: "resetZoom" as const,
      },
      {
        role: "zoomIn" as const,
      },
      {
        role: "zoomOut" as const,
      },
    ],
  },
  {
    label: "Projects",
    submenu: [
      {
        id: "add_folder",
        label: "Add Folder/s",
        click: () => sendInstruction({ instruction: "open_add_folder", data: null }),
      },
      {
        id: "scan",
        label: "Scan Folders",
        click: () => {
          ("");
        },
      },
      {
        id: "check_package_updates",
        label: "Check Package Updates",
        click: () => checkForPackageDetails(),
      },
      {
        id: "check_for_updates",
        label: "Check for dependencies Update in Project",
        click: () => checkAvaliblePackageUpdateInProjects(),
      },
    ],
  },
];

export const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
