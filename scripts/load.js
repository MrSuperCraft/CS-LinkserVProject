async function fetchUserIdFromUrl() {
    // Get the current path of the URL, and find the username from there
    const user_name = getUsernameFromURL();

    try {
        const response = await fetch(`/api/getUserId?username=${user_name}`);
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

function getUsernameFromURL() {
    const pathSegments = window.location.pathname.split('/');
    let username = '';

    if (pathSegments.length === 3 && pathSegments[1] === 'design') {
        // Case 1: URL is /design/${username}
        username = pathSegments[2];
    } else if (pathSegments.length === 2 && pathSegments[1] !== '') {
        // Case 2: URL is /${username}
        username = pathSegments[1];
    } else {
        // Default case or invalid URL structure
        username = 'Guest';
    }

    return username;
}



document.addEventListener('DOMContentLoaded', function () {
    const username = getUsernameFromURL();

    document.getElementById('dynamicUsername').innerText = username;
    document.getElementById('dynamic-nav-text').innerText = username;
});

