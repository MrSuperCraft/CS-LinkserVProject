var prevScrollPos = window.scrollY;
var navbar = document.getElementById("navbar");

window.addEventListener("scroll", function() {
    var currentScrollPos = window.scrollY;

    if (prevScrollPos > currentScrollPos) {
        navbar.style.top = "0";
    } else {
        navbar.style.top = "-100px";
    }

    prevScrollPos = currentScrollPos;
});