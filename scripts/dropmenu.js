// Global Variables
let currentPreset = 'defaultPreset'; // Set the default preset name initially
let updatedButtonText = ''; // Add a global variable to store the updated button text


window.addEventListener('load', function() {
  applyPreset('defaultPreset');
});

const menuLinks = document.querySelectorAll('.menu-link');
const menus = document.querySelectorAll('.menu');

// Function to hide all menus smoothly
function hideMenus() {
  menus.forEach(menu => {
    menu.style.height = '0';
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden'; // Hide the menu completely
  });
}

menuLinks.forEach(link => {
  link.addEventListener('click', function() {
    hideMenus();

    // Find the corresponding menu using the link's data-menu attribute
    const dataMenu = link.getAttribute('data-menu');
    const menuToDisplay = document.querySelector(`[data-menu-content="${dataMenu}"]`);
    if (menuToDisplay) {
      menuToDisplay.style.height = '100%'; // Set height to fill the screen
      menuToDisplay.style.opacity = '1';
      menuToDisplay.style.visibility = 'visible'; // Make the menu visible
    }
  });
});

// Handling the "View" button to close the menu
const viewButton = document.getElementById('viewButton');

viewButton.addEventListener('click', function() {
  hideMenus();
});





// Adding Buttons Function


let buttonCount = 0;
let draggedButton = null;

function createButton(presetName) {
  const container = document.getElementById('button-container');
  const newButton = document.createElement("button");
  const editIcon = document.createElement("span"); // Create the edit icon

  newButton.addEventListener('dragstart', handleDragStart);
  newButton.addEventListener('dragover', handleDragOver);
  newButton.addEventListener('drop', handleDrop);

  buttonCount++;
  newButton.innerText = `Link #${buttonCount}`;
  newButton.className = "custom-button";
  newButton.draggable = true;

  // Create and configure the edit icon
  editIcon.innerHTML = "&#9998;"; // Edit icon (pencil)
  editIcon.className = "edit-icon";
  editIcon.style.visibility = "hidden"; // Initially hide the edit icon
  editIcon.style.position = "absolute"; // Set the position to absolute
  // Adjust the icon's right position
  editIcon.style.right = "5px"; // You can adjust this value as needed

  // Show the edit icon on button hover
  newButton.addEventListener('mouseenter', function() {
    editIcon.style.visibility = "visible";
  });

  // Hide the edit icon when not hovering over the button
  newButton.addEventListener('mouseleave', function() {
    editIcon.style.visibility = "hidden";
  });

  editIcon.addEventListener('click', function(event) {
    event.stopPropagation(); // Prevent the event from reaching the button
    openEditModal(`Edit Link #${buttonCount}`, currentPreset);
  });

  document.getElementById('addButton').addEventListener('mousedown', function(event) {
    if (event.target.id === 'addButton') {
      event.preventDefault(); // Prevent the default behavior of the button click
      event.stopPropagation(); // Prevent the event from reaching the button
    }
  });

  // Append the button and edit icon to the container
  newButton.appendChild(editIcon);
  container.appendChild(newButton);
  container.style.marginTop = "100px";
  container.appendChild(document.getElementById("addButton"));

  currentPreset = presetName || 'defaultPreset'; // Use the provided preset or default

  const styles = presets[currentPreset];
  if (styles) {
    for (const property in styles) {
      if (property !== 'presetName' && property !== 'bgColor') {
        newButton.style[property] = styles[property];
      }
    }
  } else {
    console.error(`Preset "${currentPreset}" is not defined.`);
  }
}



function createButtonFromAddButton() {
  createButton(currentPreset);
}

function handleDragStart(event) {
 draggedButton = event.target;
}

function handleDragOver(event) {
 event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    if (draggedButton && draggedButton !== event.target) {
        const container = document.getElementById("button-container");
        const buttons = Array.from(container.getElementsByClassName("custom-button"));
        const fromIndex = buttons.indexOf(draggedButton);
        const toIndex = buttons.indexOf(event.target);

    if (fromIndex >= 0 && toIndex >= 0) {
      if (fromIndex < toIndex) {
        container.insertBefore(draggedButton, event.target.nextSibling);
        } else {
        container.insertBefore(draggedButton, event.target);
      }
    }
    draggedButton = null
  }
  

}


// Bio Text Function + Character

const textarea = document.querySelector('.bioinput');
const charCount = document.querySelector('.char-count');
const maxLength = parseInt(textarea.getAttribute('maxlength'));

textarea.addEventListener('input', function() {
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

// Modify the openEditModal function to use the stored button text
function openEditModal(title, buttonText, buttonIndex) {
  const modal = document.getElementById('editModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modal-text');
  const modalButton = document.getElementById('updateButton');
  const buttonNameInput = document.getElementById('button-Name');

  if (modal && modalTitle && modalText && modalButton && buttonNameInput) {
    // Set dynamic content for editing
    modalText.innerText = `Update this button to your liking!`;
    modalButton.textContent = `Update Button`;

    // Create a temporary div element to handle the button text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = buttonText;

    // Remove any child elements (like the span) from the temporary div
    while (tempDiv.firstChild) {
      tempDiv.removeChild(tempDiv.firstChild);
    }

    // Set the dynamic title
    modalTitle.innerHTML = `${title.replace('#1', '')}${tempDiv.innerText}`;

    // Use the stored button text or default text
    buttonNameInput.value = updatedButtonText || "My Awesome Link!";

    modal.style.display = 'block';

    // Add an event listener to the edit icon inside the modal
    const editIconInModal = document.getElementById('editIconInModal');
    if (editIconInModal) {
      // Check if the editIconInModal exists before adding the event listener
      editIconInModal.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent the event from reaching the button
        openEditModal(`Edit Link #${buttonIndex + 1}`, updatedButtonText, buttonIndex);
      });
    }
  } else {
    console.error('Modal elements not found.');
  }
}

// Modify the handleDragStart function to store the button index
function handleDragStart(event) {
  draggedButton = event.target;
  // Store the button index in a data attribute
  draggedButton.setAttribute('data-button-index', buttonCount - 1);
}

function closeEditModal() {
  const modal = document.getElementById('editModal');
  modal.style.display = 'none';
}
