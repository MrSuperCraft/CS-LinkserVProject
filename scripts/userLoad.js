function removeAllOverlays() {
    const overlaysToRemove = ['.gallery-overlay', 'div.text-overlay', '.btn__overlay', '.social-overlay', '.profile-picture-overlay'];

    overlaysToRemove.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`Elements for selector ${selector}`, elements);
        elements.forEach(element => {
            element.remove();
        })
    });

}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        removeAllOverlays();
    }, 1000);
});



document.addEventListener('DOMContentLoaded', function () {

    function blockInputs() {
        const inputs = document.querySelectorAll('input');
        console.log("Inputs: ", inputs);
        inputs.forEach(input => {
            input.disabled = true;
        });
    }

    setTimeout(() => {
        blockInputs();
    }, 2000);

});



