// Global Variables
let currentPreset = 'defaultPreset'; // Set the default preset name initially


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



// Event delegation to handle dynamically created buttons
document.getElementById('button-container').addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON') {
      let selectedPreset = currentPreset; // Assign the preset based on your logic
      applyPreset(selectedPreset); // Apply the selected preset
  }
});


// Adding Buttons Function


let buttonCount = 0;
let draggedButton = null;

function createButton(presetName) {
  const container = document.getElementById('button-container');
  const newButton = document.createElement("button");
    
  newButton.addEventListener('dragstart', handleDragStart);
  newButton.addEventListener('dragover', handleDragOver);
  newButton.addEventListener('drop', handleDrop);

  buttonCount++;
  newButton.innerText = `Link #${buttonCount}`;
  newButton.className = "custom-button";
  newButton.draggable = true;

  const currentPreset = presetName || 'defaultPreset'; // Use the provided preset or default

  const styles = presets[currentPreset];
  if (styles) {
    for (const property in styles) {
      if (property !== 'presetName' && property !== 'bgColor') {
        newButton.style[property] = styles[property];
      } else if (property === 'bgColor') {
        background.style.background = styles[property];
      }
    }

    console.log(`Button created with ${currentPreset} preset:`, styles);

    container.appendChild(newButton);
    container.style.marginTop = "100px";
    container.appendChild(document.getElementById("addButton"));
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




