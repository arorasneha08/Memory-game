const user = JSON.parse(localStorage.getItem("memoryUser"));
const welcomeText = document.getElementById("welcome-text");
const themeButtons = document.querySelectorAll(".theme-btn");
const subcategoryContainer = document.getElementById("subcategory-container");
const subcategorySelect = document.getElementById("subcategory-select");
const playBtn = document.getElementById("play-btn");
const modal = document.getElementById("start-modal");

if (!user) {
  window.location.href = "../pages/register.html";
}

welcomeText.textContent = `Welcome, ${user.name}! Choose your game theme:`;

// Theme categories
const emojiCategories = ["Animals 🐾", "Faces 😀", "Plants 🌿", "Food 🍔"];
const triviaCategories = ["Science 🔬", "Math ➕", "Geography 🌍", "History 🏺"];

let selectedTheme = "";
let selectedCategory = "";

themeButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (button.classList.contains("emoji")) {
      selectedTheme = "emoji";
      populateCategories(emojiCategories);
    } else {
      selectedTheme = "trivia";
      populateCategories(triviaCategories);
    }

    localStorage.setItem("selectedTheme", selectedTheme);
    subcategoryContainer.classList.remove("hidden");
  });
});

function populateCategories(categories) {
  subcategorySelect.innerHTML = '<option value="" disabled selected>Select category</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    subcategorySelect.appendChild(option);
  });
}

playBtn.addEventListener("click", () => {
  selectedCategory = subcategorySelect.value;

  if (!selectedCategory) {
    alert("Please select a category before starting!");
    return;
  }

  localStorage.setItem("selectedCategory", selectedCategory);

  modal.classList.add("show");

  setTimeout(() => {
    window.location.href = "../pages/game.html";
  }, 1000);
});
