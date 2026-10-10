import {registerUser, loginUser, logoutUser, watchAuthState} from './auth.js';



// Referencias a las vistas
const authView = document.getElementById('authView');
const homeView = document.getElementById('homeView');
const entryFormView = document.getElementById('entryFormView');

// Referencias a los formularios dentro de authView
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterBtn = document.getElementById('showRegisterBtn');

// Función para mostrar una sola vista a la vez
function showView(view) {
  [authView, homeView, entryFormView].forEach(v => v.style.display = 'none');
  view.style.display = 'block';
}

// Alternar entre login y registro dentro de authView
showRegisterBtn.addEventListener('click', () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
  showRegisterBtn.parentElement.style.display = 'none';
});

// Funciones para mostrar vistas específicas
function showHomeView() {
  showView(homeView);
}

function showAuthView() {
  showView(authView);
}

// Escuchar cambios en el estado de autenticación
watchAuthState((user) => {
  if (user) {
    // Usuario logueado
    console.log("Usuario logueado:", user.email);
    showHomeView();
  } else {
    // Usuario no logueado
    console.log("Usuario no logueado");
    showAuthView();
  }
});



registerForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const newUser = document.getElementById("registerEmail").value;
    const newPassword = document.getElementById("registerPassword").value;

    registerUser(newUser, newPassword)
    .then((userCredential)=>{
      // creado correctamente

      console.log(200, "usuario creado correctamente");
    })
    .catch((error)=>{
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("codigo de error: ", errorCode, "mensaje de error: ", errorMessage);
    })
}); 

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const loginEmail = document.getElementById("loginEmail").value;
    const loginPassword = document.getElementById("loginPassword").value;

    loginUser(loginEmail, loginPassword)
    .then((loginUserCredential)=>{
      // usuario logueado correctamente

      console.log(200, "usuario logueado correctamente");
    })

    .catch((error)=>{
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("codigo de error: ", errorCode, "mensaje de error: ", errorMessage);  
    })
    
});

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logoutUser()
    .then((logoutUserCredential)=>{
      console.log(200, "usuario deslogueado correctamete");
    })
    .catch((error)=>{
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("codigo de error: ", errorCode, "mensaje de error: ", errorMessage);  

    })
});
