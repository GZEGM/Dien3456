// manifest.js
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Global variables for language and theme
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

// Use appId from hardcoded config or Canvas global variable
const appId = typeof __app_id !== "undefined" ? __app_id : firebaseConfig.appId;

// Initialize Firebase
try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Define Minecraft API versions
// This object maps Minecraft game versions to their corresponding stable and beta API versions
// IMPORTANT: Keep this object updated with the latest official Minecraft Bedrock Edition API versions
// from Mojang's documentation or release notes for accurate manifest generation.
const MINECRAFT_API_VERSIONS = {
  "1.21.80": {
    stable: { server: "2.0.0", serverUi: "2.0.0" },
    beta: { server: "2.0.0-beta", serverUi: "2.0.0-beta" },
  },
  "1.21.90": {
    stable: { server: "2.0.0", serverUi: "2.0.0" },
    beta: { server: "2.1.0-beta", serverUi: "2.1.0-beta" },
  },
};

// Constants for module types
const MODULE_TYPE_RESOURCES = "resources"; // Corresponds to Resource Pack
const MODULE_TYPE_SCRIPT = "script"; // Corresponds to Scripting API

document.addEventListener("DOMContentLoaded", () => {
  // Get necessary DOM elements
  const addonNameInput = document.getElementById("addonName");
  const addonDescriptionInput = document.getElementById("addonDescription");
  const versionMajorInput = document.getElementById("versionMajor");
  const versionMinorInput = document.getElementById("versionMinor");
  const versionPatchInput = document.getElementById("versionPatch");
  const mcVersionSelect = document.getElementById("mcVersion");
  const moduleTypeSelect = document.getElementById("moduleType");
  const useBetaApiCheckbox = document.getElementById("useBetaApi");
  const generateManifestBtn = document.getElementById("generateManifestBtn");
  const manifestOutput = document.getElementById("manifestOutput");
  const copyManifestBtn = document.getElementById("copyManifestBtn");
  const messageBox = document.getElementById("messageBox");
  const messageBoxText = document.getElementById("messageBoxText");
  const messageBoxCloseBtn = document.getElementById("messageBoxCloseBtn");
  const themeToggle = document.getElementById("themeToggle");
  const langDropdownContent = document.getElementById("langDropdownContent");
  const userProfileBtn = document.getElementById("userProfileBtn");
  const userDropdownContent = document.querySelector(".user-dropdown-content");
  const logoutBtn = document.getElementById("logoutBtn");

  /**
   * Displays a custom message box.
   * @param {string} message The message to display.
   */
  const showMessageBox = (message) => {
    messageBoxText.textContent = message;
    messageBox.classList.remove("hidden");
  };

  /**
   * Hides the custom message box.
   */
  const hideMessageBox = () => {
    messageBox.classList.add("hidden");
  };

  // Event listener for message box close button
  if (messageBoxCloseBtn) {
    messageBoxCloseBtn.addEventListener("click", hideMessageBox);
  }

  /**
   * Updates Minecraft version options in the dropdown.
   * Includes only the latest stable versions.
   */
  const updateMinecraftVersions = () => {
    // Clear existing options
    mcVersionSelect.innerHTML = "";

    // Supported stable versions from 1.20.50 onwards
    const stableVersions = ["1.21.80", "1.21.90"];

    // Add stable versions
    stableVersions.forEach((version) => {
      const option = document.createElement("option");
      option.value = version;
      option.textContent = version;
      mcVersionSelect.appendChild(option);
    });

    // Set default value to the latest version if available
    if (stableVersions.length > 0) {
      mcVersionSelect.value = stableVersions[stableVersions.length - 1];
    }
  };

  /**
   * Function to apply theme to the body.
   * @param {string} theme - 'dark' or 'light'.
   */
  const applyTheme = (theme) => {
    document.body.classList.remove("dark-mode", "light-mode"); // Remove both to be safe
    document.body.classList.add(`${theme}-mode`);
    const themeToggleIcon = document
      .getElementById("themeToggle")
      ?.querySelector("i");
    if (themeToggleIcon) {
      if (theme === "dark") {
        themeToggleIcon.classList.remove("fa-sun");
        themeToggleIcon.classList.add("fa-moon");
      } else {
        themeToggleIcon.classList.remove("fa-moon");
        themeToggleIcon.classList.add("fa-sun");
      }
    }
  };

  /**
   * Updates UI text based on the current language.
   */
  const updateUIText = () => {
    document.getElementById("pageTitle").textContent =
      translations[currentLanguage].pageTitle;
    document.getElementById("headerTitle").textContent =
      translations[currentLanguage].mcpeAddons;
    document.querySelector("#navHome").childNodes[0].nodeValue =
      translations[currentLanguage].home + " ";
    document.querySelector(
      "#homeDropdownContent a[href='index.html']"
    ).textContent = translations[currentLanguage].home;
    document.querySelector(
      "#homeDropdownContent a[href='manifest.html']"
    ).textContent = translations[currentLanguage].manifestCreator;
    document.querySelector(
      "#homeDropdownContent a[href='wiki.html']"
    ).textContent = translations[currentLanguage].wiki;
    document.getElementById("navForum").textContent =
      translations[currentLanguage].forum;

    document.querySelector("h2").textContent =
      translations[currentLanguage].generateManifest;
    document.querySelector('label[for="addonName"]').textContent =
      translations[currentLanguage].addonName;
    document.querySelector('input[id="addonName"]').placeholder = translations[
      currentLanguage
    ].addonName.replace("Tên Addon:", "e.g., Minigame Wordle Addon"); // Placeholder specific
    document.querySelector('label[for="addonDescription"]').textContent =
      translations[currentLanguage].description;
    document.querySelector('textarea[id="addonDescription"]').placeholder =
      translations[currentLanguage].description.replace(
        "Mô tả:",
        "A brief description of your addon..."
      ); // Placeholder specific
    document.querySelector('label[for="versionMajor"]').textContent =
      translations[currentLanguage].versionMajor;
    document.querySelector('label[for="versionMinor"]').textContent =
      translations[currentLanguage].versionMinor;
    document.querySelector('label[for="versionPatch"]').textContent =
      translations[currentLanguage].versionPatch;
    document.querySelector('label[for="mcVersion"]').textContent =
      translations[currentLanguage].currentMinecraftVersion;
    document.querySelector('label[for="moduleType"]').textContent =
      translations[currentLanguage].moduleType;
    document.querySelector('option[value="resources"]').textContent =
      translations[currentLanguage].resources;
    document.querySelector('option[value="script"]').textContent =
      translations[currentLanguage].script;
    document.querySelector('label[for="useBetaApi"]').textContent =
      translations[currentLanguage].useBetaApi;
    document.getElementById("generateManifestBtn").textContent =
      translations[currentLanguage].generateManifest;
    document.querySelector('label[for="manifestOutput"]').textContent =
      translations[currentLanguage].yourManifest;
    document.getElementById("copyManifestBtn").textContent =
      translations[currentLanguage].copyManifest;
    document.getElementById("messageBoxCloseBtn").textContent = "OK"; // Always OK

    // Update user info display
    if (currentUser) {
      document.getElementById("userNameDisplay").textContent = `${
        translations[currentLanguage].welcome
      } ${currentUser.displayName || currentUser.email || "Guest"}`;
      document.getElementById(
        "userIdDisplay"
      ).textContent = `${translations[currentLanguage].userId} ${currentUser.uid}`;
    } else {
      document.getElementById(
        "userNameDisplay"
      ).textContent = `${translations[currentLanguage].welcome} Guest`;
      document.getElementById(
        "userIdDisplay"
      ).textContent = `${translations[currentLanguage].userId} Not logged in`;
    }
    document.getElementById("logoutBtn").textContent =
      translations[currentLanguage].logout;
  };

  // Call the version update function when the page loads
  updateMinecraftVersions();
  // Set default module type to 'script'
  moduleTypeSelect.value = MODULE_TYPE_SCRIPT;
  // Apply initial theme and language
  applyTheme(currentTheme);
  updateUIText();

  /**
   * Parses a version string (e.g., "1.0.0" or "1.0.0-beta") into a number array.
   * This is used for min_engine_version which expects a number array.
   * @param {string} versionString The version string to parse.
   * @returns {number[]} An array of numbers representing the version.
   */
  const parseVersionStringToArray = (versionString) => {
    // Remove '-beta' suffix if present before splitting
    const cleanedVersionString = versionString.replace(/-beta$/, "");
    return cleanedVersionString.split(".").map(Number);
  };

  /**
   * Handles the "Generate Manifest" button click event.
   * Creates a JSON manifest file based on input values.
   */
  generateManifestBtn.addEventListener("click", () => {
    // Get values from input fields
    const addonName = addonNameInput.value.trim();
    const addonDescription = addonDescriptionInput.value.trim();
    const versionMajor = parseInt(versionMajorInput.value, 10);
    const versionMinor = parseInt(versionMinorInput.value, 10);
    const versionPatch = parseInt(versionPatchInput.value, 10);
    const selectedMcVersion = mcVersionSelect.value;
    // min_engine_version expects a number array
    const minEngineVersion = parseVersionStringToArray(selectedMcVersion);
    const moduleType = moduleTypeSelect.value; // Get selected module type
    const useBetaApi = useBetaApiCheckbox.checked; // Get beta API checkbox state

    // Validate required fields
    if (!addonName || !addonDescription) {
      showMessageBox(translations[currentLanguage].fillAllFields);
      return;
    }
    if (isNaN(versionMajor) || isNaN(versionMinor) || isNaN(versionPatch)) {
      showMessageBox(translations[currentLanguage].invalidVersion);
      return;
    }

    // Generate random UUIDs for header and module
    const headerUuid = uuid.v4();
    const moduleUuid = uuid.v4();

    // Build module object based on selected type
    const module = {
      type: moduleType,
      uuid: moduleUuid,
      version: [versionMajor, versionMinor, versionPatch],
    };

    // Initialize dependencies and capabilities
    const dependencies = [];
    const capabilities = [];

    // If module type is 'script', add language, entry, capabilities, and dependencies
    if (moduleType === MODULE_TYPE_SCRIPT) {
      module.language = "javascript";
      module.entry = "scripts/main.js"; // Default path to the main script file
      capabilities.push("script_eval");

      const apiVersions = MINECRAFT_API_VERSIONS[selectedMcVersion];
      if (apiVersions) {
        const apiType = useBetaApi ? "beta" : "stable";
        dependencies.push({
          module_name: "@minecraft/server",
          // Dependencies version should be a string, not an array
          version: apiVersions[apiType].server,
        });
        dependencies.push({
          module_name: "@minecraft/server-ui",
          // Dependencies version should be a string, not an array
          version: apiVersions[apiType].serverUi,
        });
      } else {
        // Fallback or warning if API versions are not defined for the selected MC version
        console.warn(
          `API versions not defined for Minecraft version: ${selectedMcVersion}. Using default stable versions.`
        );
        dependencies.push({
          module_name: "@minecraft/server",
          version: "1.10.0", // Fallback version as string
        });
        dependencies.push({
          module_name: "@minecraft/server-ui",
          version: "1.10.0", // Fallback version as string
        });
      }
    }

    // Build JSON manifest structure
    const manifest = {
      format_version: 2, // Manifest format version
      header: {
        name: addonName,
        description: addonDescription,
        uuid: headerUuid,
        version: [versionMajor, versionMinor, versionPatch],
        min_engine_version: minEngineVersion,
      },
      modules: [module], // Use the constructed module object
    };

    // Add capabilities and dependencies only if they are not empty
    if (capabilities.length > 0) {
      manifest.capabilities = capabilities;
    }
    if (dependencies.length > 0) {
      manifest.dependencies = dependencies;
    }

    // Display the generated manifest in the textarea
    // Use JSON.stringify with 2 spaces for pretty formatting
    manifestOutput.value = JSON.stringify(manifest, null, 2);
  });

  /**
   * Handles the "Copy Manifest" button click event.
   * Copies the content of the manifest textarea to the clipboard.
   */
  copyManifestBtn.addEventListener("click", () => {
    manifestOutput.select(); // Select entire content in textarea
    document.execCommand("copy"); // Execute copy command
    showMessageBox(translations[currentLanguage].copiedToClipboard); // Notify user
  });

  // Auth state listener
  // Using onAuthStateChanged to react to user login/logout
  if (typeof auth !== "undefined") {
    auth.onAuthStateChanged((user) => {
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
        userProfileBtn.style.display = "block";
      } else {
        currentUser = null;
        document.getElementById(
          "userNameDisplay"
        ).textContent = `${translations[currentLanguage].welcome} Guest`;
        document.getElementById(
          "userIdDisplay"
        ).textContent = `${translations[currentLanguage].userId} Not logged in`;
        document.getElementById("userAvatar").src =
          "https://placehold.co/40x40/333333/FFFFFF?text=U";
        userProfileBtn.style.display = "block";
      }
    });
  } else {
    console.warn(
      "Firebase Auth not initialized. User authentication features will not work."
    );
  }

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        if (auth) {
          await signOut(auth);
          showMessageBox(translations[currentLanguage].logoutSuccess);
          // Optionally redirect to login page or update UI
          // window.location.href = "auth.html";
        } else {
          console.error("Firebase Auth not available for logout.");
          showMessageBox(translations[currentLanguage].logoutFailed);
        }
      } catch (error) {
        console.error("Error logging out:", error);
        showMessageBox(translations[currentLanguage].logoutFailed);
      }
    });
  }

  // Theme Toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", currentTheme);
      applyTheme(currentTheme);
    });

    // Apply saved theme on page load
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      applyTheme("dark"); // Default to dark if system preference is dark
    } else {
      applyTheme("light"); // Default to light
    }
  }

  // Language Toggle
  if (langDropdownContent) {
    langDropdownContent.addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        event.preventDefault(); // Prevent default link behavior
        const lang = event.target.dataset.lang;
        currentLanguage = lang;
        localStorage.setItem("language", currentLanguage);
        updateUIText();
        // Removed the showMessageBox call here as requested
        // showMessageBox(
        //   `${translations[currentLanguage].selectedLanguage} ${
        //     lang === "vi"
        //       ? translations[currentLanguage].vietnamese
        //       : translations[currentLanguage].english
        //   }`
        // );
      }
    });
  }

  // Dropdown functionality for Home and Language
  const dropdowns = document.querySelectorAll(".dropdown");
  dropdowns.forEach((dropdown) => {
    const dropbtn = dropdown.querySelector(".dropbtn");
    const dropdownContent = dropdown.querySelector(".dropdown-content");

    if (dropbtn && dropdownContent) {
      dropbtn.addEventListener("click", (event) => {
        // Close all other dropdowns
        dropdowns.forEach((otherDropdown) => {
          if (otherDropdown !== dropdown) {
            otherDropdown
              .querySelector(".dropdown-content")
              ?.classList.remove("show");
          }
        });
        // Open/close current dropdown
        dropdownContent.classList.toggle("show");
        event.stopPropagation(); // Prevent click event from propagating outwards
      });
    }
  });

  // Close dropdowns if clicked outside
  window.addEventListener("click", (event) => {
    dropdowns.forEach((dropdown) => {
      const dropdownContent = dropdown.querySelector(".dropdown-content");
      const dropbtn = dropdown.querySelector(".dropbtn");
      if (
        dropdownContent &&
        dropbtn &&
        !dropbtn.contains(event.target) &&
        !dropdownContent.contains(event.target)
      ) {
        dropdownContent.classList.remove("show");
      }
    });
  });

  // User Profile Dropdown
  if (userProfileBtn && userDropdownContent) {
    userProfileBtn.addEventListener("click", (event) => {
      userDropdownContent.classList.toggle("show");
      event.stopPropagation();
    });
  }

  // Close user dropdown if clicked outside
  window.addEventListener("click", (event) => {
    if (
      userProfileBtn &&
      userDropdownContent &&
      !userProfileBtn.contains(event.target) &&
      !userDropdownContent.contains(event.target)
    ) {
      userDropdownContent.classList.remove("show");
    }
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
