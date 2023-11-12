document.getElementById('imageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const imageUrl = URL.createObjectURL(file);
        const backgroundElement = document.querySelector('.background');
        backgroundElement.style.backgroundImage = `url(${imageUrl})`;
        backgroundElement.style.backgroundRepeat = 'no-repeat';
        backgroundElement.style.backgroundSize = 'cover'; // Ensuring the image covers the entire background area
        backgroundElement.style.backgroundPosition = 'center';
    }

    reader.readAsDataURL(file);
});


removeImageButton.addEventListener('click', function() {
    background.style.backgroundImage = 'none';
});