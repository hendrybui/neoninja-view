#!/usr/bin/env node
const sharp = require('sharp');
const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  console.log('🎨 Quick Icon Generator\n');

  const svgPath = path.join(__dirname, '..', 'assets', 'logo.svg');
  const buildDir = path.join(__dirname, '..', 'build');

  // Ensure build dir exists
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  try {
    // 1. Generate source PNG from SVG (1024x1024)
    console.log('📦 Converting SVG to PNG...');
    const pngPath = path.join(buildDir, 'icon.png');
    await sharp(svgPath, { density: 300 })
      .resize(1024, 1024, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(pngPath);
    console.log('✅ PNG created');

    // 2. Generate ICO with multiple sizes
    console.log('📦 Generating ICO...');
    const sizes = [16, 24, 32, 48, 64, 128, 256];
    const buffers = [];

    for (const size of sizes) {
      const buffer = await sharp(svgPath, { density: 300 })
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toBuffer();
      buffers.push(buffer);
    }

    const ico = await pngToIco(buffers);
    fs.writeFileSync(path.join(buildDir, 'icon.ico'), ico);
    console.log('✅ ICO created');

    // 3. Create ICNS (copy PNG as fallback)
    console.log('📦 Creating ICNS...');
    fs.copyFileSync(pngPath, path.join(buildDir, 'icon.icns'));
    console.log('✅ ICNS created\n');

    console.log('✨ Icons generated successfully!\n');
    
    // Show file sizes
    ['icon.png', 'icon.ico', 'icon.icns'].forEach(file => {
      const filePath = path.join(buildDir, file);
      const stats = fs.statSync(filePath);
      console.log(`   ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateIcons();
