import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import {
  ref,
  set,
  getDatabase,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";

const auth = getAuth();
const db = getDatabase();

const register = () => {
  const username = document.querySelector("#username").value;
  const email = document.querySelector("#regEmail").value;
  const password = document.querySelector("#regPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((usercredentials) => {
      const getUserUid = usercredentials.user.uid;
      console.log(usercredentials);
      set(ref(db, `users/ userUID (${username})`), {
        username: username,
        id: getUserUid,
        email: email,
      });
      setTimeout(() => {
        window.location.href = "../dist/whatsapp.html";
      }, 2000);
    })
    .catch((err) => {
      console.log("err => " + err.message);
    });
};
document.querySelector("#register").addEventListener("click", register);

const login = () => {
  var loginData = {
    name: document.querySelector("#username").value,
    email: document.querySelector("#email").value,
    password: document.querySelector("#password").value,
  };
  signInWithEmailAndPassword(auth, loginData.email, loginData.password).then(
    () => {
      setTimeout(() => {
        window.location.href = "../dist/whatsapp.html";
      }, 2000);
    }
  );
};
document.querySelector("#login").addEventListener("click", login);

const showRegisterPage = () => {
  document.querySelector(".login-main").style.display = "none";
  document.querySelector(".register-main").style.display = "flex";
};
document
  .querySelector("#showRegister")
  .addEventListener("click", showRegisterPage);

const showLoginPage = () => {
  document.querySelector(".register-main").style.display = "none";
  document.querySelector(".login-main").style.display = "flex";
};
document.querySelector("#showLogin").addEventListener("click", showLoginPage);
