// script.js

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
    translations[currentLanguage].addonGallery;
  document.getElementById("headerTitle").textContent =
    translations[currentLanguage].mcpeAddons;
  document.getElementById("navHome").textContent =
    translations[currentLanguage].home;
  document.getElementById("addonSearch").placeholder =
    translations[currentLanguage].searchPlaceholder;
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

  // Update selected language in modal
  document.getElementById("modalLangSelect").value = currentLanguage;

  // Update theme button text in modal
  if (currentTheme === "dark") {
    document.getElementById("modalThemeDark").classList.add("active");
    document.getElementById("modalThemeLight").classList.remove("active");
  } else {
    document.getElementById("modalThemeDark").classList.remove("active");
    document.getElementById("modalThemeLight").classList.add("active");
  }

  // Re-render addon cards to apply new language
  renderAddonCards(addons);
}

// Function to render addon cards
function renderAddonCards(filteredAddons) {
  const container = document.getElementById("addonList");
  container.innerHTML = ""; // Clear existing cards

  if (filteredAddons.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--dark-secondary-text);">${
      currentLanguage === "vi"
        ? "Không tìm thấy addon nào phù hợp."
        : "No matching addons found."
    }</p>`;
    return;
  }

  filteredAddons.forEach((addon) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${addon.image}" alt="${addon.title[currentLanguage]}" onerror="this.onerror=null;this.src='https://placehold.co/160x120/333333/FFFFFF?text=No+Image';" />
      <div class="info">
        <h3>${addon.title[currentLanguage]}</h3>
        <p>${addon.description[currentLanguage]}</p>
      </div>
    `;
    card.onclick = () => {
      window.location.href = `addon.html?id=${addon.id}`;
    };
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(currentTheme);
  updateUIText(); // Initial UI text update

  // Initial render of all addons
  renderAddonCards(addons);

  // Event Listeners for Header Controls
  // Language Dropdown
  document.querySelectorAll(".dropdown-content a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentLanguage = e.target.dataset.lang;
      localStorage.setItem("language", currentLanguage);
      updateUIText();
      // Re-apply search filter after language change
      filterAddons();
    });
  });

  // Theme Toggle
  document.getElementById("themeToggle").addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", currentTheme);
    applyTheme(currentTheme);
    updateUIText(); // Update modal theme buttons
  });

  // Settings Modal
  const settingsModal = document.getElementById("settingsModal");
  const settingsBtn = document.getElementById("settingsBtn");
  const closeSettingsModal = document.getElementById("closeSettingsModal");
  const modalLangSelect = document.getElementById("modalLangSelect");
  const modalThemeDark = document.getElementById("modalThemeDark");
  const modalThemeLight = document.getElementById("modalThemeLight");

  settingsBtn.addEventListener("click", () => {
    settingsModal.style.display = "block";
    updateUIText(); // Ensure modal content is in current language and theme buttons are active
  });

  closeSettingsModal.addEventListener("click", () => {
    settingsModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == settingsModal) {
      settingsModal.style.display = "none";
    }
  });

  // Modal Language Select
  modalLangSelect.addEventListener("change", (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem("language", currentLanguage);
    updateUIText();
    // Re-apply search filter after language change
    filterAddons();
  });

  // Modal Theme Buttons
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

  // Search functionality
  const addonSearchInput = document.getElementById("addonSearch");

  function filterAddons() {
    const searchTerm = addonSearchInput.value.toLowerCase();
    const filteredAddons = addons.filter((addon) => {
      const titleVi = addon.title.vi.toLowerCase();
      const descriptionVi = addon.description.vi.toLowerCase();
      const titleEn = addon.title.en.toLowerCase();
      const descriptionEn = addon.description.en.toLowerCase();

      return (
        titleVi.includes(searchTerm) ||
        descriptionVi.includes(searchTerm) ||
        titleEn.includes(searchTerm) ||
        descriptionEn.includes(searchTerm)
      );
    });
    renderAddonCards(filteredAddons);
  }

  addonSearchInput.addEventListener("input", filterAddons);

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
