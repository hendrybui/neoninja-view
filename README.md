# NeoNinja View v1.2 🥷

A high-performance, standalone local media viewer with modern dark theme and neon accents. Built with Electron for cross-platform compatibility.

![NeoNinja View](https://img.shields.io/badge/version-1.2.0-blue.svg)
![Electron](https://img.shields.io/badge/Electron-39.2.7-9FE349.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### Core Functionality
- 📁 **Folder Browsing** - Navigate through your media files with an intuitive folder tree
- 🖼️ **Image Viewing** - Support for JPG, PNG, GIF, WebP, BMP, SVG, ICO, TIFF
- 🎬 **Video Playback** - Support for MP4, WebM, OGG, MOV, AVI, MKV, FLV, WMV
- 🔍 **Search** - Quickly find files by name
- ⭐ **Favorites** - Mark and organize your favorite files
- 📋 **File Operations** - Copy, cut, paste, rename, delete files
- 🔄 **Batch Operations** - Select and move/delete multiple files at once

### Viewing Modes
- ⊞ **Grid View** - Classic thumbnail grid layout
- ☰ **List View** - Compact list with file details
- ▤ **Detail View** - Rich information display with actions

### Organization
- 🔀 **Sorting** - Sort by name, date, size, or favorites
- 🎯 **Filtering** - Filter by media type (images/videos)
- 📊 **Statistics** - Real-time file counts in folder tree

### Image Editing
- ↻ **Rotation** - Rotate images 90° clockwise or counter-clockwise
- ⇄ **Flipping** - Flip images horizontally or vertically
- 📐 **Viewer Modes** - Fit to screen, fill screen, or original size

### Video Controls
- ▶️ **Playback** - Full video controls with progress bar
- 🔊 **Volume** - Adjustable volume control
- 🔄 **Loop** - Toggle video looping
- 📷 **Screenshot** - Capture video frames
- ⛶ **Fullscreen** - Native fullscreen support

### Customization
- 🎨 **Theme Colors** - 6 neon color themes (Blue, Purple, Pink, Green, Orange, Red)
- 📏 **Thumbnail Sizes** - Small, Medium, Large options
- ⚙️ **Settings** - Comprehensive settings panel
- 🔧 **Auto-play** - Toggle video auto-play on hover

### Performance Optimizations
- ⚡ **Caching** - Intelligent file, thumbnail, and metadata caching
- 🚀 **Lazy Loading** - Efficient image loading with Intersection Observer
- 💾 **Memory Management** - Automatic cache cleanup
- 🎯 **Virtual Scrolling** - Optimized rendering for large galleries

### User Experience
- ⌨️ **Keyboard Shortcuts** - Comprehensive keyboard navigation
- 🖱️ **Context Menu** - Right-click for quick actions
- 🔔 **Toast Notifications** - Elegant feedback system
- 📱 **Responsive Design** - Adapts to different screen sizes
- ♿ **Accessibility** - Reduced motion support

## 🚀 Installation

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/neoninja-view.git
cd neoninja-view

# Install dependencies
npm install

# Run the application
npm start
```

## 📦 Building

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

Builds will be created in the `dist/` directory.

### Platform-Specific Builds
```bash
# Windows
npm run build -- --win

# macOS
npm run build -- --mac

# Linux
npm run build -- --linux
```

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

## 🎨 Themes

NeoNinja View includes 6 beautiful neon color themes:

- **Neon Blue** (default) - Cyan and blue tones
- **Neon Purple** - Purple and violet gradients
- **Neon Pink** - Pink and magenta accents
- **Neon Green** - Green and teal colors
- **Neon Orange** - Orange and amber tones
- **Neon Red** - Red and coral highlights

## 📁 Project Structure

```
neoninja-view/
├── main.js                 # Main Electron process
├── package.json            # Project configuration
├── src/
│   ├── main/
│   │   └── preload.js     # IPC bridge
│   └── renderer/
│       ├── index.html       # Main UI
│       └── renderer.js     # Renderer logic
├── assets/
│   ├── style.css          # Main stylesheet
│   └── animations.css    # Animation definitions
├── build/                 # Build assets (icons)
└── dist/                  # Build output (generated)
```

## 🔧 Configuration

Settings are stored in:
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

## 🛠️ Development

### Adding New Features
1. Implement main process logic in `main.js`
2. Add IPC handlers for communication
3. Update preload.js to expose new APIs
4. Add UI elements in `index.html`
5. Implement renderer logic in `renderer.js`
6. Style with `assets/style.css`

### Code Style
- Use ESLint for linting
- Follow existing code patterns
- Add comments for complex logic
- Test on multiple platforms

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🐛 Bug Reports

Please report bugs via GitHub Issues with:
- Operating system and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 📄 Changelog

### Version 1.2.0
- ✨ Complete redesign with modern dark theme
- 🎨 6 neon color themes
- ⚡ Performance optimizations with caching
- 🖼️ Multiple viewing modes
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

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- Image processing powered by [Sharp](https://sharp.pixelplumbing.com/)
- Settings management with [electron-store](https://github.com/sindresorhus/electron-store)

## 📞 Support

For questions or support:
- GitHub Issues: https://github.com/yourusername/neoninja-view/issues
- Documentation: https://github.com/yourusername/neoninja-view/wiki

---

**NeoNinja View** - Fast, Beautiful, Powerful 🥷

