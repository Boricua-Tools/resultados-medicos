# PWA Icons

The `icon.svg` file is the source icon for the PWA. To generate the required PNG sizes, you can use one of the following methods:

## Option 1: Online Tool

Use [PWA Asset Generator](https://www.pwabuilder.com/) or [Real Favicon Generator](https://realfavicongenerator.net/):

1. Upload `icon.svg`
2. Select "Progressive Web App" option
3. Download generated icons
4. Place in this directory

## Option 2: ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Run from this directory
for size in 72 96 128 144 152 192 384 512; do
  convert icon.svg -resize ${size}x${size} icon-${size}x${size}.png
done
```

## Option 3: Node.js Script

Using `sharp` package:

```bash
npm install sharp
node generate-icons.js
```

## Required Sizes

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Temporary Fallback

For development, the vite-plugin-pwa will use the SVG file if PNGs are not available.
