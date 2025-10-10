function makeHash(password) {
    let hash = '';
    for (let i = 0; i < password.length; i++) {
        let code = password.charCodeAt(i) * (i + 1);
        hash += code.toString().slice(-2); // take last two digits of each step
    }
    return hash.split('').reverse().join('');
}

document.getElementById("register-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!name || !email || !password) {
        alert("Please fill out all fields!");
        return;
    }

    for (let i = 0; i < name.length; i++) {
        const char = name[i];
        if (!(char >= "A" && char <= "Z") && !(char >= "a" && char <= "z") && char !== " ") {
            alert("Name should only contain letters and spaces.");
            nameInput.focus();
            return;
        }
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email address.");
        emailInput.focus();
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        passwordInput.focus();
        return;
    }

    const atIndex = email.indexOf("@");
    const dotIndex = email.lastIndexOf(".");
    if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex === email.length - 1) {
        alert("Invalid email format.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("memoryUsers")) || [];
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
        alert("This email is already registered. Please use a different one.");
        return;
    }

    const hashedPassword = makeHash(password);
    const newUser = { name, email, password: hashedPassword };

    users.push(newUser);
    localStorage.setItem("memoryUsers", JSON.stringify(users));
    localStorage.setItem("memoryUser", JSON.stringify(newUser));

    alert("Registration successful!");
    window.location.href = "../pages/home.html";
});

document.getElementById("dashboard-btn").addEventListener("click", () => {
    window.location.href = "../pages/dashboard.html";
});
