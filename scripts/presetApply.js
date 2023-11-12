const background = document.querySelector('.background');
const button = document.createElement('button');

const globalStyles = document.querySelector('.background').style;



function applyPreset(presetName) {
    const styles = presets[presetName];

    if (background.style.backgroundImage) {
        background.style.backgroundImage = 'none';
    }

    for (const property in styles) {
        if (property !== 'presetName') {
            if (property === 'bgColor') {
                globalStyles.background = styles[property];
            } else {
                const buttons = document.querySelectorAll('.custom-button');
                buttons.forEach((button) => {
                    button.style[property] = styles[property];
                });
            }

            if (styles.bioInput) {
                const bioInputStyles = styles.bioInput;
                const bioInput = document.querySelector('.bioinput');
        
                for (const property in bioInputStyles) {
                    bioInput.style[property] = bioInputStyles[property];
                }
            }

            if (styles.charCount) {
                const charCountStyles = styles.charCount;
                const charCount = document.querySelector('.char-count');

                for (const property in charCountStyles) {
                    charCount.style[property] = charCountStyles[property];
                }
            }


            if (styles.placeholder) {
                const placeholderStyles = styles.placeholder;
                const placeholder = document.getElementById('bioinput').getAttribute("placeholder");

                for (const property in placeholderStyles) {
                    placeholder.style[property] = placeholderStyles[property];
                }
            }

            // default background color
            if (!presetName) {
                globalStyles.background = defaultBackgroundColor;
                currentPreset = 'defaultPreset'; // Update the current preset as default
            }

        }

         }
        
        currentPreset = presetName; // Update the global preset variable

        console.log(`applied the preset: ${currentPreset}`);
}

// Function to create a new button with a specific preset
function createButtonWithPreset(presetName) {
    button.setAttribute('data-preset', presetName); // Set the preset data attribute
    document.getElementById('button-container').appendChild(button);
}


let imageRemoved = false;

const removeImageButton = document.getElementById('removeImageButton');

removeImageButton.addEventListener('click', function() {
    if (background.style.backgroundImage !== 'none') {
        console.log('Background image is being removed');
        background.style.backgroundImage = 'none';
        imageRemoved = true;

        setTimeout(() => {
            if (currentPreset === 'defaultPreset' && imageRemoved) {
                console.log('Restoring default background color');
                const defaultPreset = presets.defaultPreset;
                if (defaultPreset && defaultPreset.bgColor) {
                    globalStyles.background = defaultPreset.bgColor;
                } else {
                    globalStyles.background = ''; // Fallback to no background color
                }
            }
        }, 100); // Adjust the delay time as needed
    } else {
        console.log('Background image was not present');
        imageRemoved = false;
    }

    console.log('Current preset:', currentPreset);
    console.log('Image Removed:', imageRemoved);
});










  
// Apply presets to buttons specifically

function applyPresetBtn(presetName) {
    const styles = presets[presetName];
    for (const property in styles) {
        const buttons = document.querySelectorAll('.custom-button');
            buttons.forEach((button) => {
            button.style[property] = styles[property];
        });
    }
}