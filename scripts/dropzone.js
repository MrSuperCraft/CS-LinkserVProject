document.addEventListener('DOMContentLoaded', async function () {
    Dropzone.autoDiscover = false;

    let user_id; // Variable to store the user ID
    let uploadedImageId; // Variable to store the uploaded image ID
    let requestType = 'POST'; // Default request type is POST

    try {
        // Fetch the user ID when the page initially loads
        user_id = await getUserIdWithFallback();
    } catch (error) {
        console.error('Error fetching user_id:', error);
        // Handle error fetching user ID
        return; // Exit the function if user ID fetching fails
    }

    const dropzone = new Dropzone('#dropzone', {
        url: '/file-upload',
        paramName: 'file',
        maxFiles: 1,
        acceptedFiles: 'image/*',
        autoProcessQueue: false,
        method: requestType, // Set the initial request type
        init: function () {
            this.on('success', function (file, response) {
                console.log('File uploaded:', response);
                uploadedImageId = response.image_id; // Store the uploaded image ID
            });

            // Other event handlers...

            this.on('sending', async function (file, xhr, formData) {
                // Create a FormData object manually
                const formDataManual = new FormData();
                const image_description = document.getElementById('elementDescription').value;
                const image_id = currentEditedItem.dataset.id || generateUniqueId(); // Find the ID or generate a unique image ID

                // Append user_id and other form data to formDataManual
                formDataManual.append('user_id', user_id);
                formDataManual.append('image_id', image_id);
                uploadedImageId = image_id;
                formDataManual.append('image_description', image_description);

                // Set Dropzone's formData to formDataManual
                formDataManual.append('file', file); // Add the file to formDataManual

                // Set the request type based on whether it's a new upload or an update
                requestType = currentEditedItem ? 'PUT' : 'POST'; // Update requestType
                xhr.open(requestType, '/file-upload');
                xhr.send(formDataManual);
            });

            // Other event handlers...
        }
    });

    const uploadButton = document.getElementById('applyChangesButton'); uploadButton.addEventListener('click', function (e) {
        e.preventDefault();

        if (!currentEditedItem) {
            if (dropzone.getQueuedFiles().length > 0) { // Process the queued files manually 
                customizeElement(uploadedImageId);
                dropzone.processQueue();
            } else { customizeElement(); }
        } else {
            if (dropzone.getQueuedFiles().length > 0) {
                dropzone.processQueue();
                applyChanges();
            }
        }
    });

    // Function to generate a unique integer ID
    function generateUniqueId() {
        return Math.floor(Math.random() * 100000) + 1;
    }

});
