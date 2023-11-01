function hideShow() {
   const x = document.getElementById("password");
   const icon = document.querySelector("#eye");

   if (x.type === "password") {
      x.type = "text";
      icon.classList.replace("fa-eye" , "fa-eye-slash");
   } else {
      x.type = "password";
      icon.classList.replace("fa-eye-slash" , "fa-eye");
   }
}