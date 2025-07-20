# PNG to JPG Converter

A modern, web-based tool to convert PNG images to JPG format with adjustable quality settings. Built with pure HTML, CSS, and JavaScript - no server required!

## Features

- **Drag & Drop Interface**: Simply drag PNG files onto the upload area
- **Multiple File Support**: Convert multiple PNG files at once
- **Quality Control**: Adjust JPG compression quality from 10% to 100%
- **Real-time Preview**: See before/after comparison of your images
- **File Size Comparison**: View original vs converted file sizes
- **Instant Download**: Download converted JPG files immediately
- **Client-side Processing**: All conversion happens in your browser - no uploads to servers
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. Open `index.html` in your web browser
2. Drag and drop PNG files onto the upload area, or click to browse
3. Adjust the JPG quality slider (default: 90%)
4. Click "Convert to JPG" button
5. Preview the results and download your converted files

## Technical Details

- Uses HTML5 Canvas API for image processing
- Converts PNG transparency to white background
- Client-side only - no data leaves your browser
- Supports modern browsers with Canvas support

## Browser Compatibility

- Chrome 4+
- Firefox 4+
- Safari 4+
- Edge 12+
- Opera 10.1+

## File Structure

```
png-to-jpg-converter/
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## License

This project is open source and available under the MIT License.
