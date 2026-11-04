import { registerUser, loginUser, logoutUser, watchAuthState } from './auth.js';
 
// Referencias a las vistas
const authView = document.getElementById('authView');
const homeView = document.getElementById('homeView');
const entryFormView = document.getElementById('entryFormView');
 
// Referencias a los elementos de authView y del header
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const authMessage = document.getElementById('authMessage');
const logoutBtn = document.getElementById('logoutBtn');
 
// Traducción de códigos de error de Firebase a mensajes legibles
const mensajesError = {
  "auth/invalid-email": "El correo no tiene un formato válido.",
  "auth/missing-password": "Debes ingresar la contraseña.",
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/user-disabled": "Esta cuenta está deshabilitada.",
  "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
  "auth/network-request-failed": "Error de conexión. Revisa tu internet.",
  "auth/email-already-in-use": "Ese correo ya está registrado.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
};
 
// Función para mostrar una sola vista a la vez
function showView(view) {
  [authView, homeView, entryFormView].forEach(v => v.style.display = 'none');
  view.style.display = 'block';
}
 
function showHomeView() {
  showView(homeView);
}
 
function showAuthView() {
  showView(authView);
}
 
// Mostrar (o limpiar) el mensaje de error en pantalla
function showAuthMessage(text) {
  authMessage.textContent = text;
}
 
// Alternar entre login y registro dentro de authView
showRegisterBtn.addEventListener('click', () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
  showRegisterBtn.parentElement.style.display = 'none';
});
 
// Escuchar cambios en el estado de autenticación
watchAuthState((user) => {
  if (user) {
    console.log("Usuario logueado:", user.email);
    logoutBtn.style.display = 'inline';
    showHomeView();
  } else {
    console.log("Usuario no logueado");
    logoutBtn.style.display = 'none';
    showAuthMessage("");
    showAuthView();
  }
});
 
// Login: validación en cliente + manejo de errores de Firebase
async function iniciarSesion(email, password) {
  // Capa 1: validación en el cliente
  if (!email) {
    return { ok: false, mensaje: "Debes ingresar el correo." };
  }
  if (!password) {
    return { ok: false, mensaje: "Debes ingresar la contraseña." };
  }
 
  // Capa 2: validación de Firebase
  try {
    const credenciales = await loginUser(email, password);
    return { ok: true, usuario: credenciales.user };
  } catch (error) {
    console.log("Código de Firebase:", error.code);
    const mensaje =
      mensajesError[error.code] || "Ocurrió un error inesperado. Intenta de nuevo.";
    return { ok: false, mensaje };
  }
}
 
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  showAuthMessage("");
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
 
  const resultado = await iniciarSesion(email, password);
 
  if (resultado.ok) {
    console.log("Usuario logueado correctamente");
  } else {
    showAuthMessage(resultado.mensaje);
  }
});
 
// Registro
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  showAuthMessage("");
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
 
  if (!email || !password) {
    showAuthMessage("Debes ingresar correo y contraseña.");
    return;
  }
 
  try {
    await registerUser(email, password);
    console.log("Usuario creado correctamente");
  } catch (error) {
    console.log("Código de Firebase:", error.code);
    showAuthMessage(mensajesError[error.code] || "Ocurrió un error inesperado. Intenta de nuevo.");
  }
});
 
// Logout
logoutBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    await logoutUser();
    console.log("Usuario deslogueado correctamente");
  } catch (error) {
    console.log("Código de Firebase:", error.code);
  }
});