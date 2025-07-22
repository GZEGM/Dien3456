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
  sendEmailVerification,
  sendPasswordResetEmail, // Import sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Global variables for language and theme
// For this request, we'll enforce English only for auth.js
let currentLanguage = "en"; // Hardcode to English as requested
let currentTheme = localStorage.getItem("theme") || "dark";

// Firebase configuration (Must match your Firebase Project)
const firebaseConfig = {
  apiKey: "AIzaSyByxU2b9nfT9XvDUKGYG6qMPxq-Lt2h2YI",
  authDomain: "dienkon-addon.firebaseapp.com",
  projectId: "dienkon-addon",
  storageBucket: "dienkon-addon.firebaseapp.com",
  messagingSenderId: "222007544409",
  appId: "1:222007544409:web:e5bd9965f3da46c8013f48", // Ensure this appId is EXACT
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
// New elements for password reset
const forgotPasswordLink = document.getElementById("forgotPasswordLink"); // Assuming you add this to auth.html
const resetPasswordModal = document.getElementById("resetPasswordModal"); // Assuming you add this modal
const resetEmailInput = document.getElementById("resetEmailInput"); // Assuming input for reset email
const sendResetEmailBtn = document.getElementById("sendResetEmailBtn"); // Button to send reset email
const closeResetModalBtn = document.getElementById("closeResetModal"); // Close button for the modal

// Language setup (English only as requested)
const authTranslations = {
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
    registerSuccess:
      "Your account has been created. Please check your email to verify and complete registration.",
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
    emailNotVerified:
      "Your email is not verified. Please check your inbox for a verification link.",
    verificationEmailSent:
      "Verification email sent! Please check your inbox (and spam folder).",
    passwordResetEmailSent:
      "Password reset email sent! Please check your inbox (and spam folder).",
    passwordResetFailed: "Password reset failed: ",
    forgotPassword: "Forgot Password?",
    resetPasswordTitle: "Reset Password",
    sendResetLink: "Send Reset Link",
    close: "Close",
    // These might be needed for consistency, though auth.js doesn't directly use them for UI in the auth flow
    language: "Language",
    theme: "Theme",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    settings: "Settings",
    home: "Home",
    forum: "Forum",
    userAvatarAlt: "User Avatar",
    logout: "Logout",
  },
};

// Function to apply theme (kept for consistency with addon.js)
function applyTheme(theme) {
  document.body.classList.remove("dark-mode", "light-mode");
  document.body.classList.add(`${theme}-mode`);
}

// Function to update UI text based on language (now always English)
function updateUIText() {
  const headerTitle = document.getElementById("headerTitle");
  if (headerTitle) {
    headerTitle.textContent = "Dienkon Addon";
  }

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
  // Update password reset modal text
  if (document.getElementById("forgotPasswordLink")) {
    document.getElementById("forgotPasswordLink").textContent =
      authTranslations[currentLanguage].forgotPassword;
  }
  if (resetPasswordModal) {
    document.getElementById("resetPasswordModalTitle").textContent =
      authTranslations[currentLanguage].resetPasswordTitle;
    document.getElementById("resetEmailInput").placeholder =
      authTranslations[currentLanguage].emailPlaceholder;
    document.getElementById("sendResetEmailBtn").textContent =
      authTranslations[currentLanguage].sendResetLink;
    document.getElementById("closeResetModal").textContent =
      authTranslations[currentLanguage].close;
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
    window.location.href = "index.html"; // Default redirect if no specific page was stored
  }
}

// --- START Discord Notification Function ---
const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1397090922818310206/iIBWjVnMlaDozLfnzy4vctvEcUXiefGj11vuIdEmZ2Rv0OrXp57Q0V3hLdcUn8NLUOU3";

async function sendDiscordNotification(username, eventType, details = {}) {
  console.log(
    "Attempting to send Discord notification to:",
    DISCORD_WEBHOOK_URL
  );

  if (
    !DISCORD_WEBHOOK_URL ||
    DISCORD_WEBHOOK_URL === "YOUR_DISCORD_WEBHOOK_URL_HERE"
  ) {
    console.warn(
      "Discord Webhook URL is not configured. Skipping notification."
    );
    return;
  }

  let description = "";
  let color = 0; // Default color (black)

  if (eventType === "login") {
    description = `User **${username}** has logged in to the website.`;
    color = 3066993; // Green for success
    if (details.email) {
      description += `\nEmail: \`${details.email}\``;
    }
    if (details.uid) {
      description += `\nID: \`${details.uid}\``;
    }
    if (details.loginType) {
      description += `\nLogin Type: \`${details.loginType}\``;
    }
    if (details.emailVerified !== undefined) {
      description += `\nEmail Verified: \`${details.emailVerified}\``;
    }
  } else if (eventType === "register") {
    description = `New user **${username}** has registered an account.`;
    color = 3447003; // Blue for new registration
    if (details.email) {
      description += `\nEmail: \`${details.email}\``;
    }
    if (details.uid) {
      description += `\nID: \`${details.uid}\``;
    }
    if (details.emailVerified !== undefined) {
      description += `\nEmail Verified: \`${details.emailVerified}\``;
    }
  }

  const payload = {
    embeds: [
      {
        title: `Website Activity Notification`,
        description: description,
        color: color,
        timestamp: new Date().toISOString(),
        footer: {
          text: "Dienkon Addons",
        },
      },
    ],
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to send Discord notification: ${response.status} ${response.statusText}. Response: ${errorText}`
      );
    } else {
      console.log("Discord notification sent successfully.");
    }
  } catch (error) {
    console.error("Error sending Discord notification:", error);
  }
}
// --- END Discord Notification Function ---

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(currentTheme);
  updateUIText();

  // Email/Password Login
  if (emailLoginBtn) {
    emailLoginBtn.addEventListener("click", async (e) => {
      e.preventDefault();
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
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Check if email is verified
        if (!user.emailVerified) {
          showMessage(authTranslations[currentLanguage].emailNotVerified, true);

          // Optionally, you can send a verification email again
          await sendEmailVerification(user);

          // Sign out unverified user
          await auth.signOut();
          return;
        }

        // If email is verified, save/update user data to Firestore
        await setDoc(
          doc(
            db,
            `artifacts/${firebaseConfig.appId}/public/data/users`,
            user.uid
          ),
          {
            uid: user.uid,
            displayName: user.displayName || user.email,
            email: user.email,
            photoURL: user.photoURL || "",
            createdAt: user.metadata.creationTime,
            lastLoginAt: user.metadata.lastSignInTime,
            emailVerified: user.emailVerified, // Should be true here
          },
          { merge: true }
        );

        showMessage(authTranslations[currentLanguage].loginSuccess, false);
        // Ensure Discord notification is sent before redirecting
        await sendDiscordNotification(
          user.displayName || user.email || "Guest",
          "login",
          {
            email: user.email,
            uid: user.uid,
            loginType: "Email/Password",
            emailVerified: user.emailVerified,
          }
        );
        // setTimeout(redirectToPreviousPage, 10000); // 10-second delay
      } catch (error) {
        console.error("Error logging in:", error);
        showMessage(
          authTranslations[currentLanguage].loginFailed + error.message,
          true
        );
        const forgotPasswordLinkP = document.querySelector(
          ".forgot-password-link"
        );
        if (forgotPasswordLinkP) {
          forgotPasswordLinkP.style.display = "block";
        }
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
        // Google login inherently verifies email, so no explicit check needed here.
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
            emailVerified: user.emailVerified, // Will be true for Google accounts
          },
          { merge: true }
        );
        showMessage(authTranslations[currentLanguage].loginSuccess, false);
        // Ensure Discord notification is sent before redirecting
        await sendDiscordNotification(
          user.displayName || user.email || "Guest",
          "login",
          {
            email: user.email,
            uid: user.uid,
            loginType: "Google",
            emailVerified: user.emailVerified,
          }
        );
        // setTimeout(redirectToPreviousPage, 10000); // 10-second delay
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
      e.preventDefault();
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

        if (displayName) {
          await updateProfile(user, { displayName: displayName });
        }

        // Send email verification
        await sendEmailVerification(user);

        // Sign out the user immediately after registration so they have to verify their email to log in.
        await auth.signOut();

        showMessage(authTranslations[currentLanguage].registerSuccess, false);

        // Ensure Discord notification is sent
        await sendDiscordNotification(
          displayName || user.email || "New User",
          "register",
          {
            email: user.email,
            uid: user.uid,
            emailVerified: user.emailVerified, // Will be false at this point
          }
        );
        // Do not redirect after registration with email verification
        // User needs to verify email first.
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
        console.log("Anonymous user logged in:", user);
        // Ensure Discord notification is sent before redirecting
        await sendDiscordNotification("Guest", "login", {
          uid: user.uid,
          loginType: "Anonymous",
          emailVerified: user.emailVerified,
        });

        await setDoc(
          doc(
            db,
            `artifacts/${firebaseConfig.appId}/public/data/users`,
            user.uid
          ),
          {
            uid: user.uid,
            displayName: "Guest",
            photoURL: "",
            createdAt: user.metadata.creationTime,
            lastLoginAt: user.metadata.lastSignInTime,
          },
          { merge: true }
        );

        showMessage(authTranslations[currentLanguage].anonLoginSuccess, false);

        // setTimeout(redirectToPreviousPage, 10000); // 10-second delay for anonymous login
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

  // Password Reset Logic
  if (
    forgotPasswordLink &&
    resetPasswordModal &&
    sendResetEmailBtn &&
    closeResetModalBtn
  ) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      hideMessage();
      resetPasswordModal.style.display = "flex"; // Use flex to center the modal
    });

    closeResetModalBtn.addEventListener("click", () => {
      resetPasswordModal.style.display = "none";
      resetEmailInput.value = ""; // Clear input on close
    });

    window.addEventListener("click", (event) => {
      if (event.target === resetPasswordModal) {
        resetPasswordModal.style.display = "none";
        resetEmailInput.value = ""; // Clear input on close
      }
    });

    sendResetEmailBtn.addEventListener("click", async () => {
      hideMessage();
      const email = resetEmailInput.value;
      if (!email) {
        showMessage(authTranslations[currentLanguage].emailError, true);
        return;
      }
      try {
        await sendPasswordResetEmail(auth, email);
        showMessage(
          authTranslations[currentLanguage].passwordResetEmailSent,
          false
        );
        resetPasswordModal.style.display = "none";
        resetEmailInput.value = "";
      } catch (error) {
        console.error("Error sending password reset email:", error);
        showMessage(
          authTranslations[currentLanguage].passwordResetFailed + error.message,
          true
        );
      }
    });
  } else {
    console.warn(
      "Password reset elements not found. Ensure 'forgotPasswordLink', 'resetPasswordModal', 'resetEmailInput', 'sendResetEmailBtn', and 'closeResetModal' exist in your auth.html."
    );
  }

  // Initial authentication check on page load
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // If user is logged in via email/password but not verified, log them out
      // Anonymous users and Google users are considered 'verified' for this purpose as per Firebase's internal handling
      if (
        user.providerData.some(
          (provider) => provider.providerId === "password"
        ) &&
        !user.emailVerified
      ) {
        auth.signOut();
        showMessage(authTranslations[currentLanguage].emailNotVerified, true);
      } else {
        setTimeout(redirectToPreviousPage, 3000);
      }
    }
  });

  // Set initial display for forms and toggle text
  loginForm.style.display = "block";
  registerForm.style.display = "none";
  authTitle.textContent = authTranslations[currentLanguage].login;
  noAccountText.style.display = "block";
  haveAccountText.style.display = "none";
});
