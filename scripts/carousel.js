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


document.addEventListener("scroll", function () {
    var scrollPosition = window.scrollY;
    var header = document.getElementById("main-header");

    // You can adjust the scroll position and opacity values as needed
    var opacity = scrollPosition > 100 ? 0.4 : 0; // Adjust the opacity values (0.4 in this case)

    header.style.backgroundColor = "rgba(0, 0, 0, " + opacity + ")";

    // Add or remove the 'scrolled' class based on the scroll position
    if (scrollPosition > 100) {
        header.classList.add("scrolled");
        document.querySelectorAll('.navigation a').forEach(function (link) {
            link.style.color = "white";
        });
    } else {
        header.classList.remove("scrolled");
        document.querySelectorAll('.navigation a').forEach(function (link) {
            link.style.color = "black";
        });
    }



});






// Function to check if an element is in the viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to highlight the active section
function highlightActiveSection() {
    const sections = document.querySelectorAll('section');

    sections.forEach((section) => {
        const link = document.querySelector(`.navigation a[href="#${section.id}"]`);

        if (isInViewport(section)) {
            section.classList.add('active');
            link.classList.add('active');
            link.style.color = "red";

        } else {
            section.classList.remove('active');
            link.classList.remove('active');
            link.style.color = "white";
        }
    });


}




document.addEventListener('DOMContentLoaded', () => {



    const navLinks = document.querySelectorAll('#main-header .navigation a:not(.logbtn):not(#homebtn)');

    function highlightActiveSection() {
        const scrollPosition = window.scrollY;
        console.log(`Scroll Position: ${scrollPosition}`);

        let activeSectionId = null;
        navLinks.forEach(link => {
            const sectionId = link.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);

            if (section && (section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition)) {
                activeSectionId = sectionId;
            }
        });

        console.log(`Active Section ID: ${activeSectionId}`);

        // Add 'active' class to the link corresponding to the active section
        navLinks.forEach(link => {
            const sectionId = link.getAttribute('href').substring(1);
            console.log(`Link: ${link.getAttribute('href')}, Section ID: ${sectionId}, Active Section: ${sectionId === activeSectionId}`);
            link.classList.toggle('active', sectionId === activeSectionId);
            if (sectionId === activeSectionId) {
                link.style.color = '#9CD89E';

            }
        });
    }

    // Initial highlighting
    highlightActiveSection();

    // Listen for scroll events
    document.addEventListener('scroll', highlightActiveSection);
});

