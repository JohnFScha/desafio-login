const socket = io();

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("login");

loginBtn.addEventListener('click', () => {

    const newUser = {
        email: email.value,
        password: password.value
    }
    
    socket.emit('login', newUser)
})