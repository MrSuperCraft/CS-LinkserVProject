// Custom event to track fetch completion
const fetchCompletedEvent = new Event('fetchCompleted');

// Flag for the amount of fetch completions
let totalFetches = 4; // Adjusted total fetch count to 4

// Flag to track if all fetches are completed
let allFetchesCompleted = false;

// Fetches a URL and returns a promise that resolves with the response. If an error occurs while making the request, it rejects
let completedFetches = 0;

// Function to fetch data and dispatch fetchCompletedEvent when done
async function fetchData(url) {
    try {
        const response = await fetch(url);
        console.log(`Fetching data from ${url}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            handleFetchCompletion();
            return await response.json();
        } else {
            handleFetchCompletion();
            return await response.blob();
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
    }
}

// Function to handle fetch completion
// Function to handle fetch completion
function handleFetchCompletion() {
    if (!allFetchesCompleted) { // Check if all fetches are not yet completed
        completedFetches++;
        console.log('Current amount of completed fetches:', completedFetches);

        // Check if all fetches for new users or user pages without content are completed
        if (completedFetches === totalFetches - 1) { // Adjusted condition for 3 fetches
            allFetchesCompleted = true;
            checkLoadingState();
        }
    }
}

// Function to check loading state and remove loading screen if all conditions are met
function checkLoadingState() {
    if (allFetchesCompleted && document.readyState === 'complete') {
        fadeOutLoadingScreen();
    }
}

// Function to fade out the loading screen
function fadeOutLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    loadingScreen.classList.add('fade-out');

    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 1000);
}


// Event listener to handle fetchCompletedEvent
document.addEventListener('fetchCompleted', handleFetchCompletion);

// Event listener for window.onload event to ensure all content is loaded before fading out the loading screen
window.addEventListener('load', function () {
    console.log('Window loaded completely');
    checkLoadingState();
});
