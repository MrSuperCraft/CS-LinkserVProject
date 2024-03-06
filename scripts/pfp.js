document.addEventListener('DOMContentLoaded', async function () {
    const profilePictureContainer = document.querySelector('.profile-picture-container');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    // Fetch and render user's profile picture on page load
    const userId = await getUserId();  // Use your own getUserId function
    if (userId) {
        const imageUrl = await fetchProfilePicture(userId);
        if (imageUrl) {
            const profileImage = document.getElementById('profileImage');
            profileImage.src = imageUrl;
        }
    }

    fileInput.addEventListener('change', async function (event) {
        const fileInput = event.target;
        const profileImage = document.getElementById('profileImage');

        if (fileInput.files.length > 0) {
            const newImageSrc = URL.createObjectURL(fileInput.files[0]);
            profileImage.src = newImageSrc;

            // Send the file to the server using AJAX
            await sendFileToServer(fileInput.files[0]);
        }
    });

    async function sendFileToServer(file) {
        const formData = new FormData();
        formData.append('profileImage', file);
        formData.append('user_id', await getUserId());  // Use your own getUserId function

        try {
            const response = await fetch('/api/pfp/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                console.log('File uploaded successfully');
                // Optionally, you can update the UI or show a success message
            } else {
                console.error('Error uploading file:', data.error);
                // Handle the error accordingly
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function fetchProfilePicture(userId) {
        try {
            const response = await fetch(`/api/pfp/${userId}`);
            console.log('Response:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const blob = await response.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;

                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error fetching profile picture:', error);
            return null;
        }
    }




    profilePictureContainer.addEventListener('click', function () {
        fileInput.click();
    });

    profilePictureContainer.appendChild(fileInput);
});
