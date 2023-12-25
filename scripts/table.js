// table.js

document.addEventListener('DOMContentLoaded', function () {
    // Fetch user data when the page loads
    fetchUsers();

    // Add event listeners for menu items
    document.getElementById('usersMenu').addEventListener('click', function () {
        fetchUsers();
    });

    document.getElementById('contactMenu').addEventListener('click', function () {
        fetchContactSubmissions();
    });

    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Load initial section based on hash
    handleHashChange();
});


async function fetchUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();

        // Call the function to update the table with the retrieved user data
        updateUsersTable(users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function updateUsersTable(users) {
    const tableBody = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear the existing content

    users.forEach(user => {
        const row = tableBody.insertRow();

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.textContent = user.id;
        cell2.textContent = user.email;
        cell3.textContent = user.username;
    });
}


function fetchContactSubmissions() {
    // Fetch contact submissions from the server endpoint
    // Replace '/api/contact-submissions' with your actual endpoint
    fetch('/api/contact-submissions')
        .then(response => response.json())
        .then(contactSubmissions => {
            // Call a function to update the contact submissions section
            updateContactSubmissions(contactSubmissions);
        })
        .catch(error => console.error('Error fetching contact submissions:', error));
}

function updateUsersTableDynamic(users) {
    const tableBody = document.querySelector('#userTable tbody');
    // Clear existing table rows
    tableBody.innerHTML = '';

    // Iterate through each user and add a row to the table
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.email}</td>
            <td>${user.username}</td>
            <!-- Add more cells for additional user data -->
        `;
        tableBody.appendChild(row);
    });
}

function updateContactSubmissions(contactSubmissions) {
    const contactSection = document.querySelector('#contactSection');
    // Clear existing contact cards
    contactSection.innerHTML = '';

    // Iterate through each contact submission and add a card to the section
    contactSubmissions.forEach(submission => {
        const card = document.createElement('div');
        card.classList.add('card-content');

        card.innerHTML = `
            <h3>${submission.subject}</h3>
            <p>${submission.message}</p>
            <!-- Add more details as needed -->
            <button onclick="handleTicketUpdate(${submission.id})">Update</button>
        `;

        contactSection.appendChild(card);
    });
}

function handleTicketUpdate(ticketId) {
    // Implement the logic to handle ticket updates, e.g., show a modal or redirect to a ticket editing page
    console.log(`Update ticket with ID: ${ticketId}`);
}


// Searching & filtering algorithms

function searchUsers() {
    const input = document.getElementById('userSearchInput').value.toLowerCase();
    filterTable('userTable', input);
}

function searchContactSubmissions() {
    const input = document.getElementById('contactSearchInput').value.toLowerCase();
    filterContactSubmissions(input);
}

function filterTable(tableId, input) {
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let found = false;

        for (let j = 0; j < cells.length; j++) {
            const cellValue = cells[j].textContent || cells[j].innerText;

            if (cellValue.toLowerCase().indexOf(input) > -1) {
                found = true;
                break;
            }
        }

        if (found) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}

function filterContactSubmissions(input) {
    const contactCards = document.querySelectorAll('#contactSection .card-content');

    contactCards.forEach(card => {
        const textContent = card.textContent || card.innerText;

        if (textContent.toLowerCase().indexOf(input) > -1) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}


async function refreshTable() {
    const tableContainer = document.querySelector('.table-container');
    const tableLoader = document.getElementById('tableLoader');
    console.log('Refreshing table...');

    // Remove the hide-loader class to make sure the loader is visible
    tableLoader.classList.remove('hide-loader');

    // Show loading spinner during the fetch process
    showLoadingSpinner();

    try {
        // Fetch updated user data
        const response = await fetch('/api/users');
        const users = await response.json();

        // Call the function to update the table with the retrieved user data
        updateUsersTableDynamic(users);
    } catch (error) {
        console.error('Error refreshing table:', error);
    } finally {
        // Hide the loading spinner after the table is updated
        hideLoadingSpinner();
    }
}

function showLoadingSpinner() {
    const refreshIcon = document.getElementById('refreshIcon');
    refreshIcon.classList.add('loading-spinner');
}

function hideLoadingSpinner() {
    const refreshIcon = document.getElementById('refreshIcon');
    refreshIcon.classList.remove('loading-spinner');
}


function loadSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block'; // Or 'flex', 'grid', etc., based on your layout
    }
}

function handleHashChange() {
    // Implement the logic for handling hash changes
    // For example, update the displayed section based on the hash
    const hash = window.location.hash;
    switch (hash) {
        case '#users':
            fetchUsers();
            break;
        case '#contact':
            fetchContactSubmissions();
            break;
        // Add more cases as needed for other sections
        default:
            // Handle default case or do nothing
            break;
    }
}