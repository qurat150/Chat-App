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
    chatList()
});
const searchUser = document.querySelector("#getUserNameFOrChat").value
const chatList = () => {
    document.getElementById("chatMenu").innerHTML = ""
    let result = userArr.filter((userObj) => {
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
        div2SubDiv1.innerHTML = userObj.username
        createDiv2.append(div2SubDiv1)
        let div2SubDiv2 = document.createElement("div")
        div2SubDiv2.classList.add("lastSeen")
        createDiv2.append(div2SubDiv2)
        createChatName.addEventListener("click", changeMainScreenToChat)
        document.querySelector("#chatMenu").append(createChatName)
        return true

    })
    // if (!result.length) {
    //     console.log("user not found")
    // };
}
let onSearch = ()=>{
    let checking = userArr.filter((userObj)=>{
        if (document.querySelector("#getUserNameFOrChat").value == userObj.username) {
            let me = auth.currentUser.uid
            console.log(me);
            let user = document.querySelector("#getUserNameFOrChat").value
            console.log(document.querySelector("#getUserNameFOrChat").value );
            let uniqueChatId = [me, user].sort().join("")
            console.log(uniqueChatId);
        } else { console.log("user"); }
    })
}
document.querySelector(".searchButton").addEventListener("click" , onSearch)
const changeMainScreenToChat = () => {
    document.querySelector(".chatting-container").style.display = "inline-block"

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
                // console.log(auth.currentUser.uid);
                let createMessageBox = document.createElement("div")
                createMessageBox.classList.add("MessageBox")
                let textDiv = document.createElement("div")
                textDiv.classList.add("Chat-text")
                textDiv.innerHTML = data.message
                createMessageBox.append(textDiv)
                let lastSeenDiv = document.createElement("div")
                lastSeenDiv.classList.add("lastSeen")
                createMessageBox.append(lastSeenDiv)
                document.querySelector(".chatting-container").append(createMessageBox)
                lastSeenDiv.innerHTML = data.timeStamp
                if (data.sender == auth.currentUser.uid) {
                    createMessageBox.style.margin = "10px 300px"
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
document.getElementById("chatMenu li").addEventListener("click", () => {
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


    // document.body.addEventListener("load", chatList)
    // document.querySelector(".searchButton").addEventListener("click", chatList)
    // suggestions code 
    // let createSuggestions = document.createElement("div")
    // createSuggestions.classList.add("helloss")
    // document.querySelector("#searchSuggestion").append(createSuggestions)
    // console.log(createSuggestions);
    // const userSuggestions = () => {
    //     userArr.forEach((userObj) => {
    //         createSuggestions.innerHTML += userObj.username + "<br/>"
    
    
    //     })
    // }
    // document.querySelector("#getUserNameFOrChat").addEventListener("click", userSuggestions)