// Global declaration
let editor; // Declare editor globally

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
    document.getElementById('textColorSection').style.display = 'none';
    document.getElementById('textFieldSection').style.display = 'block';
}

// Editor Setup
document.addEventListener("DOMContentLoaded", function () {
    // Use a different variable name to avoid shadowing the global 'editor'
    const editorInstance = new EditorJS({
        holder: 'editorjs',
        placeholder: "Let's write an awesome story!",
        tools: {
            header: {
                class: Header,
                config: {
                    placeholder: 'Enter a header',
                    defaultLevel: 2,
                }
            },
            paragraph: {
                class: Paragraph,
                inlineToolbar: true,
            },
            quote: {
                class: Quote,
                inlineToolbar: true,
                shortcut: 'CMD+SHIFT+O',
                config: {
                    quotePlaceholder: 'Enter a quote',
                    captionPlaceholder: 'Quote\'s author',
                },
            },
            list: {
                class: List,
                inlineToolbar: true,
                config: {
                    defaultStyle: 'unordered',
                }
            },
            underline: Underline,

        },
        onReady: () => {
            console.log('Editor.js is ready to work!');
            // Assign the editor instance to the global variable
            editor = editorInstance;
        }
    });

});

// Font selection manager
document.addEventListener("DOMContentLoaded", function () {
    // Get the font selection dropdown element
    const fontSelect = document.getElementById('fontSelect');

    // List of available fonts
    const fontOptions = [
        'Poppins', 'Roboto', 'Open Sans', 'Montserrat', 'Lato',
        'Raleway', 'Nunito', 'Ubuntu', 'Source Sans Pro', 'Playfair Display',
        'Merriweather', 'Pacifico', 'Quicksand', 'Oswald', 'Roboto Condensed',
        'Roboto Slab', 'Dancing Script', 'Crimson Text', 'Roboto Mono', 'Lora',
        'Bebas Neue', 'Yanone Kaffeesatz', 'Arvo', 'Archivo', 'Anton', 'Cabin',
        'Fira Sans', 'Bitter', 'Old Standard TT', 'Lobster', 'Noto Sans', 'Dosis',
        'Inconsolata', 'Muli', 'Titillium Web', 'Baloo', 'Catamaran', 'Patua One',
        'Exo', 'Pacifico', 'Rajdhani', 'Roboto Slab', 'Overpass', 'Abril Fatface',
        'Source Code Pro', 'Cabin Sketch', 'Lobster Two', 'Archivo Narrow',
        'Quattrocento', 'Fjalla One', 'Roboto Slab', 'Barlow'
        // Add more fonts as needed
    ];

    // Populate the font selection dropdown
    fontOptions.forEach((font) => {
        const option = document.createElement('option');
        option.value = font;
        option.text = font;
        option.style.fontFamily = font;
        fontSelect.appendChild(option);
    });


    fontSelect.addEventListener('change', function () {
        // Get the selected font from the dropdown
        const selectedFont = fontSelect.value;

        // Apply the selected font to the existing text field elements
        const textfieldElements = document.querySelectorAll('.textfield-card p');
        textfieldElements.forEach((paragraph) => {
            applyFontStyles(paragraph, selectedFont);
        });

        // Apply the selected font to the paragraphs within the editor
        if (editor) {
            const editorParagraphs = document.querySelectorAll('#editorjs .ce-paragraph');
            editorParagraphs.forEach((paragraph) => {
                applyFontStyles(paragraph, selectedFont);
            });
        }
    });


});

function applyFontStyles(element, font) {
    // Set font family
    element.style.fontFamily = font;

    // Check if bold style is applied
    const isBold = editor?.isActive('bold') || element.classList.contains('cdx-bold');
    element.style.fontWeight = isBold ? 'bold' : 'normal';

    // Check if italic style is applied
    const isItalic = editor?.isActive('italic') || element.classList.contains('cdx-italic');
    element.style.fontStyle = isItalic ? 'italic' : 'normal';
}


function applyFontToText(selectedFont) {
    // Get the existing text field container
    const textfieldContainer = document.getElementById('text-field-container');

    // Check if there's an existing text field
    let textfieldElement = textfieldContainer.querySelector('.textfield-card');

    // If no existing text field, create one
    if (!textfieldElement) {
        textfieldElement = document.createElement('div');
        textfieldElement.classList.add('textfield-card');
        textfieldContainer.appendChild(textfieldElement);
    }

    // Set font family to the text field container
    textfieldElement.style.fontFamily = selectedFont;

    // Get the editor content
    const editorContent = editor.save();

    // Clear existing content in the text field
    textfieldElement.innerHTML = '';

    // Iterate through blocks in the editor content
    editorContent.blocks.forEach((block) => {
        const element = document.createElement(block.type === 'header' ? 'h3' : 'p');

        // Set font size for consistency
        element.style.fontSize = block.type === 'header' ? '35px' : '25px';

        // Set alignment based on block type
        element.style.textAlign = block.type === 'header' ? 'center' : 'left';

        // Apply the selected font to the paragraph element
        element.style.fontFamily = selectedFont;

        // Assign the content to the element with HTML formatting
        element.innerHTML = block.data.text;

        textfieldElement.appendChild(element);
    });
}



async function handleEditor() {
    // Check if 'editor' is defined before using it
    if (editor) {
        try {
            // Your existing code for handling the editor
            const editorContent = await editor.save();

            // Get the selected font from the dropdown
            const selectedFont = fontSelect.value;

            // Create a container for the text field content
            const textfieldContainer = document.getElementById('text-field-container');

            // Check if there's an existing text field
            let textfieldElement = textfieldContainer.querySelector('.textfield-card');

            // If no existing text field, create one
            if (!textfieldElement) {
                textfieldElement = document.createElement('div');
                textfieldElement.classList.add('textfield-card');
                textfieldContainer.appendChild(textfieldElement);
            }

            // Clear existing content in the text field
            textfieldElement.innerHTML = '';

            editorContent.blocks.forEach((block) => {
                const element = document.createElement(block.type === 'header' ? 'h3' : 'p');

                // Set font size for consistency
                element.style.fontSize = block.type === 'header' ? '35px' : '25px';

                // Set alignment based on block type
                element.style.textAlign = block.type === 'header' ? 'center' : 'left';

                // Apply the selected font to the paragraph element
                element.style.fontFamily = selectedFont;

                // Assign the content to the element with HTML formatting
                element.innerHTML = block.data.text;

                textfieldElement.appendChild(element);
            });

            // Create the menu button
            const menuButton = document.createElement('button');
            menuButton.classList.add('menu-button');
            menuButton.innerHTML = '<i class="fas fa-ellipsis-v"></i>'; // Font Awesome icon for vertical ellipsis

            // Create the edit text section
            const editTextSection = document.createElement('div');
            editTextSection.classList.add('menu-section', 'edit-section');
            editTextSection.innerHTML = '<i class="fas fa-pencil-alt"></i> Edit Text';

            // Create the delete element section
            const deleteElementSection = document.createElement('div');
            deleteElementSection.classList.add('menu-section', 'delete-section');
            deleteElementSection.innerHTML = '<i class="fas fa-trash-alt"></i> Delete Element';

            // Append the sections to the menu button
            menuButton.appendChild(editTextSection);
            menuButton.appendChild(deleteElementSection);

            // Add event listeners for section actions
            editTextSection.addEventListener('click', function () {
                // Add your logic for editing text here
                console.log('Editing text...');
            });

            deleteElementSection.addEventListener('click', function () {
                // Add your logic for deleting element here
                const confirmation = window.confirm('Are you sure you want to delete this element?');
                if (confirmation) {
                    // Perform deletion
                    console.log('Deleting element...');
                    textfieldElement.remove(); // Remove the text field content on deletion
                }
            });

            // Append the menu button to the text field container
            textfieldElement.appendChild(menuButton);

            // Close the customization modal
            closeCustomizeElementModal();
        } catch (error) {
            console.error('Error handling editor content:', error);
        }
    } else {
        console.error('Editor is not yet ready. Please wait for it to initialize.');
    }
}
















// event listener for avoiding using the inline tool for switching fonts
document.addEventListener('DOMContentLoaded', () => {
    // Get the editor container
    const editorContainer = document.getElementById('editorjs');

    // Add an event listener to the editor container
    editorContainer.addEventListener('click', function (event) {
        // Check if the clicked element is a button in the inline toolbar
        if (event.target.tagName === 'BUTTON' && event.target.classList.contains('ce-inline-toolbar')) {
            // Get the selected font from the dropdown
            const selectedFont = fontSelect.value;

            // Get the selected text in the editor
            const selectedText = window.getSelection().toString();

            // Check if Editor.js is ready
            if (editor) {
                // Iterate through the blocks in the Editor.js content
                editor.blocks.getAll().forEach((block) => {
                    // Check if the block contains the selected text
                    if (block.data.text.includes(selectedText)) {
                        // Update the font family for the block
                        editor.blocks.update(block.id, {
                            data: {
                                style: {
                                    fontFamily: selectedFont,
                                },
                            },
                        });

                        // Update font family for nested inline styles (e.g., u)
                        const inlineElements = editor.inlineStyles.getNodes(block.id);
                        inlineElements.forEach((inlineElement) => {
                            // Check if the inline element is within the selected text range
                            if (inlineElement.textContent.includes(selectedText)) {
                                // Update the font family for the inline element
                                inlineElement.style.fontFamily = selectedFont;
                            }
                        });
                    }
                });
            }

            // Prevent the default action of the button
            event.preventDefault();
        }
    });
});
