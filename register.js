const form = document.querySelector('#registerForm');
const input = document.querySelector('#username');
const input1 = document.querySelector('#password');
const button = document.querySelector('#loginBtn');

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(input.value.trim()==="" || input1.value.trim() === "") return;
    let user = {
        username:input.value,
        password:input1.value
    }
    localStorage.setItem("user",JSON.stringify(user));
    alert("Registration Successful! You can now logIn");
    window.location.href = "index.html";
    input.value = "";
    input1.value = "";
})
