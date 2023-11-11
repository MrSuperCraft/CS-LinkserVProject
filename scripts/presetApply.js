const background = document.querySelector('.background');
const button = document.createElement('button');

const globalStyles = document.querySelector('.background').style;

function applyPreset(presetName) {
    // Apply the styles based on the selected preset to the background and buttons
    const styles = presets[presetName];
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



  

