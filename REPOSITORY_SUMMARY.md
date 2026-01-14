# NeoNinja View v1.2 - Repository Summary

## 🎯 Project Overview

**NeoNinja View** is a high-performance, standalone local media viewer with a modern dark theme and neon accents. Built with Electron for cross-platform compatibility, it provides an elegant solution for browsing, viewing, and managing local image and video files.

### Key Characteristics
- **Modern Design**: Dark theme with 6 vibrant neon color options
- **High Performance**: Intelligent caching, lazy loading, and optimized rendering
- **Feature-Rich**: Multiple view modes, batch operations, image editing
- **Cross-Platform**: Windows, macOS, and Linux support
- **User-Friendly**: Intuitive interface with comprehensive keyboard shortcuts

---

## 📁 Project Structure

```
neoninja-view/
├── main.js                    # Main Electron process (optimized)
├── package.json               # Project configuration
├── eslint.config.js           # Code linting rules
├── README.md                 # User documentation
├── CHANGELOG.md              # Version history
├── LICENSE                   # MIT License
├── .gitignore               # Version control exclusions
├── src/
│   ├── main/
│   │   └── preload.js       # Secure IPC bridge
│   └── renderer/
│       ├── index.html         # Main UI (redesigned)
│       └── renderer.js       # Renderer logic (optimized)
├── assets/
│   ├── style.css            # Main stylesheet (modernized)
│   └── animations.css      # Animation library
└── build/                 # Build assets (icons)
    └── README.md           # Icon requirements
```

---

## 🚀 Technology Stack

### Core Technologies
- **Framework**: Electron 39.2.7
- **Language**: JavaScript (ES2022)
- **Styling**: CSS3 with Custom Properties
- **Image Processing**: Sharp 0.34.5
- **Settings**: electron-store 11.0.2
- **Build Tool**: electron-builder 26.4.0

### Key Dependencies
```json
{
  "electron": "^39.2.7",
  "electron-builder": "^26.4.0",
  "electron-store": "^11.0.2",
  "sharp": "^0.34.5"
}
```

---

## ✨ Core Features

### 1. Media Viewing
- **Image Support**: .jpg, .jpeg, .png, .gif, .webp, .bmp, .svg, .ico, .tiff, .tif
- **Video Support**: .mp4, .webm, .ogg, .mov, .avi, .mkv, .flv, .wmv
- **Multiple Viewer Modes**: Fit to screen, fill screen, original size
- **Fullscreen Support**: Native fullscreen for immersive viewing

### 2. File Management
- **Folder Browsing**: Intuitive folder tree with statistics
- **File Operations**: Copy, cut, paste, rename, delete
- **Batch Operations**: Select and move/delete multiple files
- **Context Menu**: Comprehensive right-click menu
- **Recent Folders**: Quick access to recently opened folders

### 3. Organization
- **View Modes**: Grid, List, and Detail views
- **Sorting**: By name, date, size, or favorites
- **Filtering**: By media type (images/videos)
- **Favorites System**: Mark and organize favorite files
- **Real-time Search**: Instant filtering as you type

### 4. Image Editing
- **Rotation**: 90° clockwise or counter-clockwise
- **Flipping**: Horizontal or vertical flip
- **Permanent Changes**: Edits saved to actual files

### 5. Video Controls
- **Full Playback**: Play, pause, seek controls
- **Volume Control**: Adjustable volume
- **Looping**: Toggle video looping
- **Screenshot Capture**: Capture frames to disk
- **Auto-play**: Optional auto-play on hover

### 6. Customization
- **6 Neon Themes**: Blue, Purple, Pink, Green, Orange, Red
- **Thumbnail Sizes**: Small, Medium, Large options
- **Settings Panel**: Comprehensive configuration
- **Persistent Settings**: Preferences saved between sessions

---

## ⚡ Performance Optimizations

### Caching Strategy
- **File Cache**: 100 entries, 1-minute TTL
- **Thumbnail Cache**: 200 entries, unlimited TTL
- **Metadata Cache**: 500 entries, unlimited TTL
- **Auto-cleanup**: Every 60 seconds

### Loading Optimizations
- **Lazy Loading**: Images load only when 50% visible
- **Parallel Scanning**: Concurrent directory reads
- **Batch Rendering**: DocumentFragment for DOM updates
- **Progressive Thumbnails**: Fast load with progressive JPEG

### Memory Management
- **Cache Limits**: Automatic size enforcement
- **Cleanup Policy**: LRU (Least Recently Used) eviction
- **Memory Monitoring**: Periodic cleanup every minute

---

## 🎨 Design Features

### Visual Design
- **Dark Theme**: Optimized for prolonged use
- **Neon Accents**: Vibrant, modern color palette
- **Smooth Transitions**: 150-500ms animations
- **Hover Effects**: Lift, scale, and glow effects
- **Focus States**: Clear visual indicators

### Animation Library
20+ animation types including:
- Fade in/out
- Slide up/down/left/right
- Scale up/down
- Rotate
- Bounce
- Pulse
- And more...

### User Experience
- **Intuitive Navigation**: Clear folder hierarchy
- **Quick Actions**: Right-click context menu
- **Keyboard Shortcuts**: 20+ shortcuts for power users
- **Toast Notifications**: Beautiful feedback system
- **Loading States**: Skeleton loaders

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+O` | Open Folder |
| `Ctrl+B` | Toggle Sidebar |
| `Ctrl+F` | Focus Search |
| `Ctrl+A` | Select All |
| `Ctrl+C` | Copy |
| `Ctrl+X` | Cut |
| `Ctrl+V` | Paste |
| `Delete` | Delete Selected |
| `Space` | Quick View / Play-Pause Video |
| `←` / `→` | Navigate Images |
| `↑` / `↓` | Video Volume |
| `R` | Rotate 90° CW |
| `Shift+R` | Rotate 90° CCW |
| `M` | Mute/Unmute Video |
| `F1` | Show Keyboard Help |
| `F11` | Fullscreen |
| `Esc` | Close Viewer/Modal |

---

## 🔧 Configuration

### Settings Location
- **Windows**: `%APPDATA%/neoninja-view/Config`
- **macOS**: `~/Library/Application Support/neoninja-view/Config`
- **Linux**: `~/.config/neoninja-view/Config`

### Default Settings
```json
{
  "themeColor": "neon-blue",
  "autoPlayVideos": true,
  "showFileNames": true,
  "thumbnailSize": "medium",
  "viewerMode": "fit",
  "slideShowInterval": 3000,
  "defaultView": "grid",
  "sortBy": "name",
  "sortOrder": "asc",
  "filterBy": "all",
  "videoLoop": true,
  "favorites": [],
  "supportedFormats": {
    "images": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg", ".ico", ".tiff", ".tif"],
    "videos": [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv", ".flv", ".wmv"]
  },
  "recentFolders": [],
  "maxCacheSize": 100
}
```

---

## 🏗️ Architecture

### Main Process
- **Window Management**: BrowserWindow creation and lifecycle
- **IPC Handlers**: Secure communication with renderer
- **File Operations**: File system access and manipulation
- **Image Processing**: Sharp integration for thumbnails and edits
- **Settings Management**: Persistent configuration storage
- **Menu System**: Native application menus

### Renderer Process
- **UI Rendering**: DOM manipulation and updates
- **Event Handling**: User interaction processing
- **State Management**: Centralized state object
- **Caching**: Client-side caching for performance
- **Animations**: Smooth transitions and effects

### Security Features
- **Context Isolation**: Separate renderer context
- **Secure IPC**: Validated communication channels
- **Content Security Policy**: Restrictive CSP headers
- **Input Validation**: Sanitized file paths
- **No Native Alerts**: Custom modal dialogs

---

## 📦 Build & Distribution

### Development
```bash
npm install
npm start
```

### Production Build
```bash
npm run build
```

### Platform-Specific Builds
```bash
# Windows
npm run build -- --win

# macOS
npm run build -- --mac

# Linux
npm run build -- --linux
```

### Build Output
- **Windows**: NSIS installer with desktop shortcut
- **macOS**: DMG package with app bundle
- **Linux**: AppImage distribution

---

## 🔄 Version History

### Version 1.2.0
- ✨ Complete redesign with modern dark theme
- 🎨 6 neon color themes
- ⚡ Performance optimizations with caching
- 🖼️ Multiple viewing modes (Grid, List, Detail)
- 🎯 Enhanced folder tree with statistics
- ⌨️ Comprehensive keyboard shortcuts
- 📱 Responsive design
- 🔔 Toast notification system
- 🎬 Improved video controls
- 📐 Image rotation and flipping
- ⭐ Favorites system
- 🔍 Real-time search
- 📋 Context menu
- 🔄 Batch operations

---

## 🚧 Future Roadmap (v1.3+)

- [ ] Drag and drop file support
- [ ] Image filters and adjustments
- [ ] EXIF metadata viewer
- [ ] Slideshow mode with transitions
- [ ] Image comparison
- [ ] Batch rename
- [ ] Cloud storage integration
- [ ] Plugin system
- [ ] Custom themes
- [ ] Image tagging
- [ ] Advanced search (by date, size, etc.)
- [ ] Image compression tools
- [ ] Format conversion
- [ ] PDF viewing support

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

For questions or support:
- GitHub Issues: https://github.com/yourusername/neoninja-view/issues
- Documentation: https://github.com/yourusername/neoninja-view/wiki

---

## 🎯 Project Goals

1. **Performance**: Fast, responsive, and efficient
2. **Usability**: Intuitive and accessible
3. **Design**: Modern, beautiful, and consistent
4. **Reliability**: Stable and bug-free
5. **Extensibility**: Easy to add new features

---

## 💡 Key Innovations

1. **Three-Tier Caching**: Files, thumbnails, and metadata
2. **Lazy Loading**: Intersection Observer API
3. **Parallel Processing**: Async/await for concurrent operations
4. **Modern UI**: Glass-morphism with neon accents
5. **Comprehensive Shortcuts**: Power user efficiency
6. **Batch Operations**: Multi-file management
7. **Theme System**: Dynamic color switching
8. **Animation Library**: 20+ smooth animations

---

**Built with passion for performance and design** 🥷

*Last Updated: January 14, 2026*
