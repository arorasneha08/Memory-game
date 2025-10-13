const user = JSON.parse(localStorage.getItem("memoryUser"));
const welcomeText = document.getElementById("welcome-text");
const modal = document.getElementById("goodluck-modal");

if (!user) {
    window.location.href = "../pages/register.html";
}

welcomeText.textContent = "Welcome, " + user.name + "! Choose your challenge:";

const buttons = document.querySelectorAll(".difficulty-btn");

buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        let difficulty = "";

        if (button.classList.contains("easy")) {
            difficulty = "easy";
        }
        else if (button.classList.contains("medium")) {
            difficulty = "medium";
        }
        else {
            difficulty = "hard";
        }

        localStorage.setItem("selectedDifficulty", difficulty);

        modal.classList.remove("hidden");

        setTimeout(function () {
            window.location.href = "../pages/game.html";
        }, 1000);
    });
});
