async function saveSettings() {
    // Get the selected values of theme and language
    const theme = document.getElementById('themeSelect').value;
    const language = document.getElementById('languageSelect').value;

    // You can continue to use the existing logic for other input elements if needed

    // Initialize an empty array to store settings
    const settings = [
        { setting_name: 'theme', setting_value: theme },
        { setting_name: 'language', setting_value: language },
        // Add more settings as needed
    ];

    try {
        const response = await fetch('http://localhost:3000/api/save-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settings),
        });

        console.log(settings);

        if (response.ok) {
            // Handle success, if needed
            console.log('Settings saved successfully');
        } else {
            // Handle errors, if needed
            console.error('Error saving settings:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error saving settings:', error.message);
    }
}




document.addEventListener('DOMContentLoaded', function () {
    // Add event listener for theme select
    const themeSelect = document.getElementById('themeSelect');
    themeSelect.addEventListener('change', toggleDarkMode);

    // Load initial theme based on user preference
    loadTheme();
});

async function loadTheme() {
    // Check user preference from local storage
    const savedTheme = localStorage.getItem('adminTheme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        // Set the theme selection dropdown to 'dark'
        document.getElementById('themeSelect').value = 'dark';
    }
}

loadTheme();  // Call loadTheme on page load

function toggleDarkMode() {
    const body = document.body;

    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        localStorage.setItem('adminTheme', 'light');
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('adminTheme', 'dark');
    }
}
