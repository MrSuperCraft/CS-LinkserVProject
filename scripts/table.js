// table.js

let contactSubmissions = [];


document.addEventListener('DOMContentLoaded', function () {
    // Initial number of users to display
    const initialUsersCount = 10;

    // Add event listeners for menu items
    document.getElementById('usersMenu').addEventListener('click', function () {
        fetchUsers(initialUsersCount);
    });

    document.getElementById('contactMenu').addEventListener('click', function () {
        fetchContactSubmissions();
    });

    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Load initial section based on hash or a default section
    handleHashChange();
});

async function fetchUsers(usersCount) {
    try {
        const response = await fetch(`/api/users?count=${usersCount}`);
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

    // Check if there are more users to load
    const loadMoreButton = document.getElementById('loadMoreButton');
    if (loadMoreButton) {
        loadMoreButton.style.display = users.length >= 10 ? 'block' : 'none';
    }
}

function loadMoreUsers() {
    // Get the current number of displayed users
    const currentUsersCount = document.querySelectorAll('#userTable tbody tr').length;

    // Load 10 more users
    fetchUsers(currentUsersCount + 10);
}

async function fetchCompletedTasks() {
    try {
        const response = await fetch('/api/completed-tasks');
        const completedTasks = await response.json();

        if (completedTasks.error) {
            console.error('Error fetching completed tasks:', completedTasks.error);
            return;
        }

        // Logging only the count of completed tasks instead of the entire array
        console.log('Completed Tasks Count:', completedTasks.length);

        // Update the UI with the completed tasks
        updateContactSubmissions(completedTasks);
    } catch (error) {
        console.error('Error fetching completed tasks:', error);
    }
}

async function fetchInProgressTasks() {
    try {
        const response = await fetch('http://localhost:3000/api/in-progress-tasks');
        if (!response.ok) {
            throw new Error(`Error fetching in-progress tasks: ${response.statusText}`);
        }
        const inProgressTasks = await response.json();

        // Update the UI with the in-progress tasks
        updateContactSubmissions(inProgressTasks);
    } catch (error) {
        console.error(error.message);
    }
}

async function fetchContactSubmissions() {
    try {
        const response = await fetch(`/api/contact-submissions`);
        const submissions = await response.json();

        // Update the global contactSubmissions array with the fetched data
        contactSubmissions = submissions;

        // Call a function to update the UI with the filtered submissions
        updateContactSubmissions(submissions);
    } catch (error) {
        console.error('Error fetching contact submissions:', error);
    }
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
    const contactSection = document.querySelector('.dynamic-contact');
    // Clear existing contact cards
    contactSection.innerHTML = '';

    // Iterate through each contact submission and add a card to the section
    contactSubmissions.forEach(submission => {
        const card = document.createElement('div');
        card.classList.add('card-content');

        const taskId = submission.id;
        // Use the topic as the title if available, otherwise use a default
        const title = submission.title || submission.topic || 'Untitled';

        // Render the card
        card.innerHTML = `
        <div class="card-header">
            <h3>${title}</h3>
            <p>From: ${submission.email} - ${submission.name || 'Anonymous'}</p>
            <p>${submission.message}</p>
            <p>Status: ${submission.status}</p>
        </div>
        <div class="task-buttons">
            <button onclick="updateTaskStatusAndFetch(${taskId} , 'Completed')">
                <i class="fas fa-check"></i> Add Completed Tag
            </button>
            <button onclick="updateTaskStatusAndFetch(${taskId}, 'Pending')">
                <i class="fas fa-times"></i> Remove Completed Tag
            </button>
            <button id="trash-btn" onclick="deleteTask(${taskId})">
                <i class="fas fa-trash"></i> Delete Task
            </button>
        </div>
        `;


        contactSection.appendChild(card);
    });
}

async function getContactSubmissionDetails(submissionId) {
    try {
        const response = await fetch(`/api/card/${submissionId}`);
        const submissionDetails = await response.json();
        console.log(submissionDetails);
        return submissionDetails;
    } catch (error) {
        console.error('Error fetching individual contact submission details:', error);
        throw error;
    }
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


// Update the refreshTable function
async function refreshTable() {
    console.log('Refreshing table...');

    // Show loading spinner during the fetch process
    showLoadingSpinner();
    toggleTableLoadingState(true);

    try {
        // Fetch updated user data
        const response = await fetch('/api/users');
        const users = await response.json();

        // Call the function to update the table with the retrieved user data
        updateUsersTableDynamic(users);
    } catch (error) {
        console.error('Error refreshing table:', error);
    } finally {
        // Hide the loading spinner after the table is updated or if an error occurs
        hideLoadingSpinner();
        toggleTableLoadingState(false);
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




function toggleTableLoadingState(loading) {
    const tableContainer = document.querySelector('.table-container');
    if (loading) {
        tableContainer.classList.add('loading');
    } else {
        // Delay the removal of the loading class to allow the animation to complete
        setTimeout(() => {
            tableContainer.classList.remove('loading');
        }, 500); // Adjust the delay time based on your transition duration
    }
}

// Function to update the status of a task and fetch the updated task list based on the active filter
async function updateTaskStatusAndFetch(taskId, newStatus) {
    try {
        // Update the status
        const updateResponse = await fetch('/api/update-task-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                taskId: taskId,
                newStatus: newStatus,
            }),
        });

        const updateData = await updateResponse.json();

        if (!updateResponse.ok) {
            console.error('Error updating task status:', updateData.error);
            return;
        }

        console.log(updateData.message);

        // Determine the active filter based on the "pressed" class
        const completedButton = document.querySelector('.tag-button.completed');
        const inProgressButton = document.querySelector('.tag-button.in-progress');
        const allTasksButton = document.querySelector('#allTasksButton');

        if (completedButton && completedButton.classList.contains('pressed')) {
            fetchCompletedTasks();
            console.log('completed tasks');
        } else if (inProgressButton && inProgressButton.classList.contains('pressed')) {
            fetchInProgressTasks();
            console.log('in progress tasks');
        } else if (allTasksButton && allTasksButton.classList.contains('pressed')) {
            fetchContactSubmissions();
            console.log('all')
        } else {
            // Default to fetching all tasks if no specific filter is active
            fetchContactSubmissions();
        }

    } catch (error) {
        console.error('Error updating task status:', error);
    }
}

// Function to delete task
async function deleteTask(taskId) {
    try {
        const response = await fetch(`/api/delete-task/${taskId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete task: ${response.statusText}`);
        }

        // Fetch and update contact submissions after deleting the task
        fetchContactSubmissions();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    // Add event listener for tag buttons
    document.querySelectorAll('.tag-button').forEach(function (button) {
        button.addEventListener('click', function () {
            // Remove "completed" class from all buttons
            document.querySelectorAll('.tag-button.pressed').forEach(function (completedButton) {
                completedButton.classList.remove('pressed');
            });

            // Remove "in-progress" class from all buttons
            document.querySelectorAll('.tag-button.in-progress').forEach(function (inProgressButton) {
                inProgressButton.classList.remove('in-progress');
            });

            // Toggle the appropriate class based on button click
            if (button.classList.contains('pressed')) {
                button.classList.add('in-progress');
            } else {
                button.classList.add('pressed');
            }
        });
    });
});