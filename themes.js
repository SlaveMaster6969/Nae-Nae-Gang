/* ===========================
   THEME PRESETS
   =========================== */

const themes = {
    blue: {
        "--accent": "#007bff",
        "--accent-alt": "#28a745",
        "--bubble-self": "#007bff",
        "--bubble-other": "#e5e5ea",
        "--bg": "#ffffff",
        "--bg-alt": "#f5f5f5",
        "--text": "#222",
        "--border": "#ddd"
    },

    purple: {
        "--accent": "#8a2be2",
        "--accent-alt": "#6a5acd",
        "--bubble-self": "#8a2be2",
        "--bubble-other": "#f0e6ff",
        "--bg": "#ffffff",
        "--bg-alt": "#f7f2ff",
        "--text": "#222",
        "--border": "#d8c8ff"
    },

    mint: {
        "--accent": "#2ecc71",
        "--accent-alt": "#27ae60",
        "--bubble-self": "#2ecc71",
        "--bubble-other": "#e8fff3",
        "--bg": "#ffffff",
        "--bg-alt": "#f3fff8",
        "--text": "#222",
        "--border": "#c8f7dc"
    },

    sunset: {
        "--accent": "#ff6b6b",
        "--accent-alt": "#ffa06b",
        "--bubble-self": "#ff6b6b",
        "--bubble-other": "#ffe8e8",
        "--bg": "#ffffff",
        "--bg-alt": "#fff4f0",
        "--text": "#222",
        "--border": "#ffd2c2"
    },

    amoled: {
        "--accent": "#4c8dff",
        "--accent-alt": "#3acb6a",
        "--bubble-self": "#4c8dff",
        "--bubble-other": "#1f1f1f",
        "--bg": "#000000",
        "--bg-alt": "#0d0d0d",
        "--text": "#f5f5f5",
        "--border": "#222"
    }
};

/* ===========================
   APPLY THEME
   =========================== */

function applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;

    Object.keys(theme).forEach(key => {
        document.documentElement.style.setProperty(key, theme[key]);
    });

    localStorage.setItem("chatTheme", themeName);
}

/* ===========================
   LOAD SAVED THEME
   =========================== */

function loadSavedTheme() {
    const saved = localStorage.getItem("chatTheme");
    if (saved && themes[saved]) {
        applyTheme(saved);
    }
}

/* ===========================
   BACKGROUND PRESETS
   =========================== */

const backgrounds = [
    "none",
    "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"
];

function applyBackground(index) {
    const bg = backgrounds[index] || "none";
    document.body.style.background = bg;
    localStorage.setItem("chatBackground", index);
}

function loadSavedBackground() {
    const saved = localStorage.getItem("chatBackground");
    if (saved !== null) {
        applyBackground(parseInt(saved));
    }
}

/* ===========================
   THEME TOGGLE BUTTON
   =========================== */

document.addEventListener("DOMContentLoaded", () => {
    loadSavedTheme();
    loadSavedBackground();

    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const keys = Object.keys(themes);
            const current = localStorage.getItem("chatTheme") || "blue";
            const nextIndex = (keys.indexOf(current) + 1) % keys.length;
            applyTheme(keys[nextIndex]);
        });
    }
});
