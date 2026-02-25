/* ===========================
   EMOJI LIST
   =========================== */

const emojiList = [
    "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇",
    "🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚",
    "😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥸",
    "🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","☹️",
    "😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡",
    "🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓",
    "🤗","🤔","🤭","🤫","🤥","😶","😐","😑","😬","🙄",
    "😯","😦","😧","😮","😲","🥱","😴","🤤","😪","😵",
    "🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠",
    "😈","👿","👹","👺","💀","☠️","👻","👽","👾","🤖",
    "💩","🔥","✨","🌟","💫","💥","💢","💦","💨","🕳️",
    "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔",
    "💕","💞","💓","💗","💖","💘","💝","💟","👍","👎",
    "👏","🙌","🤝","🙏","💪","👀","👁️","👅","👄","🧠"
];

/* ===========================
   BUILD EMOJI PICKER GRID
   =========================== */

function buildEmojiPicker() {
    const picker = document.getElementById("emojiPicker");
    picker.innerHTML = "";

    emojiList.forEach(e => {
        const span = document.createElement("span");
        span.textContent = e;
        span.addEventListener("click", () => insertEmoji(e));
        picker.appendChild(span);
    });
}

/* ===========================
   INSERT EMOJI INTO MESSAGE BOX
   =========================== */

function insertEmoji(emoji) {
    const msg = document.getElementById("msg");
    msg.value += emoji;
    msg.focus();
}

/* ===========================
   TOGGLE PICKER
   =========================== */

function toggleEmojiPicker() {
    const picker = document.getElementById("emojiPicker");

    if (picker.style.display === "none" || picker.style.display === "") {
        picker.style.display = "grid";
    } else {
        picker.style.display = "none";
    }
}

/* ===========================
   CLOSE PICKER WHEN CLICKING OUTSIDE
   =========================== */

document.addEventListener("click", (e) => {
    const picker = document.getElementById("emojiPicker");
    const btn = document.getElementById("emojiBtn");

    if (!picker || !btn) return;

    const clickedInsidePicker = picker.contains(e.target);
    const clickedButton = btn.contains(e.target);

    if (!clickedInsidePicker && !clickedButton) {
        picker.style.display = "none";
    }
});

/* ===========================
   INITIALIZE
   =========================== */

document.addEventListener("DOMContentLoaded", () => {
    buildEmojiPicker();

    const btn = document.getElementById("emojiBtn");
    if (btn) {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleEmojiPicker();
        });
    }
});
