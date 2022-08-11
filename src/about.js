import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";
import { ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";

const auth = getAuth()
console.log(auth);
const db = getDatabase();
const getUserForChat = ref(db, 'users/');
let userArr = [];
onChildAdded(getUserForChat, (snapshot) => {
    const data = snapshot.val();
    userArr.push(data)
});
const searchUser = () => {
    console.log(userArr);
    let result = userArr.filter((userObj) => {
        const chatList = document.querySelector("#getUserNameFOrChat").value
        if (chatList == userObj.username) {
            console.log("User Exist");
            let createChatName = document.createElement("li")
            createChatName.setAttribute("id", "li")
            createChatName.classList.add("chat-item")
            let createDiv1 = document.createElement("div")
            createDiv1.classList.add("profile-section")
            let createImgTag = document.createElement("img")
            createImgTag.setAttribute("src", "profile pic1.jpg")
            createChatName.append(createDiv1)
            createDiv1.append(createImgTag)
            let createDiv2 = document.createElement("div")
            createDiv2.classList.add("detail-section")
            createChatName.append(createDiv2)
            let div2SubDiv1 = document.createElement("div")
            div2SubDiv1.classList.add("names")
            div2SubDiv1.innerHTML = chatList
            createDiv2.append(div2SubDiv1)
            let div2SubDiv2 = document.createElement("div")
            div2SubDiv2.classList.add("lastSeen")
            createDiv2.append(div2SubDiv2)
            console.log(createChatName);
            document.querySelector(".chats").append(createChatName)
            return true
        }
    })
    if (!result.length) {
        console.log("user not found")
    };

}
document.querySelector(".searchButton").addEventListener("click", searchUser)

// suggestions code 
let createSuggestions = document.createElement("div")
createSuggestions.classList.add("helloss")
document.querySelector("#searchSuggestion").append(createSuggestions)
console.log(createSuggestions);
const userSuggestions = () => {
    userArr.forEach((userObj) => {
        createSuggestions.innerHTML += userObj.username + "<br/>"


    })
}
document.querySelector("#getUserNameFOrChat").addEventListener("click", userSuggestions)

const changeMainScreenToChat = () => {
    document.querySelector(".home-container").style.display = "none"
    document.querySelector(".chatting-container").style.display = "block"

    const auth = getAuth()

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const getUserUid = user.uid

            const sendMessage = () => {
                let getText = document.querySelector(".inputField-Section")
                let t = new Date()
                let getTimeForDatabase = t.getTime()

                function MessagesData(getUserUid, getText, getTimeForDatabase) {
                    const db = getDatabase();
                    push(ref(db, 'messages'), {
                        sender: getUserUid,
                        message: getText,
                        timeStamp: getTimeForDatabase
                    });
                }
                MessagesData(getUserUid, getText.value, getTimeForDatabase)
                getText.value = ""
            }

            document.querySelector("#sendMessage").addEventListener("click", sendMessage)
            const db = getDatabase();
            const messagesRef = ref(db, 'messages');
            onChildAdded(messagesRef, (snapshot) => {
                const data = snapshot.val();
                console.log(auth.currentUser.uid);
                console.log(data);
                let createMessageBox = document.createElement("div")
                createMessageBox.classList.add("sendChat")
                let textDiv = document.createElement("div")
                textDiv.classList.add("Chat-text")
                textDiv.innerHTML = data.message
                createMessageBox.append(textDiv)
                let lastSeenDiv = document.createElement("div")
                lastSeenDiv.classList.add("lastSeen")
                createMessageBox.append(lastSeenDiv)
                document.querySelector(".chatting-container").append(createMessageBox)
                console.log(createMessageBox);
                lastSeenDiv.innerHTML = data.timeStamp
                if (data.sender == auth.currentUser.uid) {
                    createMessageBox.style.margin = "10px 110px"
                    createMessageBox.style.backgroundColor = "#176b5b"
                    createMessageBox.style.width = "500px"
                }

            })
        } else window.location.href = "./index.html"
    })
}

const logout = () => {
    firebase.auth().signOut()
}
document.querySelector("#logout").addEventListener("click", logout)
document.getElementById("li").addEventListener("click", () => {
    changeMainScreenToChat()
})









 // let t = new Date()
    // let getHours = t.getHours() - 12
    // let getMins = t.getMinutes()
    // let amPm = "PM"
    // if (getHours >= 12) {
    //     amPm = "AM"
    // }
  // let finalTime = `${getHours}:${getMins} ${amPm}`