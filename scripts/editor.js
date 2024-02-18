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
                    levels: [2, 3, 4],
                    defaultLevel: 3,
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

        // Apply the selected font to the editor content
        if (editor) {
            // Apply the selected font to the editor container
            const editorContainer = document.getElementById('editorjs');
            editorContainer.style.fontFamily = selectedFont;

            // Directly target paragraphs within the editor and set the font
            const editorParagraphs = document.querySelectorAll('#editorjs .ce-paragraph');
            editorParagraphs.forEach((paragraph) => {
                paragraph.style.fontFamily = selectedFont;
            });

            // Directly target heading elements within the editor and set the font
            const editorHeadings = document.querySelectorAll('#editorjs h3');
            editorHeadings.forEach((heading) => {
                heading.style.fontFamily = selectedFont;
            });

            // Trigger a re-render of the editor to update the displayed text with the new font
            editor.render();
        }

        // Also, apply the selected font to the existing text field elements
        const textfieldElements = document.querySelectorAll('.textfield-card p');
        textfieldElements.forEach((paragraph) => {
            paragraph.style.fontFamily = selectedFont;
        });

    });


});

function applyFontToText(selectedFont) {

    const textfieldElement = document.createElement('div');

    // Extract and display text content inside the container
    const editorContent = [];  // Replace this with your actual content
    editorContent.forEach((block) => {
        const paragraphElement = document.createElement('p');


        // Apply the selected font to the paragraph element
        paragraphElement.style.fontFamily = selectedFont;
        paragraphElement.textContent = block.data.text;
        textfieldElement.appendChild(paragraphElement);
    });

    // Append the text field container to the desired location
    document.getElementById('text-field-container').appendChild(textfieldElement);
}

async function handleEditor() {
    // Check if 'editor' is defined before using it
    if (editor) {
        // Your existing code for handling the editor
        const editorContent = await editor.save();

        // Get the selected font from the dropdown
        const selectedFont = fontSelect.value;

        // Create a container for the text field content
        const textfieldElement = document.createElement('div');
        textfieldElement.classList.add('textfield-card');
        textfieldElement.style.fontFamily = selectedFont; // Apply font to the whole text field

        editorContent.blocks.forEach((block) => {
            const element = document.createElement(block.type === 'header' ? 'h3' : 'p');

            // Set font size for consistency
            element.style.fontSize = block.type === 'header' ? '35px' : '25px';

            // Set alignment based on block type
            element.style.textAlign = block.type === 'header' ? 'center' : 'left';

            // Apply other formatting styles
            if (block.data.bold) {
                const boldElement = document.createElement('strong');
                boldElement.textContent = block.data.text;
                element.appendChild(boldElement);
            } else if (block.data.italic) {
                const italicElement = document.createElement('em');
                italicElement.textContent = block.data.text;
                element.appendChild(italicElement);
            } else if (block.data.underline) {
                const underlineElement = document.createElement('u');
                underlineElement.textContent = block.data.text;
                element.appendChild(underlineElement);
                console.log(block.data.text)
            } else if (block.data.link) {
                // Assuming block.data.link contains the URL
                const linkElement = document.createElement('a');
                linkElement.href = block.data.link;
                linkElement.target = '_blank';
                linkElement.textContent = block.data.text;
                element.appendChild(linkElement);
            } else {
                element.textContent = block.data.text;
            }

            textfieldElement.appendChild(element);
        });

        // Create a unique ID for each text field to distinguish them
        const textfieldId = `textfield-${Date.now()}`;
        textfieldElement.id = textfieldId;

        // Append the text field container to the 'text-field-container'
        const textContainer = document.getElementById('text-field-container');
        textContainer.appendChild(textfieldElement);

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
                textContainer.removeChild(textfieldElement); // Remove the text field on deletion
            }
        });

        // Append the menu button to the text field container
        textfieldElement.appendChild(menuButton);

        // Close the customization modal
        closeCustomizeElementModal();
    } else {
        console.error('Editor is not yet ready. Please wait for it to initialize.');
    }
}
