// Add this script after your previous JavaScript code
const cards = document.querySelectorAll('.design-card');
const button = document.getElementById('customButton');

cards.forEach(card => {
    card.addEventListener('mouseover', function () {
        const animation = this.getAttribute('data-animation');
        button.className = `design-button a-${animation}`;
    });

    card.addEventListener('mouseout', function () {
        button.className = 'design-button';
    });

    card.addEventListener('click', function () {
        cards.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
    });

});
