# Changelog

All notable changes to NeoNinja View will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2024-01-14

### Added
- Complete application redesign with modern dark theme
- 6 neon color themes (Blue, Purple, Pink, Green, Orange, Red)
- Intelligent caching system for files, thumbnails, and metadata
- Lazy loading with Intersection Observer
- Multiple viewing modes (Grid, List, Detail)
- Real-time search functionality
- Favorites system with persistent storage
- Context menu with comprehensive file operations
- Toast notification system
- Keyboard shortcuts help overlay
- Folder tree with statistics
- Batch file operations (move, delete)
- Image rotation (90° CW/CCW)
- Image flipping (horizontal/vertical)
- Enhanced video controls with progress bar
- Video screenshot capture
- Video volume control
- Video loop toggle
- Fullscreen support
- Responsive design for different screen sizes
- Accessibility support (reduced motion)
- Recent folders tracking
- Settings panel with comprehensive options
- Thumbnail size customization
- Viewer mode options (fit, fill, original)
- Auto-play videos on hover option
- Show/hide file names option
- Sorting by name, date, size, favorites
- Filtering by media type
- File properties dialog
- Copy path to clipboard
- Show in file explorer
- Edit with default application
- Multi-select with Ctrl+Click
- Select all (Ctrl+A)
- Deselect all
- Navigation arrows in viewer
- Viewer counter (current/total)
- Sidebar toggle (Ctrl+B)
- Search focus (Ctrl+F)
- Keyboard help (F1)
- Fullscreen (F11)
- Escape to close modals
- Video playback controls (Space, arrows, M)
- Comprehensive documentation
- ESLint configuration
- .gitignore for clean version control
- MIT License

### Changed
- Completely rewritten main process with performance optimizations
- Optimized renderer process with state management
- Improved file scanning with parallel operations
- Enhanced folder tree building with async operations
- Better memory management with automatic cache cleanup
- Improved IPC communication pattern
- Modernized UI with CSS custom properties
- Enhanced animations and transitions
- Better error handling throughout
- Improved user feedback with toasts

### Performance
- Implemented intelligent caching system
- Added lazy loading for images
- Optimized file scanning with parallel operations
- Reduced memory usage with cache limits
- Improved rendering performance with DocumentFragment
- Added virtual scrolling support
- Optimized thumbnail generation
- Reduced initial load time
- Better handling of large file collections

### Security
- Enhanced context isolation
- Improved preload script security
- Better input validation
- Secure IPC communication
- Content Security Policy updates

### UI/UX
- Modern dark theme with neon accents
- Smooth animations and transitions
- Better visual hierarchy
- Improved contrast ratios
- Enhanced hover effects
- Better focus states
- Improved accessibility
- Responsive design improvements
- Better mobile support

### Bug Fixes
- Fixed memory leaks in file scanning
- Fixed thumbnail generation issues
- Fixed video playback problems
- Fixed context menu positioning
- Fixed sidebar toggle issues
- Fixed search functionality
- Fixed selection state management
- Fixed keyboard shortcuts conflicts

## [1.0.0] - Initial Release

### Added
- Basic image viewing functionality
- Basic video playback
- Folder browsing
- Grid view layout
- Basic file operations (copy, delete, rename)
- Settings management
- Theme support
- Thumbnail generation
