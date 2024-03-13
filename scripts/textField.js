// from addElement.js


function closeCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'none';

}

function openCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'block';
}

function showTextFieldSection() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('socialMediaEditSection').style.display = 'none';
    document.getElementById('textFieldSection').style.display = 'block';
    document.getElementById('buttonSection').style.display = 'none';

}








/*

// Function to handle direct text formatting
function formatText(style) {
    document.execCommand(style, false, null);
}

// Function to handle selected text formatting
function formatSelectedText(style, value = '') {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        var span = document.createElement('span');
        span.style[style] = value;
        range.surroundContents(span);
    }
}

// Function to change text color (for selected text)
function changeTextColor() {
    var color = prompt('Enter text color:');
    if (color !== null) {
        formatSelectedText('color', color);
    }
}

// Function to change background color (for selected text)
function changeBackgroundColor() {
    var color = prompt('Enter background color:');
    if (color !== null) {
        applyBackgroundColor(color);
    }
}

// Function to change font family
// Updated function to change font independently
function changeFont(fontFamily) {
    document.getElementById('editor').style.fontFamily = fontFamily;
    updatePreview();
}

// Populate the font select dropdown
function populateFontSelect() {
    var fontSelect = document.getElementById('fontSelect');
    var fontOptions = [
        'Poppins', 'Roboto', 'Open Sans', 'Montserrat', 'Lato', 'Raleway',
        'Nunito', 'Ubuntu', 'Source Sans Pro', 'Playfair Display', 'Merriweather',
        'Pacifico', 'Quicksand', 'Oswald', 'Roboto Condensed', 'Roboto Slab',
        'Dancing Script', 'Crimson Text', 'Roboto Mono', 'Lora', 'Bebas Neue',
        'Yanone Kaffeesatz', 'Arvo', 'Archivo', 'Anton', 'Cabin', 'Fira Sans',
        'Bitter', 'Old Standard TT', 'Lobster', 'Noto Sans', 'Dosis', 'Inconsolata',
        'Muli', 'Titillium Web', 'Baloo', 'Catamaran', 'Patua One', 'Exo',
        'Pacifico', 'Rajdhani', 'Roboto Slab', 'Overpass', 'Abril Fatface',
        'Source Code Pro', 'Cabin Sketch', 'Lobster Two', 'Archivo Narrow',
        'Quattrocento', 'Fjalla One', 'Roboto Slab', 'Barlow'
    ];

    fontOptions.forEach(function (font) {
        var option = document.createElement('option');
        option.value = font;
        option.text = font;
        fontSelect.add(option);
    });
}

// Call the function to populate font select on page load
document.addEventListener('DOMContentLoaded', populateFontSelect);


// Function to update the preview
function updatePreview() {
    var editorContent = document.getElementById('editor').innerHTML;

    // Create a temporary div to apply the font-family style
    var tempDiv = document.createElement('div');
    tempDiv.style.fontFamily = window.getComputedStyle(document.getElementById('editor')).fontFamily;
    tempDiv.innerHTML = editorContent;

    // Set the preview content with the temporary div's content
    document.getElementById('preview').innerHTML = tempDiv.innerHTML;
}




function changeFontSize(action) {
    var editor = document.getElementById('editor');
    var selection = window.getSelection();

    if (selection.isCollapsed) {
        // No specific part is selected, change the font size for the entire text
        var currentSize = parseInt(window.getComputedStyle(editor).fontSize);
        editor.style.fontSize = (action === 'increase') ? (currentSize + 2) + 'px' :
            (currentSize - 2) + 'px';
    } else {
        // Change the font size for the selected part
        var range = selection.getRangeAt(0);
        var container = range.commonAncestorContainer;

        // Create a span element for the new font size
        var span = document.createElement('span');
        span.style.fontSize = (action === 'increase') ? 'larger' : 'smaller';

        // Preserve the existing font family for the span
        span.style.fontFamily = window.getComputedStyle(editor).fontFamily;

        // Create a document fragment to hold the changes
        var fragment = document.createDocumentFragment();

        // Iterate through the selected range and apply changes to spans
        for (var node of range.cloneContents().childNodes) {
            var clonedSpan = span.cloneNode(true);
            clonedSpan.appendChild(node.cloneNode(true));
            fragment.appendChild(clonedSpan);
        }

        // Replace the selected content with the modified fragment
        range.deleteContents();
        range.insertNode(fragment);

        // Clear the selection to prevent unwanted behavior
        selection.removeAllRanges();
    }

    updatePreview();
}


*/

document.addEventListener("DOMContentLoaded", function () {

    let optionsButtons = document.querySelectorAll(".option-button");
    let advancedOptionButton = document.querySelectorAll(".adv-option-button");
    let fontName = document.getElementById("fontName");
    let fontSizeRef = document.getElementById("fontSize");
    let writingArea = document.getElementById("text-input");
    let linkButton = document.getElementById("createLink");
    let alignButtons = document.querySelectorAll(".align");
    let spacingButtons = document.querySelectorAll(".spacing");
    let formatButtons = document.querySelectorAll(".format");
    let scriptButtons = document.querySelectorAll(".script");

    //List of fontlist
    let fontList = [
        "Arial",
        "Verdana",
        "Times New Roman",
        "Garamond",
        "Georgia",
        "Courier New",
        "cursive",
    ];

    //Initial Settings
    const initializer = () => {
        //function calls for highlighting buttons
        //No highlights for link, unlink,lists, undo,redo since they are one time operations
        highlighter(alignButtons, true);
        highlighter(spacingButtons, true);
        highlighter(formatButtons, false);
        highlighter(scriptButtons, true);

        //create options for font names
        fontList.map((value) => {
            let option = document.createElement("option");
            option.value = value;
            option.innerHTML = value;
            fontName.appendChild(option);
        });

        //fontSize allows only till 7
        for (let i = 1; i <= 7; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.innerHTML = i;
            fontSizeRef.appendChild(option);
        }

        //default size
        fontSizeRef.value = 3;
    };

    //main logic
    const modifyText = (command, defaultUi, value) => {
        //execCommand executes command on selected text
        document.execCommand(command, defaultUi, value);
    };

    //For basic operations which don't need value parameter
    optionsButtons.forEach((button) => {
        button.addEventListener("click", () => {
            modifyText(button.id, false, null);
        });
    });

    //options that require value parameter (e.g colors, fonts)
    advancedOptionButton.forEach((button) => {
        button.addEventListener("change", () => {
            modifyText(button.id, false, button.value);
        });
    });

    //link
    linkButton.addEventListener("click", () => {
        let userLink = prompt("Enter a URL");
        //if link has http then pass directly else add https
        if (/http/i.test(userLink)) {
            modifyText(linkButton.id, false, userLink);
        } else {
            userLink = "http://" + userLink;
            modifyText(linkButton.id, false, userLink);
        }
    });

    //Highlight clicked button
    const highlighter = (className, needsRemoval) => {
        className.forEach((button) => {
            button.addEventListener("click", () => {
                //needsRemoval = true means only one button should be highlight and other would be normal
                if (needsRemoval) {
                    let alreadyActive = false;

                    //If currently clicked button is already active
                    if (button.classList.contains("active")) {
                        alreadyActive = true;
                    }

                    //Remove highlight from other buttons
                    highlighterRemover(className);
                    if (!alreadyActive) {
                        //highlight clicked button
                        button.classList.add("active");
                    }
                } else {
                    //if other buttons can be highlighted
                    button.classList.toggle("active");
                }
            });
        });
    };

    const highlighterRemover = (className) => {
        className.forEach((button) => {
            button.classList.remove("active");
        });
    };

    window.onload = initializer();

});