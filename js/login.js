const $formularioInicioSesion = document.getElementById("hi-iniciar-sesion");
const $formularioRegistro = document.getElementById("hi-registro");

const $seccionInicioSesion = document.getElementById("hi-formulario-registro");
const $seccionRegistro = document.getElementById("hi-formulario-inicio-sesion");

const $iniciarSesionToRegistro = document.getElementById(
  "hi-iniciar-sesion-to-registro"
);
const $registroToIniciarSesion = document.getElementById(
  "hi-registro-to-iniciar-sesion"
);

$registroToIniciarSesion.addEventListener("click", () => {
  $seccionInicioSesion.classList.add("asd");
  $seccionRegistro.classList.remove("asd");
});

$iniciarSesionToRegistro.addEventListener("click", () => {
  $seccionRegistro.classList.add("asd");
  $seccionInicioSesion.classList.remove("asd");
});

$formularioInicioSesion.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  
  const users = JSON.parse(localStorage.getItem('users'));
  const usuarioLogueado = users.find(user=> user.email===data.email&&user.login.password===data.password)
  if(usuarioLogueado){
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado));
    swal({
      title: "Bienvenido/a",
      text: `Usuario logueado satisfactoriamente.`,
      icon: "success",
      buttons:{
        confirm:{
          text:"Aceptar"
        }
      }
    }).then(()=>{
    window.location.href="/paginas/cuentas.html"
    })
    
  }else{
    swal({
      title: "Error",
      text: `Los datos que haz ingresado son incorrectos`,
      icon: "error",
      buttons:{
        confirm:{
          text:"Aceptar"
        }
      }
    }).then(()=>{
      window.location.href="/paginas/login.html"
      })
    
  }

});

$formularioRegistro.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  
});

const localStorageUsers = () => {
  const storedJsonString = localStorage.getItem('users');
  if(!storedJsonString){
  fetch("/json/usuarios-contraseñas.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const usuarios = data.users;

      localStorage.setItem('users', JSON.stringify(usuarios));
    })
    .catch((error) => console.error(error));
  }
};

localStorageUsers();

const localStorageAccounts = () => {
  const storedJsonString = localStorage.getItem("accounts");
  if (!storedJsonString) {
    fetch("/json/accounts.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const cuentas = data.accounts;

        localStorage.setItem("accounts", JSON.stringify(cuentas));
      })
      .catch((error) => console.error(error));
  }
};

localStorageAccounts();


