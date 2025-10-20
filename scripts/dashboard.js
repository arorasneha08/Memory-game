const user = JSON.parse(localStorage.getItem("memoryUser"));
const userInfo = document.getElementById("user-info");
const homeBtn = document.getElementById("home-btn");
const logoutBtn = document.getElementById("logout-btn");
const historyBody = document.getElementById("history-body");

if (!user) window.location.href = "../pages/register.html";

userInfo.textContent = `Welcome back, ${user.name} (${user.email})`;

function renderHistory() {
    const gameHistory = JSON.parse(localStorage.getItem("gameHistory")) || [];
    historyBody.innerHTML = "";

    if (gameHistory.length === 0) {
        historyBody.innerHTML = `<tr><td colspan="4">No games played yet.</td></tr>`;
    } else {
        gameHistory.slice().reverse().forEach(game => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${game.player}</td>
                <td>${game.moves}</td>
                <td>${game.time}</td>
                <td style="color:${game.status.includes("Win") ? "#00b894" : "#d63031"}">
                    ${game.status}
                </td>
            `;
            historyBody.appendChild(row);
        });
    }
}

renderHistory();

homeBtn.addEventListener("click", () => {
    window.location.href = "../pages/level.html";
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("memoryUser");
    localStorage.removeItem("selectedDifficulty");
    window.location.href = "../pages/register.html";
});
