document.addEventListener('DOMContentLoaded', () => {
    const paletteInputs = document.querySelectorAll('.palette input');
    const directionSelect = document.querySelector('.direction select');
    const gradientBox = document.querySelector('.gradient-box');

    // Event listener for palette inputs and direction select
    document.querySelector('.row.options').addEventListener('input', function (event) {
        if (event.target.matches('.palette input') || event.target.matches('.direction select')) {
            updateGradientPreview();
        }
    });

    // Function to update gradient preview
    function updateGradientPreview() {
        const gradientColors = Array.from(paletteInputs).map(colorInput => colorInput.value).join(', ');
        const selectedDirection = directionSelect.value;

        gradientBox.style.background = `linear-gradient(${selectedDirection}, ${gradientColors})`;
    }
});
