// From addElement.js


function closeCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'none';
}

function openCustomizeElementModal() {
    const customizeElementModal = document.getElementById('customizeElementModal');
    customizeElementModal.style.display = 'block';
}


// Function to dynamically load Quill editor
// function loadQuillEditor() {
// var FontAttributor = Quill.import('formats/font');
//     var fonts = ['Abril Fatface', 'Overpass', 'Comic Sans MS']; /* Add your fonts here */
//     FontAttributor.whitelist = fonts;
//     Quill.register(FontAttributor, true);
// 
//     var quill = new Quill('#editor-container', {
//         modules: {
//             toolbar: {
//                 container: "#toolbar-container",
//                 handlers: {
//                     'font': function (value) {
//                         // Update the font for the selected text
//                         this.format('font', value);
//                     }
//                 }
//             },
//         },
//         placeholder: 'Type something here',
//         theme: 'snow',
//     });
// }
// 
// // Load the Quill editor when the page loads
// document.addEventListener('DOMContentLoaded', function () {
//     loadQuillEditor();
// });








function showTextFieldSection() {
    document.getElementById('image-modal').style.display = 'none';
    document.getElementById('socialMediaEditSection').style.display = 'none';
    document.getElementById('textColorSection').style.display = 'none';
    document.getElementById('textFieldSection').style.display = 'block';
}