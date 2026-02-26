/* ============================================================
   ADMIN PANEL LOGIC
   ============================================================ */

/* 
   IMPORTANT:
   Do NOT redeclare mutedUsers or any global variables here.
   app.js already creates:
   window.mutedUsers = window.mutedUsers || new Set();
*/

document.addEventListener("DOMContentLoaded", () => {
    const adminBtn = document.getElementById("adminBtn");
    const adminPanel = document.getElementById("adminPanel");

    if (adminBtn) {
        adminBtn.addEventListener("click", () => {
            adminPanel.style.display = "block";
        });
    }

    setupAdminControls();
});

/* ============================================================
   ADMIN CONTROLS
   ============================================================ */

function setupAdminControls() {
    const kickBtn = document.getElementById("kickBtn");
    const muteBtn = document.getElementById("muteBtn");
    const announceBtn = document.getElementById("announceBtn");

    if (kickBtn) kickBtn.addEventListener("click", kickUserPrompt);
    if (muteBtn) muteBtn.addEventListener("click", muteUserPrompt);
    if (announceBtn) announceBtn.addEventListener("click", sendAnnouncementPrompt);
}

/* ============================================================
   KICK USER
   ============================================================ */

function kickUserPrompt() {
    const user = prompt("Enter username to kick:");
    if (!user) return;

    const msg = JSON.stringify({
        type: "kick",
        target: user
    });

    client.publish(CONTROL_TOPIC, msg);
}

/* ============================================================
   MUTE USER
   ============================================================ */

function muteUserPrompt() {
    const user = prompt("Enter username to mute:");
    if (!user) return;

    const msg = JSON.stringify({
        type: "mute",
        target: user
    });

    client.publish(CONTROL_TOPIC, msg);
}

/* ============================================================
   ANNOUNCEMENT
   ============================================================ */

function sendAnnouncementPrompt() {
    const text = prompt("Enter announcement text:");
    if (!text) return;

    client.publish(ANNOUNCE_TOPIC, text);
}

/* ============================================================
   HANDLE ADMIN CONTROL MESSAGES
   ============================================================ */

function handleAdminControl(json) {
    try {
        const data = JSON.parse(json);

        if (data.type === "kick" && data.target === username) {
            alert("You were kicked by an admin.");
            location.reload();
        }

        if (data.type === "mute") {
            if (data.target === username) {
                window.mutedUsers.add(username);
                alert("You have been muted by an admin.");
            }
        }

    } catch (e) {
        console.log("Admin control parse error:", e);
    }
}
