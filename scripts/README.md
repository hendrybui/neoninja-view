# Scripts Directory

This directory contains utility scripts for the NeoNinja View project.

## Available Scripts

### generate-icons.js

Automated icon generation script that creates all required icon formats (ICO, ICNS, PNG) from a single high-resolution source PNG image.

#### Usage

```bash
npm run generate-icons
```

Or run directly:

```bash
node scripts/generate-icons.js
```

#### Requirements

- **Source Icon**: A 1024x1024 PNG image located at `assets/source-icon.png`
- **Dependencies**: 
  - `sharp` (already installed)
  - `png-to-ico` (dev dependency)

#### What It Generates

1. **Windows (ICO)**: `build/icon.ico`
   - Multi-resolution icon with sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256

2. **macOS (ICNS)**: `build/icon.icns`
   - Retina-ready icon with sizes: 16x16 through 1024x1024
   - Note: ICNS generation requires macOS

3. **Linux/Runtime (PNG)**: `build/icon.png`
   - 512x512 PNG with optimized compression

#### Features

- **Validation**: Checks source icon format and size before processing
- **Parallel Processing**: Generates all formats simultaneously for better performance
- **Error Handling**: Comprehensive error messages with actionable guidance
- **Cross-Platform**: Works on all platforms (ICNS generation skipped on non-macOS)
- **Cleanup**: Automatically removes temporary files
- **Progress Feedback**: Clear console output showing generation progress

#### Error Handling

The script handles various edge cases:

- **Missing source icon**: Provides clear instructions on where to place the file
- **Wrong format**: Validates that source is PNG format
- **Suboptimal size**: Warns if source is smaller than recommended 1024x1024
- **Platform limitations**: Gracefully skips ICNS generation on non-macOS systems

#### Example Output

```
============================================================
NeoNinja View - Icon Generation Script
============================================================

✓ Source icon validated: 1024x1024 PNG

Generating PNG icon...
✓ PNG icon generated: build/icon.png
Generating ICO icon...
✓ ICO icon generated: build/icon.ico
Generating ICNS icon...
✓ ICNS icon generated: build/icon.icns

============================================================
✓ All icons generated successfully!
============================================================

Generated files:
  build/icon.png (45.23 KB)
  build/icon.ico (128.45 KB)
  build/icon.icns (234.67 KB)

Next steps:
  1. Test the application: npm start
  2. Build for distribution: npm run build
```

## Development

### Adding New Scripts

When adding new scripts to this directory:

1. Follow the existing naming convention: `kebab-case.js`
2. Add usage documentation to this README
3. Include error handling and validation
4. Add corresponding npm script to `package.json` if appropriate
5. Use async/await for asynchronous operations
6. Provide clear console feedback

### Script Best Practices

- **Validation**: Always validate inputs before processing
- **Error Handling**: Use try-catch blocks with meaningful error messages
- **Logging**: Provide clear progress feedback
- **Cleanup**: Clean up temporary files in finally blocks
- **Documentation**: Add JSDoc comments for functions
- **Configuration**: Use configuration objects for easy customization
- **Testing**: Test scripts on all target platforms

## Troubleshooting

### Common Issues

**Issue**: "Source icon not found"
- **Solution**: Create a 1024x1024 PNG icon at `assets/source-icon.png`

**Issue**: "Source icon must be PNG format"
- **Solution**: Convert your source icon to PNG format

**Issue**: ICNS generation fails
- **Solution**: Run the script on macOS, or use an online ICNS converter

**Issue**: "png-to-ico module not found"
- **Solution**: Run `npm install --save-dev png-to-ico`

## Additional Resources

- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [png-to-ico Package](https://www.npmjs.com/package/png-to-ico)
- [Electron Builder Icons](https://www.electron.build/icons)
