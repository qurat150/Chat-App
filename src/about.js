import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";
import { ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";
import { set } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";

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
let globalChatid = ""
let globalMessageId = ""
const searchUser = document.querySelector("#getUserNameFOrChat").value
const chatList = () => {
    document.querySelector(".chatMenu").innerHTML = ""
     userArr.forEach((userObj) => {
        let createChatName = document.createElement("li")
        createChatName.setAttribute("id", userObj.id)
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
        document.querySelector(".chatMenu").append(createChatName)

        createChatName.addEventListener("click" , (event)=>{
            changeMainScreenToChat()
            let gettingDiv = event.target.childNodes[0]
            let gettingName = gettingDiv.innerHTML
            let me = auth.currentUser.uid
            let user = event.currentTarget.id
            console.log(user);
            let uniqueChatId = [me, user].sort().join("")
            globalChatid = uniqueChatId
            getMessages(uniqueChatId)
            const database = getDatabase()
            const gettingMessageId = ref(database, `chatMessages/ (${globalChatid})`)
            console.log(uniqueChatId);
            onChildAdded(gettingMessageId, (snapshot) => {
                const messageId = snapshot.val();
                globalMessageId = messageId
                const setChatIds = ref(database, `chats/ ChatUID/ (${uniqueChatId})`);
                set(setChatIds , {
                    lastMessageSent : (messageId.message)? messageId.message : "empty",
                    members : {
                        0 : auth.currentUser.uid,
                        1 : (gettingName == userObj.username)? userObj.id : "false"
                    }
                })
            });
            document.querySelector(".chatName").innerHTML = gettingName
        })
    })
    // if (!result.length) {
    //     console.log("user not found")
    // };
} 
const changeMainScreenToChat = () => {
    document.querySelector("#messages").innerHTML = ""
    document.querySelector(".chatting-container").style.display = "inline-block"
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const getUserUid = user.uid
            const sendMessage = (e) => {
                e.stopImmediatePropagation()
                let getText = document.querySelector(".inputField-Section")
                let t = new Date()
                let getTimeForDatabase = t.getTime()
                function MessagesData(getUserUid, getText, getTimeForDatabase) {
                    const db = getDatabase();
                    let chatMessages = push(ref(db, `chatMessages/ (${globalChatid})`), {
                        sender: getUserUid,
                        message: getText,
                        timeStamp: getTimeForDatabase
                    });
                }
                MessagesData(getUserUid, getText.value, getTimeForDatabase)
                getText.value = ""
            }
            document.querySelector("#sendMessage").addEventListener("click", sendMessage)
           
        }
        else {window.location.href = "./index.html"}
    })
}
// Getting Messages from database
const getMessages = (globalChatid) =>{
    const messagesRef = ref(db, `chatMessages/ (${globalChatid})`);
onChildAdded(messagesRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data);
    let createMessageBox = document.createElement("div")
    createMessageBox.classList.add("MessageBox")
    let textDiv = document.createElement("div")
    textDiv.classList.add("Chat-text")
    textDiv.innerHTML = data.message
    createMessageBox.append(textDiv)
    let lastSeenDiv = document.createElement("div")
    lastSeenDiv.classList.add("lastSeen")
    createMessageBox.append(lastSeenDiv)
    document.querySelector("#messages").append(createMessageBox)
    lastSeenDiv.innerHTML = data.timeStamp
    if (data.sender == auth.currentUser.uid) {
        createMessageBox.style.margin = "10px 300px"
        createMessageBox.style.backgroundColor = "#176b5b"
        createMessageBox.style.width = "500px"
    }
})
}

const logout = () => {
    firebase.auth().signOut()
}
document.querySelector("#logout").addEventListener("click", logout)







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