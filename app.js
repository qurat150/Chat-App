const register = () => {
    var registerData = {
        name: document.querySelector("#username").value,
        email: document.querySelector("#regEmail").value,
        password: document.querySelector("#regPassword").value,
    }
    auth.createUserWithEmailAndPassword(
        registerData.email,
        registerData.password,
    )
}
const login = () => {
    var loginData = {
        name: document.querySelector("#username").value,
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
    }
    auth.signInWithEmailAndPassword (
        loginData.email,
        loginData.password,
    )
}
const showRegister = () => {
    document.querySelector(".login-main").style.display = "none"
    document.querySelector(".register-main").style.display = "flex"
}
const showLogin = () => {
    document.querySelector(".register-main").style.display = "none"
    document.querySelector(".login-main").style.display = "flex"
}