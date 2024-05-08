document.addEventListener('DOMContentLoaded', function () {
    let image_id = generateUniqueId(); // Generate unique image ID

    const dropzone = new Dropzone('#dropzone', {
        url: '/file-upload', // Set the initial upload URL
        paramName: 'file',
        maxFiles: 1,
        acceptedFiles: 'image/*',
        autoProcessQueue: false,
        method: 'POST', // Set the initial request method to POST
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

            this.on('sending', function (file, xhr, formData) {
                // Attach additional data to the file upload request
                const image_description = document.getElementById('elementDescription').value;
                // Replace spaces with underscores in the filename
                file.name.replace(/ /g, '_');
                file.name.replace(/%20/g, '_');

                if (currentEditedItem) {
                    image_id = currentEditedItem.dataset.id;
                }

                formData.append('image_id', image_id);
                formData.append('image_description', image_description);
            });

            // Modify Dropzone to send a PUT request when updating an image
            this.on('processing', function (file) {
                if (currentEditedItem) {
                    this.options.method = 'PUT'; // Change the request method to PUT
                } else {
                    this.options.method = 'POST'; // Reset to POST if not updating
                }
            });
        }
    });

    const uploadButton = document.getElementById('applyChangesButton');
    uploadButton.addEventListener('click', function () {
        if (!currentEditedItem) {
            if (dropzone.getQueuedFiles().length > 0) {
                // Process the queued files manually
                customizeElement(image_id);
                dropzone.processQueue();
            } else {
                customizeElement();
            }
        } else {
            if (dropzone.getQueuedFiles().length > 0) {
                dropzone.processQueue();
                applyChanges();
            }
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const addElementButton = document.querySelector('#addElementButton');
    addElementButton.addEventListener('click', openAddElementModal);
});
