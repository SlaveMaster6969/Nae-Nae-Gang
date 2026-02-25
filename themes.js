const THEME_PRESETS = [
    { name: "Blue", accent: "#007bff", accentAlt: "#28a745" },
    { name: "Purple", accent: "#6f42c1", accentAlt: "#20c997" },
    { name: "Mint", accent: "#20c997", accentAlt: "#17a2b8" },
    { name: "Sunset", accent: "#fd7e14", accentAlt: "#e83e8c" },
    { name: "AMOLED", accent: "#4c8dff", accentAlt: "#3acb6a", dark: true }
];

const BG_PRESETS = [
    { name: "Plain", image: "none" },
    { name: "Soft Gradient", image: "linear-gradient(135deg,#fdfbfb,#ebedee)" },
    { name: "Blue Gradient", image: "linear-gradient(135deg,#cfd9df,#e2ebf0)" },
    { name: "Sunset Gradient", image: "linear-gradient(135deg,#f6d365,#fda085)" },
    { name: "Dark Fade", image: "linear-gradient(135deg,#232526,#414345)" }
];

function initThemes() {
    const themeSelect = document.getElementById("themePreset");
    const bgSelect = document.getElementById("bgPreset");

    THEME_PRESETS.forEach((t, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = t.name;
        themeSelect.appendChild(opt);
    });

    BG_PRESETS.forEach((b, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = b.name;
        bgSelect.appendChild(opt);
    });

    themeSelect.addEventListener("change", () => {
        const t = THEME_PRESETS[themeSelect.value];
        if (!t) return;
        document.documentElement.style.setProperty("--accent", t.accent);
        document.documentElement.style.setProperty("--accent-alt", t.accentAlt);
        if (t.dark) document.body.classList.add("dark");
        else document.body.classList.remove("dark");
    });

    bgSelect.addEventListener("change", () => {
        const b = BG_PRESETS[bgSelect.value];
        if (!b) return;
        document.documentElement.style.setProperty("--bg-image", b.image);
    });
}

document.addEventListener("DOMContentLoaded", initThemes);
