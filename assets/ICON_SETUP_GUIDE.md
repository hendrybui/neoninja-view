# Icon Setup Guide for NeoNinja View

## Current Issue

The file `assets/NeoNinja.ico` currently contains a text placeholder instead of actual binary icon data. This file needs to be replaced with a proper icon file.

## Recommended Approach

### 1. Icon File Locations

The project uses icons in multiple locations:

**For Development (Runtime):**
- `build/icon.png` - Used by Electron at runtime (see main.js:299)
- `build/icon.ico` - Windows build icon
- `build/icon.icns` - macOS build icon

**For Assets:**
- `assets/NeoNinja.ico` - Currently a placeholder, can be removed or replaced

### 2. Required Icon Sizes

**Windows (.ico):**
- 16x16, 32x32, 48x48, 64x64, 128x128, 256x256 pixels
- Recommended: Include all sizes in one multi-resolution ICO file

**macOS (.icns):**
- 16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024 pixels
- Use `iconutil` or online converters

**Linux (.png):**
- 512x512 pixels minimum
- PNG format with transparency support

### 3. Automated Icon Generation

Create a script to generate all required icons from a single source image:

```javascript
// scripts/generate-icons.js
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sourceIcon = 'assets/source-icon.png'; // 1024x1024 PNG source
const outputDir = 'build';

async function generateIcons() {
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Generate PNG for Linux/runtime
  await sharp(sourceIcon)
    .resize(512, 512)
    .png()
    .toFile(path.join(outputDir, 'icon.png'));

  // Generate ICO sizes for Windows
  const icoSizes = [16, 32, 48, 64, 128, 256];
  const icoBuffers = await Promise.all(
    icoSizes.map(size =>
      sharp(sourceIcon)
        .resize(size, size)
        .png()
        .toBuffer()
    )
  );

  // Combine into ICO (requires additional library like 'png-to-ico')
  const pngToIco = require('png-to-ico');
  const icoBuffer = await pngToIco(icoBuffers);
  await fs.writeFile(path.join(outputDir, 'icon.ico'), icoBuffer);

  // Generate ICNS for macOS (requires macOS)
  // Use iconutil command-line tool
  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);
```

### 4. Package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "generate-icons": "node scripts/generate-icons.js",
    "build:icons": "npm run generate-icons && electron-builder"
  }
}
```

### 5. Recommended Actions

**Option A: Remove the placeholder**
```bash
rm neoninja-view/assets/NeoNinja.ico
```

**Option B: Replace with actual icon**
1. Obtain or create a 1024x1024 PNG icon
2. Save as `assets/source-icon.png`
3. Run the icon generation script
4. Remove the placeholder file

**Option C: Use a placeholder icon service**
For development, use a temporary icon from a service like:
- https://www.flaticon.com
- https://icon-icons.com
- Create a simple icon using online tools

### 6. Build Configuration Verification

Ensure `package.json` build configuration is correct:

```json
{
  "build": {
    "win": {
      "icon": "build/icon.ico"
    },
    "mac": {
      "icon": "build/icon.icns"
    },
    "linux": {
      "icon": "build/icon.png"
    }
  }
}
```

### 7. Best Practices

1. **Single Source of Truth**: Maintain one high-resolution source icon (1024x1024 PNG)
2. **Version Control**: Include source icon in Git, exclude generated icons
3. **Automated Generation**: Use scripts to generate all required formats
4. **Cross-Platform**: Test icons on all target platforms
5. **Accessibility**: Ensure good contrast and readability at small sizes
6. **Brand Consistency**: Use the same icon across all platforms

### 8. .gitignore Updates

Add to `.gitignore`:
```
# Generated icons
build/icon.ico
build/icon.icns
build/icon.png

# Keep source icon
!assets/source-icon.png
```

### 9. Validation

After setting up icons, verify:

```bash
# Check file sizes
ls -lh build/icon.*

# Test build
npm run build

# Test runtime
npm start
```

## Next Steps

1. Choose an approach (A, B, or C)
2. Implement the chosen solution
3. Update documentation
4. Test on all target platforms
