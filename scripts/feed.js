// Function to show a message in the feed
function showMessage(message, type) {
    const messageFeed = document.getElementById('messageFeed');

    // Create a new message element
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);

    // Set color based on message type
    let color;
    let iconClass;
    switch (type) {
        case 'success':
            color = '#4CAF50'; // Green
            iconClass = 'fas fa-check-circle';
            break;
        case 'error':
            color = '#F44336'; // Red
            iconClass = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            color = '#FFC107'; // Yellow
            iconClass = 'fas fa-exclamation-triangle';
            break;
        default:
            color = '#333'; // Default color
            iconClass = 'fas fa-info-circle';
    }

    messageElement.style.backgroundColor = color;

    // Create a span for the icon
    const iconElement = document.createElement('span');
    iconElement.classList.add('message-icon');
    iconElement.innerHTML = `<i class="${iconClass}"></i>`;

    // Add the icon and message to the message element
    messageElement.appendChild(iconElement);
    messageElement.innerHTML += message;

    // Add the message to the feed
    messageFeed.appendChild(messageElement);

    // Show the message with a slight delay for a smooth transition
    setTimeout(() => {
        messageElement.style.opacity = 1;
        // Scroll the feed to the bottom to show the latest messages
        messageFeed.scrollTop = messageFeed.scrollHeight;
    }, 100);

    // Automatically hide messages after a certain time (adjust as needed)
    setTimeout(() => {
        messageElement.style.opacity = 0;
        // Remove the message element after the fade out effect
        setTimeout(() => {
            messageElement.remove();
        }, 300);
    }, 5000);
}

/* 
* Example of using the showMessage function for different types
* showMessage('Button created successfully!', 'success');
* showMessage('Button not found!', 'error');
* showMessage('Internal Server Error!', 'warning');
*
*/

/* Testing purposes only
document.addEventListener('DOMContentLoaded', () => {
    showMessage('hello world', 'success');
    showMessage('Button not found!', 'error');
    showMessage('Internal Server Error!', 'warning');
}) 
*/