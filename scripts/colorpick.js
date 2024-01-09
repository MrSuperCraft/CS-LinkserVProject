document.addEventListener('input', function (event) {
    if (event.target.matches('.palette input')) {
        updateGradientPreview();
    }
});

function updateGradientPreview() {
    const colors = document.querySelectorAll('.palette input');
    const direction = document.querySelector('.select-box select').value;
    const gradientBox = document.querySelector('.gradient-box');

    const gradientColors = Array.from(colors).map(colorInput => colorInput.value).join(', ');

    gradientBox.style.background = `linear-gradient(${direction}, ${gradientColors})`;
}