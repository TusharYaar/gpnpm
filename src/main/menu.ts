import { Menu, app } from "electron";

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
        id: "add_project_folder",
        label: "Add Project Folder",

        click: () => {
          ("");
        },
      },
      {
        id: "scan",
        label: "Scan Folders",
        click: () => {
          ("");
        },
      },
    ],
  },
];

export const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
