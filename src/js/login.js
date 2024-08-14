const showRegisterForm = document.getElementById('showRegisterForm'),
  loginSection = document.getElementById('loginSection'),
  registerSection = document.getElementById('registerSection'),
  showLoginForm = document.getElementById('showLoginForm');

const buttonLogin = document.getElementById("buttonLogin");
const buttonRegister = document.getElementById('buttonRegister');

let loginUsername = document.getElementById("loginEmail");
let loginPassword = document.getElementById('loginPassword');
let registerUsername = document.getElementById("registerEmail");
let registerPassword = document.getElementById('registerPassword');


showRegisterForm.addEventListener('click', function () {
  loginSection.style.display = 'none'; // Oculta toda la sección de login
  registerSection.style.display = 'block'; // Muestra la sección de registro
  showLoginForm.style.display = 'block'; // Muestra el botón para regresar a login
});

showLoginForm.addEventListener('click', function () {
  registerSection.style.display = 'none'; // Oculta toda la sección de registro
  loginSection.style.display = 'block'; // Muestra la sección de login
});

buttonRegister.addEventListener("click",(e)=>{
  e.defaultPrevented;
  register();
})
buttonLogin.addEventListener("click", (e) => {
  e.defaultPrevented;
  sendData();
});


async function sendData(){

 await axios({
      method: "post",
      url: "http://localhost:3000/api/login",
      data: {
        user: `${loginUsername.value}`,
        password: `${loginPassword.value}`
      }
    }).then(response => {
      if (response.data) {
        window.location.href = "index.html";
      } else {
        console.log("la contraseña esta mal")
      }
    }).catch(error => {
      console.log(error);
    })
}

async function register (){
  await axios({
    method: "post",
    url: "http://localhost:3000/api/register",
    data: {
      user: `${registerUsername.value}`,
      password: `${registerPassword.value}`
    }
  }).then(response => {
    if (response.data) {
      console.log('usuario registrado');
    } else {
      console.log("el usuario ya esta registrado")
    }
  }).catch(error => {
    console.log(error);
  })
}