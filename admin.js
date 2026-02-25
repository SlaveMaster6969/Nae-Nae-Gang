/* ===========================
   ADMIN CONFIG
   =========================== */

// You can change this to any password you want
const ADMIN_PASSWORD = "MASTERADMIN123";

// Track muted users
let mutedUsers = new Set();

/* ===========================
   ADMIN PANEL OPEN/CLOSE
   =========================== */

document.addEventListener("DOMContentLoaded", () => {
    const adminBtn = document.getElementById("adminBtn");
    const adminPanel = document.getElementById("adminPanel");

    adminBtn.addEventListener("click", () => {
        const pw = prompt("Enter admin password:");
        if (pw === ADMIN_PASSWORD) {
            adminPanel.style.display = "flex";
        } else {
            alert("Incorrect admin password");
        }
    });
});

/* ===========================
   MQTT CONTROL TOPICS
   =========================== */

const CONTROL_TOPIC = "ttg/chat/control";
const ANNOUNCE_TOPIC = "ttg/chat/announce";

/* ===========================
   HANDLE CONTROL MESSAGES
   =========================== */

function handleAdminControl(json) {
    try {
        const data = JSON.parse(json);

        if (data.action === "kick" && data.target === username) {
            alert("You have been kicked by an admin.");
            location.reload();
        }

        if (data.action === "mute" && data.target === username) {
            mutedUsers.add(username);
            alert("You have been muted by an admin.");
        }

    } catch (e) {
        console.error("Invalid admin control message");
    }
}

/* ===========================
   SEND ADMIN COMMANDS
   =========================== */

function sendKickCommand() {
    const target = prompt("Kick which user?");
    if (!target) return;

    const msg = JSON.stringify({
        action: "kick",
        target
    });

    client.publish(CONTROL_TOPIC, msg);
}

function sendMuteCommand() {
    const target = prompt("Mute which user?");
    if (!target) return;

    const msg = JSON.stringify({
        action: "mute",
        target
    });

    client.publish(CONTROL_TOPIC, msg);
}

function sendAnnouncement() {
    const text = prompt("Announcement text:");
    if (!text) return;

    client.publish(ANNOUNCE_TOPIC, text);
}

/* ===========================
   ADMIN PANEL BUTTONS
   =========================== */

document.addEventListener("DOMContentLoaded", () => {
    const kickBtn = document.getElementById("kickBtn");
    const muteBtn = document.getElementById("muteBtn");
    const announceBtn = document.getElementById("announceBtn");

    kickBtn.addEventListener("click", sendKickCommand);
    muteBtn.addEventListener("click", sendMuteCommand);
    announceBtn.addEventListener("click", sendAnnouncement);
});
