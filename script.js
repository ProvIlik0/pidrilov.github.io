function $(id){return document.getElementById(id);}

/* ---------- UI ---------- */
function showReg(){
    $("regBox").classList.remove("hidden");
    $("loginBox").classList.add("hidden");
    $("tabReg").classList.add("active");
    $("tabLogin").classList.remove("active");
}

function showLogin(){
    $("loginBox").classList.remove("hidden");
    $("regBox").classList.add("hidden");
    $("tabLogin").classList.add("active");
    $("tabReg").classList.remove("active");
}

/* ---------- VALIDATION ---------- */
function validateLogin(login){
    if(/[А-Яа-яЁё]/.test(login)) return "Нельзя использовать русские буквы";
    if(/\s/.test(login)) return "Нельзя использовать пробелы";
    if(!/^[a-zA-Z0-9_]+$/.test(login)) return "Разрешены: a-z A-Z 0-9 _";
    if(login.length < 3) return "Минимум 3 символа";
    return "";
}

/* ---------- AUTH ---------- */
function register(){
    const login = $("regLogin").value.trim();
    const pass = $("regPass").value.trim();
    const err = validateLogin(login);
    $("regError").innerText = err;
    if(err || !pass) return;

    localStorage.setItem("account", JSON.stringify({
        login, pass, expires:null
    }));
    localStorage.setItem("auth","true");
    init();
}

function createTemp(){
    localStorage.setItem("account", JSON.stringify({
        login:"Temp"+Math.floor(Math.random()*10000),
        pass:"",
        expires:Date.now()+30*60*1000
    }));
    localStorage.setItem("auth","true");
    init();
}

function login(){
    const l = $("loginLogin").value.trim();
    const p = $("loginPass").value.trim();
    const acc = JSON.parse(localStorage.getItem("account"));
    if(!acc || acc.login!==l || acc.pass!==p) return;
    localStorage.setItem("auth","true");
    init();
}

function logout(){
    localStorage.removeItem("auth");
    init();
}

/* ---------- TIMER ---------- */
function startTimer(exp){
    const t = $("timer");
    t.classList.remove("hidden");
    setInterval(()=>{
        const left = exp - Date.now();
        if(left<=0){
            localStorage.clear();
            location.reload();
        }
        const m = Math.floor(left/60000);
        const s = Math.floor((left%60000)/1000);
        t.innerText = `Осталось ${m}:${s.toString().padStart(2,"0")}`;
    },1000);
}

/* ---------- GENERATOR ---------- */
function randFrom(a){return a[Math.floor(Math.random()*a.length)];}

function generateNickname(){
    const baseInput = $("nameInput").value.trim();
    const base = baseInput || "player";

    const prefixes = ["x","real","dark","neo","pro","its","mr",""];
    const suffixes = ["gg","tv","xd","fps","lol","yt",""];
    const numbers = ["7","9","13","21","77","99","1337",""];

    function stylize(text){
        return text
            .replace(/a/gi, () => Math.random() > 0.7 ? "4" : "a")
            .replace(/e/gi, () => Math.random() > 0.7 ? "3" : "e")
            .replace(/o/gi, () => Math.random() > 0.7 ? "0" : "o")
            .replace(/i/gi, () => Math.random() > 0.8 ? "1" : "i");
    }

    let nick =
        randFrom(prefixes) +
        stylize(base) +
        randFrom(suffixes) +
        randFrom(numbers);

    const mode = $("caseSelect").value;
    if(mode === "upper") nick = nick.toUpperCase();
    if(mode === "lower") nick = nick.toLowerCase();
    if(mode === "random"){
        nick = nick.split("")
            .map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase())
            .join("");
    }

    $("nicknameResult").innerText = nick;
    saveNickHistory(nick);
}


function generatePassword(){
    const c="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    let p="";
    for(let i=0;i<14;i++) p+=randFrom(c);
    $("passwordResult").innerText=p;
}

/* ---------- INIT ---------- */
function init(){
    const auth=$("auth"), app=$("app"), timer=$("timer");
    const acc=JSON.parse(localStorage.getItem("account"));
    const ok=localStorage.getItem("auth")==="true";

    if(ok && acc){
        auth.classList.add("hidden");
        app.classList.remove("hidden");
        if(acc.expires) startTimer(acc.expires);
        else timer.classList.add("hidden");
    }else{
        auth.classList.remove("hidden");
        app.classList.add("hidden");
        timer.classList.add("hidden");
    }
}

init();

function saveNickHistory(nick){
    let history = JSON.parse(localStorage.getItem("nickHistory")) || [];
    history.unshift(nick);

    // убираем повторы
    history = [...new Set(history)];

    // максимум 10
    history = history.slice(0, 10);

    localStorage.setItem("nickHistory", JSON.stringify(history));
}


function renderHistory(){
    const box = $("historyBox");
    let history = JSON.parse(localStorage.getItem("nickHistory")) || [];
    if(history.length === 0){
        box.innerHTML = "История пуста";
        return;
    }

    box.innerHTML = history.map(n =>
        `<div style="cursor:pointer" onclick="copyText('${n}')">${n}</div>`
    ).join("");
}

function toggleHistory(){
    const box = $("historyBox");
    box.classList.toggle("hidden");
    renderHistory();
}

function copyText(text){
    navigator.clipboard.writeText(text);
}

(function countVisits(){
    let visits = localStorage.getItem("siteVisits");
    visits = visits ? parseInt(visits) + 1 : 1;
    localStorage.setItem("siteVisits", visits);
    const v = document.getElementById("visits");
    if(v) v.innerText = "Visits: " + visits;
})();

/* =========================
   VISITS COUNTER (GoatCounter)
   ========================= */

// ждём загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
    const visitsEl = document.getElementById("visits");

    if (!visitsEl) return;

    // стартовое значение (для анимации)
    let current = 0;
    visitsEl.textContent = "Visits: ...";

    // GoatCounter даёт данные через глобальный объект
    function tryGetVisits() {
        if (window.goatcounter && window.goatcounter.visit_count) {
            const realCount = window.goatcounter.visit_count;
            animateCounter(visitsEl, realCount);
        } else {
            // если данные ещё не пришли — пробуем снова
            setTimeout(tryGetVisits, 500);
        }
    }

    tryGetVisits();
});

/* =========================
   ANIMATION
   ========================= */

function animateCounter(element, target) {
    let value = 0;
    const duration = 800; // мс
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = Math.max(1, Math.floor(target / steps));

    const timer = setInterval(() => {
        value += increment;
        if (value >= target) {
            value = target;
            clearInterval(timer);
        }
        element.textContent = `Visits: ${value}`;
    }, stepTime);
}

