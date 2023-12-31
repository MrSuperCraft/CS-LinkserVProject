document.addEventListener('DOMContentLoaded', function () {
    const dropzone = new Dropzone('#dropzone', {
        url: '/file-upload', // Replace with the actual upload URL
        paramName: 'file',
        maxFiles: 1,
        acceptedFiles: 'image/*',
        init: function () {
            this.on('success', function (file, response) {
                // Handle the successful upload
                console.log('File uploaded:', response);
                // Add logic to display the uploaded image or handle as needed
            });

            this.on('error', function (file, errorMessage) {
                // Handle the upload error
                console.error('File upload error:', errorMessage);
            });
        }
    });

    const addElementButton = document.querySelector('#addElementButton');
    addElementButton.addEventListener('click', openAddElementModal);
});


