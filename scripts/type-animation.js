document.addEventListener("DOMContentLoaded", function() {
    const words = ["IMAGINE", "REALIZE", "CREATE", "DESIGN"];
    const textElement = document.querySelector('.typing-text');
    const cursorElement = document.querySelector('.cursor');
    let wordIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;

    function typeText() {
        const word = words[wordIndex];
        if (isDeleting && textElement.textContent.length > 0) {
            textElement.textContent = word.slice(0, textElement.textContent.length - 1);
        } else if (!isDeleting && letterIndex <= word.length) {
            textElement.textContent = word.slice(0, letterIndex);
            letterIndex++;
        } else {
            isDeleting = true;
        }

        if (isDeleting && textElement.textContent.length === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            letterIndex = 0;
        }

        if (wordIndex === words.length) {
            wordIndex = 0;
        }

        setTimeout(typeText, isDeleting ? 300 : 200);
    }


    function blinkCursor() {
        if (cursorElement) {
            cursorElement.style.opacity = cursorElement.style.opacity === "0" ? "1" : "0";
            setTimeout(blinkCursor, 500);
        }
    }
    
    // Activate Functions
    typeText();
    blinkCursor(); 


});