document.addEventListener('DOMContentLoaded', async function () {
    const profilePictureContainers = document.querySelectorAll('.profile-picture-container');

    profilePictureContainers.forEach(async function (container) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        // Fetch and render user's profile picture on page load
        const userId = await getUserId();
        const blobData = await fetchProfilePicture(userId);

        if (blobData) {
            const profileImages = container.querySelectorAll('.profile-image');
            profileImages.forEach((profileImage) => {
                profileImage.src = URL.createObjectURL(blobData);
            });
        }

        fileInput.addEventListener('change', async function (event) {
            const fileInput = event.target;
            const profileImages = document.querySelectorAll('.profile-image');

            if (fileInput.files.length > 0) {
                try {
                    const newImageBlob = fileInput.files[0];
                    profileImages.forEach((profileImage) => {
                        profileImage.src = URL.createObjectURL(newImageBlob);
                    });

                    // Send the Blob data to the server using AJAX
                    await sendBlobImageToServer(newImageBlob);

                    // Display success message
                    showMessage('File uploaded successfully', 'success');
                } catch (error) {
                    console.error('Error processing file:', error.message);

                    // Display error message
                    showMessage('Error uploading file. Please try again.', 'error');
                }
            }
        });

        container.addEventListener('click', function () {
            fileInput.click();
        });

        container.appendChild(fileInput);
    });
});



async function sendBlobImageToServer(imageBlob) {
    const userId = await getUserId();
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('imageData', imageBlob);

    try {
        const response = await fetch('/api/pfp/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            console.log('File uploaded successfully');
        } else {
            console.error('Error uploading file:', data.error);
        }
    } catch (error) {
        console.error('Fetch error:', error.message);
    }
}

async function fetchProfilePicture(userId) {
    try {
        const response = await fetch(`/api/pfp/${userId}`);

        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`Profile picture not found for user ${userId}`);
                return null; // Return null for 404 responses
            } else {
                showMessage('Failed to load the profile image. Reload the page.', 'error');
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        const blob = await response.blob();

        handleFetchCompletion(); // Increment fetch completion for profile picture\
        return blob;
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        return null;
    }
}
