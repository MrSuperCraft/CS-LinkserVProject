function toggleDropdown() {
    const dropdown = document.getElementById("myDropdown");
    const button = document.querySelector(".dropbtn");
    button.classList.toggle("move-up");
    dropdown.classList.toggle("show");
}
