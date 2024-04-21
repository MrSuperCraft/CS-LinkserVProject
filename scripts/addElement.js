// Helper Functions
let currentEditedItem = false; // Flag to track edit mode
let titleAdded = false; // Flag to track if title has been added



// On load
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event triggered.');
    // Your existing JavaScript code here
    const addElementButton = document.querySelector('#addElementButton');
    addElementButton.addEventListener('click', openAddElementModal);

    const applyChangesButton = document.getElementById('applyChangesButton');
    applyChangesButton.addEventListener('click', function () {
        console.log('applyChangesButton clicked.');
        if (currentEditedItem) {
            applyChanges();
        }
    });
});

// Function to open the add element modal
function openAddElementModal() {
    const addElementModal = document.getElementById('addElementModal');
    addElementModal.style.display = 'block';
}

// Function to close the add element modal
function closeAddElementModal() {
    const addElementModal = document.getElementById('addElementModal');
    addElementModal.style.display = 'none';
}

let currentElementType; // Store the type of the currently selected element

function setText(type) {
    if (type === 'image') { document.getElementById('modalTitle').textContent = 'Add a New Image' };
    if (type === 'social') { document.getElementById('modalTitle').textContent = 'Add a Social Media Button' };
    if (type === 'button') { document.getElementById('modalTitle').textContent = 'Add a New Button ' };
    if (type === 'textfield') { document.getElementById('modalTitle').textContent = 'Add a New Textfield' };


};

function addElement(type) {

    const customizeElementContent = document.getElementById('customize-element-content');
    customizeElementContent.removeAttribute('style')


    openCustomizeElementModal();
    currentElementType = type;
    closeAddElementModal();

    setText(currentElementType);


    if (currentElementType === 'image') {
        document.getElementById('customize-element-content').setAttribute("style", "0vh");

        clearFormInputs();
        document.getElementById('buttonSection').style.display = 'none';
        showImageSection();
        document.querySelector('.delete-image').style.display = 'none';

    } else if (currentElementType === 'social') {
        document.getElementById('customize-element-content').setAttribute("style", "0vh");

        // Reset values in the modal
        document.getElementById('platformSearch').value = '';  // Reset platform input
        document.getElementById('socialUrl').value = '';  // Reset URL input
        document.querySelectorAll('.colors input')[0].value = '#5665E9';  // Reset color1 to default color
        document.querySelectorAll('.colors input')[1].value = '#A271F8';  // Reset color2 to default color
        const directionSelect = document.querySelector('.select-box select');
        directionSelect.value = 'to left top';

        showSocialMediaSection();

    } else if (currentElementType === 'textfield') {
        document.getElementById('customize-element-content').style.width = '100vh';
        showTextFieldSection();
    } else if (currentElementType === 'button') {
        document.getElementById('customize-element-content').setAttribute("style", "0vh");
        showButtonSection();
    }
}

async function customizeElement(image_id) {
    const elementDescription = document.getElementById('elementDescription').value;
    const imageUrlInput = document.getElementById('imageUrlAddress').value;
    const dropzoneFiles = document.querySelectorAll('.dropzone .dz-filename span');


    try {
        let elementUrl;
        let imageDescription = ''; // Initialize image description variable

        if (dropzoneFiles.length > 0) {
            // User uploaded a file through Dropzone
            elementUrl = `/file/${decodeURIComponent(dropzoneFiles[0].textContent.trim())}`;
            imageDescription = elementDescription; // Use element description as image description

            // Create a fetch request to update image description
            const updateDescriptionUrl = `/api/files/description/${image_id}`;
            fetch(updateDescriptionUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image_id: image_id, image_description: imageDescription })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update image description.');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Image description updated:', data);
                    // Add logic to handle successful update if needed
                })
                .catch(error => {
                    console.error('Error updating image description:', error);
                    // Add logic to handle error if needed
                });

            customizeOrAddGalleryElement(elementUrl, elementDescription, image_id);
            showMessage('Image added successfully.', 'success');
        } else if (isValidUrl(imageUrlInput)) {
            // Use the provided URL if it's a valid URL
            elementUrl = imageUrlInput;
            imageDescription = elementDescription; // Use element description as image description


            const response = await fetch('/api/fileUrl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: await getUserId(),
                    image_id: generateUniqueId(), // Pass the image ID generated in Dropzone
                    file_url: elementUrl,
                    image_description: imageDescription
                })
            });

            if (!response.ok) {
                throw new Error('Failed to upload image.');
            }

            const data = await response.json();
            console.log(data); // Handle the response data as needed
            showMessage('Image added successfully.', 'success');
            customizeOrAddGalleryElement(elementUrl, elementDescription, image_id); // Pass image_id here
            clearFormInputs();
            return; // Exit the function after successful upload
        } else {
            showMessage('Invalid URL provided.', 'warning');
            return;
        }

        // Handle other cases here if needed

    } catch (error) {
        console.error(error);
        showMessage('Failed to upload image.', 'error');
    }
}






// Function to check if a URL is valid
function isValidUrl(url) {
    // Regular expression to validate URL format
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlRegex.test(url);
}

function openCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'block';
}

function closeCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'none';
    clearFormInputs();

    customizeElementModal.removeAttribute('style');
}

// Function to clear the form inputs and dropzone
function clearFormInputs() {
    document.getElementById('elementDescription').value = ''; // Clear element description
    document.getElementById('imageUrlAddress').value = '';

    // Clear dropzone files
    const dropzone = Dropzone.forElement('.dropzone'); // Replace '.dropzone' with the actual selector for your dropzone
    if (dropzone) {
        dropzone.removeAllFiles();
    }
    // Add more lines for other form inputs if needed
}

// Function to enable image editing
function enableImageEdit() {
    document.getElementById('customize-element-content').setAttribute("style", "0vh");

    document.getElementById('modalTitle').innerText = 'Edit Image';
    document.getElementById('elementDescription').style.display = 'block';

    document.getElementById('image-modal').style.display = 'block';
    document.getElementById('buttonSection').style.display = 'none';
    document.getElementById('imageEditSection').style.display = 'block';
    document.getElementById('textFieldSection').style.display = 'none';
    document.getElementById('delete-image').style.display = 'block';
    document.getElementById('socialMediaEditSection').style.display = 'none';
    document.getElementById('addSocialMediaButton').style.display = 'none';
    document.getElementById('saveChangesButton').style.display = 'none';
    document.getElementById('socialDelete').style.display = 'none';

    // Populate the modal with existing details if editing an item
    if (currentEditedItem) {
        const description = currentEditedItem.querySelector('.gallery-description').textContent;
        document.getElementById('elementDescription').value = description;

        // Display the existing image URL in the modal
        const imageUrl = currentEditedItem.getAttribute('data-url');
        document.getElementById('imageUrlAddress').value = imageUrl;

    } else {
        currentEditedItem = false;
    }
}

function editElement(galleryElement) {
    const image = galleryElement.querySelector('img');
    const description = galleryElement.querySelector('.gallery-description').textContent;

    // Populate the modal with existing details
    document.getElementById('elementDescription').value = description;
    document.getElementById('imageUrlAddress').value = image.src;

    // Set the currentEditedItem to galleryElement
    currentEditedItem = galleryElement;

    // Trigger the modal for editing
    enableImageEdit(image);
    openCustomizeElementModal();
}

// Function to apply changes to the image
async function applyChanges() {
    const image_id = currentEditedItem.dataset.id;
    const elementDescription = document.getElementById('elementDescription').value;
    const imageUrlInput = document.getElementById('imageUrlAddress').value.trim();
    const dropzoneFiles = document.querySelectorAll('.dropzone .dz-filename span');

    if (!currentEditedItem) {
        showMessage('No item being edited. Cannot apply changes.');
        return;
    }

    let imageData;

    if (dropzoneFiles.length > 0 || (dropzoneFiles.length > 0 && imageUrlInput == `/file/${encodeURIComponent(dropzoneFiles[0].textContent.trim())}`)) {
        // User uploaded a file through Dropzone
        const imageUrl = `/file/${encodeURIComponent(dropzoneFiles[0].textContent.trim())}`;
        imageData = { type: 'file', data: dropzoneFiles[0], url: imageUrl };
    } else if (isValidUrl(imageUrlInput)) {
        // Use the provided URL if it's a valid URL
        const imageUrl = imageUrlInput.startsWith('http://') || imageUrlInput.startsWith('https://') ? imageUrlInput : imageUrlInput;
        imageData = { type: 'url', url: imageUrl };
    } else {
        showMessage('Invalid URL provided or no file uploaded.', 'warning');
        return;
    }

    // Update or create the image element
    if (currentEditedItem) {
        if (imageData.type === 'file') {
            // Update existing image with file
            const file = imageData.data;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('image_id', currentEditedItem.dataset.id);
            formData.append('image_description', elementDescription);

            // Perform the file upload or update here using formData and fetch
            // This part depends on your server-side logic

        } else if (imageData.type === 'url') {
            // Update image src attribute with URL
            currentEditedItem.querySelector('img').src = imageData.url;

            const response = await fetch('/api/fileUrl', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image_id: image_id, // Pass the image ID generated in Dropzone
                    file_url: imageUrlInput,
                    image_description: elementDescription
                })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        }
    }

    if (currentEditedItem) {
        updateGalleryDescription(currentEditedItem, elementDescription);
    } else {
        showMessage('Error caught when trying to edit.');
    }


    // Change the existing overlay text only when editing an item
    const overlayElement = currentEditedItem.querySelector('.gallery-overlay');
    if (overlayElement) {
        overlayElement.innerText = '✏';
    }

    // Close the modal and clear form inputs
    setTimeout(() => {
        closeCustomizeElementModal();
        clearFormInputs();
        // Reset the currentEditedItem flag
        currentEditedItem = false;
    }, 300); // Adjust the delay as needed
}







// Function to fetch all images and display them in gallery items
async function fetchAndDisplayImages() {
    const user_id = await getUserIdWithFallback();
    try {
        const response = await fetch(`/api/getAllImages/${user_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch images.');
        }
        const imageData = await response.json();
        console.log('Image Data:', imageData); // Log the fetched image data

        // Process each image based on the data
        imageData.forEach(image => {
            if (image.file_url) {
                customizeOrAddGalleryElement(image.file_url, image.image_description, image.image_id)
            } else if (image.filename) {
                // Use the server route to fetch the image by filename
                const imageUrl = `/file/${image.filename}`;
                console.log('Image URL:', imageUrl); // Log the image URL
                customizeOrAddGalleryElement(imageUrl, image.image_description, image.image_id);
            }
        });
    } catch (error) {
        console.error('Error fetching and displaying images:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayImages);














// Function to get the image URL based on user input
function getImageUrl(dropzoneFiles, imageUrlInput) {
    let elementUrl;

    if (dropzoneFiles.length > 0) {
        // Use the new image from the dropzone
        elementUrl = `/file/${encodeURIComponent(dropzoneFiles[0].textContent.trim())}`;
    } else if (imageUrlInput) {
        // Use the provided URL
        elementUrl = imageUrlInput.startsWith('http') ? imageUrlInput : imageUrlInput;
    } else {
        showMessage('No changes applied. Image URL or file required.');
    }

    return elementUrl;
}


async function deleteImage() {
    if (currentEditedItem) {

        const image_id = currentEditedItem.dataset.id;
        const response = await fetch(`/api/deleteImage/${image_id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete image');
        }

        const data = await response.json();
        console.log(data.message); // Handle success message


        // Remove the gallery item
        const galleryContainer = document.getElementById('galleryContainer');
        currentEditedItem.remove();

        // Check if the gallery is empty, and if so, remove the entire container
        if (galleryContainer.children.length === 1) {
            galleryContainer.remove();
            titleAdded = false; // Reset the titleAdded flag
        }

        // Close the modal and clear form inputs
        closeCustomizeElementModal();
        clearFormInputs();

        // Reset the currentEditedItem flag
        currentEditedItem = false;
    } else {
        showMessage('Cannot delete the image. Try again later', 'error');
    }
}

function customizeOrAddGalleryElement(elementUrl, elementDescription, imageId) {
    const contentContainer = document.getElementById('images-container');
    let galleryContainer = document.getElementById('galleryContainer');

    const image_id = imageId || generateUniqueId();

    if (!galleryContainer) {
        galleryContainer = contentContainer.appendChild(document.createElement('div'));
        galleryContainer.id = 'galleryContainer';

        if (!titleAdded) {
            galleryContainer.appendChild(Object.assign(document.createElement('div'), { textContent: `${getUsernameFromURL()}'s Gallery`, classList: ['gallery-title'] }));
            titleAdded = true;
        }
    }

    let galleryElement;

    // Check if an item is being edited
    if (currentEditedItem) {
        galleryElement = currentEditedItem;
    } else {
        galleryElement = document.createElement('div');
        galleryElement.classList.add('gallery-item');
        galleryContainer.appendChild(galleryElement);

        // Create the image-text div only on initial load
        const descriptionContainer = galleryElement.appendChild(document.createElement('div'));
        descriptionContainer.classList.add('image-text');
        const descriptionElement = descriptionContainer.appendChild(document.createElement('div'));
        descriptionElement.classList.add('gallery-description');
    }

    // Update data-url attribute with elementUrl
    galleryElement.setAttribute('data-url', elementUrl);

    // Create a new image element
    const newImage = document.createElement('img');
    newImage.src = elementUrl;
    newImage.alt = 'New Image';

    // Set up the event listener for image loading
    newImage.onload = function () {
        console.log('Image loaded successfully');

        // Update or create the text elements
        let descriptionContainer = galleryElement.querySelector('.image-text');
        if (!descriptionContainer) {
            descriptionContainer = galleryElement.appendChild(document.createElement('div'));
            descriptionContainer.classList.add('image-text');
        }

        let descriptionElement = descriptionContainer.querySelector('.gallery-description');
        if (!descriptionElement) {
            descriptionElement = descriptionContainer.appendChild(document.createElement('div'));
            descriptionElement.classList.add('gallery-description');
        }

        // Update both data-description and inner text for the specific 'gallery-description' element
        descriptionElement.innerText = elementDescription;
        descriptionElement.dataset.description = elementDescription;

        galleryElement.dataset.description = elementDescription;
        galleryElement.dataset.id = image_id;

        // Check if there's an existing overlay before adding a new one
        const existingOverlay = galleryElement.querySelector('.gallery-overlay');
        if (!existingOverlay) {
            const overlayElement = galleryElement.appendChild(Object.assign(document.createElement('div'), { innerText: '✏', classList: ['gallery-overlay'] }));
            overlayElement.addEventListener('click', function () {
                enableImageEdit();
                editElement(galleryElement);
            });
        }

        // Close the modal and clear form inputs only if not editing
        if (!currentEditedItem) {
            closeCustomizeElementModal();
            clearFormInputs();
        }
    };

    // Append the new image element
    galleryElement.appendChild(newImage);
}


// Function to update the gallery description
function updateGalleryDescription(galleryElement, elementDescription) {
    const descriptionElement = galleryElement.querySelector('.gallery-description');

    if (descriptionElement) {

        descriptionElement.textContent = elementDescription;
        descriptionElement.dataset.description = elementDescription;
        galleryElement.dataset.description = elementDescription;


    } else {
        showMessage('Description element not found.', 'error');
    }
}



function showImageSection() {
    document.getElementById('image-modal').style.display = 'block';
    document.getElementById('socialMediaEditSection').style.display = 'none';
    document.getElementById('textEditSection').style.display = 'block';
    document.getElementById('imageEditSection').style.display = 'block';
    document.getElementById('textFieldSection').style.display = 'none';
    document.getElementById('buttonCreationForm').style.display = 'none';
    document.getElementById('buttonSection').style.display = 'none';
    document.getElementById('delete-image').style.display = 'none';


}

function EditSocialMedia() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('imageEditSection').style.display = 'none';
    document.getElementById('socialMediaEditSection').style.display = 'block';
    document.getElementById('saveChangesButton').style.display = 'block';
    document.getElementById('addSocialMediaButton').style.display = 'none';
    document.getElementById('textFieldSection').style.display = 'none';
    document.getElementById('buttonSection').style.display = 'none';
    document.getElementById('buttonCreationForm').style.display = 'none';
}

