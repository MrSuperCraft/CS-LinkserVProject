// On load
document.addEventListener('DOMContentLoaded', function () {

    // Attach the functions to your existing elements or buttons
    const addElementButton = document.querySelector('#addElementButton'); // Replace with your actual button
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


function addElement(type) {
    const contentContainer = document.querySelector('.content'); // Replace with your actual container

    if (type === 'button') {
        const newButton = document.createElement('button');
        newButton.textContent = 'New Button';
        contentContainer.appendChild(newButton);
    } else if (type === 'textfield') {
        const newTextField = document.createElement('input');
        newTextField.type = 'text';
        newTextField.placeholder = 'New Textfield';
        contentContainer.appendChild(newTextField);
    } else if (type === 'link') {
        const newLink = document.createElement('a');
        newLink.href = '#'; // Replace with the actual link
        newLink.textContent = 'New Link';
        contentContainer.appendChild(newLink);
    } else if (type === 'image') {
        const newImage = document.createElement('img');
        newImage.src = 'path/to/default-image.jpg'; // Replace with a default image path
        newImage.alt = 'New Image';
        contentContainer.appendChild(newImage);
    } else if (type === 'social') {
        const newSocialIcon = document.createElement('i');
        newSocialIcon.className = 'fab fa-twitter'; // Replace with the desired social media icon class
        contentContainer.appendChild(newSocialIcon);
    }

    closeAddElementModal(); // Close the modal after adding an element
}