function updateRadius(value) {
    const radiusValueLabel = document.getElementById("radiusValue");
    radiusValueLabel.textContent = value;
    const buttons = document.querySelectorAll(".custom-button");
    
    buttons.forEach(button => {
        button.style.borderRadius = `${value}px`;
    });
}