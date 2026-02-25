/* ============================================================
   GLOBAL STATE
   ============================================================ */

let client = null;
let username = "";
let currentRoom = "main";
let rooms = ["main"];
let onlineUsers = new Set();
let mutedUsers = new Set();
let lastSeen = {};
let typingTimeouts = {};
let readReceipts = {};
let editingMessageId = null;

/* MQTT topics */
const BASE = "ttg/chat";
const ROOM_TOPIC = room => `${BASE}/${room}`;
const TYPING_TOPIC = room => `${BASE}/${room}/typing`;
const PRESENCE_TOPIC = `${BASE}/presence`;
const CONTROL_TOPIC = `${BASE}/control`;
const ANNOUNCE_TOPIC = `${BASE}/announce`;

/* Flespi token (replace with your real token) */
const token = "g977bmKI5b1CdmpybeBxi4QfXcrGVva0oUvZc4mb9lhxNkIL3L2pXhIfhI7NP2J0";

/* Passwords */
const passwords = {
    "LandonStone202": "landon",
    "A1746471BCBF": "Chris",
    "Randy": "Brandon"
};

/* ============================================================
   INITIALIZATION
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login").style.display = "block";
    setupLogin();
    setupEnterKey();
    setupSendButton();
    setupTypingIndicator();
    setupRoomList();
    setupFileUpload();
});



/* ============================================================
   LOGIN LOGIC
   ============================================================ */

function setupLogin() {
    document.getElementById("loginBtn").addEventListener("click", checkPassword);
}



function checkPassword() {
    let pw = document.getElementById("pw").value.trim();

    if (pw === "*#0*#") {
        document.getElementById("login").style.display = "none";
        document.getElementById("aboutMenu").style.display = "block";
        return;
    }

    let hidden = false;
    if (pw.startsWith("*67")) {
        hidden = true;
        pw = pw.substring(3);
    }

    if (passwords[pw]) {
        username = hidden ? "Unknown User" : passwords[pw];
        startChat();
    } else {
        alert("Invalid password");
    }
}

/* ============================================================
   START CHAT
   ============================================================ */

function startChat() {
    document.getElementById("login").style.display = "none";
    document.getElementById("chat").style.display = "block";

    document.getElementById("currentUserLabel").textContent = username;

    client = mqtt.connect("wss://mqtt.flespi.io:443", {
        username: token,
        password: "",
        clean: true
    });

    client.on("connect", () => {
        joinRoom("main");
        client.subscribe(PRESENCE_TOPIC);
        client.subscribe(CONTROL_TOPIC);
        client.subscribe(ANNOUNCE_TOPIC);

        publishPresence("online");
    });

    client.on("message", (topic, payload) => {
        const text = payload.toString();

        if (topic === PRESENCE_TOPIC) handlePresence(text);
        else if (topic === CONTROL_TOPIC) handleAdminControl(text);
        else if (topic === ANNOUNCE_TOPIC) handleAnnouncement(text);
        else if (topic.endsWith("/typing")) handleTypingMessage(topic, text);
        else handleChatMessage(topic, text);
    });

    window.addEventListener("beforeunload", () => {
        publishPresence("offline");
    });
}

/* ============================================================
   PRESENCE SYSTEM
   ============================================================ */

function publishPresence(state) {
    const msg = JSON.stringify({
        user: username,
        state,
        time: Date.now()
    });
    client.publish(PRESENCE_TOPIC, msg);
}

function handlePresence(json) {
    try {
        const data = JSON.parse(json);
        const user = data.user;

        lastSeen[user] = data.time;

        if (data.state === "online") {
            onlineUsers.add(user);
        } else if (data.state === "offline") {
            onlineUsers.delete(user);
        }

        updateUserList();
    } catch (e) {}
}

/* ============================================================
   ROOM SYSTEM
   ============================================================ */

function setupRoomList() {
    updateRoomList();
}

function updateRoomList() {
    const list = document.getElementById("roomList");
    list.innerHTML = "";

    rooms.forEach(room => {
        const item = document.createElement("div");
        item.className = "roomItem";
        item.textContent = room;
        item.addEventListener("click", () => joinRoom(room));
        list.appendChild(item);
    });
}

function joinRoom(room) {
    if (currentRoom) {
        client.unsubscribe(ROOM_TOPIC(currentRoom));
        client.unsubscribe(TYPING_TOPIC(currentRoom));
    }

    currentRoom = room;

    client.subscribe(ROOM_TOPIC(room));
    client.subscribe(TYPING_TOPIC(room));

    document.getElementById("roomTitle").textContent = room;

    clearChatBox();
}

/* ============================================================
   CHAT MESSAGE HANDLING
   ============================================================ */

function handleChatMessage(topic, text) {
    const room = topic.split("/").pop();
    if (room !== currentRoom) return;

    const colon = text.indexOf(":");
    let sender = "Unknown";
    let message = text;

    if (colon !== -1) {
        sender = text.substring(0, colon).trim();
        message = text.substring(colon + 1).trim();
    }

    addUser(sender);
    addMessage(sender, message);
}

/* ============================================================
   ADD MESSAGE TO UI
   ============================================================ */

function addMessage(sender, message) {
    const box = document.getElementById("chatBox");

    const row = document.createElement("div");
    row.className = "msgRow" + (sender === username ? " self" : "");

    const bubble = document.createElement("div");
    bubble.className = "msgBubble " + (sender === username ? "self" : "other");

    const main = document.createElement("div");
    main.textContent = message;

    const meta = document.createElement("div");
    meta.className = "msgMeta";
    meta.textContent = sender + " • " + new Date().toLocaleTimeString();

    bubble.appendChild(main);
    bubble.appendChild(meta);
    row.appendChild(bubble);

    box.appendChild(row);
    smoothScroll(box);
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */

function smoothScroll(element) {
    element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth"
    });
}

/* ============================================================
   SEND MESSAGE
   ============================================================ */

function setupSendButton() {
    document.getElementById("sendBtn").addEventListener("click", sendMsg);
}

function sendMsg() {
    if (!client || !client.connected) return;

    const input = document.getElementById("msg");
    const message = input.value.trim();
    if (!message) return;

    if (mutedUsers.has(username)) {
        alert("You are muted.");
        return;
    }

    const fullMsg = `${username}: ${message}`;
    client.publish(ROOM_TOPIC(currentRoom), fullMsg);

    addMessage(username, message);
    input.value = "";
}

/* ============================================================
   ENTER KEY SUPPORT
   ============================================================ */

function setupEnterKey() {
    document.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            if (document.getElementById("login").style.display !== "none") {
                checkPassword();
            } else {
                sendMsg();
            }
        }
    });
}

/* ============================================================
   TYPING INDICATOR
   ============================================================ */

function setupTypingIndicator() {
    const msg = document.getElementById("msg");

    msg.addEventListener("input", () => {
        client.publish(TYPING_TOPIC(currentRoom), JSON.stringify({
            user: username,
            typing: true
        }));
    });
}

function handleTypingMessage(topic, json) {
    try {
        const data = JSON.parse(json);
        if (data.user === username) return;

        const indicator = document.getElementById("typingIndicator");
        indicator.textContent = `${data.user} is typing…`;

        clearTimeout(typingTimeouts[data.user]);
        typingTimeouts[data.user] = setTimeout(() => {
            indicator.textContent = "";
        }, 1500);
    } catch (e) {}
}

/* ============================================================
   USER LIST
   ============================================================ */

function addUser(name) {
    if (!name) return;
    onlineUsers.add(name);
    updateUserList();
}

function updateUserList() {
    const list = document.getElementById("userList");
    list.innerHTML = "";

    onlineUsers.forEach(user => {
        const item = document.createElement("div");
        item.className = "userItem";

        const dot = document.createElement("div");
        dot.className = "userDot";

        const label = document.createElement("span");
        label.textContent = user;

        item.appendChild(dot);
        item.appendChild(label);
        list.appendChild(item);
    });
}

/* ============================================================
   ANNOUNCEMENTS
   ============================================================ */

function handleAnnouncement(text) {
    const box = document.getElementById("chatBox");

    const row = document.createElement("div");
    row.style.fontSize = "13px";
    row.style.opacity = "0.8";
    row.style.margin = "6px 0";
    row.style.textAlign = "center";
    row.textContent = "📢 " + text;

    box.appendChild(row);
    smoothScroll(box);
}

/* ============================================================
   FILE UPLOADS
   ============================================================ */

function setupFileUpload() {
    // You can add a file input later if you want
}

/* ============================================================
   CLEAR CHAT
   ============================================================ */

function clearChatBox() {
    document.getElementById("chatBox").innerHTML = "";
}
