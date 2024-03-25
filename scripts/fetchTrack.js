// Custom event to track fetch completion
const fetchCompletedEvent = new Event('fetchCompleted');

// Flag for the amount of fetch completions
let totalFetches = 5;

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


// Function to fade out the loading screen when all fetches are complete
function handleFetchCompletion() {
    completedFetches++;
    if (completedFetches === totalFetches) {
        fadeOutLoadingScreen();
    }

    console.log('current amount of completed fetchings:', completedFetches);
}

// Function to fade out the loading screen
function fadeOutLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');

    // After a delay, remove the loading screen from the DOM
    setTimeout(() => {
        // Add a class to trigger the fade-out animation
        loadingScreen.classList.add('fade-out');

    }, 1500); // Adjust the duration as needed

    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 2000);
}



// Event listener to handle fetchCompletedEvent
document.addEventListener('fetchCompleted', handleFetchCompletion);
