# Background Image Setup Instructions

To use your custom background image for the Neoninja app, follow these steps:

## Step 1: Copy the Image File

Copy the image file from your Downloads folder to the Neoninja assets folder:

**From:** `C:/Users/kentb/Downloads/neoninja_layout with logo.jpg`
**To:** `/workspaces/grok-viewer/neoninja-view/assets/neoninja-layout.jpg`

### How to Copy:

**Option 1: Using File Explorer**
1. Navigate to `C:/Users/kentb/Downloads/`
2. Find the file `neoninja_layout with logo.jpg`
3. Right-click and select "Copy"
4. Navigate to your workspace: `/workspaces/grok-viewer/neoninja-view/assets/`
5. Right-click and select "Paste"
6. Rename the file to `neoninja-layout.jpg` (if needed)

**Option 2: Using Command Line**
```bash
cp "/c/Users/kentb/Downloads/neoninja_layout with logo.jpg" "/workspaces/grok-viewer/neoninja-view/assets/neoninja-layout.jpg"
```

## Step 2: Verify the File

After copying, verify the file exists in the correct location:
- Path: `/workspaces/grok-viewer/neoninja-view/assets/neoninja-layout.jpg`

## Step 3: Restart the App

Once the image is in place, restart the Neoninja app to see the new background.

## What Was Changed

The CSS has been updated to:
1. Load the image `neoninja-layout.jpg` from the assets folder
2. Display it as a full-screen background cover
3. Add a dark overlay (85% opacity) to ensure text readability
4. Keep the background fixed while scrolling

## Customization Options

If you want to adjust the background appearance, you can modify these CSS properties in [`style.css`](assets/style.css):

- `background-size`: Controls how the image scales (cover, contain, auto)
- `background-position`: Centers the image (center, top, bottom, etc.)
- `background-repeat`: Prevents image repetition (no-repeat, repeat)
- Dark overlay opacity: Change `0.85` in the `rgba(15, 17, 26, 0.85)` value

## Troubleshooting

**Background not showing?**
- Verify the image file is in the correct location
- Check that the filename matches exactly: `neoninja-layout.jpg`
- Clear browser cache if testing in a web browser
- Restart the application

**Text hard to read?**
- Increase the overlay opacity in the CSS (change `0.85` to a higher value like `0.90` or `0.95`)

**Image distorted?**
- Try changing `background-size` from `cover` to `contain` or `auto`
