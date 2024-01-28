// From addElement.js


function closeCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'none';
}

function openCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'block';
}


// On load
document.addEventListener('DOMContentLoaded', () => {

    // Whitelist the fonts
    let Font = Quill.import('formats/font');
    Font.whitelist = ['Inconsolata', 'Roboto', 'Mirza', 'Arial', 'sans-serif'];
    Quill.register(Font, true);

    // Initialize Quill
    var quill = new Quill('#editor', {
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': ['Inconsolata', 'Roboto', 'Mirza', 'Arial', 'sans-serif'] }],
                [{ 'align': [] }],
                ['clean'],
            ]
        },
        placeholder: 'Compose an epic...',
        theme: 'snow'
    });

});



function showTextFieldSection() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('socialMediaEditSection').style.display = 'none';
    document.getElementById('textColorSection').style.display = 'none';
    document.getElementById('textFieldSection').style.display = 'block';
}