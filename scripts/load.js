async function fetchUserIdFromUrl() {
    // Get the current path of the URL, and find the username from there
    const user_name = getUsernameFromURL();

    // Decode the username to replace special characters like "@" and "_" with their original form
    const decodedUsername = decodeURIComponent(user_name);

    try {
        const response = await fetch(`/api/getUserId?username=${decodedUsername}`);
        if (response.ok) {
            const data = await response.json();
            return data.user_id; // Return the user_id from the response data
        } else {
            console.error('Failed to fetch user ID');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user ID:', error);
        return null;
    }
}



async function getUserIdWithFallback() {
    // Attempt to fetch user_id from URL
    const user_id_from_url = await fetchUserIdFromUrl();

    // Check if user_id_from_url is valid (not null or undefined)
    if (user_id_from_url) {
        return user_id_from_url; // Return user_id_from_url if valid
    } else {
        // Fallback to getUserId() if user_id_from_url is not valid
        return await getUserId();
    }
}

/**
 * Retrieves the username from the current URL.
 * Removes specific hash segments (#view, #profile, #presets, #design, #background) from the URL path.
 *
 * @returns {string} The username extracted from the URL.
 */
function getUsernameFromURL() {
    const pathSegments = window.location.pathname.split('/');
    let username = '';

    // Remove specific hash segments from the pathSegments
    const validPathSegments = pathSegments.filter(segment => {
        return !['#view', '#profile', '#presets', '#design', '#background'].includes(segment);
    });

    if (validPathSegments.length === 3 && validPathSegments[1] === 'design') {
        // Case 1: URL is /design/${username}
        username = validPathSegments[2].replace(/_/g, '');
    } else if (validPathSegments.length === 2 && validPathSegments[1] !== '') {
        // Case 2: URL is /${username}
        username = validPathSegments[1].replace(/_/g, '');
    } else {
        // Default case or invalid URL structure
        username = 'Guest';
    }

    console.log(`Username extracted from URL: ${username}`);
    return username;
}



document.addEventListener('DOMContentLoaded', function () {
    const username = getUsernameFromURL();

    const decodedUsername = decodeURI(username);
    const formattedUsername = decodedUsername.replace(/%40/g, '@'); // Replace %40 with @


    document.getElementById('dynamicUsername').innerText = formattedUsername;
    document.getElementById('dynamic-nav-text').innerText = formattedUsername;


    // Get the current URL from window.location
    const currentURL = window.location.href;

    // Decode the URL to remove encoding
    const decodedURL = decodeURI(currentURL);

    // Replace spaces with underscores and other special characters as needed
    const formattedURL = decodedURL.replace(/ /g, '_').replace(/@/g, '@');

    // Replace the URL in the browser's address bar without reloading the page
    history.replaceState(null, '', formattedURL);
});

