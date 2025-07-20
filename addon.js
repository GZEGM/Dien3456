// addon.js
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
    : "en";
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
  document.getElementById("navForum").textContent =
    translations[currentLanguage].forum; // Added forum translation
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

  // Update addon details specific text
  const downloadButton = document.querySelector(".addon-detail .btn");
  if (downloadButton) {
    downloadButton.textContent = translations[currentLanguage].downloadAddon;
  }

  const loadingMessage = document.getElementById("loadingMessage");
  if (loadingMessage) {
    loadingMessage.textContent = translations[currentLanguage].loadingAddon;
  }

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

  loadAddonDetails(); // Reload addon details with new language
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
    // Sort versions by releaseDate to ensure the latest is at the end
    addon.versions.sort(
      (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)
    );

    // Get the latest version by default
    const latestVersion = addon.versions[addon.versions.length - 1];

    // Build version options
    const versionOptions = addon.versions
      .map(
        (version) => `
      <option value="${version.versionName}">${version.versionName}</option>
    `
      )
      .join("");

    addonDetailContent.innerHTML = `
      <section class="addon-detail">
        <div class="version-selector">
          <label for="versionSelect">${
            translations[currentLanguage].selectVersion
          }</label>
          <select id="versionSelect">
            ${versionOptions}
          </select>
        </div>

        <h2 id="addonTitle">${latestVersion.title[currentLanguage]}</h2>
        <p id="addonDescription">${
          latestVersion.description[currentLanguage]
        }</p>

        <div class="media-section" id="addonImages">
          <h3>${translations[currentLanguage].images}</h3>
          <div class="image-gallery">
            ${latestVersion.images
              .map(
                (image) => `
              <div class="image-item">
                <img src="${image.src}" alt="${latestVersion.title[currentLanguage]}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/000000/FFFFFF?text=Image+Not+Found';" />
                <p>${image.captions[currentLanguage]}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="media-section" id="addonVideos">
          <h3>${translations[currentLanguage].videos}</h3>
          <div class="video-gallery">
            ${latestVersion.videos
              .map(
                (videoSrc) => `
              <iframe src="${videoSrc}" frameborder="0" allowfullscreen></iframe>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="changelog-section" id="addonChangelog">
          <h3>${translations[currentLanguage].changelog}</h3>
          <pre>${latestVersion.changelog[currentLanguage]}</pre>
        </div>

        <a href="${
          latestVersion.file
        }" class="btn" id="downloadButton" download>${
      translations[currentLanguage].downloadAddon
    }</a>
      </section>
    `;

    // Set the latest version as selected in the dropdown
    document.getElementById("versionSelect").value = latestVersion.versionName;

    // Add event listener for version selection
    document
      .getElementById("versionSelect")
      .addEventListener("change", (event) => {
        const selectedVersionName = event.target.value;
        const selectedVersion = addon.versions.find(
          (v) => v.versionName === selectedVersionName
        );
        if (selectedVersion) {
          updateAddonContent(selectedVersion);
        }
      });
  } else {
    addonDetailContent.innerHTML = `<p class="error-message">${translations[currentLanguage].addonNotFound}</p>`;
  }
}

// Function to update addon content based on selected version
function updateAddonContent(version) {
  document.getElementById("addonTitle").textContent =
    version.title[currentLanguage];
  document.getElementById("addonDescription").textContent =
    version.description[currentLanguage];

  const imageGallery = document.querySelector("#addonImages .image-gallery");
  imageGallery.innerHTML = version.images
    .map(
      (image) => `
    <div class="image-item">
      <img src="${image.src}" alt="${version.title[currentLanguage]}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/000000/FFFFFF?text=Image+Not+Found';" />
      <p>${image.captions[currentLanguage]}</p>
    </div>
  `
    )
    .join("");

  const videoGallery = document.querySelector("#addonVideos .video-gallery");
  videoGallery.innerHTML = version.videos
    .map(
      (videoSrc) => `
    <iframe src="${videoSrc}" frameborder="0" allowfullscreen></iframe>
  `
    )
    .join("");

  document.querySelector("#addonChangelog pre").textContent =
    version.changelog[currentLanguage];
  document.getElementById("downloadButton").href = version.file;
  document.getElementById("downloadButton").textContent =
    translations[currentLanguage].downloadAddon;
}

// Event Listeners
document.addEventListener("DOMContentLoaded", async () => {
  applyTheme(currentTheme);
  updateUIText(); // Initial UI text update and addon details load

  // Auth state listener
  onAuthStateChanged(auth, async (user) => {
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
  });

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
      // loadAddonDetails(); // Reload details with new language - Handled by updateUIText
    });
  });

  // Language Selector in Modal
  const modalLangSelect = document.getElementById("modalLangSelect");
  modalLangSelect.value = currentLanguage; // Set initial value
  modalLangSelect.addEventListener("change", (event) => {
    currentLanguage = event.target.value;
    localStorage.setItem("language", currentLanguage);
    updateUIText();
    // loadAddonDetails(); // Reload details with new language - Handled by updateUIText
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
