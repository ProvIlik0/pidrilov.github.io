/* =========================
   VISITS (1 PER SESSION AFTER ACTION)
   ========================= */

const visitsEl = document.getElementById("visits");

let visits = Number(localStorage.getItem("visits") || 0);
let actionDone = sessionStorage.getItem("actionDone") === "true";

updateVisitsUI();

function registerAction() {
    if (!actionDone) {
        visits++;
        localStorage.setItem("visits", visits);
        sessionStorage.setItem("actionDone", "true");
        actionDone = true;
        updateVisitsUI();
    }
}

function updateVisitsUI() {
    if (visitsEl) {
        visitsEl.textContent = "Visits: " + visits;
    }
}

/* =========================
   AUTH TABS (ANIMATED)
   ========================= */

const registerTab = document.getElementById("register");
const loginTab = document.getElementById("login");

function showRegister() {
    registerTab.style.display = "block";
    loginTab.style.display = "none";
}

function showLogin() {
    registerTab.style.display = "none";
    loginTab.style.display = "block";
}

/* =========================
   AUTH LOGIC
   ========================= */

function register() {
    const login = regLogin.value;
    const pass = regPass.value;

    if (/[а-яА-Я\s]/.test(login)) {
        regError.textContent = "Нельзя использовать русские буквы или пробелы";
        return;
    }

    localStorage.setItem("user", JSON.stringify({ login, pass }));
    auth.style.display = "none";
    app.style.display = "block";

    registerAction();
}

function login() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    if (logLogin.value === user.login && logPass.value === user.pass) {
        auth.style.display = "none";
        app.style.display = "block";
        registerAction();
    }
}

function logout() {
    app.style.display = "none";
    auth.style.display = "block";
}

/* =========================
   NICK GENERATOR + HISTORY
   ========================= */

let historyArr = JSON.parse(localStorage.getItem("nickHistory") || "[]");

function generateNick() {
    const base = baseNick.value || "";
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

    let rand = "";
    for (let i = 0; i < 6; i++) {
        rand += chars[Math.floor(Math.random() * chars.length)];
    }

    const nick = base + rand;
    nickResult.textContent = nick;

    historyArr.unshift(nick);
    if (historyArr.length > 5) historyArr.pop();

    localStorage.setItem("nickHistory", JSON.stringify(historyArr));
    renderHistory();

    registerAction();
}

function renderHistory() {
    history.innerHTML = historyArr.join("<br>");
}

function toggleHistory() {
    history.style.display =
        history.style.display === "block" ? "none" : "block";
}

renderHistory();

/* =========================
   PASSWORD GENERATOR
   ========================= */

function generatePassword() {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pass = "";

    for (let i = 0; i < 12; i++) {
        pass += chars[Math.floor(Math.random() * chars.length)];
    }

    passResult.textContent = pass;

    registerAction();
}
