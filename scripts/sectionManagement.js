document.addEventListener('DOMContentLoaded', () => {
    // Function to show the appropriate section based on the hash in the URL
    const showSection = () => {
        const hash = window.location.hash.substring(1);
        const sections = ['view', 'design', 'presets', 'background', 'profile'];
        const defaultSection = 'view';  // Set the default section here

        sections.forEach(section => {
            const sectionElement = document.getElementById(`${section}Section`);
            if (sectionElement) {
                sectionElement.style.display = section === (hash || defaultSection) ? 'block' : 'none';
            }
        });
    };

    // Add event listener for hash changes
    window.addEventListener('hashchange', showSection);

    // Initial call to show the correct section on page load
    showSection();





    // Gradient Preview Control

    updateGradientPreview(); // Call the function to display the gradient preview

    // Add event listeners to gradient color pickers to trigger preview update
    const gradientStartColorInput = document.getElementById('gradientStart');
    gradientStartColorInput.addEventListener('input', updateGradientPreview);

    const gradientEndColorInput = document.getElementById('gradientEnd');
    gradientEndColorInput.addEventListener('input', updateGradientPreview);
});






// lines 29 - 245 : background modifications




// Function to apply gradient
function applyGradient() {
    // Get selected colors
    const gradientStartColor = document.getElementById('gradientStart').value;
    const gradientEndColor = document.getElementById('gradientEnd').value;

    // Get selected gradient direction
    const gradientDirection = document.getElementById('gradientDirection').value;

    // Apply gradient to the background section
    const backgroundSection = document.getElementById('backgroundSection');
    backgroundSection.style.backgroundImage = `linear-gradient(${gradientDirection}, ${gradientStartColor}, ${gradientEndColor})`;

    // Apply gradient to the view section
    const viewSection = document.getElementById('viewSection');
    viewSection.style.backgroundImage = `linear-gradient(${gradientDirection}, ${gradientStartColor}, ${gradientEndColor})`;

    updateGradientPreview();

}


// Function to apply static color
function applyStaticColor() {
    const staticColor = document.getElementById('staticColor').value;
    applyColor(staticColor);
}

const backgroundImageInput = document.getElementById('backgroundImage');
backgroundImageInput.addEventListener('change', handleFileInputChange);

// Function to handle file input change
function handleFileInputChange() {
    const imageUrl = document.getElementById('imageUrl').value;
    const customImage = backgroundImageInput.files[0];

    if (imageUrl !== "") {
        displayImagePreview(imageUrl);
    } else if (customImage) {
        const imageUrl = URL.createObjectURL(customImage);
        displayImagePreview(imageUrl);
    }
}

// Function to apply custom image
function applyCustomImage() {
    const imageUrl = document.getElementById('imageUrl').value;
    const backgroundImageInput = document.getElementById('backgroundImage');
    const customImage = backgroundImageInput.files[0];

    if (imageUrl !== "") {
        displayImagePreview(imageUrl);
        applyImage(imageUrl);  // Apply image to background
    } else if (customImage) {
        const imageUrl = URL.createObjectURL(customImage);
        displayImagePreview(imageUrl);
        applyImage(imageUrl);  // Apply image to background
    }
}

// Helper function to apply color to background sections
function applyColor(color) {
    const backgroundSection = document.getElementById('backgroundSection');

    // Remove gradient styles
    backgroundSection.style.backgroundImage = 'none';

    // Apply the static color
    backgroundSection.style.backgroundColor = color;

    const viewSection = document.getElementById('viewSection');

    // Remove gradient styles
    viewSection.style.backgroundImage = 'none';

    // Apply the static color
    viewSection.style.backgroundColor = color;
}

// Function to apply custom image
function applyCustomImage() {
    const imageUrl = document.getElementById('imageUrl').value;
    const backgroundImageInput = document.getElementById('backgroundImage');
    const customImage = backgroundImageInput.files[0];

    if (imageUrl !== "") {
        displayImagePreview(imageUrl);
        applyImage(imageUrl);  // Apply image to background
    } else if (customImage) {
        const imageUrl = URL.createObjectURL(customImage);
        displayImagePreview(imageUrl);
        applyImage(imageUrl);  // Apply image to background
    }
}


function displayImagePreview(imageUrl) {
    // Get the preview element
    const imagePreview = document.getElementById('imagePreview');

    // Set the background image of the preview
    imagePreview.style.backgroundImage = `url(${imageUrl})`;

    // Display the preview
    imagePreview.style.display = 'block';
}


// Helper function to apply image to background sections
function applyImage(imageUrl) {
    const backgroundSection = document.getElementById('backgroundSection');
    backgroundSection.style.backgroundImage = `url('${imageUrl}')`;
    backgroundSection.style.backgroundSize = 'cover';

    const viewSection = document.getElementById('viewSection');
    viewSection.style.backgroundImage = `url('${imageUrl}')`;
    viewSection.style.backgroundSize = 'cover';
}


function resetGradientStyles() {
    // Reset gradient styles for both sections
    const backgroundSection = document.getElementById('backgroundSection');
    backgroundSection.style.backgroundImage = 'none';

    const viewSection = document.getElementById('viewSection');
    viewSection.style.backgroundImage = 'none';
}



function removeImage() {
    // Remove the selected file and clear the file input
    const backgroundImageInput = document.getElementById('backgroundImage');
    backgroundImageInput.value = null;

    // Clear the image preview
    clearImagePreview();

    // Remove the background image from both sections
    clearBackgroundImage('viewSection');
    clearBackgroundImage('backgroundSection');
}

function clearImagePreview() {
    // Hide the image preview
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.style.display = 'none';
}

function clearBackgroundImage(sectionId) {
    // Remove the background image from the specified section
    const section = document.getElementById(sectionId);
    section.style.backgroundImage = 'none';
    // You may want to add more styling adjustments based on your design requirements
}



// Add event listener to the gradient direction select
const gradientDirectionSelect = document.getElementById('gradientDirection');
gradientDirectionSelect.addEventListener('change', updateGradientPreview);


// Function to update gradient preview
// Function to update gradient preview
function updateGradientPreview() {
    const gradientStartColor = document.getElementById('gradientStart').value;
    const gradientEndColor = document.getElementById('gradientEnd').value;
    const gradientDirection = document.getElementById('gradientDirection').value;

    // Update the gradient preview styles
    const gradientPreviewInner = document.getElementById('gradientPreviewInner');
    gradientPreviewInner.style.backgroundImage = `linear-gradient(${gradientDirection}, ${gradientStartColor}, ${gradientEndColor})`;

    // Display the gradient preview
    displayGradientPreview();
}

// Function to display gradient preview
function displayGradientPreview() {
    // Show the gradient preview
    const gradientPreview = document.getElementById('gradientPreview');
    gradientPreview.style.display = 'flex';  // Adjust the display style as needed
}












/////////////////////////////////




// Lines 250 - ? : Profile API

document.addEventListener('DOMContentLoaded', async function () {
    const userId = await getUserId();

    try {
        const response = await fetch(`/api/user/${userId}`);
        const userData = await response.json();

        // Now you have the user details in the 'userData' object
        document.getElementById('stat__username').innerText = userData.Username;
        document.getElementById('stat__email').innerText = userData.Email;
        document.getElementById('stat__membership').innerText = userData.Membership;

    } catch (error) {
        console.error('Error fetching user details:', error.message);
    }
});





