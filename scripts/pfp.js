const profilePicInput = document.getElementById('profilePicInput');
const profilePic = document.getElementById('profilePic');

profilePic.addEventListener('click', function() {
    profilePicInput.click();
});

profilePicInput.addEventListener('change', function() {
    const file = profilePicInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePic.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});