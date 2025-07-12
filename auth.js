// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signInAnonymously,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Global variables for language and theme
let currentLanguage = localStorage.getItem("language") || "vi";
let currentTheme = localStorage.getItem("theme") || "dark";

// Firebase configuration (Cần khớp với Project Firebase của bạn)
const firebaseConfig = {
  apiKey: "AIzaSyByxU2b9nfT9XvDUKGYG6qMPxq-Lt2h2YI",
  authDomain: "dienkon-addon.firebaseapp.com",
  projectId: "dienkon-addon",
  storageBucket: "dienkon-addon.firebasestorage.app",
  messagingSenderId: "222007544409",
  appId: "1:222007544409:web:e5bd9965f3da46c8013f48", // Đảm bảo appId này CHÍNH XÁC
  measurementId: "G-P00YDS3E58",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get elements
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authTitle = document.getElementById("authTitle");
const toggleToRegisterLink = document.getElementById("toggleToRegister");
const toggleToLoginLink = document.getElementById("toggleToLogin");
const emailLoginBtn = document.getElementById("emailLoginBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const registerBtn = document.getElementById("registerBtn");
const messageDiv = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");
const anonLoginBtn = document.getElementById("anonLoginBtn");

// Language and Theme setup (same as forum.js for consistency)
const authTranslations = {
  vi: {
    login: "Đăng nhập",
    register: "Đăng ký",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Mật khẩu",
    namePlaceholder: "Tên hiển thị (tùy chọn)",
    emailLogin: "Đăng nhập bằng Email",
    googleLogin: "Đăng nhập bằng Google",
    registerBtn: "Đăng ký tài khoản mới",
    haveAccount: "Đã có tài khoản?",
    noAccount: "Chưa có tài khoản?",
    registerNow: "Đăng ký ngay!",
    loginNow: "Đăng nhập ngay!",
    welcome: "Chào mừng bạn",
    loginSuccess: "Đăng nhập thành công! Đang chuyển hướng...",
    registerSuccess: "Đăng ký thành công! Đang chuyển hướng...",
    logoutSuccess: "Đăng xuất thành công!",
    autoLoginFailed:
      "Không thể tự động đăng nhập. Vui lòng đăng nhập thủ công.",
    emailError: "Vui lòng nhập email hợp lệ.",
    passwordError: "Mật khẩu phải có ít nhất 6 ký tự.",
    loginFailed: "Đăng nhập thất bại: ",
    registerFailed: "Đăng ký thất bại: ",
    error: "Lỗi: ",
    googleLoginFailed: "Đăng nhập Google thất bại: ",
    welcomeAnon: "Chào mừng, Khách!",
    anonLogin: "Đăng nhập với tư cách Khách",
    anonLoginSuccess: "Đăng nhập ẩn danh thành công! Đang chuyển hướng...",
    language: "Ngôn ngữ",
    theme: "Chủ đề",
    darkMode: "Chế độ Tối",
    lightMode: "Chế độ Sáng",
    settings: "Cài đặt",
    close: "Đóng",
    home: "Trang chủ",
    forum: "Diễn đàn",
    userAvatarAlt: "Ảnh đại diện người dùng",
    logout: "Đăng xuất",
  },
  en: {
    login: "Login",
    register: "Register",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    namePlaceholder: "Display Name (optional)",
    emailLogin: "Login with Email",
    googleLogin: "Login with Google",
    registerBtn: "Register New Account",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    registerNow: "Register now!",
    loginNow: "Login now!",
    welcome: "Welcome",
    loginSuccess: "Login successful! Redirecting...",
    registerSuccess: "Registration successful! Redirecting...",
    logoutSuccess: "Logout successful!",
    autoLoginFailed: "Automatic login failed. Please log in manually.",
    emailError: "Please enter a valid email.",
    passwordError: "Password must be at least 6 characters.",
    loginFailed: "Login failed: ",
    registerFailed: "Registration failed: ",
    error: "Error: ",
    googleLoginFailed: "Google login failed: ",
    welcomeAnon: "Welcome, Guest!",
    anonLogin: "Login as Guest",
    anonLoginSuccess: "Anonymous login successful! Redirecting...",
    language: "Language",
    theme: "Theme",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    settings: "Settings",
    close: "Close",
    home: "Home",
    forum: "Forum",
    userAvatarAlt: "User Avatar",
    logout: "Logout",
  },
};

function applyTheme(theme) {
  document.body.classList.remove("dark-mode", "light-mode");
  document.body.classList.add(`${theme}-mode`);
  const themeToggleIcon = document.querySelector("#themeToggle i");
  if (themeToggleIcon) {
    if (theme === "dark") {
      themeToggleIcon.classList.remove("fa-moon");
      themeToggleIcon.classList.add("fa-sun");
    } else {
      themeToggleIcon.classList.remove("fa-sun");
      themeToggleIcon.classList.add("fa-moon");
    }
  } else {
    console.warn("Theme toggle icon not found.");
  }
}

function updateUIText() {
  // Update header
  const headerTitle = document.getElementById("headerTitle");
  if (headerTitle) {
    headerTitle.textContent = "🧩 MCPE Addons"; // Static title
  }
  const navHome = document.getElementById("navHome");
  if (navHome) {
    navHome.textContent = authTranslations[currentLanguage].home;
  }
  const navForum = document.getElementById("navForum");
  if (navForum) {
    navForum.textContent = authTranslations[currentLanguage].forum;
  }

  // Update auth form
  if (authTitle) {
    authTitle.textContent =
      loginForm && loginForm.style.display === "block"
        ? authTranslations[currentLanguage].login
        : authTranslations[currentLanguage].register;
  }

  const loginEmail = document.getElementById("loginEmail");
  if (loginEmail) {
    loginEmail.placeholder = authTranslations[currentLanguage].emailPlaceholder;
  }
  const loginPassword = document.getElementById("loginPassword");
  if (loginPassword) {
    loginPassword.placeholder =
      authTranslations[currentLanguage].passwordPlaceholder;
  }
  const registerEmail = document.getElementById("registerEmail");
  if (registerEmail) {
    registerEmail.placeholder =
      authTranslations[currentLanguage].emailPlaceholder;
  }
  const registerPassword = document.getElementById("registerPassword");
  if (registerPassword) {
    registerPassword.placeholder =
      authTranslations[currentLanguage].passwordPlaceholder;
  }
  const registerDisplayName = document.getElementById("registerDisplayName");
  if (registerDisplayName) {
    registerDisplayName.placeholder =
      authTranslations[currentLanguage].namePlaceholder;
  }

  if (emailLoginBtn) {
    emailLoginBtn.textContent = authTranslations[currentLanguage].emailLogin;
  }
  if (googleLoginBtn) {
    googleLoginBtn.textContent = authTranslations[currentLanguage].googleLogin;
  }
  if (registerBtn) {
    registerBtn.textContent = authTranslations[currentLanguage].registerBtn;
  }
  if (anonLoginBtn) {
    anonLoginBtn.textContent = authTranslations[currentLanguage].anonLogin;
  }

  const noAccountText = document.getElementById("noAccountText");
  if (noAccountText) {
    noAccountText.textContent = authTranslations[currentLanguage].noAccount;
  }
  if (toggleToRegisterLink) {
    toggleToRegisterLink.textContent =
      authTranslations[currentLanguage].registerNow;
  }
  const haveAccountText = document.getElementById("haveAccountText");
  if (haveAccountText) {
    haveAccountText.textContent = authTranslations[currentLanguage].haveAccount;
  }
  if (toggleToLoginLink) {
    toggleToLoginLink.textContent = authTranslations[currentLanguage].loginNow;
  }

  // Update settings modal
  const settingsModalTitle = document.getElementById("settingsModalTitle");
  if (settingsModalTitle) {
    settingsModalTitle.textContent = authTranslations[currentLanguage].settings;
  }
  const modalLangLabel = document.getElementById("modalLangLabel");
  if (modalLangLabel) {
    modalLangLabel.textContent =
      authTranslations[currentLanguage].language + ":";
  }
  const modalThemeLabel = document.getElementById("modalThemeLabel");
  if (modalThemeLabel) {
    modalThemeLabel.textContent = authTranslations[currentLanguage].theme + ":";
  }
  const modalThemeDarkText = document.getElementById("modalThemeDarkText");
  if (modalThemeDarkText) {
    modalThemeDarkText.textContent = authTranslations[currentLanguage].darkMode;
  }
  const modalThemeLightText = document.getElementById("modalThemeLightText");
  if (modalThemeLightText) {
    modalThemeLightText.textContent =
      authTranslations[currentLanguage].lightMode;
  }

  // Update selected language in modal
  const modalLangSelect = document.getElementById("modalLangSelect");
  if (modalLangSelect) {
    modalLangSelect.value = currentLanguage;
  }

  // Update theme button text in modal
  const modalThemeDark = document.getElementById("modalThemeDark");
  const modalThemeLight = document.getElementById("modalThemeLight");
  if (modalThemeDark && modalThemeLight) {
    if (currentTheme === "dark") {
      modalThemeDark.classList.add("active");
      modalThemeLight.classList.remove("active");
    } else {
      modalThemeDark.classList.remove("active");
      modalThemeLight.classList.add("active");
    }
  }
}

// Function to show messages
function showMessage(message, isError = false) {
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${isError ? "error" : "success"}`;
    messageDiv.style.display = "block";
  } else {
    console.warn("Message div not found.");
  }
}

// Function to hide messages
function hideMessage() {
  if (messageDiv) {
    messageDiv.style.display = "none";
  }
}

// Redirect after login
function redirectToPreviousPage() {
  const storedUrl = localStorage.getItem("redirectAfterLogin");
  if (storedUrl && storedUrl !== window.location.href) {
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = storedUrl;
  } else {
    window.location.href = "forum.html"; // Default redirect if no specific page was stored
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(currentTheme);
  updateUIText(); // Initial UI text update

  // Event Listeners for Header Controls (copied from script.js/addon.js)
  // Language Dropdown
  document.querySelectorAll(".dropdown-content a").forEach((link) => {
    if (link) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        currentLanguage = e.target.dataset.lang;
        localStorage.setItem("language", currentLanguage);
        updateUIText();
      });
    } else {
      console.warn("Dropdown content link not found.");
    }
  });

  // Theme Toggle
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", currentTheme);
      applyTheme(currentTheme);
      updateUIText(); // Update modal theme buttons
    });
  } else {
    console.warn("Theme toggle button not found.");
  }

  // Settings Modal
  const settingsModal = document.getElementById("settingsModal");
  const settingsBtn = document.getElementById("settingsBtn");
  const closeSettingsModal = document.getElementById("closeSettingsModal");
  const modalLangSelect = document.getElementById("modalLangSelect");
  const modalThemeDark = document.getElementById("modalThemeDark");
  const modalThemeLight = document.getElementById("modalThemeLight");

  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      if (settingsModal) settingsModal.style.display = "block";
      updateUIText(); // Ensure modal content is in current language and theme buttons are active
    });
  } else {
    console.warn("Settings button not found.");
  }

  if (closeSettingsModal) {
    closeSettingsModal.addEventListener("click", () => {
      if (settingsModal) settingsModal.style.display = "none";
    });
  } else {
    console.warn("Close settings modal button not found.");
  }

  if (settingsModal) {
    window.addEventListener("click", (event) => {
      if (event.target == settingsModal) {
        settingsModal.style.display = "none";
      }
    });
  }

  // Modal Language Select
  if (modalLangSelect) {
    modalLangSelect.addEventListener("change", (e) => {
      currentLanguage = e.target.value;
      localStorage.setItem("language", currentLanguage);
      updateUIText();
    });
  } else {
    console.warn("Modal language select not found.");
  }

  // Modal Theme Buttons
  if (modalThemeDark) {
    modalThemeDark.addEventListener("click", () => {
      currentTheme = "dark";
      localStorage.setItem("theme", currentTheme);
      applyTheme(currentTheme);
      updateUIText();
    });
  } else {
    console.warn("Modal Dark Theme button not found.");
  }

  if (modalThemeLight) {
    modalThemeLight.addEventListener("click", () => {
      currentTheme = "light";
      localStorage.setItem("theme", currentTheme);
      applyTheme(currentTheme);
      updateUIText();
    });
  } else {
    console.warn("Modal Light Theme button not found.");
  }

  // Email/Password Login
  if (emailLoginBtn) {
    emailLoginBtn.addEventListener("click", async () => {
      console.log("Email Login button clicked.");
      hideMessage();
      const email = document.getElementById("loginEmail")?.value;
      const password = document.getElementById("loginPassword")?.value;

      if (!email) {
        showMessage(authTranslations[currentLanguage].emailError, true);
        return;
      }
      if (password && password.length < 6) {
        // Check password existence before length
        showMessage(authTranslations[currentLanguage].passwordError, true);
        return;
      }
      if (!password) {
        // Handle case where password input might be missing or empty
        showMessage(authTranslations[currentLanguage].passwordError, true);
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, email, password);
        showMessage(authTranslations[currentLanguage].loginSuccess, false);
        setTimeout(redirectToPreviousPage, 1500);
      } catch (error) {
        console.error("Error logging in:", error);
        showMessage(
          authTranslations[currentLanguage].loginFailed + error.message,
          true
        );
      }
    });
  } else {
    console.error("Element with ID 'emailLoginBtn' not found.");
  }

  // Google Login
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async () => {
      console.log("Google Login button clicked.");
      hideMessage();
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        // Save user data to Firestore
        await setDoc(
          doc(
            db,
            `artifacts/${firebaseConfig.appId}/public/data/users`,
            user.uid
          ),
          {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: user.metadata.creationTime,
            lastLoginAt: user.metadata.lastSignInTime,
          },
          { merge: true }
        ); // Use merge to update if exists, create if not
        showMessage(authTranslations[currentLanguage].loginSuccess, false);
        setTimeout(redirectToPreviousPage, 1500);
      } catch (error) {
        console.error("Error with Google login:", error);
        showMessage(
          authTranslations[currentLanguage].googleLoginFailed + error.message,
          true
        );
      }
    });
  } else {
    console.error("Element with ID 'googleLoginBtn' not found.");
  }

  // Email/Password Register
  if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
      console.log("Register button clicked.");
      hideMessage();
      const email = document.getElementById("registerEmail")?.value;
      const password = document.getElementById("registerPassword")?.value;
      const displayName = document.getElementById("registerDisplayName")?.value;

      if (!email) {
        showMessage(authTranslations[currentLanguage].emailError, true);
        return;
      }
      if (password && password.length < 6) {
        // Check password existence before length
        showMessage(authTranslations[currentLanguage].passwordError, true);
        return;
      }
      if (!password) {
        // Handle case where password input might be missing or empty
        showMessage(authTranslations[currentLanguage].passwordError, true);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Update user profile with display name
        if (displayName) {
          await updateProfile(user, { displayName: displayName });
        }

        // Save user data to Firestore
        await setDoc(
          doc(
            db,
            `artifacts/${firebaseConfig.appId}/public/data/users`,
            user.uid
          ),
          {
            uid: user.uid,
            displayName: displayName || user.email, // Use display name if provided, else email
            email: user.email,
            photoURL: user.photoURL || "", // photoURL might be null for email/password users
            createdAt: user.metadata.creationTime,
            lastLoginAt: user.metadata.lastSignInTime,
          },
          { merge: true }
        );

        showMessage(authTranslations[currentLanguage].registerSuccess, false);
        setTimeout(redirectToPreviousPage, 1500);
      } catch (error) {
        console.error("Error registering:", error);
        showMessage(
          authTranslations[currentLanguage].registerFailed + error.message,
          true
        );
      }
    });
  } else {
    console.error("Element with ID 'registerBtn' not found.");
  }

  // Anonymous Login
  if (anonLoginBtn) {
    anonLoginBtn.addEventListener("click", async () => {
      console.log("Anonymous Login button clicked.");
      hideMessage();
      try {
        const userCredential = await signInAnonymously(auth);
        const user = userCredential.user;
        // For anonymous users, you might still want to save a basic profile
        await setDoc(
          doc(
            db,
            `artifacts/${firebaseConfig.appId}/public/data/users`,
            user.uid
          ),
          {
            uid: user.uid,
            displayName: "Khách ẩn danh", // Default name for anonymous users
            photoURL: "",
            createdAt: user.metadata.creationTime,
            lastLoginAt: user.metadata.lastSignInTime,
          },
          { merge: true }
        );
        showMessage(authTranslations[currentLanguage].anonLoginSuccess, false);
        setTimeout(redirectToPreviousPage, 1500);
      } catch (error) {
        console.error("Error signing in anonymously:", error);
        showMessage(authTranslations[currentLanguage].autoLoginFailed, true);
      }
    });
  } else {
    console.error("Element with ID 'anonLoginBtn' not found.");
  }

  // Toggle between login and register forms
  if (toggleToRegisterLink && loginForm && registerForm && authTitle) {
    toggleToRegisterLink.addEventListener("click", (e) => {
      console.log("Toggle to Register link clicked.");
      e.preventDefault();
      loginForm.style.display = "none";
      registerForm.style.display = "block";
      authTitle.textContent = authTranslations[currentLanguage].register;
      if (toggleToRegisterLink.parentNode)
        toggleToRegisterLink.parentNode.style.display = "none";
      if (toggleToLoginLink && toggleToLoginLink.parentNode)
        toggleToLoginLink.parentNode.style.display = "block";
      hideMessage();
    });
  } else {
    console.warn("Toggle to Register link or related forms/title not found.");
  }

  if (toggleToLoginLink && loginForm && registerForm && authTitle) {
    toggleToLoginLink.addEventListener("click", (e) => {
      console.log("Toggle to Login link clicked.");
      e.preventDefault();
      loginForm.style.display = "block";
      registerForm.style.display = "none";
      authTitle.textContent = authTranslations[currentLanguage].login;
      if (toggleToRegisterLink && toggleToRegisterLink.parentNode)
        toggleToRegisterLink.parentNode.style.display = "block";
      if (toggleToLoginLink.parentNode)
        toggleToLoginLink.parentNode.style.display = "none";
      hideMessage();
    });
  } else {
    console.warn("Toggle to Login link or related forms/title not found.");
  }

  // Initial authentication check on page load
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // If user is already signed in, redirect to the stored URL or forum.html
      redirectToPreviousPage();
    }
    // If no user is signed in, stay on auth.html and let user choose login method.
  });
});
