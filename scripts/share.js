// Extract username from the URL
const username = window.location.pathname.split('/').pop();


// Get the user ID from the route
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

// Add a flag to track whether buttons are loaded
let buttonsLoaded = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('share-dynamic-text').innerText = `Share ${username}'s LinkserV`
})


async function openInfoModal() {
    const infoModal = document.getElementById('infoModal');
    infoModal.style.display = 'block';

    // Fetch user information when opening the modal
    const userId = await getUserId();
    fetch(`/api/UserInfo/${userId}`)
        .then(response => response.json())
        .then(data => {
            const pageInfoTextarea = document.getElementById('pageInfo');
            pageInfoTextarea.value = data.pageInfo || '';
            updateInfo();
        })
        .catch(error => {
            console.error('Error fetching user information:', error);
        });

}

function closeInfoModal() {
    const infoModal = document.getElementById('infoModal');
    infoModal.style.display = 'none';
}

async function saveInfoChanges() {
    const userId = await getUserId();
    const pageInfoTextarea = document.getElementById('pageInfo');
    const pageInfo = pageInfoTextarea.value;

    // Make a Fetch API request to save data to the server
    fetch('/api/UserInfo/Change', {  // Update the URL to match your server route
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            pageInfo: pageInfo
        })
    })
        .then(response => response.json())
        .then((data) => {
            showMessage('Page info saved successfully!', 'success')
            console.log('Data saved successfully:', data);
            closeInfoModal(); // Optionally, close the modal after saving
        })
        .catch(error => {
            showMessage('An error has occured when trying to save the info. Please try again.', 'error')
            console.error('Error saving data:', error);
        });
}



function openShareModal() {
    const shareModal = document.getElementById('shareModal');
    shareModal.style.display = 'block';

    // Load dynamic buttons only if not loaded before
    if (!buttonsLoaded) {
        loadDynamicShareButtons(username);
        // Set the flag to true after loading buttons
        buttonsLoaded = true;
    }
}

function closeShareModal() {
    const shareModal = document.getElementById('shareModal');
    shareModal.style.display = 'none';
}

// Close modals if the user clicks outside the modal content
window.onclick = function (event) {
    const modals = document.getElementsByClassName('modal');
    for (var i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = 'none';
        }
    }
};


function loadDynamicShareButtons(username) {
    const platforms = ['facebook', 'twitter', 'whatsapp', 'linkedin', 'email'];
    const shareModalContent = document.getElementById('shareModalContent');

    platforms.forEach(function (platform) {
        const button = document.createElement('button');
        button.className = 'share-button ' + platform;

        // Create an icon element
        const icon = document.createElement('span');
        icon.className = 'icon ' + getFontAwesomeClass(platform);
        button.appendChild(icon);

        // Set button text
        button.appendChild(document.createTextNode('Share on ' + platform.charAt(0).toUpperCase() + platform.slice(1)));

        // Dynamically set the href attribute based on the user's page address
        const userPageAddress = 'http://localhost:3000/' + username; // Adjust the URL structure as needed
        button.setAttribute('data-href', getShareLink(userPageAddress, platform));

        button.onclick = function () {
            shareOnPlatform(platform);
        };

        shareModalContent.appendChild(button);
    });

    // Get the URL address span element
    const urlAddressSpan = document.getElementById('url-address');

    // Set the dynamic URL address
    const dynamicURL = `https://localhost:3000/${username}`;
    urlAddressSpan.textContent = dynamicURL;
}

function shareOnPlatform(platform) {
    const platformURL = getPlatformURL(platform, username);
    if (platformURL !== '') {
        window.open(platformURL, '_blank');
    } else {
        console.error('Unsupported platform: ' + platform);
    }
}

// New function to get the Font Awesome class for each platform
function getFontAwesomeClass(platform) {
    switch (platform) {
        case 'facebook':
            return 'fab fa-facebook';
        case 'twitter':
            return 'fab fa-twitter';
        case 'whatsapp':
            return 'fab fa-whatsapp';
        case 'linkedin':
            return 'fab fa-linkedin';
        case 'email':
            return 'fas fa-envelope';
        default:
            return 'fab fa-share'; // Default icon
    }
}

function getPlatformURL(platform, username) {
    switch (platform) {
        case 'facebook':
            return `https://www.facebook.com/sharer/sharer.php?u=http://localhost:3000/${username}`;
        case 'twitter':
            return `https://twitter.com/intent/tweet?url=http://localhost:3000/${username}&text=Check out this page on LinkserV!`;
        case 'whatsapp':
            return `https://api.whatsapp.com/send?text=Check out this page on LinkserV: http://localhost:3000/${username}`;
        case 'linkedin':
            return `https://www.linkedin.com/shareArticle?url=http://localhost:3000/${username}`;
        case 'email':
            const emailSubject = `${username}'s LinkserV`;
            const emailBody = `Check out this LinkserV: http://localhost:3000/${username}`;
            return `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        default:
            return '';
    }
}

function getShareLink(userPageAddress, platform) {
    switch (platform) {
        case 'facebook':
            return getPlatformURL('facebook', username);
        case 'twitter':
            return getPlatformURL('twitter', username);
        case 'whatsapp':
            return getPlatformURL('whatsapp', username);
        // Add more cases for other platforms
        default:
            return '';
    }
}

// Function to copy the URL to the clipboard
function copyLinkToClipboard() {
    // Get the URL address span element
    const urlAddressSpan = document.getElementById('url-address');

    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = urlAddressSpan.textContent;
    document.body.appendChild(tempInput);

    // Select the input content
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text to the clipboard
    document.execCommand('copy');

    // Remove the temporary input
    document.body.removeChild(tempInput);

    // Change the innerText of the button to "Copied!" in green
    const copyStatusSpan = document.getElementById('copyStatus');
    copyStatusSpan.innerText = 'Copied!';
    copyStatusSpan.style.color = '#4CAF50'; // Green color

    // Reset the innerText after 2 seconds (adjust the duration as needed)
    setTimeout(() => {
        copyStatusSpan.innerText = 'Copy';
        copyStatusSpan.style.color = ''; // Reset the color to default
    }, 2000);
}


function updateInfo() {
    const pageInfoTextarea = document.getElementById('pageInfo');
    const updatedInfo = pageInfoTextarea.value;

    // Display the updated info in the preview section
    const previewInfo = document.getElementById('previewInfo');
    previewInfo.innerHTML = updatedInfo; // Change .textContent to .innerHTML

    // Show the preview section
    const previewSection = document.getElementById('previewSection');
    previewSection.style.display = 'block';


}


const textarea = document.getElementById('pageInfo');

function charCount() {
    const textarea = document.querySelector('#infoModalContent #pageInfo');
    const charCount = document.querySelector('#infoModalContent .char-count');
    const maxLength = parseInt(textarea.getAttribute('maxlength'));

    textarea.addEventListener('input', function () {
        let currentLength = textarea.value.length;

        if (currentLength > maxLength) {
            textarea.value = textarea.value.slice(0, maxLength);
            currentLength = maxLength;
        }

        charCount.textContent = `${currentLength}/${maxLength}`;

        textarea.style.height = 'auto'; // Reset the height
        textarea.style.height = (textarea.scrollHeight) + 'px';
    });

    // Ensure the textarea starts with a correct character count
    charCount.textContent = `0/${maxLength}`;
}



// Functions to handle the dynamic change of text inside the preview element, to show links, proper line usage etc.
document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('pageInfo');
    const previewInfoDiv = document.getElementById('previewInfo');

    textarea.addEventListener('input', function () {
        const content = textarea.value;

        // Regular expression to find URLs in the text
        const urlRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:[^\s]*)?)/g;

        // Replace URLs with clickable links
        const formattedContent = content.replace(urlRegex, function (url) {
            // Check if the URL starts with 'http'
            const href = url.startsWith('https') ? url : 'https://' + url;
            return `<a href="${href}" target="_blank" style="color: #3498db">${url}</a>`;
        });

        // Set the innerHTML of the previewInfoDiv
        previewInfoDiv.innerHTML = formattedContent;
    });
});