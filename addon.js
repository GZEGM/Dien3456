// addon.js

// Global variables for language and theme
let currentLanguage = localStorage.getItem("language") || "vi";
let currentTheme = localStorage.getItem("theme") || "dark";

// Function to apply theme
function applyTheme(theme) {
  document.body.classList.remove("dark-mode", "light-mode");
  document.body.classList.add(`${theme}-mode`);
  const themeToggleIcon = document
    .getElementById("themeToggle")
    .querySelector("i");
  if (theme === "dark") {
    themeToggleIcon.classList.remove("fa-moon");
    themeToggleIcon.classList.add("fa-sun");
  } else {
    themeToggleIcon.classList.remove("fa-sun");
    themeToggleIcon.classList.add("fa-moon");
  }
}

// Function to update UI text based on language
function updateUIText() {
  document.getElementById("pageTitle").textContent =
    translations[currentLanguage].addonDetails;
  document.getElementById("headerTitle").textContent =
    translations[currentLanguage].mcpeAddons;
  document.getElementById("navHome").textContent =
    translations[currentLanguage].home;
  document.getElementById("settingsModalTitle").textContent =
    translations[currentLanguage].settings;
  document.getElementById("modalLangLabel").textContent =
    translations[currentLanguage].language + ":";
  document.getElementById("modalThemeLabel").textContent =
    translations[currentLanguage].theme + ":";
  document.getElementById("modalThemeDarkText").textContent =
    translations[currentLanguage].darkMode;
  document.getElementById("modalThemeLightText").textContent =
    translations[currentLanguage].lightMode;

  // Update addon details specific text
  const downloadButton = document.querySelector(".addon-detail .btn");
  if (downloadButton) {
    downloadButton.textContent = translations[currentLanguage].downloadAddon;
  }

  const loadingMessage = document.getElementById("loadingMessage");
  if (loadingMessage) {
    loadingMessage.textContent = translations[currentLanguage].loadingAddon;
  }
}

// Function to load addon details
function loadAddonDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const addonId = parseInt(urlParams.get("id"));
  const addonDetailContent = document.getElementById("addonDetailContent");

  // Check if addonId is a valid number
  if (isNaN(addonId)) {
    addonDetailContent.innerHTML = `<p class="error-message">${translations[currentLanguage].addonNotFound}</p>`;
    return;
  }

  const addon = addons.find((a) => a.id === addonId);

  if (addon) {
    addonDetailContent.innerHTML = `
      <section class="addon-detail">
        <img src="${addon.image}" alt="${
      addon.title[currentLanguage]
    }" onerror="this.onerror=null;this.src='https://placehold.co/600x400/000000/FFFFFF?text=Image+Not+Found';" />
        <div class="addon-info">
          <h2>${addon.title[currentLanguage]}</h2>
          <p>${addon.description[currentLanguage]}</p>
          ${
            addon.video
              ? `<div class="video-container"><iframe src="${addon.video.replace(
                  "watch?v=",
                  "embed/"
                )}" frameborder="0" allowfullscreen></iframe></div>`
              : ""
          }
          <a href="${addon.file}" class="btn" download>${
      translations[currentLanguage].downloadAddon
    }</a>
        </div>
      </section>
    `;
  } else {
    addonDetailContent.innerHTML = `<p class="error-message">${translations[currentLanguage].addonNotFound}</p>`;
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Apply theme and update UI text on load
  applyTheme(currentTheme);
  updateUIText();
  loadAddonDetails(); // Load addon details when DOM is ready

  // Theme Toggle Button
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", currentTheme);
    applyTheme(currentTheme);
    updateUIText();
  });

  // Settings Modal
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsModal = document.getElementById("settingsModal");
  const closeSettingsModal = document.getElementById("closeSettingsModal");

  settingsBtn.addEventListener("click", () => {
    settingsModal.style.display = "block";
  });

  closeSettingsModal.addEventListener("click", () => {
    settingsModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
      settingsModal.style.display = "none";
    }
  });

  // Language Selector in Header
  const langBtn = document.getElementById("langBtn");
  const dropdownContent = langBtn.nextElementSibling;

  dropdownContent.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      currentLanguage = event.target.dataset.lang;
      localStorage.setItem("language", currentLanguage);
      updateUIText();
      loadAddonDetails(); // Reload details with new language
    });
  });

  // Language Selector in Modal
  const modalLangSelect = document.getElementById("modalLangSelect");
  modalLangSelect.value = currentLanguage; // Set initial value
  modalLangSelect.addEventListener("change", (event) => {
    currentLanguage = event.target.value;
    localStorage.setItem("language", currentLanguage);
    updateUIText();
    loadAddonDetails(); // Reload details with new language
  });

  // Modal Theme Buttons
  const modalThemeDark = document.getElementById("modalThemeDark");
  const modalThemeLight = document.getElementById("modalThemeLight");

  modalThemeDark.addEventListener("click", () => {
    currentTheme = "dark";
    localStorage.setItem("theme", currentTheme);
    applyTheme(currentTheme);
    updateUIText();
  });

  modalThemeLight.addEventListener("click", () => {
    currentTheme = "light";
    localStorage.setItem("theme", currentTheme);
    applyTheme(currentTheme);
    updateUIText();
  });

  // Scroll to Top Button
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  window.addEventListener("scroll", () => {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
