document.addEventListener('DOMContentLoaded', function () {
    // Function to handle file input change
    function handleFileInputChange(event) {
        const fileInput = event.target;
        const profileImage = document.getElementById('profileImage');

        // Check if a file is selected
        if (fileInput.files.length > 0) {
            const newImageSrc = URL.createObjectURL(fileInput.files[0]);
            profileImage.src = newImageSrc;
        }
    }

    // Find the profile picture container
    const profilePictureContainer = document.querySelector('.profile-picture-container');

    // Create a file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // Restrict to image files
    fileInput.style.display = 'none'; // Hide the file input

    // Attach the function to the file input change event
    fileInput.addEventListener('change', handleFileInputChange);

    // Function to trigger file input when the image or overlay is clicked
    function handleImageClick() {
        fileInput.click(); // Trigger the file input
    }

    // Attach the function to the image and overlay click events
    profilePictureContainer.addEventListener('click', handleImageClick);

    // Append the file input to the profile picture container
    profilePictureContainer.appendChild(fileInput);
});