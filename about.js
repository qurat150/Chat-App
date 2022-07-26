const auth = firebase.auth()
auth.onAuthStateChanged((user) => {
    if (user) {
        const usersData = firebase.database().ref(`users/${user.uid}`)
        usersData.on("value", (snapshot) => {
            const showData = snapshot.val()
            // alert(`${showData.name} Logged in !`);
        })
    } else window.location.href = "./index.html"
})
const changeMainScreenToChat = () => {
    document.querySelector(".home-container").style.display = "none"
    document.querySelector(".chatting-container").style.display = "block"

    document.addEventListener("click", (event) => {
        let text = event.target
        let getChildDiv = text.childNodes[1]
        getChildDiv.innerHTML = document.querySelector(".names").innerHTML
        console.log(getChildDiv, getChildDiv.innerHTML);

    })
}
const sendMessage = () => {
    let getText = document.querySelector(".inputField-Section")
    let t = new Date()
    let getHours = t.getHours() - 12
    let getMins = t.getMinutes()
    let amPm = "PM"
    if (getHours >= 12) {
        amPm = "AM"
    }
    let finalTime = `${getHours}:${getMins} ${amPm}`

    const database = firebase.database()
    database.ref("messages").push().set({
        message: getText.value,
        time: finalTime
    })
    getText.value = ""
}

const usersData = firebase.database().ref("messages")
usersData.on("child_added", (snapshot) => {
    const showMessages = snapshot.val()

    let createMessageBox = document.createElement("div")
    createMessageBox.classList.add("sendChat")
    let textDiv = document.createElement("div")
    textDiv.classList.add("Chat-text")
    textDiv.innerHTML = showMessages.message
    createMessageBox.append(textDiv)
    lastSeenDiv = document.createElement("div")
    lastSeenDiv.classList.add("lastSeen")
    createMessageBox.append(lastSeenDiv)
    document.querySelector(".nav-chat").append(createMessageBox)
    lastSeenDiv.innerHTML = showMessages.time

})

const logout = () => {
    firebase.auth().signOut()
}