document.addEventListener("DOMContentLoaded", function () {
    // Array of image sources
    const imageSources = ["design-main.png", "website-setup.svg", "web dev.svg"];
    
    // Index to track the current image
    let currentIndex = 0;

    function changeImage() {
        // Fade out the current image
        document.getElementById("carouselImage").style.opacity = 0;

        // Wait for the fade-out animation to complete
        setTimeout(() => {
            // Change the image source
            currentIndex = (currentIndex + 1) % imageSources.length;
            document.getElementById("carouselImage").src = imageSources[currentIndex];

            // Fade in the new image
            document.getElementById("carouselImage").style.opacity = 1;
        }, 1000); // Adjust the delay as needed
    }

    // Initial call to start the image change loop
    setInterval(changeImage, 5000); // Change every 5 seconds, adjust as needed

});
  