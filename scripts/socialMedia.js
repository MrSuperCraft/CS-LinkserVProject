// From /addElement.js

function closeCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'none';
}

function openCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'block';
}



// On Load
document.addEventListener('DOMContentLoaded', () => {

});



function showImageSection() {
    document.getElementById('image-modal').style.display = 'block';
    document.getElementById('socialMediaEditSection').style.display = 'none';
    document.getElementById('textEditSection').style.display = 'block';
    document.getElementById('imageEditSection').style.display = 'block';

}

function EditSocialMedia() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('imageEditSection').style.display = 'none';
    document.getElementById('socialMediaEditSection').style.display = 'block';
    document.getElementById('saveChangesButton').style.display = 'block';
    document.getElementById('addSocialMediaButton').style.display = 'none';
}

function showSocialMediaSection() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('imageEditSection').style.display = 'none';
    document.getElementById('socialMediaEditSection').style.display = 'block';
    document.getElementById('addSocialMediaButton').style.display = 'block';
    document.getElementById('saveChangesButton').style.display = 'none';
}

function enableSocialEdit() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('imageEditSection').style.display = 'none';
    document.getElementById('socialMediaEditSection').style.display = 'block';
    document.getElementById('addSocialMediaButton').style.display = 'none';
    document.getElementById('saveChangesButton').style.display = 'block';
}




document.addEventListener('DOMContentLoaded', () => {
    // Find the select element
    const platformSelect = document.getElementById('socialMediaPlatform');

    // Hide the original select element
    platformSelect.style.display = 'none';

    // Add an input element for searching
    const platformSearch = document.createElement('input');
    platformSearch.setAttribute('type', 'text');
    platformSearch.setAttribute('placeholder', 'Search for a platform...');
    platformSearch.setAttribute('id', 'platformSearch');
    platformSearch.style.marginBottom = '10px';

    // Create a container for the search input and options card
    const searchContainer = document.getElementById('socialMediaSearchContainer');

    // Create a container for the options card
    const optionsCard = document.createElement('div');
    optionsCard.setAttribute('class', 'options-card');
    optionsCard.style.width = '250px';
    optionsCard.style.overflowX = 'hidden'; // Add this line to hide the sideways scrollbar

    // Append the search input and options card to the search container
    searchContainer.appendChild(platformSearch);
    searchContainer.appendChild(optionsCard);

    // Event listener for the search input
    platformSearch.addEventListener('input', function () {
        const searchTerm = platformSearch.value.toLowerCase();

        // Check if the search input is empty
        if (searchTerm.trim() === '') {
            // Hide the options card
            optionsCard.style.display = 'none';
        } else {
            // Filter and display matching options
            const matchingOptions = Array.from(platformSelect.options).filter(option =>
                option.text.toLowerCase().includes(searchTerm)
            );

            displayOptions(matchingOptions);
        }
    });

    // Function to display filtered options
    function displayOptions(options) {
        // Clear existing options
        optionsCard.innerHTML = '';

        // Add filtered options
        options.forEach(option => {
            const optionItem = document.createElement('div');
            optionItem.textContent = option.text;
            optionItem.style.width = '250px';
            optionItem.style.padding = '8px';
            optionItem.style.boxSizing = 'border-box'; // Include padding in the total width

            // Get the icon class for the current platform
            const iconClass = getIconClass(option.value);

            // Create an icon element
            const iconElement = document.createElement('i');
            iconElement.setAttribute('class', iconClass);
            iconElement.style.marginLeft = '8px'; // Adjust the value as needed

            // Append the icon and text to the option item
            optionItem.appendChild(iconElement);

            optionItem.addEventListener('click', function () {
                // Set the selected option in the hidden select element
                platformSelect.value = option.value;

                // Trigger the change event manually
                platformSelect.dispatchEvent(new Event('change'));

                // Update the search input with the selected option
                platformSearch.value = option.text;

                // Clear the displayed options
                optionsCard.innerHTML = '';
            });

            optionsCard.appendChild(optionItem);
        });

        // Display the options card
        optionsCard.style.display = 'block';
    }
});


























// Function to create a social media button
function createSocialMediaButton(platform, url, direction, color1, color2) {
    // Create a container for the button and overlay
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('social-button-container');

    // Create an overlay div
    const overlay = document.createElement('div');
    overlay.classList.add('social-overlay');
    overlay.innerText = '✏';

    // Create an anchor element
    const buttonLink = document.createElement('a');
    buttonLink.href = url.startsWith('http') ? url : `http://${url}`;
    buttonLink.target = "_blank";
    buttonLink.style.background = `linear-gradient(${direction}, ${color1}, ${color2})`;
    buttonLink.style.borderRadius = '50%'; // Make the button circular
    buttonLink.style.width = '80px'; // Set a fixed width
    buttonLink.style.height = '80px'; // Set a fixed height
    buttonLink.style.display = 'flex';
    buttonLink.style.alignItems = 'center';
    buttonLink.style.justifyContent = 'center';
    buttonLink.style.textDecoration = 'none'; // Remove underline from the link

    // Create an icon element
    const iconElement = document.createElement('i');
    iconElement.className = getIconClass(platform);
    iconElement.style.color = 'white';
    iconElement.style.fontSize = '30px'; // Adjust the font size as needed

    // Append the icon to the anchor element
    buttonLink.appendChild(iconElement);

    // Append the anchor element and overlay to the button container
    buttonContainer.appendChild(buttonLink);
    buttonContainer.appendChild(overlay);

    // Add a click event listener for opening the edit modal
    buttonContainer.addEventListener('click', function () {
        openEditSocialMediaModal(buttonContainer, platform, url, color1, color2);
    });

    // Add click event listener to the overlay
    overlay.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent the click from reaching the button
        openEditSocialMediaModal(buttonContainer, platform, url, color1, color2, direction);
    });


    return buttonContainer;
}

// Event listener for the "Add Social Media Icon" button in Customize Element modal
window.addEventListener('load', (event) => {
    const addSocialMediaButton = document.getElementById('addSocialMediaButton');
    console.log(addSocialMediaButton);

    addSocialMediaButton.addEventListener('click', function () {
        // Retrieve values from the inputs
        const platform = document.getElementById('socialMediaPlatform').value;
        const url = document.getElementById('href-text').value;
        const directionSelect = document.querySelector('.select-box select');
        const direction = directionSelect.value || 'Left Top'; // Default to 'Left Top' if no direction is selected
        const color1 = document.querySelectorAll('.colors input')[0].value;
        const color2 = document.querySelectorAll('.colors input')[1].value;

        // Create a new button element
        const newSocialMediaButton = createSocialMediaButton(platform, url, direction, color1, color2);

        // Add the button to your page or container
        document.getElementById('buttonContainer').appendChild(newSocialMediaButton);

        // After adding the button to the page
        setTimeout(() => {
            // Clear form inputs except direction and colors
            document.getElementById('socialMediaPlatform').value = '';
            document.getElementById('href-text').value = '';
            directionSelect.value = 'Left Top'; // Reset direction to default
            document.querySelectorAll('.colors input')[0].value = '#5665E9'; // Reset color1 to default black
            document.querySelectorAll('.colors input')[1].value = '#A271F8'; // Reset color2 to default white

        }, 200);

        // Close the modal
        closeCustomizeElementModal();
    });
});

function openEditSocialMediaModal(buttonContainer, platform, url, color1, color2) {
    // Populate your modal with the values
    document.getElementById('socialMediaPlatform').value = platform;
    document.getElementById('href-text').value = url;

    // Find the select element for direction
    const directionSelect = document.querySelector('.select-box select');

    // Find the option with the specified value
    const selectedOption = Array.from(directionSelect.options).find(option => option.text === platform);

    // Set the selected attribute for the found option
    if (selectedOption) {
        selectedOption.selected = true;
    } else {
        // If the option is not found, set a default value or handle it as needed
        directionSelect.value = 'Left Top';
    }

    // Trigger the change event
    directionSelect.dispatchEvent(new Event('change'));

    document.querySelectorAll('.colors input')[0].value = color1;
    document.querySelectorAll('.colors input')[1].value = color2;

    // Set default direction if no direction is selected
    if (!directionSelect.value) {
        directionSelect.value = 'Left Top';
        directionSelect.dispatchEvent(new Event('change'));
    }

    // Analyze the current gradient and automatically select the corresponding option
    analyzeAndSelectGradient(directionSelect);

    // Clear other inputs
    document.getElementById('platformSearch').value = ''; // Assuming this is the search input
    // Add more input clearing if needed

    enableSocialEdit();

    // Add 'editing' class to indicate that the button is being edited
    buttonContainer.classList.add('editing');

    // Open the modal
    openCustomizeElementModal();
}

// Function to analyze the current gradient and automatically select the corresponding option
function analyzeAndSelectGradient(directionSelect) {
    const editingContainer = document.querySelector('.social-button-container.editing');

    if (editingContainer) {
        const editedButtonLink = editingContainer.querySelector('a');
        const computedStyle = window.getComputedStyle(editedButtonLink);
        const gradient = computedStyle.backgroundImage;

        // Extract direction from gradient
        const directionMatch = gradient.match(/to\s(\w+(\s\w+)*)/i);
        const direction = directionMatch ? directionMatch[1].replace(/\s/g, ' ') : 'Left Top';

        // Find the option with the determined direction
        const matchingOption = Array.from(directionSelect.options).find(option =>
            option.text.toLowerCase().includes(direction.toLowerCase())
        );

        // Set the selected attribute for the found option
        if (matchingOption) {
            // Set the selected attribute for the found option
            directionSelect.value = matchingOption.value;
            directionSelect.dispatchEvent(new Event('change'));
        }
    }
}


const directionSelect = document.getElementById('directionSelect');
const selectedDirection = document.querySelector('.select-box select');

function saveChanges() {
    // Retrieve values from the inputs in the modal
    const platform = document.getElementById('socialMediaPlatform').value;
    const url = document.getElementById('href-text').value;
    const direction = document.querySelector('.select-box select').value;
    const color1 = document.querySelectorAll('.colors input')[0].value;
    const color2 = document.querySelectorAll('.colors input')[1].value;

    // Find the edited social media button container
    const editingContainer = document.querySelector('.social-button-container.editing');

    // Check if the element exists before trying to modify it
    if (editingContainer) {
        const editedButtonLink = editingContainer.querySelector('a');
        const editedIconElement = editedButtonLink.querySelector('i');

        // Update the button link with the new values
        editedButtonLink.href = url.startsWith('http') ? url : `http://${url}`;
        editedButtonLink.style.background = `linear-gradient(${direction}, ${color1}, ${color2})`;

        // Update the icon element with the new platform icon
        editedIconElement.className = getIconClass(platform);

        // Remove the 'editing' class to indicate that the button has been saved
        editingContainer.classList.remove('editing');

        // Close the modal
        closeCustomizeElementModal();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Add an event listener for the "Save Changes" button in the modal
    document.getElementById('saveChangesButton').addEventListener('click', saveChanges);
});





buttonContainer.addEventListener('click', function () {
    openEditSocialMediaModal(buttonContainer, platform, url, direction, color1, color2);
});














































// Getting icons for the options
function getIconClass(platform) {
    switch (platform) {
        // Social Media Icons
        case 'facebook':
            return 'fab fa-facebook';
        case 'twitter':
            return 'fab fa-twitter';
        case 'instagram':
            return 'fab fa-instagram';
        case 'linkedin':
            return 'fab fa-linkedin';
        case 'youtube':
            return 'fab fa-youtube';
        case 'pinterest':
            return 'fab fa-pinterest';
        case 'snapchat':
            return 'fab fa-snapchat-ghost';
        case 'tiktok':
            return 'fab fa-tiktok';
        case 'reddit':
            return 'fab fa-reddit';
        case 'whatsapp':
            return 'fab fa-whatsapp';
        // Add more cases for other social media platforms

        // Music Platform Icons
        case 'spotify':
            return 'fa-brands fa-spotify';
        case 'soundcloud':
            return 'fa-brands fa-soundcloud';
        case 'apple-music':
            return 'fa-brands fa-apple';
        case 'google-play-music':
            return 'fa-brands fa-google-play';
        case 'amazon-music':
            return 'fa-brands fa-amazon';
        // Add more cases for other music platforms

        // Other Icons
        case 'github':
            return 'fa-brands fa-github';
        case 'discord':
            return 'fa-brands fa-discord';
        case 'medium':
            return 'fa-brands fa-medium';
        case 'twitch':
            return 'fa-brands fa-twitch';
        case 'steam':
            return 'fa-brands fa-steam';
        case 'stack-overflow':
            return 'fa-brands fa-stack-overflow';
        case 'etsy':
            return 'fa-brands fa-etsy';
        case 'telegram':
            return 'fa-brands fa-telegram';
        case 'slack':
            return 'fa-brands fa-slack';
        case 'behance':
            return 'fa-brands fa-behance';
        case 'quora':
            return 'fa-brands fa-quora';
        case 'paypal':
            return 'fa-brands fa-paypal';
        case 'bandcamp':
            return 'fa-brands fa-bandcamp';
        // Add more cases for other platforms

        // Default icon if no match is found
        default:
            return 'fas fa-question-circle'; // or any default icon you prefer
    }
}