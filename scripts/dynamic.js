// Add script to show dynamic content based on the path
document.addEventListener('DOMContentLoaded', function () {
    const pathSegments = window.location.pathname.split('/');
    let username = ''
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
  
      // Dynamically get the button text when opening the modal
      const buttonText = event.target.innerText;
    }
  });

  function updateLink() {
    const buttonName = document.getElementById('button-Name').value;
    const buttonURL = document.getElementById('button-URL').value;
  
    const dynamicButton = document.querySelector('.custom-button.dynamic');
    
    if (dynamicButton) {
      const buttonTextElement = dynamicButton.innerText;
  
      if (buttonTextElement) {
        console.log('Updating link with:', buttonName, buttonURL);
  
        buttonTextElement.innerText = buttonName; // Update button text
  
        // Update stored values
        localStorage.setItem('buttonText', buttonName);
        localStorage.setItem('buttonURL', buttonURL);
  
        closeEditModal();
      } else {
        console.error('Button text element not found.');
      }
    } else {
      console.error('Dynamic button not found.');
    }
  }
  
  

  function retrieveStoredValues() {
    const storedButtonText = localStorage.getItem('buttonText');
    const storedButtonURL = localStorage.getItem('buttonURL');
  
    console.log('Retrieved values:', storedButtonText, storedButtonURL);
  
    return {
      buttonText: storedButtonText,
      buttonURL: storedButtonURL,
    };
  }

  function createDynamicButtons() {
    const container = document.getElementById('button-container');
  
    // Remove existing dynamic buttons
    container.querySelectorAll('.custom-button.dynamic').forEach(button => button.remove());
  
    // Retrieve stored values
    const storedValues = retrieveStoredValues();
  
    // Create a new dynamic button with editIcon
    const newButton = document.createElement('button');
    newButton.className = 'custom-button dynamic';
    newButton.innerText = storedValues.buttonText || 'Default Text';
  
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
      openEditModal(`Edit Link #${buttonCount}`, storedValues.buttonText);
    });
  
    newButton.appendChild(editIcon);
  
    // Make the dynamic button draggable
    newButton.setAttribute('draggable', true);
    newButton.addEventListener('dragstart', handleDragStart);
    newButton.addEventListener('dragover', handleDragOver);
    newButton.addEventListener('drop', handleDrop);
  
    container.insertBefore(newButton, document.getElementById('addButton'));
  
    // Add other button-related logic as needed
  }
  
  



  // Call the function on page load to retrieve stored values and create dynamic buttons
  window.addEventListener('load', function() {
    applyPreset('defaultPreset');
    retrieveStoredValues(); // Add this line to retrieve values
    createDynamicButtons(); // Add this line to create buttons
  })