// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  // signInWithCustomToken, // Removed: Rely on Firebase session persistence
  // signInAnonymously, // Removed: Rely on Firebase session persistence
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Global variables for language and theme
// Sửa dòng khởi tạo currentLanguage
let currentLanguage =
  (localStorage.getItem("language") || "en") in translations
    ? localStorage.getItem("language") || "en"
    : "en"; // Changed default language to English
let currentTheme = localStorage.getItem("theme") || "dark";
let currentUser = null; // To store current authenticated user
let db, auth; // Firebase instances

// Firebase configuration (provided by Canvas environment or hardcoded fallback)
const firebaseConfig =
  typeof __firebase_config !== "undefined"
    ? JSON.parse(__firebase_config)
    : {
        apiKey: "AIzaSyByxU2b9nfT9XvDUKGYG6qMPxq-Lt2h2YI",
        authDomain: "dienkon-addon.firebaseapp.com",
        projectId: "dienkon-addon",
        storageBucket: "dienkon-addon.firebasestorage.app",
        messagingSenderId: "222007544409",
        appId: "1:222007544409:web:e5bd9965f3da46c8013f48",
        measurementId: "G-P00YDS3E58",
      };

// Sử dụng appId từ cấu hình hardcoded hoặc từ biến toàn cục của Canvas
const appId = typeof __app_id !== "undefined" ? __app_id : firebaseConfig.appId;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
auth = getAuth(app);
db = getFirestore(app);

// Flag to ensure initial rendering happens only after auth state is determined
let isInitialAuthCheckComplete = false;

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
    translations[currentLanguage].mcpeAddons; // Updated
  document.getElementById("navHome").textContent =
    translations[currentLanguage].home;
  document.getElementById("navForum").textContent =
    translations[currentLanguage].forum; // Added forum translation
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
  document.getElementById("logoutBtn").textContent =
    translations[currentLanguage].logout;

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

  // Re-render addon cards to apply new language if already initialized
  if (isInitialAuthCheckComplete) {
    // Only re-render if initial check is done
    renderAddonCards(addons);
  }
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

document.addEventListener("DOMContentLoaded", async () => {
  applyTheme(currentTheme);
  updateUIText(); // Initial UI text update

  // Auth state listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      document.getElementById("userNameDisplay").textContent = `${
        translations[currentLanguage].welcome
      } ${user.displayName || user.email || "Guest"}`;
      document.getElementById(
        "userIdDisplay"
      ).textContent = `${translations[currentLanguage].userId} ${user.uid}`;
      document.getElementById("userAvatar").src =
        user.photoURL ||
        `https://placehold.co/40x40/333333/FFFFFF?text=${(
          user.displayName ||
          user.email ||
          "U"
        )
          .charAt(0)
          .toUpperCase()}`;
      document.getElementById("userProfileBtn").style.display = "block";
    } else {
      currentUser = null;
      document.getElementById(
        "userNameDisplay"
      ).textContent = `${translations[currentLanguage].welcome} Guest`;
      document.getElementById(
        "userIdDisplay"
      ).textContent = `${translations[currentLanguage].userId} Loading...`;
      document.getElementById("userAvatar").src =
        "https://placehold.co/40x40/333333/FFFFFF?text=U";
      document.getElementById("userProfileBtn").style.display = "block"; // Still show button, but content is "Guest"

      // Only redirect to auth.html if the user is not authenticated and not already on the auth page
      if (window.location.pathname !== "/auth.html") {
        localStorage.setItem("redirectAfterLogin", window.location.href);
        window.location.href = "auth.html";
        return; // Stop further execution on this page
      }
    }

    // Only render addons AFTER the initial auth check is complete and no redirect occurred
    if (!isInitialAuthCheckComplete) {
      console.log("Initial auth check complete. Rendering addon cards.");
      renderAddonCards(addons);
      isInitialAuthCheckComplete = true;
    }
  });

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

  // User Profile Dropdown
  document.getElementById("userProfileBtn").addEventListener("click", () => {
    const dropdown = document.querySelector(".user-dropdown-content");
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  });

  // Logout button
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "auth.html"; // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
      // In a real app, you might show a message to the user
    }
  });
});
