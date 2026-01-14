/* global require, __dirname, process, console */

// main.js - NeoNinja View v1.2 - Optimized Main Process
const { app, BrowserWindow, ipcMain, dialog, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

// Performance optimizations - Enable GPU for glowing effects and features
// Note: These switches are set by Electron before app is ready
// GPU is enabled by default for hardware acceleration

// Cache for performance
const fileCache = new Map();
const thumbnailCache = new Map();
const metadataCache = new Map();

// Default settings
const defaultSettings = {
  themeColor: 'neon-blue',
  autoPlayVideos: true,
  showFileNames: true,
  thumbnailSize: 'medium',
  viewerMode: 'fit',
  slideShowInterval: 3000,
  defaultView: 'grid',
  sortBy: 'name',
  sortOrder: 'asc',
  filterBy: 'all',
  videoLoop: true,
  favorites: [],
  supportedFormats: {
    images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.ico', '.tiff', '.tif'],
    videos: ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv']
  },
  recentFolders: [],
  maxCacheSize: 100
};

// Settings manager
class SettingsManager {
  constructor() {
    const { default: Store } = require('electron-store');
    this.store = new Store({
      defaults: defaultSettings,
      projectName: 'neoninja-view'
    });
  }

  get(key) {
    return this.store.get(key);
  }

  getAll() {
    return this.store.store;
  }

  set(key, value) {
    this.store.set(key, value);
  }

  reset() {
    this.store.clear();
    Object.keys(defaultSettings).forEach(key => {
      this.store.set(key, defaultSettings[key]);
    });
  }

  addRecentFolder(folderPath) {
    const recent = this.get('recentFolders') || [];
    const index = recent.indexOf(folderPath);
    if (index > -1) {
      recent.splice(index, 1);
    }
    recent.unshift(folderPath);
    if (recent.length > 10) {
      recent.pop();
    }
    this.set('recentFolders', recent);
  }
}

const settings = new SettingsManager();
let mainWindow;

// Optimized file scanning with caching
async function scanDirectoryRecursive(directory, extensions, cacheKey = null) {
  // Check cache first
  if (cacheKey && fileCache.has(cacheKey)) {
    const cached = fileCache.get(cacheKey);
    if (Date.now() - cached.timestamp < 60000) { // Cache for 1 minute
      return cached.files;
    }
  }

  const mediaFiles = [];

  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    const promises = entries.map(async (entry) => { // eslint-disable-line require-await
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return scanDirectoryRecursive(fullPath, extensions);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          return fullPath;
        }
      }
      return [];
    });

    const results = await Promise.all(promises);
    results.forEach(files => mediaFiles.push(...files));
  } catch (err) {
    console.error(`Error reading directory ${directory}:`, err);
  }

  // Update cache
  if (cacheKey) {
    fileCache.set(cacheKey, {
      files: mediaFiles,
      timestamp: Date.now()
    });

    // Clean old cache entries
    if (fileCache.size > settings.get('maxCacheSize')) {
      const oldestKey = Array.from(fileCache.keys())[0];
      fileCache.delete(oldestKey);
    }
  }

  return mediaFiles;
}

// Optimized folder tree building
async function buildFolderTree(dirPath, imageExtensions, videoExtensions, isRoot = false) {
  const folder = {
    name: isRoot ? path.basename(dirPath) : path.basename(dirPath),
    path: dirPath,
    children: [],
    imageCount: 0,
    videoCount: 0
  };

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    // Count media files in this directory
    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (imageExtensions.includes(ext)) {
          folder.imageCount++;
        } else if (videoExtensions.includes(ext)) {
          folder.videoCount++;
        }
      }
    }

    // Build child folders in parallel
    const folderPromises = [];
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const childPath = path.join(dirPath, entry.name);
        folderPromises.push(buildFolderTree(childPath, imageExtensions, videoExtensions, false));
      }
    }

    const childFolders = await Promise.all(folderPromises);

    // Only include folders that have files
    for (const childFolder of childFolders) {
      const childTotal = childFolder.imageCount + childFolder.videoCount +
                        (childFolder.totalImageCount || 0) + (childFolder.totalVideoCount || 0);
      if (childTotal > 0) {
        folder.children.push(childFolder);
      }
    }

    // Calculate total counts
    folder.totalImageCount = folder.imageCount + folder.children.reduce(
      (sum, child) => sum + (child.totalImageCount || 0), 0
    );
    folder.totalVideoCount = folder.videoCount + folder.children.reduce(
      (sum, child) => sum + (child.totalVideoCount || 0), 0
    );

  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err);
  }

  return folder;
}

// Optimized thumbnail generation with caching
async function generateThumbnail(filePath, size = 300) {
  const cacheKey = `${filePath}_${size}`;

  // Check cache
  if (thumbnailCache.has(cacheKey)) {
    return thumbnailCache.get(cacheKey);
  }

  try {
    const sharp = require('sharp');
    const buffer = await fs.readFile(filePath);
    const thumbnail = await sharp(buffer)
      .resize(size, size, {
        fit: 'cover',
        position: 'center',
        fastShrinkOnLoad: true
      })
      .jpeg({ quality: 75, progressive: true })
      .toBuffer();

    const result = `data:image/jpeg;base64,${thumbnail.toString('base64')}`;

    // Cache result
    thumbnailCache.set(cacheKey, result);

    // Clean old cache entries
    if (thumbnailCache.size > 200) {
      const oldestKey = Array.from(thumbnailCache.keys())[0];
      thumbnailCache.delete(oldestKey);
    }

    return result;
  } catch (err) {
    console.error('Error generating thumbnail:', err);
    return null;
  }
}

// Optimized metadata extraction
async function extractMetadata(filePath) {
  const cacheKey = filePath;

  // Check cache
  if (metadataCache.has(cacheKey)) {
    return metadataCache.get(cacheKey);
  }

  try {
    const stats = await fs.stat(filePath);
    const metadata = {
      name: path.basename(filePath),
      path: filePath,
      size: stats.size,
      sizeFormatted: formatBytes(stats.size),
      created: stats.birthtime,
      modified: stats.mtime,
      isDirectory: stats.isDirectory(),
      extension: path.extname(filePath).toLowerCase()
    };

    // Cache result
    metadataCache.set(cacheKey, metadata);

    // Clean old cache entries
    if (metadataCache.size > 500) {
      const oldestKey = Array.from(metadataCache.keys())[0];
      metadataCache.delete(oldestKey);
    }

    return metadata;
  } catch (err) {
    console.error('Error extracting metadata:', err);
    return null;
  }
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))  } ${  sizes[i]}`;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    backgroundColor: '#0a0e27',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'src/main/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    },
    icon: path.join(__dirname, 'build/icon.png')
  });

  mainWindow.loadFile('src/renderer/index.html');

  // Show window when ready to prevent visual glitches
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  createMenu(mainWindow);
}

function createMenu(mainWindow) {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Folder',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog({
              properties: ['openDirectory']
            });
            if (!canceled) {
              settings.addRecentFolder(filePaths[0]);
              mainWindow.webContents.send('folder-selected', filePaths[0]);
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Recent Folders',
          submenu: (settings.get('recentFolders') || []).map(folder => ({
            label: path.basename(folder),
            click: () => {
              mainWindow.webContents.send('folder-selected', folder);
            }
          }))
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Grid View',
          type: 'radio',
          checked: settings.get('defaultView') === 'grid',
          click: () => {
            settings.set('defaultView', 'grid');
            mainWindow.webContents.send('view-changed', 'grid');
          }
        },
        {
          label: 'List View',
          type: 'radio',
          checked: settings.get('defaultView') === 'list',
          click: () => {
            settings.set('defaultView', 'list');
            mainWindow.webContents.send('view-changed', 'list');
          }
        },
        {
          label: 'Detail View',
          type: 'radio',
          checked: settings.get('defaultView') === 'detail',
          click: () => {
            settings.set('defaultView', 'detail');
            mainWindow.webContents.send('view-changed', 'detail');
          }
        },
        { type: 'separator' },
        {
          label: 'Sort by Name',
          type: 'radio',
          checked: settings.get('sortBy') === 'name',
          click: () => {
            settings.set('sortBy', 'name');
            mainWindow.webContents.send('sort-changed', 'name');
          }
        },
        {
          label: 'Sort by Date',
          type: 'radio',
          checked: settings.get('sortBy') === 'date',
          click: () => {
            settings.set('sortBy', 'date');
            mainWindow.webContents.send('sort-changed', 'date');
          }
        },
        {
          label: 'Sort by Size',
          type: 'radio',
          checked: settings.get('sortBy') === 'size',
          click: () => {
            settings.set('sortBy', 'size');
            mainWindow.webContents.send('sort-changed', 'size');
          }
        },
        { type: 'separator' },
        {
          label: 'Toggle Sidebar',
          accelerator: 'CmdOrCtrl+B',
          click: () => {
            mainWindow.webContents.send('toggle-sidebar');
          }
        },
        { type: 'separator' },
        { role: 'toggleDevTools' },
        { role: 'reload' }
      ]
    },
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Auto-play Videos',
          type: 'checkbox',
          checked: settings.get('autoPlayVideos'),
          click: (menuItem) => {
            settings.set('autoPlayVideos', menuItem.checked);
            mainWindow.webContents.send('setting-changed', {
              key: 'autoPlayVideos',
              value: menuItem.checked
            });
          }
        },
        {
          label: 'Show File Names',
          type: 'checkbox',
          checked: settings.get('showFileNames'),
          click: (menuItem) => {
            settings.set('showFileNames', menuItem.checked);
            mainWindow.webContents.send('setting-changed', {
              key: 'showFileNames',
              value: menuItem.checked
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Thumbnail Size',
          submenu: [
            {
              label: 'Small',
              type: 'radio',
              checked: settings.get('thumbnailSize') === 'small',
              click: () => {
                settings.set('thumbnailSize', 'small');
                mainWindow.webContents.send('thumbnail-size-changed', 'small');
              }
            },
            {
              label: 'Medium',
              type: 'radio',
              checked: settings.get('thumbnailSize') === 'medium',
              click: () => {
                settings.set('thumbnailSize', 'medium');
                mainWindow.webContents.send('thumbnail-size-changed', 'medium');
              }
            },
            {
              label: 'Large',
              type: 'radio',
              checked: settings.get('thumbnailSize') === 'large',
              click: () => {
                settings.set('thumbnailSize', 'large');
                mainWindow.webContents.send('thumbnail-size-changed', 'large');
              }
            }
          ]
        },
        { type: 'separator' },
        {
          label: 'Reset to Defaults',
          click: () => {
            settings.reset();
            mainWindow.webContents.send('settings-reset');
            app.relaunch();
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Keyboard Shortcuts',
          accelerator: 'F1',
          click: () => {
            mainWindow.webContents.send('show-keyboard-help');
          }
        },
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About NeoNinja View',
              message: 'NeoNinja View v1.2.0',
              detail: 'A high-performance local media viewer with modern design.\n\nBuilt with Electron and optimized for speed and efficiency.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('dialog:openDirectory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (canceled) return null;
  return filePaths[0];
});

ipcMain.handle('files:scan', async (event, dirPath) => {
  try {
    const userSettings = settings.getAll();
    const allExtensions = [
      ...userSettings.supportedFormats.images,
      ...userSettings.supportedFormats.videos
    ];
    const cacheKey = crypto.createHash('md5').update(dirPath).digest('hex');
    return await scanDirectoryRecursive(dirPath, allExtensions, cacheKey);
  } catch (err) {
    console.error('Error reading directory:', err);
    return [];
  }
});

ipcMain.handle('files:getFolderTree', async (event, rootPath) => {
  try {
    const userSettings = settings.getAll();
    const imageExtensions = userSettings.supportedFormats.images;
    const videoExtensions = userSettings.supportedFormats.videos;
    return await buildFolderTree(rootPath, imageExtensions, videoExtensions, true);
  } catch (err) {
    console.error('Error building folder tree:', err);
    return null;
  }
});

ipcMain.handle('settings:get', async (event, key) => {
  return key ? settings.get(key) : settings.getAll();
});

ipcMain.handle('settings:set', async (event, key, value) => {
  settings.set(key, value);
  return settings.get(key);
});

ipcMain.handle('settings:reset', async () => {
  return settings.reset();
});

ipcMain.handle('file:rename', async (event, oldPath, newPath) => {
  try {
    await fs.rename(oldPath, newPath);
    // Clear cache for affected paths
    clearCacheForPath(oldPath);
    return { success: true, newPath };
  } catch (err) {
    console.error('Error renaming file:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('file:delete', async (event, filePath) => {
  try {
    await fs.unlink(filePath);
    // Clear cache
    clearCacheForPath(filePath);
    return { success: true };
  } catch (err) {
    console.error('Error deleting file:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('file:copy', async (event, filePath) => {
  try {
    const image = nativeImage.createFromPath(filePath);
    if (!image.isEmpty()) {
      const { clipboard } = require('electron');
      clipboard.writeImage(image);
      return { success: true, message: 'Image copied to clipboard' };
    } else {
      const { clipboard } = require('electron');
      clipboard.writeText(filePath);
      return { success: true, message: 'File path copied to clipboard' };
    }
  } catch (err) {
    console.error('Error copying file:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('file:cut', async (event, filePath) => {
  try {
    const { clipboard } = require('electron');
    clipboard.writeText(`cut:${filePath}`);
    return { success: true, message: 'File cut to clipboard' };
  } catch (err) {
    console.error('Error cutting file:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('file:paste', async (event, targetDir) => {
  try {
    const { clipboard } = require('electron');
    const clipText = clipboard.readText();

    if (clipText.startsWith('cut:')) {
      const sourcePath = clipText.substring(4);
      const fileName = path.basename(sourcePath);
      const targetPath = path.join(targetDir, fileName);

      await fs.rename(sourcePath, targetPath);
      // Clear cache
      clearCacheForPath(sourcePath);
      return { success: true, message: 'File moved', path: targetPath };
    }

    return { success: false, error: 'No file to paste' };
  } catch (err) {
    console.error('Error pasting file:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('file:edit', async (event, filePath) => {
  try {
    const { shell } = require('electron');
    await shell.openPath(filePath);
    return { success: true };
  } catch (err) {
    console.error('Error opening file:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('file:showInFolder', async (event, filePath) => {
  try {
    const { shell } = require('electron');
    shell.showItemInFolder(filePath);
    return { success: true };
  } catch (err) {
    console.error('Error showing file in folder:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('file:copyPath', async (event, filePath) => {
  try {
    const { clipboard } = require('electron');
    clipboard.writeText(filePath);
    return { success: true, message: 'Path copied to clipboard' };
  } catch (err) {
    console.error('Error copying path:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('file:getProperties', async (event, filePath) => {
  try {
    const metadata = await extractMetadata(filePath);
    if (metadata) {
      return { success: true, properties: metadata };
    }
    return { success: false, error: 'Failed to get properties' };
  } catch (err) {
    console.error('Error getting file properties:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('file:rotate', async (event, filePath, angle) => {
  try {
    const sharp = require('sharp');
    const buffer = await fs.readFile(filePath);
    const rotated = await sharp(buffer)
      .rotate(angle)
      .toBuffer();

    await fs.writeFile(filePath, rotated);
    // Clear cache
    clearCacheForPath(filePath);
    return { success: true };
  } catch (err) {
    console.error('Error rotating image:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('file:flip', async (event, filePath, direction) => {
  try {
    const sharp = require('sharp');
    const buffer = await fs.readFile(filePath);
    let transform = sharp(buffer);

    if (direction === 'horizontal') {
      transform = transform.flop();
    } else if (direction === 'vertical') {
      transform = transform.flip();
    }

    const flipped = await transform.toBuffer();
    await fs.writeFile(filePath, flipped);
    // Clear cache
    clearCacheForPath(filePath);
    return { success: true };
  } catch (err) {
    console.error('Error flipping image:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('file:generateThumbnail', async (event, filePath, size = 300) => {
  try {
    const thumbnail = await generateThumbnail(filePath, size);
    if (thumbnail) {
      return { success: true, thumbnail };
    }
    return { success: false, error: 'Failed to generate thumbnail' };
  } catch (err) {
    console.error('Error generating thumbnail:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('files:batchMove', async (event, files, targetDir) => {
  const results = [];
  for (const file of files) {
    try {
      const fileName = path.basename(file);
      const targetPath = path.join(targetDir, fileName);
      await fs.rename(file, targetPath);
      clearCacheForPath(file);
      results.push({ file, success: true });
    } catch (err) {
      results.push({ file, success: false, error: err.message });
    }
  }
  return results;
});

ipcMain.handle('files:batchDelete', async (event, files) => {
  const results = [];
  for (const file of files) {
    try {
      await fs.unlink(file);
      clearCacheForPath(file);
      results.push({ file, success: true });
    } catch (err) {
      results.push({ file, success: false, error: err.message });
    }
  }
  return results;
});

ipcMain.handle('file:move', async (event, sourcePath, targetPath) => {
  try {
    await fs.rename(sourcePath, targetPath);
    clearCacheForPath(sourcePath);
    return { success: true };
  } catch (err) {
    console.error('Error moving file:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('file:save', async (event, blob, fileName) => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: fileName,
      filters: [
        { name: 'PNG Image', extensions: ['png'] },
        { name: 'JPEG Image', extensions: ['jpg', 'jpeg'] }
      ]
    });

    if (canceled || !filePath) {
      return { success: false, error: 'Save canceled' };
    }

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    return { success: true, path: filePath };
  } catch (err) {
    console.error('Error saving file:', err);
    return { success: false, error: err.message };
  }
});

// Cache management
function clearCacheForPath(filePath) {
  // Clear from all caches
  for (const [key, value] of fileCache.entries()) {
    if (value.files.includes(filePath)) {
      fileCache.delete(key);
    }
  }

  for (const key of thumbnailCache.keys()) {
    if (key.startsWith(filePath)) {
      thumbnailCache.delete(key);
    }
  }

  if (metadataCache.has(filePath)) {
    metadataCache.delete(filePath);
  }
}

// Clear all caches periodically
setInterval(() => {
  const now = Date.now();

  // Clear old file cache entries
  for (const [key, value] of fileCache.entries()) {
    if (now - value.timestamp > 300000) { // 5 minutes
      fileCache.delete(key);
    }
  }

  // Limit thumbnail cache size
  if (thumbnailCache.size > 200) {
    const keysToDelete = Array.from(thumbnailCache.keys()).slice(0, 50);
    keysToDelete.forEach(key => thumbnailCache.delete(key));
  }

  // Limit metadata cache size
  if (metadataCache.size > 500) {
    const keysToDelete = Array.from(metadataCache.keys()).slice(0, 100);
    keysToDelete.forEach(key => metadataCache.delete(key));
  }
}, 60000); // Every minute
