/* global require */

// preload.js - NeoNinja View v1.2 - Secure IPC Bridge
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // Dialog operations
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),

  // File operations
  scanFiles: (dirPath) => ipcRenderer.invoke('files:scan', dirPath),
  getFolderTree: (rootPath) => ipcRenderer.invoke('files:getFolderTree', rootPath),
  renameFile: (oldPath, newPath) => ipcRenderer.invoke('file:rename', oldPath, newPath),
  deleteFile: (filePath) => ipcRenderer.invoke('file:delete', filePath),
  copyFile: (filePath) => ipcRenderer.invoke('file:copy', filePath),
  cutFile: (filePath) => ipcRenderer.invoke('file:cut', filePath),
  pasteFile: (targetDir) => ipcRenderer.invoke('file:paste', targetDir),
  editFile: (filePath) => ipcRenderer.invoke('file:edit', filePath),
  showInFolder: (filePath) => ipcRenderer.invoke('file:showInFolder', filePath),
  copyPath: (filePath) => ipcRenderer.invoke('file:copyPath', filePath),
  getFileProperties: (filePath) => ipcRenderer.invoke('file:getProperties', filePath),
  rotateImage: (filePath, angle) => ipcRenderer.invoke('file:rotate', filePath, angle),
  flipImage: (filePath, direction) => ipcRenderer.invoke('file:flip', filePath, direction),
  generateThumbnail: (filePath, size) => ipcRenderer.invoke('file:generateThumbnail', filePath, size),
  moveFile: (sourcePath, targetPath) => ipcRenderer.invoke('file:move', sourcePath, targetPath),
  saveFile: (blob, fileName) => ipcRenderer.invoke('file:save', blob, fileName),

  // Batch operations
  batchMove: (files, targetDir) => ipcRenderer.invoke('files:batchMove', files, targetDir),
  batchDelete: (files) => ipcRenderer.invoke('files:batchDelete', files),

  // Settings operations
  getSettings: (key) => ipcRenderer.invoke('settings:get', key),
  setSetting: (key, value) => ipcRenderer.invoke('settings:set', key, value),
  resetSettings: () => ipcRenderer.invoke('settings:reset'),

  // Event listeners
  onFolderSelected: (callback) => ipcRenderer.on('folder-selected', (event, path) => callback(path)),
  onViewChanged: (callback) => ipcRenderer.on('view-changed', (event, view) => callback(view)),
  onSortChanged: (callback) => ipcRenderer.on('sort-changed', (event, sortBy) => callback(sortBy)),
  onSettingChanged: (callback) => ipcRenderer.on('setting-changed', (event, data) => callback(data)),
  onThumbnailSizeChanged: (callback) => ipcRenderer.on('thumbnail-size-changed', (event, size) => callback(size)),
  onSettingsReset: (callback) => ipcRenderer.on('settings-reset', () => callback()),
  onToggleSidebar: (callback) => ipcRenderer.on('toggle-sidebar', () => callback()),
  onShowKeyboardHelp: (callback) => ipcRenderer.on('show-keyboard-help', () => callback()),

  // Remove listeners
  removeAllListeners: () => ipcRenderer.removeAllListeners('folder-selected')
});
