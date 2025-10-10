function makeHash(password) {
    let hash = '';
    for (let i = 0; i < password.length; i++) {
        let code = password.charCodeAt(i) * (i + 1);
        hash += code.toString().slice(-2);
    }
    return hash.split('').reverse().join('');
}

document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const hashedPassword = makeHash(password);

    const users = JSON.parse(localStorage.getItem("memoryUsers")) || [];
    const user = users.find(u => u.email === email && u.password === hashedPassword);

    if (!user) {
        alert("Invalid email or password!");
        return;
    }

    localStorage.setItem("memoryUser", JSON.stringify(user));
    alert("Login successful!");
    window.location.href = "home.html";
});
