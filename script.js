class PNGToJPGConverter {
    constructor() {
        this.files = [];
        this.convertedFiles = [];
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.conversionSection = document.getElementById('conversionSection');
        this.previewSection = document.getElementById('previewSection');
        this.qualitySlider = document.getElementById('quality');
        this.qualityValue = document.getElementById('qualityValue');
        this.convertBtn = document.getElementById('convertBtn');
        this.previewContainer = document.getElementById('previewContainer');
    }

    bindEvents() {
        // File input events
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.uploadArea.addEventListener('click', () => this.fileInput.click());

        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // Quality slider
        this.qualitySlider.addEventListener('input', (e) => this.updateQualityDisplay(e));

        // Convert button
        this.convertBtn.addEventListener('click', () => this.convertFiles());
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'image/png');
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    processFiles(files) {
        if (files.length === 0) {
            alert('Please select PNG files only.');
            return;
        }

        this.files = files;
        this.showConversionSection();
        this.updateUploadAreaText();
    }

    updateUploadAreaText() {
        const icon = this.uploadArea.querySelector('.upload-icon');
        const title = this.uploadArea.querySelector('h3');
        const subtitle = this.uploadArea.querySelector('p');

        icon.textContent = '✅';
        title.textContent = `${this.files.length} PNG file(s) selected`;
        subtitle.textContent = 'Click to select different files';
    }

    showConversionSection() {
        this.conversionSection.style.display = 'block';
    }

    updateQualityDisplay(e) {
        const quality = Math.round(e.target.value * 100);
        this.qualityValue.textContent = `${quality}%`;
    }

    async convertFiles() {
        if (this.files.length === 0) return;

        this.convertBtn.disabled = true;
        this.convertBtn.innerHTML = '<span class="loading"></span>Converting...';

        this.convertedFiles = [];
        this.previewContainer.innerHTML = '';

        for (let i = 0; i < this.files.length; i++) {
            const file = this.files[i];
            try {
                const convertedFile = await this.convertPNGToJPG(file);
                this.convertedFiles.push(convertedFile);
                this.displayPreview(file, convertedFile);
            } catch (error) {
                console.error(`Error converting ${file.name}:`, error);
                this.displayError(file, error.message);
            }
        }

        this.convertBtn.disabled = false;
        this.convertBtn.textContent = 'Convert to JPG';
        this.previewSection.style.display = 'block';
    }

    convertPNGToJPG(file) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Set canvas dimensions to match image
                canvas.width = img.width;
                canvas.height = img.height;

                // Fill with white background (JPG doesn't support transparency)
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw the PNG image
                ctx.drawImage(img, 0, 0);

                // Convert to JPG blob
                canvas.toBlob((blob) => {
                    if (blob) {
                        const jpgFile = new File([blob], file.name.replace('.png', '.jpg'), {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        resolve(jpgFile);
                    } else {
                        reject(new Error('Failed to convert image'));
                    }
                }, 'image/jpeg', parseFloat(this.qualitySlider.value));
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    }

    displayPreview(originalFile, convertedFile) {
        const previewDiv = document.createElement('div');
        previewDiv.className = 'file-preview';

        const originalSize = this.formatFileSize(originalFile.size);
        const convertedSize = this.formatFileSize(convertedFile.size);
        const compression = Math.round((1 - convertedFile.size / originalFile.size) * 100);

        previewDiv.innerHTML = `
            <h4>${originalFile.name} → ${convertedFile.name}</h4>
            <div class="image-comparison">
                <div class="image-container">
                    <img src="${URL.createObjectURL(originalFile)}" alt="Original PNG">
                    <p>PNG - ${originalSize}</p>
                </div>
                <div class="image-container">
                    <img src="${URL.createObjectURL(convertedFile)}" alt="Converted JPG">
                    <p>JPG - ${convertedSize}</p>
                </div>
            </div>
            <p style="text-align: center; color: #28a745; font-weight: 600; margin-bottom: 10px;">
                ${compression > 0 ? `${compression}% smaller` : 'Size optimized'}
            </p>
            <button class="download-btn" onclick="converter.downloadFile('${convertedFile.name}')">
                Download JPG
            </button>
        `;

        this.previewContainer.appendChild(previewDiv);
    }

    displayError(file, errorMessage) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'file-preview';
        errorDiv.style.borderColor = '#dc3545';
        errorDiv.style.backgroundColor = '#f8d7da';

        errorDiv.innerHTML = `
            <h4 style="color: #721c24;">${file.name}</h4>
            <p style="color: #721c24; text-align: center;">
                ❌ Error: ${errorMessage}
            </p>
        `;

        this.previewContainer.appendChild(errorDiv);
    }

    downloadFile(fileName) {
        const file = this.convertedFiles.find(f => f.name === fileName);
        if (file) {
            const url = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize the converter when the page loads
let converter;
document.addEventListener('DOMContentLoaded', () => {
    converter = new PNGToJPGConverter();
});

// Prevent default drag behaviors on the entire page
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => e.preventDefault());
