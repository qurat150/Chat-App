const register = () => {
    var registerData = {
        username: document.querySelector("#username").value,
        email: document.querySelector("#regEmail").value,
        password: document.querySelector("#regPassword").value,
    }
    console.log(registerData.email);
    console.log(registerData.password);
    firebase.auth().createUserWithEmailAndPassword(registerData.email, registerData.password)
    .then((res)=>{
        let user = {
            username : registerData.username,
            email : registerData.email ,
            password : registerData.password
        }
        const database = firebase.database()
        database.ref(`users/${res.user.uid}`).set(user)
        .then(()=>{
            alert("New user is Registered !")
        

        console.log(res)
        console.log(user)
        console.log(user.uid)
    })}).catch((err)=>{
            console.log("err=>" , err)
        })
}
const login = () => {
    var loginData = {
        name: document.querySelector("#username").value,
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
    }
    auth.signInWithEmailAndPassword(
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