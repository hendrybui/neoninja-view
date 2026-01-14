// renderer.js - NeoNinja View v1.2 - Optimized Renderer Process
console.log('NeoNinja View v1.2 - Renderer initialized');

// State management
const state = {
  currentFiles: [],
  currentSettings: {},
  currentRootPath: null,
  currentFolderPath: null,
  folderTreeData: null,
  selectedFiles: new Set(),
  currentViewerIndex: 0,
  isSlideshowRunning: false,
  slideshowInterval: null,
  searchQuery: ''
};

// DOM Elements cache
const elements = {
  pickFolder: null,
  sidebar: null,
  folderTree: null,
  toggleSidebar: null,
  gallery: null,
  viewerModal: null,
  viewerContent: null,
  closeViewerBtn: null,
  settingsBtn: null,
  settingsPanel: null,
  closeSettingsBtn: null,
  controlsBar: null,
  renameModal: null,
  renameInput: null,
  renameConfirm: null,
  renameCancel: null,
  contextMenu: null,
  searchInput: null,
  clearSearchBtn: null,
  folderSummary: null,
  bulkControls: null,
  selectionCount: null
};

// Initialize DOM elements
function initElements() {
  elements.pickFolder = document.getElementById('pickFolder');
  elements.sidebar = document.getElementById('sidebar');
  elements.folderTree = document.getElementById('folderTree');
  elements.toggleSidebar = document.getElementById('toggleSidebar');
  elements.gallery = document.getElementById('gallery');
  elements.viewerModal = document.getElementById('viewerModal');
  elements.viewerContent = document.getElementById('viewerContent');
  elements.closeViewerBtn = document.getElementById('closeViewerBtn');
  elements.settingsBtn = document.getElementById('settingsBtn');
  elements.settingsPanel = document.getElementById('settingsPanel');
  elements.closeSettingsBtn = document.querySelector('.close-settings');
  elements.controlsBar = document.getElementById('controlsBar');
  elements.renameModal = document.getElementById('renameModal');
  elements.renameInput = document.getElementById('renameInput');
  elements.renameConfirm = document.getElementById('renameConfirm');
  elements.renameCancel = document.getElementById('renameCancel');
  elements.contextMenu = document.getElementById('contextMenu');
  elements.searchInput = document.getElementById('searchInput');
  elements.clearSearchBtn = document.getElementById('clearSearchBtn');
  elements.folderSummary = document.getElementById('folderSummary');
  elements.bulkControls = document.getElementById('bulkControls');
  elements.selectionCount = document.getElementById('selectionCount');
}

// Toast notification system
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}</span>
    <span class="toast-message">${message}</span>
  `;
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remove after delay
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// File selection management
function toggleFileSelection(filePath, addToSelection = false) {
  if (state.selectedFiles.has(filePath)) {
    state.selectedFiles.delete(filePath);
  } else {
    if (!addToSelection) {
      state.selectedFiles.clear();
    }
    state.selectedFiles.add(filePath);
  }
  updateSelectionUI();
}

function clearSelection() {
  state.selectedFiles.clear();
  updateSelectionUI();
}

function selectAllFiles() {
  state.selectedFiles.clear();
  state.currentFiles.forEach(file => state.selectedFiles.add(file));
  updateSelectionUI();
}

function updateSelectionUI() {
  // Update gallery items
  document.querySelectorAll('.gallery-item').forEach(item => {
    const filePath = item.dataset.filePath;
    if (state.selectedFiles.has(filePath)) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });

  // Update bulk controls
  if (state.selectedFiles.size > 0) {
    elements.bulkControls.style.display = 'flex';
    elements.selectionCount.textContent = `${state.selectedFiles.size} selected`;
  } else {
    elements.bulkControls.style.display = 'none';
  }
}

// Context menu management
let contextMenuTargetPath = null;

function showContextMenu(x, y, filePath) {
  contextMenuTargetPath = filePath;
  const menu = elements.contextMenu;
  menu.style.display = 'block';
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;

  // Adjust position if off screen
  const rect = menu.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    menu.style.left = `${window.innerWidth - rect.width - 10}px`;
  }
  if (rect.bottom > window.innerHeight) {
    menu.style.top = `${window.innerHeight - rect.height - 10}px`;
  }
}

function hideContextMenu() {
  elements.contextMenu.style.display = 'none';
  contextMenuTargetPath = null;
}

// Settings initialization
async function initSettings() {
  state.currentSettings = await window.api.getSettings();

  // Initialize favorites if not present
  if (!state.currentSettings.favorites) {
    state.currentSettings.favorites = [];
  }

  // Apply theme
  applyTheme(state.currentSettings.themeColor || 'neon-blue');

  // Apply settings to UI
  document.getElementById('autoPlayVideos').checked = state.currentSettings.autoPlayVideos;
  document.getElementById('showFileNames').checked = state.currentSettings.showFileNames;
  document.getElementById('thumbnailSize').value = state.currentSettings.thumbnailSize;
  document.getElementById('viewerMode').value = state.currentSettings.viewerMode || 'fit';
  document.getElementById('slideShowInterval').value = state.currentSettings.slideShowInterval / 1000;
  document.getElementById('sortSelect').value = state.currentSettings.sortBy;
  document.getElementById('filterSelect').value = state.currentSettings.filterBy || 'all';

  // Set active theme button
  const currentTheme = state.currentSettings.themeColor || 'neon-blue';
  document.querySelectorAll('.theme-color-btn').forEach(btn => {
    if (btn.dataset.color === currentTheme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Apply thumbnail size
  elements.gallery.className = `gallery thumbnail-${state.currentSettings.thumbnailSize}`;
}

// Theme application
function applyTheme(color) {
  const themes = {
    'neon-blue': { primary: '#00d4ff', secondary: '#0099cc', accent: '#0066ff', glow: 'rgba(0, 212, 255, 0.3)' },
    'neon-purple': { primary: '#b24bf3', secondary: '#8b2fcf', accent: '#6b21a8', glow: 'rgba(178, 75, 243, 0.3)' },
    'neon-pink': { primary: '#ff4d9f', secondary: '#cc3380', accent: '#991a60', glow: 'rgba(255, 77, 159, 0.3)' },
    'neon-green': { primary: '#00ff88', secondary: '#00cc6a', accent: '#00994d', glow: 'rgba(0, 255, 136, 0.3)' },
    'neon-orange': { primary: '#ff9500', secondary: '#cc7700', accent: '#995900', glow: 'rgba(255, 149, 0, 0.3)' },
    'neon-red': { primary: '#ff4757', secondary: '#cc3846', accent: '#992935', glow: 'rgba(255, 71, 87, 0.3)' }
  };

  const theme = themes[color] || themes['neon-blue'];
  document.documentElement.style.setProperty('--theme-primary', theme.primary);
  document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
  document.documentElement.style.setProperty('--theme-accent', theme.accent);
  document.documentElement.style.setProperty('--theme-glow', theme.glow);
}

// File loading
async function loadFolder(folderPath, updateTree = true) {
  state.currentRootPath = folderPath;
  state.currentFolderPath = folderPath;

  // Show sidebar
  elements.sidebar.style.display = 'flex';

  if (updateTree) {
    state.folderTreeData = await window.api.getFolderTree(folderPath);
    renderFolderTree(state.folderTreeData);
  }

  const files = await window.api.scanFiles(folderPath);
  state.currentFiles = files;
  elements.controlsBar.style.display = files.length > 0 ? 'flex' : 'none';
  renderGallery(files);
}

async function loadFolderFromTree(folderPath) {
  state.currentFolderPath = folderPath;
  const files = await window.api.scanFiles(folderPath);
  state.currentFiles = files;
  elements.controlsBar.style.display = files.length > 0 ? 'flex' : 'none';
  renderGallery(files);

  // Update active state
  document.querySelectorAll('.folder-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.path === folderPath) {
      item.classList.add('active');
    }
  });
}

// Folder tree rendering
function renderFolderTree(folderData) {
  if (!folderData) {
    elements.folderTree.innerHTML = '<div class="placeholder"><span class="placeholder-icon">❌</span><p>Error loading folders</p></div>';
    return;
  }

  // Update summary
  elements.folderSummary.style.display = 'block';
  document.getElementById('totalImages').textContent = folderData.totalImageCount || 0;
  document.getElementById('totalVideos').textContent = folderData.totalVideoCount || 0;
  document.getElementById('totalFiles').textContent = (folderData.totalImageCount || 0) + (folderData.totalVideoCount || 0);

  elements.folderTree.innerHTML = '';

  function createFolderElement(folder, isRoot = false) {
    const folderItem = document.createElement('div');
    folderItem.className = `folder-item ${isRoot ? 'root' : ''} ${folder.path === state.currentFolderPath ? 'active' : ''}`;
    folderItem.dataset.path = folder.path;

    const totalImages = folder.totalImageCount || 0;
    const totalVideos = folder.totalVideoCount || 0;
    const hasFiles = totalImages > 0 || totalVideos > 0;

    let countsHTML = '';
    if (hasFiles) {
      countsHTML = '<span class="folder-count">';
      if (totalImages > 0) {
        countsHTML += `<span class="count-badge images">🖼️ ${totalImages}</span>`;
      }
      if (totalVideos > 0) {
        countsHTML += `<span class="count-badge videos">🎬 ${totalVideos}</span>`;
      }
      countsHTML += '</span>';
    }

    folderItem.innerHTML = `
      <span class="folder-icon">📁</span>
      <span class="folder-name" title="${folder.name}">${folder.name}</span>
      ${countsHTML}
    `;

    folderItem.addEventListener('click', (e) => {
      e.stopPropagation();
      loadFolderFromTree(folder.path);
    });

    return folderItem;
  }

  function renderFolder(folder, container, isRoot = false) {
    const folderElement = createFolderElement(folder, isRoot);
    container.appendChild(folderElement);

    if (folder.children && folder.children.length > 0) {
      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'folder-children';

      folder.children
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(child => renderFolder(child, childrenContainer));

      container.appendChild(childrenContainer);
    }
  }

  renderFolder(folderData, elements.folderTree, true);
}

// File sorting
function sortFiles(files) {
  const sorted = [...files];
  const { sortBy, sortOrder } = state.currentSettings;

  sorted.sort((a, b) => {
    let compareA, compareB;

    if (sortBy === 'name') {
      compareA = a.toLowerCase();
      compareB = b.toLowerCase();
    } else if (sortBy === 'favorites') {
      const aFav = state.currentSettings.favorites.includes(a);
      const bFav = state.currentSettings.favorites.includes(b);
      if (aFav !== bFav) return bFav ? 1 : -1;
      compareA = a.toLowerCase();
      compareB = b.toLowerCase();
    } else {
      compareA = a;
      compareB = b;
    }

    const result = compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
    return sortOrder === 'asc' ? result : -result;
  });

  return sorted;
}

// Gallery rendering with virtual scrolling optimization
function renderGallery(files) {
  elements.gallery.innerHTML = '';

  if (files.length === 0) {
    elements.gallery.innerHTML = `
      <div class="placeholder">
        <span class="placeholder-icon">📭</span>
        <p>No media files found in this folder.</p>
      </div>
    `;
    return;
  }

  // Filter by type
  let filteredFiles = files;
  const filterBy = state.currentSettings.filterBy || 'all';

  if (filterBy === 'images') {
    filteredFiles = files.filter(file => {
      const ext = file.split('.').pop().toLowerCase();
      return state.currentSettings.supportedFormats.images.some(v => v === `.${ext}`);
    });
  } else if (filterBy === 'videos') {
    filteredFiles = files.filter(file => {
      const ext = file.split('.').pop().toLowerCase();
      return state.currentSettings.supportedFormats.videos.some(v => v === `.${ext}`);
    });
  }

  if (filteredFiles.length === 0) {
    elements.gallery.innerHTML = `
      <div class="placeholder">
        <span class="placeholder-icon">🔍</span>
        <p>No matching media files found.</p>
      </div>
    `;
    return;
  }

  const sortedFiles = sortFiles(filteredFiles);

  // Apply view mode
  if (state.currentSettings.defaultView === 'list') {
    elements.gallery.className = `gallery list-view-mode thumbnail-${state.currentSettings.thumbnailSize}`;
  } else if (state.currentSettings.defaultView === 'detail') {
    elements.gallery.className = 'gallery detail-view-mode';
  } else {
    elements.gallery.className = `gallery thumbnail-${state.currentSettings.thumbnailSize}`;
  }

  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();

  sortedFiles.forEach((file, index) => {
    const item = createGalleryItem(file, index);
    fragment.appendChild(item);
  });

  elements.gallery.appendChild(fragment);
}

function createGalleryItem(file, index) {
  const ext = file.split('.').pop().toLowerCase();
  const isVideo = state.currentSettings.supportedFormats.videos.some(v => v === `.${ext}`);
  const fileName = file.split('\\').pop().split('/').pop();
  const isFavorite = state.currentSettings.favorites.includes(file);

  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.dataset.filePath = file;
  item.dataset.index = index;

  // Media element
  const media = isVideo
    ? document.createElement('video')
    : document.createElement('img');

  media.src = `file://${file}`;
  media.className = 'gallery-media';
  media.loading = 'lazy';

  // Video handling
  if (isVideo) {
    media.muted = true;
    media.loop = true;
    media.playsInline = true;
    media.preload = 'metadata';

    media.addEventListener('loadedmetadata', () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            media.play().catch(() => {});
          } else {
            media.pause();
          }
        });
      }, { threshold: 0.5 });

      observer.observe(media);
    });

    if (state.currentSettings.autoPlayVideos) {
      media.addEventListener('mouseenter', () => {
        media.play().catch(() => {});
      });
      media.addEventListener('mouseleave', () => {
        media.pause();
      });
    }
  }

  // Click handling
  let clickTimeout = null;
  let lastClickTime = 0;

  item.addEventListener('click', (e) => {
    e.preventDefault();
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;

    if (timeDiff < 300) {
      clearTimeout(clickTimeout);
      openViewer(file, isVideo);
    } else {
      clickTimeout = setTimeout(() => {
        const addToSelection = e.ctrlKey || e.metaKey;
        toggleFileSelection(file, addToSelection);
      }, 300);
    }

    lastClickTime = currentTime;
  });

  item.addEventListener('dblclick', (e) => {
    e.preventDefault();
    clearTimeout(clickTimeout);
    openViewer(file, isVideo);
  });

  // Context menu
  item.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, file);
  });

  item.appendChild(media);

  // File info based on view mode
  if (state.currentSettings.defaultView === 'list') {
    const info = document.createElement('div');
    info.className = 'file-info-list';
    info.innerHTML = `
      <span class="file-name" title="${fileName}">${fileName}</span>
      <div class="file-meta">
        <span class="file-type-badge ${isVideo ? 'video' : 'image'}">${isVideo ? '🎬' : '🖼️'}</span>
      </div>
    `;
    item.appendChild(info);
  } else if (state.currentSettings.defaultView === 'detail') {
    const info = document.createElement('div');
    info.className = 'file-info-detail';
    info.innerHTML = `
      <div class="file-name" title="${fileName}">${fileName}</div>
      <div class="file-actions">
        <button class="action-btn fav-btn ${isFavorite ? 'active' : ''}" title="Toggle favorite">
          ${isFavorite ? '❤️' : '♡'}
        </button>
        <button class="action-btn edit-btn" title="Edit">✏️</button>
        <button class="action-btn delete-btn" title="Delete">🗑️</button>
      </div>
    `;
    item.appendChild(info);
  } else if (state.currentSettings.showFileNames) {
    const info = document.createElement('div');
    info.className = 'file-name-container';
    info.innerHTML = `
      <span class="file-name" title="${fileName}">${fileName}</span>
      <div class="quick-actions">
        <button class="action-btn fav-btn ${isFavorite ? 'active' : ''}" title="Toggle favorite">
          ${isFavorite ? '❤️' : '♡'}
        </button>
      </div>
    `;
    item.appendChild(info);
  }

  return item;
}

// Viewer modal
function openViewer(file, isVideo) {
  state.currentViewerIndex = state.currentFiles.indexOf(file);
  showCurrentMedia();
  elements.viewerModal.style.display = 'flex';
}

function showCurrentMedia() {
  elements.viewerContent.innerHTML = '';

  const file = state.currentFiles[state.currentViewerIndex];
  const ext = file.split('.').pop().toLowerCase();
  const isVideo = state.currentSettings.supportedFormats.videos.some(v => v === `.${ext}`);

  const media = isVideo
    ? document.createElement('video')
    : document.createElement('img');

  media.src = `file://${file}`;
  media.className = `viewer-media viewer-mode-${state.currentSettings.viewerMode || 'fit'}`;

  if (isVideo) {
    media.controls = true;
    media.autoplay = true;
    media.loop = state.currentSettings.videoLoop !== false;
  }

  // Navigation arrows
  if (state.currentFiles.length > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-arrow nav-arrow-left';
    prevBtn.innerHTML = '‹';
    prevBtn.onclick = (e) => {
      e.stopPropagation();
      navigateViewer(-1);
    };

    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-arrow nav-arrow-right';
    nextBtn.innerHTML = '›';
    nextBtn.onclick = (e) => {
      e.stopPropagation();
      navigateViewer(1);
    };

    elements.viewerContent.appendChild(prevBtn);
    elements.viewerContent.appendChild(nextBtn);
  }

  // Counter
  const counter = document.createElement('div');
  counter.className = 'viewer-counter';
  counter.textContent = `${state.currentViewerIndex + 1} / ${state.currentFiles.length}`;
  elements.viewerContent.appendChild(counter);

  // Context menu
  media.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, file);
  });

  elements.viewerContent.appendChild(media);
}

function navigateViewer(direction) {
  state.currentViewerIndex += direction;

  if (state.currentViewerIndex < 0) {
    state.currentViewerIndex = state.currentFiles.length - 1;
  } else if (state.currentViewerIndex >= state.currentFiles.length) {
    state.currentViewerIndex = 0;
  }

  showCurrentMedia();
}

function closeViewer() {
  elements.viewerModal.style.display = 'none';
  elements.viewerContent.innerHTML = '';
}

// Event listeners setup
function setupEventListeners() {
  // Folder selection
  elements.pickFolder.addEventListener('click', async () => {
    const folderPath = await window.api.openDirectory();
    if (folderPath) {
      await loadFolder(folderPath);
    }
  });

  // Settings panel
  elements.settingsBtn.addEventListener('click', () => {
    elements.settingsPanel.classList.add('show');
  });

  elements.closeSettingsBtn.addEventListener('click', () => {
    elements.settingsPanel.classList.remove('show');
  });

  // Sidebar toggle
  elements.toggleSidebar.addEventListener('click', () => {
    elements.sidebar.classList.toggle('collapsed');
    elements.toggleSidebar.textContent = elements.sidebar.classList.contains('collapsed') ? '▶' : '◀';
  });

  // Viewer close
  elements.closeViewerBtn.addEventListener('click', closeViewer);
  elements.viewerModal.addEventListener('click', (e) => {
    if (e.target === elements.viewerModal) {
      closeViewer();
    }
  });

  // Search
  elements.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase();
    elements.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    filterGallery();
  });

  elements.clearSearchBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    state.searchQuery = '';
    elements.clearSearchBtn.style.display = 'none';
    filterGallery();
  });

  // View controls
  document.querySelectorAll('.view-controls .control-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const view = btn.dataset.view;
      await window.api.setSetting('defaultView', view);
      state.currentSettings.defaultView = view;
      renderGallery(state.currentFiles);

      // Update active state
      document.querySelectorAll('.view-controls .control-btn').forEach(b => {
        b.classList.remove('active');
      });
      btn.classList.add('active');
    });
  });

  // Sort controls
  document.getElementById('sortSelect').addEventListener('change', async (e) => {
    await window.api.setSetting('sortBy', e.target.value);
    state.currentSettings.sortBy = e.target.value;
    renderGallery(state.currentFiles);
  });

  document.getElementById('sortOrderBtn').addEventListener('click', async () => {
    const newOrder = state.currentSettings.sortOrder === 'asc' ? 'desc' : 'asc';
    await window.api.setSetting('sortOrder', newOrder);
    state.currentSettings.sortOrder = newOrder;
    renderGallery(state.currentFiles);
  });

  // Filter controls
  document.getElementById('filterSelect').addEventListener('change', async (e) => {
    await window.api.setSetting('filterBy', e.target.value);
    state.currentSettings.filterBy = e.target.value;
    renderGallery(state.currentFiles);
  });

  // Bulk controls
  document.getElementById('selectAllBtn')?.addEventListener('click', selectAllFiles);
  document.getElementById('deselectAllBtn')?.addEventListener('click', clearSelection);

  document.getElementById('bulkDeleteBtn')?.addEventListener('click', async () => {
    if (state.selectedFiles.size === 0) return;

    const count = state.selectedFiles.size;
    if (!confirm(`Are you sure you want to delete ${count} file${count > 1 ? 's' : ''}?`)) {
      return;
    }

    let deletedCount = 0;
    for (const filePath of state.selectedFiles) {
      const result = await window.api.deleteFile(filePath);
      if (result && result.success) {
        deletedCount++;
        const index = state.currentFiles.indexOf(filePath);
        if (index !== -1) {
          state.currentFiles.splice(index, 1);
        }

        const favIndex = state.currentSettings.favorites.indexOf(filePath);
        if (favIndex > -1) {
          state.currentSettings.favorites.splice(favIndex, 1);
        }
      }
    }

    if (deletedCount > 0) {
      await window.api.setSetting('favorites', state.currentSettings.favorites);
      showToast(`Deleted ${deletedCount} file${deletedCount > 1 ? 's' : ''}`, 'success');
      clearSelection();
      await loadFolder(state.currentRootPath, false);
    }
  });

  document.getElementById('bulkMoveBtn')?.addEventListener('click', async () => {
    if (state.selectedFiles.size === 0) return;
    const destFolder = await window.api.openDirectory();
    if (destFolder) {
      let movedCount = 0;
      for (const filePath of state.selectedFiles) {
        const fileName = filePath.split('\\').pop().split('/').pop();
        const newPath = destFolder + (destFolder.endsWith('\\') || destFolder.endsWith('/') ? '' : '/') + fileName;
        const result = await window.api.moveFile(filePath, newPath);
        if (result && result.success) {
          movedCount++;
          const index = state.currentFiles.indexOf(filePath);
          if (index !== -1) {
            state.currentFiles.splice(index, 1);
          }
        }
      }

      if (movedCount > 0) {
        showToast(`Moved ${movedCount} file${movedCount > 1 ? 's' : ''}`, 'success');
        clearSelection();
        await loadFolder(state.currentRootPath, false);
      }
    }
  });

  // Settings changes - Theme color buttons
  document.querySelectorAll('.theme-color-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const color = e.target.dataset.color;
      await window.api.setSetting('themeColor', color);
      state.currentSettings.themeColor = color;
      applyTheme(color);

      // Update active state
      document.querySelectorAll('.theme-color-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  document.getElementById('autoPlayVideos').addEventListener('change', async (e) => {
    await window.api.setSetting('autoPlayVideos', e.target.checked);
    state.currentSettings.autoPlayVideos = e.target.checked;
  });

  document.getElementById('showFileNames').addEventListener('change', async (e) => {
    await window.api.setSetting('showFileNames', e.target.checked);
    state.currentSettings.showFileNames = e.target.checked;
    renderGallery(state.currentFiles);
  });

  document.getElementById('thumbnailSize').addEventListener('change', async (e) => {
    await window.api.setSetting('thumbnailSize', e.target.value);
    state.currentSettings.thumbnailSize = e.target.value;
    elements.gallery.className = `gallery thumbnail-${e.target.value}`;
  });

  document.getElementById('viewerMode').addEventListener('change', async (e) => {
    await window.api.setSetting('viewerMode', e.target.value);
    state.currentSettings.viewerMode = e.target.value;
  });

  document.getElementById('slideShowInterval').addEventListener('change', async (e) => {
    const value = parseInt(e.target.value) * 1000;
    await window.api.setSetting('slideShowInterval', value);
    state.currentSettings.slideShowInterval = value;
  });

  document.getElementById('resetSettings').addEventListener('click', async () => {
    await window.api.resetSettings();
    location.reload();
  });

  // Context menu
  elements.contextMenu.addEventListener('click', async (e) => {
    const item = e.target.closest('.context-menu-item');
    if (!item) return;

    const action = item.dataset.action;
    const targetPath = contextMenuTargetPath;
    hideContextMenu();

    try {
      switch (action) {
        case 'copy':
          const copyResult = await window.api.copyFile(targetPath);
          if (copyResult.success) showToast(copyResult.message, 'success');
          break;

        case 'cut':
          const cutResult = await window.api.cutFile(targetPath);
          if (cutResult.success) showToast(cutResult.message, 'success');
          break;

        case 'paste':
          const pasteDir = state.currentFolderPath || state.currentRootPath;
          const pasteResult = await window.api.pasteFile(pasteDir);
          if (pasteResult.success) {
            showToast(pasteResult.message, 'success');
            await loadFolder(state.currentRootPath, false);
          }
          break;

        case 'edit':
          await window.api.editFile(targetPath);
          break;

        case 'showInFolder':
          await window.api.showInFolder(targetPath);
          break;

        case 'copyPath':
          const pathResult = await window.api.copyPath(targetPath);
          if (pathResult.success) showToast(pathResult.message, 'success');
          break;

        case 'properties':
          const propsResult = await window.api.getFileProperties(targetPath);
          if (propsResult.success) {
            const props = propsResult.properties;
            alert(`
Name: ${props.name}
Path: ${props.path}
Size: ${props.sizeFormatted}
Created: ${new Date(props.created).toLocaleString()}
Modified: ${new Date(props.modified).toLocaleString()}
            `.trim());
          }
          break;

        case 'delete':
          if (confirm('Are you sure you want to delete this file?')) {
            const deleteResult = await window.api.deleteFile(targetPath);
            if (deleteResult.success) {
              showToast('File deleted', 'success');
              await loadFolder(state.currentRootPath, false);
            }
          }
          break;

        case 'rotate90':
          const rotate90Result = await window.api.rotateImage(targetPath, 90);
          if (rotate90Result.success) {
            showToast('Image rotated 90° CW', 'success');
            await loadFolder(state.currentRootPath, false);
          }
          break;

        case 'rotate270':
          const rotate270Result = await window.api.rotateImage(targetPath, 270);
          if (rotate270Result.success) {
            showToast('Image rotated 90° CCW', 'success');
            await loadFolder(state.currentRootPath, false);
          }
          break;

        case 'flipH':
          const flipHResult = await window.api.flipImage(targetPath, 'horizontal');
          if (flipHResult.success) {
            showToast('Image flipped horizontally', 'success');
            await loadFolder(state.currentRootPath, false);
          }
          break;

        case 'flipV':
          const flipVResult = await window.api.flipImage(targetPath, 'vertical');
          if (flipVResult.success) {
            showToast('Image flipped vertically', 'success');
            await loadFolder(state.currentRootPath, false);
          }
          break;

        case 'addToCollection':
          const favorites = state.currentSettings.favorites || [];
          const index = favorites.indexOf(targetPath);
          if (index > -1) {
            favorites.splice(index, 1);
            showToast('Removed from favorites', 'info');
          } else {
            favorites.push(targetPath);
            showToast('Added to favorites', 'success');
          }
          await window.api.setSetting('favorites', favorites);
          state.currentSettings.favorites = favorites;
          renderGallery(state.currentFiles);
          break;
      }
    } catch (err) {
      showToast(`Action failed: ${  err.message}`, 'error');
    }
  });

  // Close context menu on outside click
  document.addEventListener('click', (e) => {
    if (!elements.contextMenu.contains(e.target)) {
      hideContextMenu();
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', async (e) => {
    // Viewer navigation
    if (elements.viewerModal.style.display === 'flex') {
      if (e.key === 'ArrowLeft') {
        navigateViewer(-1);
      } else if (e.key === 'ArrowRight') {
        navigateViewer(1);
      } else if (e.key === 'Escape') {
        closeViewer();
      }
      return;
    }

    // Global shortcuts
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      selectAllFiles();
    } else if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      elements.searchInput.focus();
    } else if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      elements.sidebar.classList.toggle('collapsed');
      elements.toggleSidebar.textContent = elements.sidebar.classList.contains('collapsed') ? '▶' : '◀';
    } else if (e.key === 'F1') {
      e.preventDefault();
      document.getElementById('keyboardHelp').style.display = 'flex';
    }
  });
}

// Gallery filtering
function filterGallery() {
  if (!state.searchQuery) {
    renderGallery(state.currentFiles);
    return;
  }

  const filtered = state.currentFiles.filter(file => {
    const fileName = file.split('\\').pop().split('/').pop().toLowerCase();
    return fileName.includes(state.searchQuery);
  });

  renderGallery(filtered);
}

// IPC event listeners
function setupIPCListeners() {
  window.api.onFolderSelected((path) => loadFolder(path));
  window.api.onViewChanged((view) => {
    state.currentSettings.defaultView = view;
    renderGallery(state.currentFiles);
  });
  window.api.onSortChanged((sortBy) => {
    state.currentSettings.sortBy = sortBy;
    renderGallery(state.currentFiles);
  });
  window.api.onSettingChanged((data) => {
    state.currentSettings[data.key] = data.value;
    if (data.key === 'showFileNames') {
      renderGallery(state.currentFiles);
    }
  });
  window.api.onThumbnailSizeChanged((size) => {
    state.currentSettings.thumbnailSize = size;
    elements.gallery.className = `gallery thumbnail-${size}`;
  });
  window.api.onSettingsReset(() => {
    location.reload();
  });
  window.api.onToggleSidebar(() => {
    elements.sidebar.classList.toggle('collapsed');
    elements.toggleSidebar.textContent = elements.sidebar.classList.contains('collapsed') ? '▶' : '◀';
  });
  window.api.onShowKeyboardHelp(() => {
    document.getElementById('keyboardHelp').style.display = 'flex';
  });
}

// Initialize application
async function init() {
  initElements();
  setupEventListeners();
  setupIPCListeners();
  await initSettings();

  console.log('NeoNinja View v1.2 initialized successfully');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
