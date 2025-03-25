document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectFileBtn = document.getElementById('selectFile');
    const previewSection = document.getElementById('previewSection');
    const originalPreview = document.getElementById('originalPreview');
    const pngPreview = document.getElementById('pngPreview');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const preserveTransparency = document.getElementById('preserveTransparency');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentFile = null;

    // Handle file selection button click
    selectFileBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // Handle file input change
    fileInput.addEventListener('change', handleFileSelect);

    // Handle drag and drop events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Handle quality slider change
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value;
        if (currentFile) {
            convertImage();
        }
    });

    // Handle transparency checkbox change
    preserveTransparency.addEventListener('change', () => {
        if (currentFile) {
            convertImage();
        }
    });

    // Handle convert button click
    convertBtn.addEventListener('click', convertImage);

    // Handle download button click
    downloadBtn.addEventListener('click', downloadImage);

    // Handle file selection
    function handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }

    // Handle file
    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        currentFile = file;
        
        // Display original image preview
        const reader = new FileReader();
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            previewSection.classList.remove('d-none');
            convertBtn.disabled = false;
            downloadBtn.disabled = true;
            convertImage();
        };
        reader.readAsDataURL(file);
    }

    // Convert image to PNG
    function convertImage() {
        if (!currentFile) return;

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas dimensions
            canvas.width = img.width;
            canvas.height = img.height;

            // Create a white background if transparency is not preserved
            if (!preserveTransparency.checked) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Draw image
            ctx.drawImage(img, 0, 0);

            // Convert to PNG with specified quality
            const quality = qualitySlider.value / 100;
            const pngDataUrl = canvas.toDataURL('image/png', quality);

            // Display PNG preview
            pngPreview.src = pngDataUrl;
            downloadBtn.disabled = false;

            // Store the PNG data URL for download
            downloadBtn.dataset.pngDataUrl = pngDataUrl;
        };
        img.src = URL.createObjectURL(currentFile);
    }

    // Download converted image
    function downloadImage() {
        const pngDataUrl = downloadBtn.dataset.pngDataUrl;
        if (!pngDataUrl) return;

        const link = document.createElement('a');
        link.download = currentFile.name.replace(/\.[^/.]+$/, '') + '.png';
        link.href = pngDataUrl;
        link.click();
    }
}); 