// Add script to show dynamic content based on the path
document.addEventListener('DOMContentLoaded', function () {
  const pathSegments = window.location.pathname.split('/');
  let username = '';
  // Check if the path is /design or /design/user
  if (pathSegments.length === 3 && pathSegments[1] === 'design') {
    username = pathSegments[2];
  } else if (pathSegments.length === 2 && pathSegments[1] === 'design') {
    // Handle the case of /design without a username
    // Set a default or show an error message
    username = 'Guest';
  }

  document.getElementById('dynamicUsername').innerText = username;
});

// Event delegation to handle dynamically created buttons
document.getElementById('button-container').addEventListener('click', function (event) {
  if (event.target.tagName === 'BUTTON') {
    let selectedPreset = currentPreset; // Assign the preset based on your logic
    applyPresetBtn(selectedPreset); // Apply the selected preset
  }
});

function updateLink() {
  const buttonName = document.getElementById('button-Name').value;
  const buttonURL = document.getElementById('button-URL').value;

  const dynamicButton = document.querySelector('.custom-button.dynamic');

  if (dynamicButton) {
    // Update the button text with the provided buttonName
    dynamicButton.innerText = buttonName;

    // Store the updated button text in the global variable
    updatedButtonText = buttonName;

    console.log('Updating link with:', buttonName, buttonURL);

    // Check if the edit icon is already present in the button
    const editIcon = dynamicButton.querySelector('.edit-icon');
    if (!editIcon) {
      // If not, create and append the edit icon to the button
      const newEditIcon = document.createElement('span');
      newEditIcon.innerHTML = '&#9998;'; // Edit icon (pencil)
      newEditIcon.className = 'edit-icon';
      newEditIcon.style.visibility = 'hidden';
      newEditIcon.style.position = 'absolute';
      newEditIcon.style.right = '5px';

      // Show the edit icon on button hover
      dynamicButton.addEventListener('mouseenter', function () {
        newEditIcon.style.visibility = 'visible';
      });

      // Hide the edit icon when not hovering over the button
      dynamicButton.addEventListener('mouseleave', function () {
        newEditIcon.style.visibility = 'hidden';
      });

      newEditIcon.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent the event from reaching the button
        openEditModal(`Edit Link #1`, updatedButtonText, 0);
      });

      dynamicButton.appendChild(newEditIcon);
    } else {
      // If the edit icon is already present, make it visible
      editIcon.style.visibility = 'visible';
    }

    // Call openEditModal with the updatedButtonText
    openEditModal(`Edit Link #1`, updatedButtonText, 0);

    // Optionally, you can perform actions related to the button URL here if needed

    // closeEditModal(); // Commented out to allow for further editing
  } else {
    console.error('Dynamic button not found.');
  }
}

function createDynamicButtons() {
  const container = document.getElementById('button-container');

  // Remove existing dynamic buttons
  container.querySelectorAll('.custom-button.dynamic').forEach(button => button.remove());

  // Create a new dynamic button
  const newButton = document.createElement('button');
  newButton.className = 'custom-button dynamic';

  // Create and configure the edit icon
  const editIcon = document.createElement('span');
  editIcon.innerHTML = '&#9998;'; // Edit icon (pencil)
  editIcon.className = 'edit-icon';
  editIcon.style.visibility = 'hidden';
  editIcon.style.position = 'absolute';
  editIcon.style.right = '5px';

  // Show the edit icon on button hover
  newButton.addEventListener('mouseenter', function () {
    editIcon.style.visibility = 'visible';
  });

  // Hide the edit icon when not hovering over the button
  newButton.addEventListener('mouseleave', function () {
    editIcon.style.visibility = 'hidden';
  });

  editIcon.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent the event from reaching the button
    openEditModal(`Edit Link #1`, newButton.innerText, 0);
  });

  // Make the dynamic button draggable
  newButton.setAttribute('draggable', true);
  newButton.addEventListener('dragstart', handleDragStart);
  newButton.addEventListener('dragover', handleDragOver);
  newButton.addEventListener('drop', handleDrop);

  // Append the button text and edit icon to the button
  newButton.appendChild(document.createTextNode('Default Text'));
  newButton.appendChild(editIcon);

  container.insertBefore(newButton, document.getElementById('addButton'));

  // Add other button-related logic as needed
}

// Call the function on page load to create dynamic buttons
window.addEventListener('load', function () {
  applyPreset('defaultPreset');
  createDynamicButtons(); // Add this line to create buttons
});