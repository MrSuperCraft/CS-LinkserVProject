// From addElement.js


function closeCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'none';
}

function openCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'block';
}


// On load

document.addEventListener('DOMContentLoaded', () => {

});


function showTextFieldSection() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('socialMediaEditSection').style.display = 'none';
    document.getElementById('textColorSection').style.display = 'none';
    document.getElementById('textFieldSection').style.display = 'block';
}