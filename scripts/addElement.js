// Helper Functions
let currentEditedItem = false; // Flag to track edit mode
let titleAdded = false; // Flag to track if title has been added

function getUsernameFromURL() {
    const pathSegments = window.location.pathname.split('/');
    let username = '';

    if (pathSegments.length === 3 && pathSegments[1] === 'design') {
        username = pathSegments[2];
    } else if (pathSegments.length === 2 && pathSegments[1] === 'design') {
        username = 'Guest';
    }

    return username;
}

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
        } else {
            customizeElement();
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

function addElement(type) {
    openCustomizeElementModal();
    currentElementType = type;
    closeAddElementModal();

    // Set modal title based on whether it's a new addition or an edit
    document.getElementById('modalTitle').innerText = (type === 'image') ? 'Add Image' : 'Add Element';
    document.getElementById('modalTitle').innerText = (type === 'social') ? 'Add a Social Media icon' : 'Add Element';
    document.getElementById('modalTitle').innerText = (type === 'textfield') ? 'Add a Text Field' : 'Add Element';
    document.getElementById('modalTitle').innerText = (type === 'button') ? 'Add A New Button' : 'Add Element'


    if (type === 'image') {
        showImageSection();
        document.getElementById('textFieldSection').style.display = 'none';


    } else if (type === 'social') {
        // Reset values in the modal
        document.getElementById('platformSearch').value = '';  // Reset platform input
        document.getElementById('href-text').value = '';  // Reset URL input
        document.querySelectorAll('.colors input')[0].value = '#5665E9';  // Reset color1 to default color
        document.querySelectorAll('.colors input')[1].value = '#A271F8';  // Reset color2 to default color
        const directionSelect = document.querySelector('.select-box select');
        directionSelect.value = 'to left top';

        showSocialMediaSection();


    } else if (type === 'textfield') {
        showTextFieldSection();
    }

    if (type === 'button') {
        showButtonSection();
    }
}

function customizeElement() {
    const elementDescription = document.getElementById('elementDescription').value;
    const imageUrlInput = document.getElementById('imageUrl').value.trim();
    const dropzoneFiles = document.querySelectorAll('.dropzone .dz-filename span');

    if (currentEditedItem) {
        applyChanges();
    } else {
        closeCustomizeElementModal();
        clearFormInputs();

        let elementUrl;

        if (dropzoneFiles.length > 0) {
            // User uploaded a file through Dropzone
            elementUrl = `/file/${decodeURIComponent(dropzoneFiles[0].textContent.trim())}`;
            customizeOrAddGalleryElement(elementUrl, elementDescription);
        } else if (imageUrlInput) {
            // Use the provided URL
            elementUrl = imageUrlInput.startsWith('http') ? imageUrlInput : `/file/${encodeURIComponent(imageUrlInput)}`;
            customizeOrAddGalleryElement(elementUrl, elementDescription);
        } else {
            console.error('No files uploaded or image URL provided.');
            return;
        }
    }
}

function openCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'block';
}

function closeCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'none';
    clearFormInputs();
}

// Function to clear the form inputs and dropzone
function clearFormInputs() {
    document.getElementById('elementDescription').value = ''; // Clear element description
    document.getElementById('imageUrl').value = '';

    // Clear dropzone files
    const dropzone = Dropzone.forElement('.dropzone'); // Replace '.dropzone' with the actual selector for your dropzone
    if (dropzone) {
        dropzone.removeAllFiles();
    }
    // Add more lines for other form inputs if needed
}

// Function to enable image editing
function enableImageEdit() {
    document.getElementById('modalTitle').innerText = 'Edit Image';
    document.getElementById('elementDescription').style.display = 'block';
    document.getElementById('elementDescription').style.marginLeft = '8px';
    document.getElementById('imageEditSection').style.display = 'block';

    // Populate the modal with existing details if editing an item
    if (currentEditedItem && currentElementType === 'image') {
        const description = currentEditedItem.querySelector('.gallery-description').textContent;
        document.getElementById('elementDescription').value = description;

        // Display the existing image URL in the modal
        const imageUrl = currentEditedItem.getAttribute('data-url');
        document.getElementById('imageUrl').value = imageUrl;

        // Add delete button only if it doesn't exist
        const deleteButton = document.querySelector('.delete-button');
        if (!deleteButton) {
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.innerHTML = 'Delete <i class="fas fa-trash-alt"></i>';
            deleteButton.style.marginLeft = '8px';
            deleteButton.style.backgroundColor = 'red';
            deleteButton.addEventListener('click', deleteImage);

            // Append it below the "Apply Changes" button
            const applyChangesButton = document.getElementById('applyChangesButton');
            applyChangesButton.parentNode.insertBefore(deleteButton, applyChangesButton.nextSibling);
        }
    } else {
        currentEditedItem = false;
    }
}

function editElement(galleryElement) {
    const image = galleryElement.querySelector('img');
    const description = galleryElement.querySelector('.gallery-description').textContent;

    // Populate the modal with existing details
    document.getElementById('elementDescription').value = description;
    document.getElementById('imageUrl').value = image.src;

    // Set the currentEditedItem to galleryElement
    currentEditedItem = galleryElement;

    // Trigger the modal for editing
    enableImageEdit(image);
    openCustomizeElementModal();
}

// Function to apply changes to the image
function applyChanges() {
    const elementDescription = document.getElementById('elementDescription').value.trim();
    const imageUrlInput = document.getElementById('imageUrl').value.trim();
    const dropzoneFiles = document.querySelectorAll('.dropzone .dz-filename span');

    if (!currentEditedItem) {
        showError('No item being edited. Cannot apply changes.');
        return;
    }

    console.log('Editing an existing element');
    console.log('Element Description:', elementDescription);
    console.log('Image URL Input:', imageUrlInput);
    console.log('Dropzone Files:', dropzoneFiles);

    updateGalleryDescription(currentEditedItem, elementDescription);

    const elementUrl = getImageUrl(dropzoneFiles, imageUrlInput);

    // Update or create the image element
    const imageElement = currentEditedItem.querySelector('img');
    if (imageElement) {
        // Update existing image
        imageElement.src = elementUrl;
    }

    // Update the description attribute for the 'gallery-item'
    currentEditedItem.setAttribute('description', elementDescription);

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
    }, 200); // Adjust the delay as needed

}


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
        showError('No changes applied. Image URL or file required.');
    }

    return elementUrl;
}

// Function to show an error message
function showError(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';

    // Hide the error message after a few seconds
    setTimeout(() => {
        errorMessageElement.style.display = 'none';
        errorMessageElement.textContent = '';
    }, 3000);
}

function deleteImage() {
    if (currentEditedItem) {
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

        // Remove the delete button from the modal
        const deleteButton = document.querySelector('.delete-button');
        if (deleteButton) {
            deleteButton.remove();
        }
    }
}

function customizeOrAddGalleryElement(elementUrl, elementDescription) {
    const contentContainer = document.querySelector('.content');
    let galleryContainer = document.getElementById('galleryContainer');

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
        galleryElement.setAttribute('data-url', elementUrl);

    }

    // Create a new image element
    const newImage = document.createElement('img');
    newImage.src = elementUrl;
    newImage.alt = 'New Image';

    // Set up the event listener for image loading
    newImage.onload = function () {
        console.log('Image loaded successfully');

        // If not editing, update or create the text elements
        if (!currentEditedItem) {
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
            descriptionElement.setAttribute('data-description', elementDescription);

            galleryElement.setAttribute('data-description', elementDescription);

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
        console.log('Before Update - Inner Text:', descriptionElement.innerText);
        console.log('Before Update - Data Description:', descriptionElement.getAttribute('data-description'));

        console.log('Updating description:', elementDescription);
        descriptionElement.innerText = elementDescription;
        descriptionElement.setAttribute('data-description', elementDescription);
        galleryElement.setAttribute('data-description', elementDescription);

        console.log('After Update - Inner Text:', descriptionElement.innerText);
        console.log('After Update - Data Description:', descriptionElement.getAttribute('data-description'));
    } else {
        console.error('Description element not found.');
    }
}



function showImageSection() {
    document.getElementById('image-modal').style.display = 'block';
    document.getElementById('socialMediaEditSection').style.display = 'none';
    document.getElementById('textEditSection').style.display = 'block';
    document.getElementById('imageEditSection').style.display = 'block';
    document.getElementById('textFieldSection').style.display = 'none';


}

function EditSocialMedia() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('imageEditSection').style.display = 'none';
    document.getElementById('socialMediaEditSection').style.display = 'block';
    document.getElementById('saveChangesButton').style.display = 'block';
    document.getElementById('addSocialMediaButton').style.display = 'none';
    document.getElementById('textFieldSection').style.display = 'none';

}

function showTextFieldSection() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('socialMediaEditSection').style.display = 'none';
    document.getElementById('textColorSection').style.display = 'none';
    document.getElementById('textFieldSection').style.display = 'block';

}
