const socket = io();

const botonChat = document.querySelector("#botonChat");
const parrafosMensajes = document.querySelector(".parrafosMensajes");
const valInput = document.querySelector("#chatBox");

let email;
if (localStorage.getItem("email")) {
  email = localStorage.getItem("email");
} else {
  Swal.fire({
    title: "Identificación de usuario",
    text: "Por favor ingrese su email",
    input: "text",

    inputValidator: (valor) => {
      return !valor && "Ingrese un email válido";
    },
    allowOutsideClick: false,
  }).then((resultado) => {
    email = resultado.value;
    localStorage.setItem("email", email);
  });
}

botonChat.addEventListener("click", () => {
  if (valInput.value.trim().length > 0) {
    socket.emit("mensaje", {
      email: email,
      message: valInput.value,
    });
    valInput.value = "";
  }
});

socket.on("mensajes", (arrayMensajes) => {
  parrafosMensajes.innerHTML = ""; // limpio
  arrayMensajes.forEach((msj) => {
    const { email, message } = msj;
    parrafosMensajes.innerHTML += `<p class="mail">${email} escribió: </p> <p class="message">${message}</p>`;
  });
});
