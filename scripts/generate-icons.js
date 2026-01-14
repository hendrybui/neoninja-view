#!/usr/bin/env node

/**
 * Icon Generation Script for NeoNinja View
 * 
 * This script generates all required icon formats (ICO, ICNS, PNG)
 * from a single high-resolution source PNG image.
 * 
 * Usage: node scripts/generate-icons.js
 * 
 * Requirements:
 * - sharp: Image processing library
 * - png-to-ico: ICO file generation
 * - macOS: iconutil for ICNS generation (built-in)
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const config = {
  sourceIcon: 'assets/source-icon.png', // Source: 1024x1024 PNG
  outputDir: 'build',
  tempDir: 'build/.icon-temp',
  iconsetDir: 'build/NeoNinja.iconset',
  
  // Required sizes for each format
  icoSizes: [16, 32, 48, 64, 128, 256],
  icnsSizes: [16, 32, 64, 128, 256, 512, 1024],
  pngSize: 512
};

/**
 * Ensure a directory exists, creating it if necessary
 */
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

/**
 * Generate PNG icon for Linux and runtime use
 */
async function generatePngIcon() {
  console.log('Generating PNG icon...');
  
  const outputPath = path.join(config.outputDir, 'icon.png');
  
  await sharp(config.sourceIcon)
    .resize(config.pngSize, config.pngSize, {
      fit: 'cover',
      position: 'center',
      kernel: 'lanczos3'
    })
    .png({
      quality: 90,
      compressionLevel: 9,
      adaptiveFiltering: true
    })
    .toFile(outputPath);
  
  console.log(`✓ PNG icon generated: ${outputPath}`);
  return outputPath;
}

/**
 * Generate ICO icon for Windows
 */
async function generateIcoIcon() {
  console.log('Generating ICO icon...');
  
  const pngToIco = require('png-to-ico');
  
  // Generate all required sizes
  const buffers = await Promise.all(
    config.icoSizes.map(size =>
      sharp(config.sourceIcon)
        .resize(size, size, {
          fit: 'cover',
          position: 'center',
          kernel: 'lanczos3'
        })
        .png()
        .toBuffer()
    )
  );
  
  // Combine into ICO
  const icoBuffer = await pngToIco(buffers);
  const outputPath = path.join(config.outputDir, 'icon.ico');
  
  await fs.writeFile(outputPath, icoBuffer);
  
  console.log(`✓ ICO icon generated: ${outputPath}`);
  return outputPath;
}

/**
 * Generate ICNS icon for macOS
 */
async function generateIcnsIcon() {
  console.log('Generating ICNS icon...');
  
  const platform = process.platform;
  
  if (platform !== 'darwin') {
    console.log('⚠ ICNS generation requires macOS. Skipping...');
    console.log('  To generate ICNS, run this script on a Mac or use an online converter.');
    return null;
  }
  
  // Create iconset directory
  await ensureDir(config.iconsetDir);
  
  // Generate all required sizes for iconset
  const sizePromises = [
    // Standard sizes
    sharp(config.sourceIcon).resize(16, 16).png().toFile(path.join(config.iconsetDir, 'icon_16x16.png')),
    sharp(config.sourceIcon).resize(32, 32).png().toFile(path.join(config.iconsetDir, 'icon_16x16@2x.png')),
    sharp(config.sourceIcon).resize(32, 32).png().toFile(path.join(config.iconsetDir, 'icon_32x32.png')),
    sharp(config.sourceIcon).resize(64, 64).png().toFile(path.join(config.iconsetDir, 'icon_32x32@2x.png')),
    sharp(config.sourceIcon).resize(128, 128).png().toFile(path.join(config.iconsetDir, 'icon_128x128.png')),
    sharp(config.sourceIcon).resize(256, 256).png().toFile(path.join(config.iconsetDir, 'icon_128x128@2x.png')),
    sharp(config.sourceIcon).resize(256, 256).png().toFile(path.join(config.iconsetDir, 'icon_256x256.png')),
    sharp(config.sourceIcon).resize(512, 512).png().toFile(path.join(config.iconsetDir, 'icon_256x256@2x.png')),
    sharp(config.sourceIcon).resize(512, 512).png().toFile(path.join(config.iconsetDir, 'icon_512x512.png')),
    sharp(config.sourceIcon).resize(1024, 1024).png().toFile(path.join(config.iconsetDir, 'icon_512x512@2x.png'))
  ];
  
  await Promise.all(sizePromises);
  
  // Convert iconset to ICNS using iconutil
  const outputPath = path.join(config.outputDir, 'icon.icns');
  await execAsync(`iconutil -c icns ${config.iconsetDir} -o ${outputPath}`);
  
  // Clean up iconset directory
  await fs.rm(config.iconsetDir, { recursive: true, force: true });
  
  console.log(`✓ ICNS icon generated: ${outputPath}`);
  return outputPath;
}

/**
 * Validate source icon
 */
async function validateSourceIcon() {
  try {
    const metadata = await sharp(config.sourceIcon).metadata();
    
    if (metadata.format !== 'png') {
      throw new Error(`Source icon must be PNG format, got ${metadata.format}`);
    }
    
    if (metadata.width < 512 || metadata.height < 512) {
      console.warn('⚠ Warning: Source icon is smaller than recommended 1024x1024');
      console.warn(`  Current size: ${metadata.width}x${metadata.height}`);
    }
    
    console.log(`✓ Source icon validated: ${metadata.width}x${metadata.height} PNG`);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Source icon not found: ${config.sourceIcon}\n` +
        'Please create a 1024x1024 PNG icon at this location.');
    }
    throw err;
  }
}

/**
 * Clean up temporary files
 */
async function cleanup() {
  try {
    await fs.rm(config.tempDir, { recursive: true, force: true });
  } catch (err) {
    // Ignore cleanup errors
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('NeoNinja View - Icon Generation Script');
  console.log('='.repeat(60));
  console.log();
  
  try {
    // Validate source icon
    await validateSourceIcon();
    console.log();
    
    // Ensure output directory exists
    await ensureDir(config.outputDir);
    
    // Generate all icon formats
    const results = await Promise.all([
      generatePngIcon(),
      generateIcoIcon(),
      generateIcnsIcon()
    ]);
    
    console.log();
    console.log('='.repeat(60));
    console.log('✓ All icons generated successfully!');
    console.log('='.repeat(60));
    console.log();
    console.log('Generated files:');
    results.filter(Boolean).forEach(file => {
      const stats = require('fs').statSync(file);
      console.log(`  ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    });
    console.log();
    console.log('Next steps:');
    console.log('  1. Test the application: npm start');
    console.log('  2. Build for distribution: npm run build');
    console.log();
    
  } catch (err) {
    console.error();
    console.error('✗ Error generating icons:');
    console.error(`  ${err.message}`);
    console.error();
    process.exit(1);
  } finally {
    await cleanup();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { generateIcons: main };
