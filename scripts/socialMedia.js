// From /addElement.js

function closeCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'none';

    const editingContainer = document.querySelector('div').classList.contains('editing');
    editingContainer.classList.remove('editing');

}

function openCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'block';
}

// Global Variables





// On Load
document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('customizeElementModal');

    modalOverlay.addEventListener('click', function (event) {
        // Check if the click was inside the modal content
        const isInsideModalContent = event.target.closest('.modal-content');

        if (!isInsideModalContent) {
            // Get the closest social-button-container ancestor
            const buttonContainer = event.target.closest('.social-button-container');

            if (!buttonContainer) {
                // Click was outside of any button, handle as needed
                removeAllEditingClasses();
            } else {
                // Get the button_id from the clicked button
                const buttonId = buttonContainer.dataset.button_id;

                // Remove editing class from all buttons
                removeAllEditingClasses();

                // Add editing class to the clicked button
                buttonContainer.classList.add('editing');

                // Call the updateSocialMediaButton function with the buttonId
                updateSocialMediaButton(buttonId);
            }
        }
    });
});

// Function to remove the "editing" class from all buttons
function removeAllEditingClasses() {
    const editingButtons = document.querySelectorAll('.social-button-container.editing');
    editingButtons.forEach(button => button.classList.remove('editing'));
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
    document.getElementById('socialDelete').style.display = 'block';
    document.getElementById('textFieldSection').style.display = 'none';
    document.getElementById('buttonSection').style.display = 'none';


}

function showSocialMediaSection() {
    document.getElementById('buttonSection').style.display = 'none';
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('imageEditSection').style.display = 'none';
    document.getElementById('socialMediaEditSection').style.display = 'block';
    document.getElementById('addSocialMediaButton').style.display = 'block';
    document.getElementById('saveChangesButton').style.display = 'none';
    // document.getElementById('textColorSection').style.display = 'none';
    document.getElementById('socialDelete').style.display = 'none';
    document.getElementById('textFieldSection').style.display = 'none';

}

function enableSocialEdit() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('modalTitle').innerText = 'Customize Your Icon';
    document.getElementById('imageEditSection').style.display = 'none';
    document.getElementById('socialMediaEditSection').style.display = 'block';
    document.getElementById('addSocialMediaButton').style.display = 'none';
    // document.getElementById('textColorSection').style.display = 'block';
    document.getElementById('saveChangesButton').style.display = 'block';
    document.getElementById('socialDelete').style.display = 'block';
    document.getElementById('textFieldSection').style.display = 'none';
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
                option.text.toLowerCase().includes(searchTerm) || option.value.includes(searchTerm)
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

            optionItem.addEventListener('click', function (event) {
                // Set the selected option in the hidden select element
                platformSelect.value = option.value;

                // Trigger the change event manually
                platformSelect.dispatchEvent(new Event('change'));

                // Update the search input with the selected option
                platformSearch.value = option.text;

                // Clear the displayed options
                optionsCard.innerHTML = '';

                // Get the closest parent with the 'social-button-container' class
                const buttonContainer = this.closest('.social-button-container');

                // Check if a button container is found
                if (buttonContainer) {
                    // Add or toggle the 'editing' class on the found button container
                    buttonContainer.classList.toggle('editing', true);
                }

                // Stop further propagation of the event
                event.stopPropagation();
            });

            optionsCard.appendChild(optionItem);
        });

        // Display the options card
        optionsCard.style.display = 'block';
    }
});























// Function to create a social media button
function createSocialMediaButtonUI(platform, url, direction, color1, color2, buttonId) {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('social-button-container');

    // Set the dataset property for both platform and buttonId
    buttonContainer.dataset.platform = platform;
    buttonContainer.dataset.button_id = buttonId || generateUniqueId();

    // const textColor = getCustomColor(textColorClass);

    // Create an overlay div
    const overlay = document.createElement('div');
    overlay.classList.add('social-overlay');
    overlay.innerText = '✏';

    // Create an anchor element
    const buttonLink = document.createElement('a');
    buttonLink.href = url && url.startsWith('http') ? url : `http://${url}`;
    buttonLink.target = "_blank";
    buttonLink.style.background = `linear-gradient(${direction}, ${color1}, ${color2})`;
    buttonLink.style.borderRadius = '50%'; // Make the button circular
    buttonLink.style.width = '80px'; // Set a fixed width
    buttonLink.style.height = '80px'; // Set a fixed height
    buttonLink.style.display = 'flex';
    buttonLink.style.alignItems = 'center';
    buttonLink.style.justifyContent = 'center';
    buttonLink.style.textDecoration = 'none'; // Remove underline from the link

    // Create an icon element as an i element
    const iconElement = document.createElement('i');
    iconElement.className = getIconClass(platform); // Update the icon class based on the platform
    iconElement.style.color = 'white';
    iconElement.style.fontSize = '30px'; // Adjust the font size as needed
    // iconElement.style.color = textColor; // Set the text color dynamically

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

        // Analyze the gradient and select the corresponding option
        analyzeAndSelectGradient(directionSelect);

        console.log('Direction value before modal:', direction);

        // Open the edit modal
        openEditSocialMediaModal(buttonContainer, platform, url, color1, color2, direction);
    });

    return buttonContainer;
}




// Event listener for the "Add Social Media Icon" button in Customize Element modal
window.addEventListener('load', (event) => {
    const addSocialMediaButton = document.getElementById('addSocialMediaButton');

    addSocialMediaButton.addEventListener('click', function () {
        // Retrieve values from the inputs
        const platform = document.getElementById('socialMediaPlatform').value || 'facebook';
        const url = document.getElementById('href-text').value || 'https://example.com';
        const directionSelect = document.querySelector('.select-box select');
        const direction = directionSelect.value || 'Left Top'; // Default to 'Left Top' if no direction is selected
        const color1 = document.querySelectorAll('.colors input')[0].value || '#5665E9';
        const color2 = document.querySelectorAll('.colors input')[1].value || '#A271F8';

        // Create a new button element
        const newSocialMediaButton = createSocialMediaButtonUI(platform, url, direction, color1, color2);

        // Add the button to your page or container
        document.getElementById('social-links-dynamic').appendChild(newSocialMediaButton);

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

function openEditSocialMediaModal(buttonContainer, platform, url, color1, color2, direction, buttonId) {


    const searchContainer = document.getElementById('socialMediaSearchContainer');

    const dataPlatform = buttonContainer.dataset.platform || platform;
    console.log('dataPlatform: ', dataPlatform)

    const platformSearch = searchContainer.querySelector('#platformSearch');
    console.log('platformSearch element:', platformSearch);

    // Set the value for platformSearch
    if (platformSearch) {
        platformSearch.value = dataPlatform;
    } else {
        console.error('platformSearch element not found');
    }



    document.getElementById('href-text').value = url;

    // Find the select element for direction
    const directionSelect = document.querySelector('.select-box select');




    // Find the option with the specified value
    const selectedOption = Array.from(directionSelect.options).find(option => option.text.toLowerCase() === direction.toLowerCase());

    // Set the selected attribute for the found option
    if (selectedOption) {
        // Update the direction based on the selected option
        directionSelect.value = selectedOption.value;
        directionSelect.dispatchEvent(new Event('change'));
    } else {
        // If the option is not found, set a default value or handle it as needed
        directionSelect.value = 'to left top';
        directionSelect.querySelector('option[value="to left top"]').setAttribute('selected', 'selected');
        directionSelect.dispatchEvent(new Event('change'));
    }

    // Trigger the change event
    directionSelect.dispatchEvent(new Event('change'));

    document.querySelectorAll('.colors input')[0].value = color1;
    document.querySelectorAll('.colors input')[1].value = color2;

    // Analyze the current gradient and automatically select the corresponding option
    analyzeAndSelectGradient(directionSelect);

    enableSocialEdit();

    // Add 'editing' class to indicate that the button is being edited
    buttonContainer.classList.add('editing');

    // Fetch the button ID using the promise
    getButtonId().then(buttonId => {
        // Set the button ID in the hidden input
        document.getElementById('btn_id').value = buttonId;

    });
    // Open the modal
    openCustomizeElementModal();
}


// Function to analyze the current gradient and automatically select the corresponding option
function analyzeAndSelectGradient(directionSelect) {
    let editingContainer = document.querySelector('.social-button-container.editing');


    if (editingContainer && directionSelect) {
        const editedButtonLink = editingContainer.querySelector('a');
        const computedStyle = window.getComputedStyle(editedButtonLink);

        // Extract the background image value
        const backgroundImageValue = computedStyle.backgroundImage;

        console.log('Background Image:', backgroundImageValue); // Log the background image value

        // Check if the background image contains the gradient keyword
        if (backgroundImageValue.includes('linear-gradient')) {

            // Extract direction from gradient using a regex
            const directionMatch = backgroundImageValue.match(/to\s(\w+(\s\w+)*)/i);
            const direction = directionMatch ? directionMatch[1].replace(/\s/g, ' ') : 'Left Top';


            // Check if directionSelect has options
            if (directionSelect.options) {
                // Find the option with the determined direction
                const matchingOption = Array.from(directionSelect.options).find(option =>
                    option.text.toLowerCase().includes(direction.toLowerCase())
                );


                // Set the selected attribute for the found option
                directionSelect.value = matchingOption ? matchingOption.value : '';
                directionSelect.dispatchEvent(new Event('change'));
            }
        }
    }
}


const directionSelect = document.querySelector('#directionSelect select');
const selectedDirection = document.querySelector('.select-box select');

async function updateSocialMediaButtonUI(buttonId) {
    let editingContainer = document.querySelector('.editing');

    // Retrieve values from the inputs in the modal
    const platform = document.getElementById('socialMediaPlatform').value;
    const url = document.getElementById('href-text').value;
    const direction = document.querySelector('.select-box select').value;
    const color1 = document.querySelectorAll('.colors input')[0].value;
    const color2 = document.querySelectorAll('.colors input')[1].value;

    // Add this line to retrieve the text color value
    // const textColor = document.querySelectorAll('#text-color')[0].value;

    // Check if the element exists before trying to modify it
    if (editingContainer && editingContainer.classList.contains('editing')) {

        console.log("Is editing class present:", editingContainer.classList.contains('editing'));

        // If a buttonId is not provided or is -1, generate a new ID
        if (!buttonId || buttonId === -1) {
            buttonId = generateUniqueId(); // Replace with your logic to generate a new ID
        }

        // Create a new button element with the updated values, including textColor
        const newSocialMediaButton = createSocialMediaButtonUI(platform, url, direction, color1, color2, buttonId);
        newSocialMediaButton.dataset.platform = platform;
        newSocialMediaButton.dataset.url = url;
        newSocialMediaButton.dataset.direction = direction;
        newSocialMediaButton.dataset.color1 = color1;
        newSocialMediaButton.dataset.color2 = color2;

        //console.log("The selected color is:" + textColor);

        // Add the new button to your page or container
        document.getElementById('social-links-dynamic').appendChild(newSocialMediaButton);

        console.log('changes saved.')
        // Close the modal
        // Remove the existing button
        editingContainer.remove();

        setTimeout(closeCustomizeElementModal, 300);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Add an event listener for the "Save Changes" button in the modal
    document.getElementById('saveChangesButton').addEventListener('click', updateSocialMediaButtonUI);
});



const buttonContainer = document.getElementById('social-links-dynamic');

buttonContainer.addEventListener('click', function () {
    openEditSocialMediaModal(buttonContainer, platform, url, direction, color1, color2);
});












// Function to get icon class for the specified platform
function getIconClass(platform) {
    switch (platform) {
        // Social Media Icons
        case 'Facebook':
            return 'fab fa-facebook';
        case 'Twitter':
            return 'fab fa-twitter';
        case 'Instagram':
            return 'fab fa-instagram';
        case 'Linkedin':
            return 'fab fa-linkedin';
        case 'Youtube':
            return 'fab fa-youtube';
        case 'Pinterest':
            return 'fab fa-pinterest';
        case 'Snapchat':
            return 'fab fa-snapchat-ghost';
        case 'Tiktok':
            return 'fab fa-tiktok';
        case 'Reddit':
            return 'fab fa-reddit';
        case 'WhatsApp':
            return 'fab fa-whatsapp';
        // Add more cases for other social media platforms

        // Music Platform Icons
        case 'Spotify':
            return 'fab fa-spotify';
        case 'Soundcloud':
            return 'fab fa-soundcloud';
        case 'Apple Music':
            return 'fab fa-apple';
        case 'Amazon Music':
            return 'fab fa-amazon';
        // Add more cases for other music platforms

        // Other Icons
        case 'GitHub':
            return 'fab fa-github';
        case 'Discord':
            return 'fab fa-discord';
        case 'Twitch':
            return 'fab fa-twitch';
        case 'Steam':
            return 'fab fa-steam';
        case 'Stack Overflow':
            return 'fab fa-stack-overflow';
        case 'Etsy':
            return 'fab fa-etsy';
        case 'Telegram':
            return 'fab fa-telegram';
        case 'Slack':
            return 'fab fa-slack';
        case 'Behance':
            return 'fab fa-behance';
        case 'Quora':
            return 'fab fa-quora';
        case 'PayPal':
            return 'fab fa-paypal';
        case 'Bandcamp':
            return 'fab fa-bandcamp';
        case 'Dribbble':
            return 'fab fa-dribbble';
        case 'Tumblr':
            return 'fab fa-tumblr';
        // Add more cases for other platforms

        // Default icon if no match is found
        default:
            return 'fas fa-question-circle'; // or any default icon you prefer
    }
}



// Function to update the icon
function updateIcon(platform) {
    const iconClass = getIconClass(platform);
    const socialButton = document.querySelector('.social-button-container.editing');

    // Remove existing icon (both SVG and i element)
    const existingIcon = socialButton.querySelector('svg');
    if (existingIcon) {
        existingIcon.remove();
    }

    // Create and append the new SVG element
    const newIcon = createSvgElement(iconClass);
    socialButton.appendChild(newIcon);
}

// Function to create an SVG element based on the platform
function createSvgElement(iconClass) {
    const div = document.createElement('div');
    div.innerHTML = `<i class="${iconClass}"></i>`;
    return div.firstChild;
}













function deleteSocialMediaButtonUI() {
    console.log('Attempting to delete button from UI...');
    const buttonContainer = document.querySelector('.social-button-container.editing');

    if (buttonContainer) {
        console.log('Button container found, attempting to remove...');
        // Remove the button container
        buttonContainer.remove();

        // Optionally, add any additional cleanup logic here

        console.log('Button deleted from UI.');

        // Delay closing the modal to ensure DOM update
        setTimeout(() => {
            closeCustomizeElementModal();
        }, 100); // Adjust the delay time if needed
    } else {
        console.log('Button container not found.');
    }
}





/*  Manually define custom color classes and their hex values
const customColorClasses = [
    { name: 'pastel-red', hex: '#FF6E70' },
    { name: 'pastel-orange', hex: '#FFA07A' },
    { name: 'pastel-yellow', hex: '#FFD700' },
    { name: 'pastel-green', hex: '#98FB98' },
    { name: 'pastel-blue', hex: '#ADD8E6' },
    { name: 'lavender', hex: '#E6E6FA' },
    { name: 'mint-green', hex: '#98FF98' },
    { name: 'peach', hex: '#FFDAB9' },
    { name: 'sky-blue', hex: '#87CEEB' },
    { name: 'rose-pink', hex: '#FFB6C1' },
    { name: 'aqua', hex: '#00FFFF' },
    { name: 'lilac', hex: '#C8A2C8' },
    { name: 'coral', hex: '#FF7F50' },
    { name: 'sunflower-yellow', hex: '#FFD700' },
    { name: 'turquoise', hex: '#40E0D0' },
    { name: 'cherry-blossom-pink', hex: '#FFB6C1' },
    { name: 'pearl-white', hex: '#FFF' },
    { name: 'sage-green', hex: '#9ACD32' },
    { name: 'mustard-yellow', hex: '#FFDB58' },
    { name: 'teal', hex: '#008080' },
    { name: 'blush', hex: '#DE5D83' },
    { name: 'periwinkle', hex: '#CCCCFF' },
    { name: 'amber', hex: '#FFBF00' },
    { name: 'slate-gray', hex: '#708090' },
    { name: 'burgundy', hex: '#800000' },
    { name: 'ivory', hex: '#FFFFF0' },
    { name: 'olive', hex: '#808000' },
    { name: 'crimson', hex: '#DC143C' },
    { name: 'powder-blue', hex: '#B0E0E6' },
    { name: 'sepia', hex: '#704214' },
    { name: 'azure', hex: '#007FFF' },
    { name: 'marigold', hex: '#FFD700' },
    { name: 'sienna', hex: '#A0522D' },
    { name: 'mauve', hex: '#E0B0FF' },
    { name: 'charcoal', hex: '#36454F' },
    { name: 'tangerine', hex: '#FFA500' },
    { name: 'eggshell', hex: '#FFF4E1' },
    { name: 'cobalt-blue', hex: '#0047AB' },
    { name: 'magenta', hex: '#FF00FF' },
    { name: 'pistachio', hex: '#93C572' },
    { name: 'topaz', hex: '#FFD700' },
    { name: 'cyan', hex: '#00FFFF' },
    { name: 'brick-red', hex: '#FF4500' },
    { name: 'emerald-green', hex: '#008000' },
    { name: 'plum', hex: '#8E4585' },
    { name: 'coral-pink', hex: '#FF6F74' },
    { name: 'caramel', hex: '#FFD700' },
    { name: 'mulberry', hex: '#C8509B' },
    { name: 'steel-blue', hex: '#4682B4' },
    { name: 'goldenrod', hex: '#DAA520' },
    { name: 'plain-white', hex: '#FFF' }
];

*/

// Function to get the corresponding color from customColorClasses
//function getCustomColor(value) {
//    const colorObject = customColorClasses.find(color => color.name === value);
//    return colorObject ? colorObject.hex : '#000'; // Default to black if not found
//}











// Temporarily removed feature - color selection for the icon


// document.addEventListener('DOMContentLoaded', () => {
//     // Find the select element
//     const colorSelect = document.getElementById('text-color');
// 
//     // Hide the original select element
//     colorSelect.style.display = 'none';
// 
//     // Add an input element for searching
//     const colorSearch = document.createElement('input');
//     colorSearch.setAttribute('type', 'text');
//     colorSearch.setAttribute('placeholder', 'Search for a color...');
//     colorSearch.setAttribute('id', 'colorSearch');
//     colorSearch.style.marginBottom = '10px';
// 
//     // Create a container for the search input and options card
//     const searchContainer = document.getElementById('textColorSearchContainer');
//     const optionsCard = document.createElement('div');
//     optionsCard.setAttribute('class', 'options-card');
//     optionsCard.style.width = '300px';
//     optionsCard.style.overflowX = 'hidden'; // Add this line to hide the sideways scrollbar
// 
//     // Append the search input and options card to the search container
//     searchContainer.appendChild(colorSearch);
//     searchContainer.appendChild(optionsCard);
// 
//     // Event listener for the search input
//     colorSearch.addEventListener('input', function () {
//         const searchTerm = colorSearch.value.toLowerCase();
// 
//         // Check if the search input is empty
//         if (searchTerm.trim() === '') {
//             // Hide the options card
//             optionsCard.style.display = 'none';
//         } else {
//             // Filter and display matching options
//             const matchingOptions = Array.from(colorSelect.options).filter(option =>
//                 option.textContent.toLowerCase().includes(searchTerm)
//             );
// 
//             displayOptions(matchingOptions);
//         }
//     });
// 
//     // Function to display filtered options
//     function displayOptions(options) {
//         // Clear existing options
//         optionsCard.innerHTML = '';
// 
//         // Add filtered options
//         options.forEach(option => {
//             const optionItem = document.createElement('div');
//             optionItem.style.width = '280px';
//             optionItem.style.padding = '8px';
//             optionItem.style.boxSizing = 'border-box'; // Include padding in the total width
//             optionItem.style.textAlign = 'left';
// 
//             // Get the demo text for the current color
//             const demoText = option.getAttribute('data-demo');
// 
//             // Create a demo element for the color square
//             const demoSquare = document.createElement('div');
//             demoSquare.style.width = '20px';
//             demoSquare.style.height = '20px';
//             demoSquare.style.backgroundColor = getCustomColor(option.value); // Get corresponding color from customColorClasses
//             demoSquare.classList.add('color-square');
//             demoSquare.style.display = 'inline-block';
//             demoSquare.style.marginRight = '8px';
// 
//             // Create a text element for the color name
//             const colorName = document.createElement('span');
//             colorName.textContent = demoText;
// 
//             // Append the demo square and color name to the option item
//             optionItem.appendChild(demoSquare);
//             optionItem.appendChild(colorName);
// 
//             optionItem.addEventListener('click', function () {
//                 // Set the selected option in the hidden select element
//                 colorSelect.value = option.value;
// 
//                 // Trigger the change event manually
//                 colorSelect.dispatchEvent(new Event('change'));
// 
//                 // Update the search input with the selected option
//                 colorSearch.value = demoText;
// 
//                 // Clear the displayed options
//                 optionsCard.innerHTML = '';
//             });
// 
//             optionsCard.appendChild(optionItem);
//         });
// 
//         // Display the options card
//         optionsCard.style.display = 'block';
//     }
// 
// 
// 
// });




// Function to get the user ID
async function getUserId() {
    try {
        const response = await fetch('/get-user-id');

        if (!response.ok) {
            throw new Error(`Failed to fetch user ID. Status: ${response.status}`);
        }

        const data = await response.json();
        return data.userId;
    } catch (error) {
        console.error('Error fetching user ID:', error.message);
        return null;
    }
}


// Function to get form values
function getFormValues() {
    const platform = document.getElementById('socialMediaPlatform').value;
    const url = document.getElementById('href-text').value.trim();
    const direction = document.querySelector('#directionSelect select').value; // Ensure this line is correctly retrieving the value
    const color1 = document.querySelector('.colors input:nth-child(1)').value;
    const color2 = document.querySelector('.colors input:nth-child(2)').value;

    return { platform, url, direction, color1, color2 };
}


// Function to save a new social media button
async function saveSocialMediaButton() {
    const userId = await getUserId();
    if (!userId) {
        console.error('User ID not available');
        return;
    }

    const buttonId = generateUniqueId();

    const { platform, direction, color1, color2, url } = getFormValues();

    // Check if URL is not empty and is valid
    if (!url || !isValidUrl(url)) {
        console.error('Invalid or empty URL');
        return;
    }

    // Format URL with protocol
    const formattedUrl = formatUrlWithProtocol(url);

    try {
        const response = await fetch('/api/socialMedia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                button_id: buttonId,
                platform,
                url: formattedUrl, // Use the formatted URL
                color1,
                color2,
                direction,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to save social media button. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Button saved:', data);

        // Call a function to dynamically create the button on the UI
        createSocialMediaButtonUI(platform, formattedUrl, direction, color1, color2, buttonId);

        // Call showMessage for success
        showMessage('Button saved successfully!', 'success');
    } catch (error) {
        if (response && response.status === 500) {
            // Server-side error
            showMessage('Internal Server Error. Please try again later.', 'warning');
        } else {
            showMessage('Failed to create button. Please try again.', 'error');
        }
    }
}

// Function to save a new social media button
async function updateSocialMediaButton() {
    const userId = await getUserId();
    if (!userId) {
        console.error('User ID not available');
        return;
    }

    const buttonId = document.getElementById('btn_id').value;
    if (!buttonId) {
        console.error('Button ID not available');
        return;
    }

    const { platform, direction, color1, color2, url } = getFormValues();

    // Check if URL is not empty and is valid
    if (!url || !isValidUrl(url)) {
        console.error('Invalid or empty URL');
        return;
    }

    // Format URL with protocol
    const formattedUrl = formatUrlWithProtocol(url);

    try {
        console.log('Sending PUT request to:', `/api/socialMedia/${userId}/${buttonId}`);

        const response = await fetch(`/api/socialMedia/${userId}/${buttonId}`, {
            method: 'PUT', // Use PUT for updates
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                button_id: buttonId,
                platform,
                url: formattedUrl,
                color1,
                color2,
                direction,
            }),
        });

        console.log('PUT request completed. Response:', response);

        if (!response.ok) {
            throw new Error(`Failed to update social media button. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Button updated:', data);

        // Call a function to dynamically update the button on the UI
        updateSocialMediaButtonUI(buttonId);

        // Call showMessage for success
        showMessage('Button updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating button:', error);
        // Handle errors as needed
        showMessage('Failed to update button. Please try again.', 'error');
    }
}


// Modified getButtonId function
async function getButtonId() {
    return new Promise((resolve) => {
        const checkForButtonId = async () => {
            let container = document.querySelector('.editing');

            if (container && container.dataset && container.dataset.button_id) {
                resolve(container.dataset.button_id);
            } else {
                // Fetch the button ID before retrying
                await sleep(100); // Add a delay to avoid excessive checks
                requestAnimationFrame(checkForButtonId);
            }
        };

        // Start checking for the button ID
        checkForButtonId();
    });
}


// Function to introduce a delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}





// Function to delete an existing social media button
async function deleteSocialMediaButton() {
    console.log('running the function: deleteSocialMediaButton()')
    try {
        const buttonId = document.getElementById('btn_id').value;
        if (!buttonId) {
            console.error('Button ID not available');
            showMessage('Failed to delete, ID not found', 'error');
            return;
        }

        // Make an HTTP DELETE request to the server
        const response = await fetch(`/api/socialMedia/${buttonId}`, { method: 'DELETE' });
        console.log(response); // Add this line

        if (response.ok) {

            deleteSocialMediaButtonUI();

            // Button deleted successfully
            console.log('Button deleted from the server.');
            showMessage('Button deleted successfully!', 'success');
            closeCustomizeElementModal();
        } else if (response.status === 500) {
            console.log('Deletion unsuccessful.');
            showMessage('Failed to delete the button due to a server error', 'warning');
        } else {
            console.error('Failed to delete the button.');
            showMessage('Failed to delete.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('An error occurred while deleting the button', 'error');
    }
}




// Helper functions

// Function to check and modify URL to include a protocol
function formatUrlWithProtocol(url) {
    // Check if the URL starts with 'www.' and prepend 'https://' if true
    if (url.startsWith('www.')) {
        return 'https://' + url;
    }

    // Check if the URL starts with 'http://' or 'https://'
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url; // No modification needed, already has a protocol
    }

    // If none of the above, assume 'https://' and prepend it
    return 'https://' + url;
}

function isValidUrl(string) {
    try {
        // If the URL doesn't have a protocol, add 'https://'
        if (!string.startsWith('http://') && !string.startsWith('https://')) {
            string = 'https://' + string;
        }

        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}



// display of buttons on the UI




// Function to create a social media button and render it
function createAndRenderSocialMediaButton(platform, url, direction, color1, color2, button_id) {
    const newSocialMediaButton = createSocialMediaButtonUI(platform, url, direction, color1, color2, button_id);

    // Check if newSocialMediaButton is a valid node
    if (newSocialMediaButton && newSocialMediaButton instanceof Node) {
        // Check if the button is not already a child node
        const socialLinksDynamic = document.getElementById('social-links-dynamic');
        if (!socialLinksDynamic.contains(newSocialMediaButton)) {
            // Add the button to your page or container
            socialLinksDynamic.appendChild(newSocialMediaButton);
        }
    } else {
        console.error('Failed to create and render social media button. createSocialMediaButtonUI returned:', newSocialMediaButton);
    }
}



// Function to display user's social media buttons
async function displayUserSocialMediaButtons() {
    const userId = await getUserId(); // Assuming you have a function to get the user ID

    if (userId) {
        const response = await fetch(`/api/socialMedia/${userId}`);
        if (response.ok) {
            const socialMediaButtons = await response.json();
            const socialLinksDynamic = document.getElementById('social-links-dynamic');

            socialMediaButtons.forEach(button => {
                // Create a social media button with the specific button_id from the database
                const newSocialMediaButton = createSocialMediaButtonUI(
                    button.platform,
                    button.url,
                    button.direction,
                    button.color1,
                    button.color2,
                    button.button_id
                );

                if (newSocialMediaButton) {
                    // Add the button to your page or container
                    socialLinksDynamic.appendChild(newSocialMediaButton);
                } else {
                    console.error('Failed to create social media button for buttonId:', button.button_id);
                }
            });
        } else {
            console.error('Failed to fetch user social media buttons.');
        }
    }
}

// Helper functions

function clearEditingClass() {
    const socialButtons = document.querySelectorAll()

    socialButtons.forEach(button => {
        button.classList.remove('editing');
    })
}


// Event listener for page load
window.addEventListener('load', (event) => {
    // Display user's social media buttons when the page loads
    displayUserSocialMediaButtons();

    // Other event listeners or actions as needed
});



// Function to generate a unique integer ID
function generateUniqueId() {
    // This example assumes a maximum ID range of 1 to 100000
    return Math.floor(Math.random() * 100000) + 1;
}