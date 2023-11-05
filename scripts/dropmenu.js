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

function createButton() {
  buttonCount++;
  const button = document.createElement("button");
  button.innerText = `Link #${buttonCount}`;
  button.className = "custom-button";
  button.draggable = true;
  button.addEventListener('dragstart', handleDragStart);
  button.addEventListener('dragover', handleDragOver);
  button.addEventListener('drop', handleDrop);

  const container = document.getElementById("button-container");
  container.appendChild(button);
  container.style.marginTop = "100px";
  container.appendChild(document.getElementById("addButton")); // Move addButton to the end

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