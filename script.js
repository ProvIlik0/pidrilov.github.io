/* ===== AUTH ===== */

function showRegister(){
    document.getElementById("register").style.display="block";
    document.getElementById("login").style.display="none";
}

function showLogin(){
    document.getElementById("register").style.display="none";
    document.getElementById("login").style.display="block";
}

function register(){
    const login = regLogin.value;

    if(/[а-яА-Я\s]/.test(login)){
        regError.textContent = "Нельзя использовать русские буквы или пробелы";
        return;
    }

    localStorage.setItem("user", JSON.stringify({
        login,
        pass: regPass.value
    }));

    auth.style.display="none";
    app.style.display="block";
}

function login(){
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user) return;

    if(logLogin.value === user.login && logPass.value === user.pass){
        auth.style.display="none";
        app.style.display="block";
    }
}

function logout(){
    app.style.display="none";
    auth.style.display="block";
}

/* ===== NICK ===== */

function generateNick(){
    const base = baseNick.value;
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let r="";
    for(let i=0;i<6;i++){
        r+=chars[Math.floor(Math.random()*chars.length)];
    }
    nickResult.textContent = base + r;
}

/* ===== PASSWORD ===== */

function generatePassword(){
    const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    let p="";
    for(let i=0;i<12;i++){
        p+=chars[Math.floor(Math.random()*chars.length)];
    }
    passResult.textContent = p;
}
