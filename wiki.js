// wiki.js

// Import Firebase modules - Đảm bảo các module Firebase được import trực tiếp trong file này
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Global variables for language and theme - Khai báo các biến toàn cục giống như manifest.js
let currentLanguage = localStorage.getItem("language") || "en";
let currentTheme = localStorage.getItem("theme") || "dark";
let currentUser = null; // Để lưu trữ người dùng đã xác thực hiện tại
let db, auth; // Các instance của Firebase
// const translations; // Giả định đối tượng translations được tải từ data.js

document.addEventListener("DOMContentLoaded", () => {
  // Firebase configuration (provided by Canvas environment or hardcoded fallback)
  // Cấu hình Firebase giống như trong manifest.js
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
  const appId =
    typeof __app_id !== "undefined" ? __app_id : firebaseConfig.appId;

  // Initialize Firebase - Khởi tạo Firebase ngay trong wiki.js
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized in wiki.js");
  } catch (error) {
    console.error("Error initializing Firebase in wiki.js:", error);
  }

  // Get DOM elements for settings modal
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsModal = document.getElementById("settingsModal");
  const closeSettingsModal = document.getElementById("closeSettingsModal");
  const modalLangSelect = document.getElementById("modalLangSelect");
  const modalThemeDark = document.getElementById("modalThemeDark");
  const modalThemeLight = document.getElementById("modalThemeLight");

  // Get DOM elements for header controls
  const themeToggle = document.getElementById("themeToggle"); // Nút chuyển đổi chủ đề trong header
  const langDropdownContent = document.querySelector(
    ".header-controls .dropdown-content"
  ); // Dropdown ngôn ngữ trong header
  const userProfileBtn = document.getElementById("userProfileBtn");
  const userDropdownContent = document.querySelector(".user-dropdown-content");
  const logoutBtn = document.getElementById("logoutBtn");

  // Get DOM elements for scroll to top button
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  // Ensure translations object is available
  // Đây là phần quan trọng: `translations` phải được định nghĩa toàn cục từ `data.js`
  if (typeof translations === "undefined") {
    console.error(
      "Đối tượng Translations không tìm thấy. Vui lòng đảm bảo data.js được tải đúng cách."
    );
    return;
  }

  /**
   * Applies the selected theme to the body.
   * @param {string} theme - 'dark' or 'light'.
   */
  const applyTheme = (theme) => {
    document.body.classList.remove("dark-mode", "light-mode"); // Xóa cả hai để an toàn
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
    // Update page title and header
    document.getElementById("pageTitle").textContent =
      translations[currentLanguage].wikiPageTitle;
    document.getElementById("headerTitle").textContent =
      translations[currentLanguage].mcpeAddons;

    // Update navigation links
    document.querySelector("#navHome").childNodes[0].nodeValue =
      translations[currentLanguage].home + " ";
    document.getElementById("dropdownAddonList").textContent =
      translations[currentLanguage].addonList;
    document.getElementById("dropdownCreateManifest").textContent =
      translations[currentLanguage].manifestCreator;
    document.getElementById("dropdownWiki").textContent =
      translations[currentLanguage].wiki;
    document.getElementById("navForum").textContent =
      translations[currentLanguage].forum;

    // Update Wiki content
    document.getElementById("wikiTitle").textContent =
      translations[currentLanguage].wikiTitle;
    document.getElementById("gettingStartedTitle").textContent =
      translations[currentLanguage].gettingStartedTitle;
    document.getElementById("gettingStartedContent").textContent =
      translations[currentLanguage].gettingStartedContent;
    document.getElementById("gettingStartedContent2").textContent =
      translations[currentLanguage].gettingStartedContent2;
    document.getElementById("generalInfoTitle").textContent =
      translations[currentLanguage].generalInfoTitle;
    document.getElementById("generalInfoContent").textContent =
      translations[currentLanguage].generalInfoContent;
    document.getElementById("installationGuideTitle").textContent =
      translations[currentLanguage].installationGuideTitle;
    document.getElementById("installationGuideContent").textContent =
      translations[currentLanguage].installationGuideContent;
    document.getElementById("troubleshootingTitle").textContent =
      translations[currentLanguage].troubleshootingTitle;
    document.getElementById("troubleshootingContent").textContent =
      translations[currentLanguage].troubleshootingContent;
    document.getElementById("contributeTitle").textContent =
      translations[currentLanguage].contributeTitle;
    document.getElementById("contributeContent").textContent =
      translations[currentLanguage].contributeContent;

    // Update settings modal text
    document.getElementById("settingsModalTitle").textContent =
      translations[currentLanguage].settings;
    document.getElementById("modalLangLabel").textContent =
      translations[currentLanguage].language;
    document.getElementById("modalThemeLabel").textContent =
      translations[currentLanguage].theme;
    document.getElementById("modalThemeDarkText").textContent =
      translations[currentLanguage].darkMode;
    document.getElementById("modalThemeLightText").textContent =
      translations[currentLanguage].lightMode;

    // Update user info display
    if (currentUser) {
      // Kiểm tra nếu currentUser không phải là null
      document.getElementById("welcomeMessage").textContent = `${
        translations[currentLanguage].welcome
      } ${currentUser.displayName || currentUser.email || "Guest"}`;
      document.getElementById(
        "userIdDisplay"
      ).textContent = `${translations[currentLanguage].userId} ${currentUser.uid}`;
      document.getElementById("userAvatar").src =
        currentUser.photoURL ||
        `https://placehold.co/40x40/333333/FFFFFF?text=${(
          currentUser.displayName ||
          currentUser.email ||
          "U"
        )
          .charAt(0)
          .toUpperCase()}`;
    } else {
      document.getElementById(
        "welcomeMessage"
      ).textContent = `${translations[currentLanguage].welcome} Guest`;
      document.getElementById(
        "userIdDisplay"
      ).textContent = `${translations[currentLanguage].userId} Not logged in`;
      document.getElementById("userAvatar").src =
        "https://placehold.co/40x40/333333/FFFFFF?text=U";
    }
    document.getElementById("logoutBtn").textContent =
      translations[currentLanguage].logout;

    // Set selected language in modal dropdown
    if (modalLangSelect) {
      modalLangSelect.value = currentLanguage;
    }
  };

  // Apply initial theme on page load
  applyTheme(currentTheme);
  // Initial UI text update for non-user specific elements.
  // User-specific elements will be updated by onAuthStateChanged.
  updateUIText();

  // Settings Modal functionality
  if (settingsBtn && settingsModal && closeSettingsModal) {
    settingsBtn.addEventListener("click", () => {
      settingsModal.style.display = "block";
      // Set initial state of language and theme in modal
      if (modalLangSelect) {
        modalLangSelect.value = currentLanguage;
      }
      // Highlight current theme button
      if (currentTheme === "dark") {
        modalThemeDark.classList.add("active");
        modalThemeLight.classList.remove("active");
      } else {
        modalThemeLight.classList.add("active");
        modalThemeDark.classList.remove("active");
      }
    });

    closeSettingsModal.addEventListener("click", () => {
      settingsModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target === settingsModal) {
        settingsModal.style.display = "none";
      }
    });
  }

  // Language selection in settings modal
  if (modalLangSelect) {
    modalLangSelect.addEventListener("change", (event) => {
      currentLanguage = event.target.value;
      localStorage.setItem("language", currentLanguage);
      updateUIText();
    });
  }

  // Theme selection in settings modal
  if (modalThemeDark && modalThemeLight) {
    modalThemeDark.addEventListener("click", () => {
      currentTheme = "dark";
      localStorage.setItem("theme", currentTheme);
      applyTheme(currentTheme);
      modalThemeDark.classList.add("active");
      modalThemeLight.classList.remove("active");
    });

    modalThemeLight.addEventListener("click", () => {
      currentTheme = "light";
      localStorage.setItem("theme", currentTheme);
      applyTheme(currentTheme);
      modalThemeLight.classList.add("active");
      modalThemeDark.classList.remove("active");
    });
  }

  // Header Theme Toggle (redundant if settings modal is primary, but kept for consistency)
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", currentLanguage); // Lỗi ở đây: lưu currentLanguage thay vì currentTheme
      applyTheme(currentTheme);
      // Also update modal theme buttons if modal is open
      if (settingsModal.style.display === "block") {
        if (currentTheme === "dark") {
          modalThemeDark.classList.add("active");
          modalThemeLight.classList.remove("active");
        } else {
          modalThemeLight.classList.add("active");
          modalThemeDark.classList.remove("active");
        }
      }
    });
  }

  // Header Language Dropdown
  if (langDropdownContent) {
    langDropdownContent.addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        event.preventDefault(); // Prevent default link behavior
        const lang = event.target.dataset.lang;
        currentLanguage = lang;
        localStorage.setItem("language", currentLanguage);
        updateUIText();
        // Close the dropdown after selection
        event.target.closest(".dropdown-content")?.classList.remove("show");
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
    // Also close user dropdown if clicked outside
    if (
      userProfileBtn &&
      userDropdownContent &&
      !userProfileBtn.contains(event.target) &&
      !userDropdownContent.contains(event.target)
    ) {
      userDropdownContent.classList.remove("show");
    }
  });

  // User Profile Dropdown
  if (userProfileBtn && userDropdownContent) {
    userProfileBtn.addEventListener("click", (event) => {
      userDropdownContent.classList.toggle("show");
      event.stopPropagation();
    });
  }

  // Scroll to Top Button functionality
  if (scrollToTopBtn) {
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
  }

  // Firebase Auth state listener
  // Listener này rất quan trọng để "tải trạng thái xác thực" và cập nhật UI tương ứng.
  // Nó dựa vào 'auth' đã được khởi tạo toàn cục trong file này.
  if (typeof auth !== "undefined") {
    auth.onAuthStateChanged((user) => {
      currentUser = user; // Cập nhật biến toàn cục currentUser
      updateUIText(); // Cập nhật UI dựa trên trạng thái người dùng mới (bao gồm avatar và tin nhắn chào mừng)
      // Đảm bảo nút hồ sơ người dùng hiển thị bất kể trạng thái đăng nhập
      if (userProfileBtn) {
        userProfileBtn.style.display = "block";
      }
    });
  } else {
    console.warn(
      "Đối tượng Firebase Auth không xác định. Các tính năng xác thực người dùng sẽ không hoạt động trên trang Wiki."
    );
    // Đảm bảo nút hồ sơ người dùng vẫn hiển thị ngay cả khi không có auth
    if (userProfileBtn) {
      userProfileBtn.style.display = "block";
    }
  }

  // Logout button functionality
  // Nó dựa vào 'auth' đã được khởi tạo toàn cục trong file này.
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        if (typeof auth !== "undefined") {
          await signOut(auth);
          console.log("Đăng xuất thành công.");
        } else {
          console.error(
            "Firebase Auth không có sẵn để đăng xuất trên trang Wiki."
          );
        }
      } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
      }
    });
  }
});
