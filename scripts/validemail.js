function validate() {

    const validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = document.getElementById('email').value;
  
    const span = document.querySelector('span');
  
    if (email.trim()=="") {
        
      span.innerText = "";
  
    } else if ((validRegex.test(email))) {
      span.innerText = "Valid ✔";
      span.style.color = "green";
    } else {
      span.innerText = "Invalid ✖";
      span.style.color = "red";
    }
  
}   