const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    checkConfig: () => ipcRenderer.invoke('setup:check-status'),
    saveConfig: (config) => ipcRenderer.invoke('setup:save-config', config),
    initDbNew: (path) => ipcRenderer.invoke('setup:init-new', path),
    restoreDb: (backupFile, targetPath) => ipcRenderer.invoke('setup:restore-db', backupFile, targetPath),
    selectFolder: () => ipcRenderer.invoke('dialog:open-directory'),
    selectFile: () => ipcRenderer.invoke('dialog:open-file'),
});
