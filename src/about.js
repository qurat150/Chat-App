import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";

const auth = getAuth();
const database = getDatabase();
let globalChatId = "";
let userArr = [];
let user = null;

// Current User
onAuthStateChanged(auth, (fetchedUser) => {
  if (fetchedUser) {
    user = fetchedUser;
    console.log("user", fetchedUser);
  } else {
    window.location.href = "/dist/authentication.html";
  }
});

// List user
const getUsersRef = ref(database, "users/");
onChildAdded(getUsersRef, (snapshot) => {
  const data = snapshot.val();
  userArr.push(data);
  showChatsList();
});

let createChatItem;
const createChatComponent = (userObj) => {
  createChatItem = document.createElement("li");
  createChatItem.setAttribute("id", userObj.id);
  createChatItem.classList.add("chat-item");

  createChatItem.innerHTML = `
    <div class="profile-section">
      <img src="../dist/images/profile pic1.jpg">
    </div>
    <div class="detail-section">
      <div class="names">${userObj.username}</div>
      <div class="lastSeen"></div>
    </div>
  `;
  document.querySelector(".chatMenu").appendChild(createChatItem);
};

const createUniqueChatId = () => {
  let mineId = auth.currentUser.uid;
  let userId = event.currentTarget.id;
  let uniqueChatId = [mineId, userId].sort().join("");
  return uniqueChatId;
};

const showProfileName = () => {
  let gettingDiv = event.target.childNodes[1];
  let gettingName = gettingDiv.innerHTML;
  document.querySelector(".chatName").innerHTML = gettingName;
};

const showChatsList = () => {
  document.querySelector(".chatMenu").innerHTML = "";
  userArr.forEach((userObj) => {
    createChatComponent(userObj);
    createChatItem.addEventListener("click", () => {
      let u = createUniqueChatId();
      globalChatId = u;
      conversationScreen();
      showProfileName();
    });
  });
};

const conversationScreen = () => {
  document.querySelector("#messages").innerHTML = "";
  document.querySelector(".chatting-container").style.display = "inline-block";
  getMessages();
};

const sendMessage = (e) => {
  e.stopImmediatePropagation();
  const chatPartnerId = user.uid;
  let getText = document.querySelector(".inputField-Section");
  let getTimeForDatabase = new Date().getTime();
  push(ref(database, `chatMessages/ ${globalChatId}`), {
    sender: chatPartnerId,
    message: getText.value,
    timeStamp: getTimeForDatabase,
  });
  getText.value = "";
};
document.querySelector("#sendMessage").addEventListener("click", sendMessage);
const getMessages = () => {
  const conversationId = `chatMessages/ ${globalChatId}`;
  const messagesRef = ref(database, conversationId);
  onChildAdded(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const showMsgTime = moment(data.timeStamp).format("hh:mm A");
    createMessageBox(data, showMsgTime);
  });
};

const createMessageBox = (data, showMsgTime) => {
  const createMessageBox = document.createElement("div");
  createMessageBox.className = "MessageBox";
  createMessageBox.style.width = "500px";
  createMessageBox.style.margin = `10px ${
    data.sender === auth.currentUser.uid ? "400px" : "100px"
  }`;
  createMessageBox.style.backgroundColor =
    data.sender === auth.currentUser.uid ? "#176b5b" : "rgb(48, 59, 66)";

  createMessageBox.innerHTML = `
    <div class="Chat-text">${data.message}</div>
    <div class="lastSeen" style="color: rgba(148, 164, 175, 0.603);">${showMsgTime}</div>
  `;
  document.querySelector("#messages").appendChild(createMessageBox);
  
};

const logout = () => {
  // firebase.auth().signOut();
  signOut(auth);
};
document.querySelector("#logout").addEventListener("click", logout);

// const messagesRef = ref(database, `chatMessages/ (${globalChatId})`);
// onChildAdded(messagesRef, (snapshot) => {
//   const messageId = snapshot.val();
//   console.log(messageId);
//   globalMessageId = messageId;
//   const setChatIds = ref(database, `chats/ ChatUID/ (${uniqueChatId})`);
//   set(setChatIds, {
//     lastMessageSent: messageId.message ? messageId.message : "empty",
//     members: {
//       0: auth.currentUser.uid,
//       1: gettingName == userObj.username ? userObj.id : "false",
//     },
//   });
// });


