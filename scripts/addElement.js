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
    const addElementButton = document.querySelector('#addElementButton');
    addElementButton.addEventListener('click', openAddElementModal);
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
}

function customizeElement() {
    const contentContainer = document.querySelector('.content');
    const elementDescription = document.getElementById('elementDescription').value;

    const dropzoneFiles = document.querySelectorAll('.dropzone .dz-filename span');


    if (dropzoneFiles.length > 0) {
        const elementUrl = dropzoneFiles[0].textContent.trim();
        const decodedElementUrl = decodeURIComponent(elementUrl);

        const elementImage = decodedElementUrl.startsWith('http') ? decodedElementUrl : `/file/${decodedElementUrl}`;

        if (currentElementType === 'image') {
            let galleryContainer = document.getElementById('galleryContainer');
            if (!galleryContainer) {
                galleryContainer = document.createElement('div');
                galleryContainer.id = 'galleryContainer';
                contentContainer.appendChild(galleryContainer);

                // Add the title only if it's the first image
                if (!titleAdded) {
                    const titleElement = document.createElement('div');
                    titleElement.textContent = `${getUsernameFromURL()}'s Gallery`;
                    titleElement.classList.add('gallery-title');
                    galleryContainer.appendChild(titleElement);
                    titleAdded = true; // Set the flag to true after adding the title
                }
            }

            const galleryElement = document.createElement('div');
            galleryElement.classList.add('gallery-item');

            const newImage = document.createElement('img');
            newImage.src = `/file/${elementUrl}`;
            newImage.alt = 'New Image';

            // Create a description element
            const descriptionContainer = document.createElement('div');
            descriptionContainer.classList.add('image-text');
            const descriptionElement = document.createElement('div');
            descriptionElement.textContent = elementDescription;
            descriptionElement.classList.add('gallery-description');

            galleryElement.appendChild(newImage);
            galleryElement.appendChild(descriptionContainer);
            descriptionContainer.appendChild(descriptionElement);
            galleryContainer.appendChild(galleryElement);

            // Create an overlay element
            const overlayElement = document.createElement('div');
            overlayElement.innerText = '✏';
            overlayElement.classList.add('gallery-overlay');
            overlayElement.addEventListener('click', () => editElement(galleryElement));

            // Append the overlay to the gallery element
            galleryElement.appendChild(overlayElement);

            console.log('Image Source:', newImage.src);
        }
        console.log('Element Image:', elementImage);

        closeCustomizeElementModal();
        clearFormInputs();
    } else {
        console.error('No files uploaded.');
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
    // Your logic to trigger image editing mode
    document.getElementById('modalTitle').innerText = 'Edit Image';
    document.getElementById('elementDescription').style.display = 'block';
    document.getElementById('elementDescription').style.marginLeft = '8px';
    document.getElementById('imageEditSection').style.display = 'block';
    openCustomizeElementModal();

    // Hide the image overlay
    document.getElementById('imageOverlay').style.display = 'blo';
}



function editElement(galleryElement) {
    const image = galleryElement.querySelector('img');
    const description = galleryElement.querySelector('.gallery-description').textContent;

    // Populate the modal with existing details
    document.getElementById('elementDescription').value = description;
    document.getElementById('imageUrl').value = image.src;

    // Trigger the modal for editing
    enableImageEdit();

    // Store a reference to the edited item for later use (e.g., for updating details on Apply Changes)
    currentEditedItem = galleryElement;
}