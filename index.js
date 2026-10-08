const form = document.querySelector('#loginForm');
const username = document.querySelector('#username');
const password = document.querySelector('#password');

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(username.value.trim()==="" || password.value.trim()==="") return;
    let data = localStorage.getItem("user");
    let parse = JSON.parse(data);

    
    if(username.value === parse.username && password.value === parse.password){
        window.location.href = "Dashboard.html";
    }
    else{
        alert("Invalid Username or Password");
        username.value = "";
        password.value = "";
    }
})