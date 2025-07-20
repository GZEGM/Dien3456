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
// Sửa dòng khởi tạo currentLanguage
let currentLanguage =
  (localStorage.getItem("language") || "en") in translations
    ? localStorage.getItem("language") || "en"
    : "en";
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
const anonLoginBtn = document.getElementById("anonLoginBtn");
const noAccountText = document.getElementById("noAccountText");
const haveAccountText = document.getElementById("haveAccountText");

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
}

function updateUIText() {
  const headerTitle = document.getElementById("headerTitle");
  if (headerTitle) {
    headerTitle.textContent = "Dienkon Addon"; // Updated
  }

  // Update auth form based on which form is currently visible
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

  if (noAccountText) {
    noAccountText.childNodes[0].nodeValue =
      authTranslations[currentLanguage].noAccount + " ";
  }
  if (toggleToRegisterLink) {
    toggleToRegisterLink.textContent =
      authTranslations[currentLanguage].registerNow;
  }
  if (haveAccountText) {
    haveAccountText.childNodes[0].nodeValue =
      authTranslations[currentLanguage].haveAccount + " ";
  }
  if (toggleToLoginLink) {
    toggleToLoginLink.textContent = authTranslations[currentLanguage].loginNow;
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
  updateUIText(); // Initial UI text update based on default English and login form

  // Email/Password Login
  if (emailLoginBtn) {
    emailLoginBtn.addEventListener("click", async (e) => {
      e.preventDefault(); // Prevent default form submission
      console.log("Email Login button clicked.");
      hideMessage();
      const email = document.getElementById("loginEmail")?.value;
      const password = document.getElementById("loginPassword")?.value;

      if (!email) {
        showMessage(authTranslations[currentLanguage].emailError, true);
        return;
      }
      if (password && password.length < 6) {
        showMessage(authTranslations[currentLanguage].passwordError, true);
        return;
      }
      if (!password) {
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
        );
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
    registerBtn.addEventListener("click", async (e) => {
      e.preventDefault(); // Prevent default form submission
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
        showMessage(authTranslations[currentLanguage].passwordError, true);
        return;
      }
      if (!password) {
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
            displayName: displayName || user.email,
            email: user.email,
            photoURL: user.photoURL || "",
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
            displayName: "Guest", // Default anonymous name is English
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
  if (
    toggleToRegisterLink &&
    loginForm &&
    registerForm &&
    authTitle &&
    noAccountText &&
    haveAccountText
  ) {
    toggleToRegisterLink.addEventListener("click", (e) => {
      console.log("Toggle to Register link clicked.");
      e.preventDefault();
      loginForm.style.display = "none";
      registerForm.style.display = "block";
      authTitle.textContent = authTranslations[currentLanguage].register;
      noAccountText.style.display = "none";
      haveAccountText.style.display = "block";
      hideMessage();
    });
  } else {
    console.warn("Toggle to Register link or related forms/title not found.");
  }

  if (
    toggleToLoginLink &&
    loginForm &&
    registerForm &&
    authTitle &&
    noAccountText &&
    haveAccountText
  ) {
    toggleToLoginLink.addEventListener("click", (e) => {
      console.log("Toggle to Login link clicked.");
      e.preventDefault();
      loginForm.style.display = "block";
      registerForm.style.display = "none";
      authTitle.textContent = authTranslations[currentLanguage].login;
      noAccountText.style.display = "block";
      haveAccountText.style.display = "none";
      hideMessage();
    });
  } else {
    console.warn("Toggle to Login link or related forms/title not found.");
  }

  // Initial authentication check on page load
  onAuthStateChanged(auth, (user) => {
    if (user) {
      redirectToPreviousPage();
    }
  });

  // Set initial display for forms and toggle text
  loginForm.style.display = "block";
  registerForm.style.display = "none";
  authTitle.textContent = authTranslations[currentLanguage].login;
  noAccountText.style.display = "block";
  haveAccountText.style.display = "none";
});
