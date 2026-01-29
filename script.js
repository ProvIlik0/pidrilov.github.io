/* =========================
   THEME
   ========================= */
function setTheme(t){
    document.body.className = t;
    localStorage.setItem("theme", t);
}
document.body.className = localStorage.getItem("theme") || "dark";

/* =========================
   VISITS (1 PER SESSION AFTER ACTION)
   ========================= */
let visits = Number(localStorage.getItem("visits") || 0);
let sessionUsed = sessionStorage.getItem("used");

const visitsEl = document.getElementById("visits");
updateVisits();

function action(){
    if(!sessionUsed){
        visits++;
        localStorage.setItem("visits", visits);
        sessionStorage.setItem("used", "1");
        sessionUsed = true;
        updateVisits();
    }
}

function updateVisits(){
    if(visitsEl){
        visitsEl.textContent = "Visits: " + visits;
    }
}

/* =========================
   AUTH UI (TABS WITH COLOR CHANGE)
   ========================= */
function showRegister(){
    register.style.display = "block";
    login.style.display = "none";
    tabReg.classList.add("active");
    tabLog.classList.remove("active");
}

function showLogin(){
    register.style.display = "none";
    login.style.display = "block";
    tabLog.classList.add("active");
    tabReg.classList.remove("active");
}

/* =========================
   AUTH LOGIC
   ========================= */
function register(){
    const err = valid(regLogin.value, regPass.value);
    if(err){
        regError.textContent = err;
        return;
    }

    localStorage.setItem("user", JSON.stringify({
        l: regLogin.value,
        p: regPass.value
    }));

    regError.textContent = "Аккаунт создан. Войди 👇";
    regError.style.color = "#7CFF7C";

    // переключаем вкладку на ВХОД
    showLogin();

    // подставляем логин
    logLogin.value = regLogin.value;
    logPass.value = "";
    logPass.focus();

    action();
}


function login(){
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user) return;

    if(logLogin.value === user.l && logPass.value === user.p){
        auth.style.display = "none";
        app.style.display = "block";
        action();
    }
}

function logout(){
    app.style.display = "none";
    auth.style.display = "block";
    showLogin();
}

/* =========================
   TEMP ACCOUNT (30 MIN)
   ========================= */
let tempTimer;

function createTemp(){
    let t = 1800;
    timer.style.display = "block";
    auth.style.display = "none";
    app.style.display = "block";
    action();

    clearInterval(tempTimer);
    tempTimer = setInterval(() => {
        t--;
        timer.textContent = `Осталось ${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`;
        if(t <= 0){
            clearInterval(tempTimer);
            logout();
        }
    }, 1000);
}

/* =========================
   NICK + HISTORY
   ========================= */
let hist = JSON.parse(localStorage.getItem("hist") || "[]");

function generateNick(){
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let r = "";
    for(let i=0;i<6;i++) r += chars[Math.random()*chars.length|0];

    const nick = (baseNick.value || "") + r;
    nickResult.textContent = nick;

    hist.unshift(nick);
    if(hist.length > 5) hist.pop();
    localStorage.setItem("hist", JSON.stringify(hist));
    renderHistory();

    action();
}

function renderHistory(){
    history.innerHTML = hist.join("<br>");
}

function toggleHistory(){
    history.style.display =
        history.style.display === "block" ? "none" : "block";
}

renderHistory();

/* =========================
   PASSWORD
   ========================= */
function generatePassword(){
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let p = "";
    for(let i=0;i<12;i++) p += chars[Math.random()*chars.length|0];
    passResult.textContent = p;
    action();
}

