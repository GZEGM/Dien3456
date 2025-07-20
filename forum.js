// forum.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile, // Added for profile updates
  signInAnonymously, // Added for anonymous sign-in
  signInWithCustomToken, // Added for custom token sign-in
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy, // Removed orderBy from direct import as it will be used in-memory sorting
  onSnapshot,
  doc, // Ensure 'doc' is explicitly imported
  getDocs,
  where,
  limit,
  setDoc,
  updateDoc, // Added for profile updates
  deleteDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Global variables for language and theme
// Sửa dòng khởi tạo currentLanguage
let currentLanguage =
  (localStorage.getItem("language") || "en") in translations
    ? localStorage.getItem("language") || "en"
    : "en";
let currentTheme = localStorage.getItem("theme") || "dark";
let currentUser = null; // To store current authenticated user
let db, auth; // Firebase instances
let currentChatRecipientId = null; // To store the ID of the user currently chatting with
let unsubscribeChatListener = null; // To unsubscribe from chat listener when closing chat
let unsubscribeFriendsListener = null; // To unsubscribe from friends listener
let unsubscribeFriendRequestsListener = null; // To unsubscribe from friend requests listener
let unsubscribeConversationsListener = null; // To unsubscribe from conversations listener
let unsubscribePostsListener = null; // To unsubscribe from posts listener

// Firebase configuration (provided by Canvas environment or hardcoded fallback)
const firebaseConfig =
  typeof __firebase_config !== "undefined"
    ? JSON.parse(__firebase_config)
    : {
        apiKey: "AIzaSyByxU2b9nfT9XvDUKGYG6qMPxq-Lt2h2YI",
        authDomain: "dienkon-addon.firebaseapp.com",
        projectId: "dienkon-addon",
        storageBucket: "dienkon-addon.firebaseapp.com",
        messagingSenderId: "222007544409",
        appId: "1:222007544409:web:e5bd9965f3da46c8013f48",
        measurementId: "G-P00YDS3E58",
      };
const appId = typeof __app_id !== "undefined" ? __app_id : firebaseConfig.appId;

// Forum specific translations
const forumTranslations = {
  vi: {
    forum: "Diễn đàn",
    newPostTitle: "Tạo bài viết mới",
    postPlaceholder: "Viết bài viết của bạn ở đây...",
    imageUrlPlaceholder: "Dán URL hình ảnh (tùy chọn)",
    postBtn: "Đăng bài",
    recentPosts: "Bài viết gần đây",
    loadingPosts: "Đang tải bài viết...",
    noPosts: "Chưa có bài viết nào.",
    commentPlaceholder: "Viết bình luận của bạn...",
    commentBtn: "Bình luận",
    comments: "Bình luận",
    loginToPost: "Vui lòng đăng nhập để đăng bài hoặc bình luận.",
    logout: "Đăng xuất",
    welcome: "Chào mừng,",
    userId: "ID:",
    home: "Trang chủ",
    settings: "Cài đặt",
    language: "Ngôn ngữ",
    theme: "Chủ đề",
    darkMode: "Chế độ Tối",
    lightMode: "Chế độ Sáng",
    mcpeAddons: "Dienkon Addon",
    close: "Đóng",
    postSuccess: "Bài viết đã được đăng thành công!",
    commentSuccess: "Bình luận đã được đăng thành công!",
    postError: "Lỗi khi đăng bài: ",
    commentError: "Lỗi khi đăng bình luận: ",
    imageLoadError: "Không thể tải hình ảnh.",
    userAvatarAlt: "Ảnh đại diện người dùng",
    postImageAlt: "Ảnh bài viết",
    commentUserAvatarAlt: "Ảnh đại diện người dùng bình luận",
    postContentEmpty: "Nội dung bài viết không được để trống.",
    chat: "Trò chuyện",
    chatWith: "Trò chuyện với",
    typeMessage: "Nhập tin nhắn của bạn...",
    send: "Gửi",
    attachFile: "Đính kèm tệp (Không khả dụng)", // Updated translation
    fileUploadError: "Lỗi tải lên tệp: ",
    fileTooLarge: "Tệp quá lớn. Kích thước tối đa là 5MB.",
    chatFile: "Tệp đính kèm",
    downloadFile: "Tải xuống tệp",
    messageSendError: "Lỗi gửi tin nhắn: ",
    noMessages: "Chưa có tin nhắn nào. Bắt đầu trò chuyện!",
    uploading: "Đang tải lên...",
    fileUploadDisabled:
      "Tính năng tải lên tệp không khả dụng do hạn chế tài khoản.",
    firebaseInitError:
      "Lỗi khởi tạo Firebase. Vui lòng đảm bảo cấu hình Firebase đã được cung cấp.",
    searchUsers: "Tìm người dùng theo tên hiển thị...",
    noUsersFound: "Không tìm thấy người dùng nào.",
    startChat: "Bắt đầu trò chuyện",
    chatWithSelf: "Bạn không thể trò chuyện với chính mình.",
    friends: "Bạn bè",
    loadingFriends: "Đang tải bạn bè...",
    noFriends: "Bạn chưa có người bạn nào.",
    friendRequests: "Yêu cầu kết bạn",
    loadingFriendRequests: "Đang tải yêu cầu...",
    noFriendRequests: "Không có yêu cầu kết bạn nào.",
    addFriend: "Kết bạn",
    accept: "Chấp nhận",
    decline: "Từ chối",
    removeFriend: "Hủy kết bạn",
    friendRequestSent: "Đã gửi yêu cầu kết bạn!",
    friendRequestAccepted: "Đã chấp nhận yêu cầu kết bạn!",
    friendRequestDeclined: "Đã từ chối yêu cầu kết bạn.",
    friendRemoved: "Đã hủy kết bạn.",
    friendRequestError: "Lỗi khi xử lý yêu cầu kết bạn: ",
    removeFriendError: "Lỗi khi hủy kết bạn: ",
    // New tab translations
    tabPosts: "Bài viết",
    tabFriends: "Bạn bè",
    tabMessages: "Tin nhắn",
    tabProfile: "Hồ sơ", // New
    findUsers: "Tìm kiếm người dùng",
    messagesSectionTitle: "Tin nhắn của tôi",
    loadingConversations: "Đang tải tin nhắn...",
    noConversations: "Chưa có cuộc trò chuyện nào.",
    // Friends tab sub-sections
    friendsListTitle: "Danh sách bạn bè",
    friendRequestsTitle: "Yêu cầu kết bạn",
    findUsersTitle: "Tìm kiếm người dùng",
    // Profile tab translations
    profile: "Hồ sơ",
    profileSectionTitle: "Hồ sơ của tôi",
    displayNameLabel: "Tên hiển thị:",
    idLabel: "ID:",
    emailLabel: "Email:",
    descriptionLabel: "Mô tả:",
    saveProfile: "Lưu Hồ sơ",
    profileUpdated: "Hồ sơ đã được cập nhật!",
    deletePost: "Xóa bài đăng",
    confirmDeletePost: "Bạn có chắc chắn muốn xóa bài đăng này?",
    postDeleted: "Bài đăng đã được xóa!",
    confirmRemoveFriend: "Bạn có chắc chắn muốn hủy kết bạn với người này?",
    sentRequest: "Đã gửi yêu cầu", // New
    confirm: "Xác nhận", // New
    cancel: "Hủy", // New
    thisIsYourProfile: "Đây là hồ sơ của bạn.", // New translation for self-profile click
    edit: "Chỉnh sửa", // New translation for edit option
    editPostTitle: "Chỉnh sửa bài đăng", // New
    editCommentTitle: "Chỉnh sửa bình luận", // New
    save: "Lưu", // New
    editCommentConfirm: "Bạn có chắc chắn muốn xóa bình luận này?", // New
    noChatSelected: "Chọn một cuộc trò chuyện để bắt đầu", // New
    recallMessage: "Thu hồi", // New
    confirmRecallMessage:
      "Bạn có chắc chắn muốn thu hồi tin nhắn này? Tin nhắn sẽ biến mất với cả hai bên.", // New
    messageRecalled: "Tin nhắn đã được thu hồi!", // New
    messageEdited: "Tin nhắn đã được chỉnh sửa!", // New
    messageRecalledText: "Tin nhắn đã được thu hồi", // New
  },
  en: {
    forum: "Forum",
    newPostTitle: "Create New Post",
    postPlaceholder: "Write your post here...",
    imageUrlPlaceholder: "Paste image URL (optional)",
    postBtn: "Post",
    recentPosts: "Recent Posts",
    loadingPosts: "Loading posts...",
    noPosts: "No posts yet.",
    commentPlaceholder: "Write your comment...",
    commentBtn: "Comment",
    comments: "Comments",
    loginToPost: "Please log in to post or comment.",
    logout: "Logout",
    welcome: "Welcome,",
    userId: "ID:",
    home: "Home",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    mcpeAddons: "Dienkon Addons",
    close: "Close",
    postSuccess: "Post created successfully!",
    commentSuccess: "Comment posted successfully!",
    postError: "Error posting: ",
    commentError: "Error commenting: ",
    imageLoadError: "Could not load image.",
    userAvatarAlt: "User Avatar",
    postImageAlt: "Post Image",
    commentUserAvatarAlt: "Comment User Avatar",
    postContentEmpty: "Post content cannot be empty.",
    chat: "Chat",
    chatWith: "Chat with",
    typeMessage: "Type your message...",
    send: "Send",
    attachFile: "Attach File (Disabled)", // Updated translation
    fileUploadError: "File upload error: ",
    fileTooLarge: "File too large. Max size is 5MB.",
    chatFile: "Attached File",
    downloadFile: "Download File",
    messageSendError: "Error sending message: ",
    noMessages: "No messages yet. Start chatting!",
    uploading: "Uploading...",
    fileUploadDisabled:
      "File upload feature is disabled due to account limitations.",
    firebaseInitError:
      "Firebase initialization error. Please ensure Firebase config is provided.",
    searchUsers: "Search users by display name...",
    noUsersFound: "No users found.",
    startChat: "Start Chat",
    chatWithSelf: "You cannot chat with yourself.",
    friends: "Friends",
    loadingFriends: "Loading friends...",
    noFriends: "You have no friends yet.",
    friendRequests: "Friend Requests",
    loadingFriendRequests: "Loading requests...",
    noFriendRequests: "No friend requests.",
    addFriend: "Add Friend",
    accept: "Accept",
    decline: "Decline",
    removeFriend: "Remove Friend",
    friendRequestSent: "Friend request sent!",
    friendRequestAccepted: "Friend request accepted!",
    friendRequestDeclined: "Friend request declined.",
    friendRemoved: "Friend removed.",
    friendRequestError: "Error processing friend request: ",
    removeFriendError: "Error removing friend: ",
    // New tab translations
    tabPosts: "Posts",
    tabFriends: "Friends",
    tabMessages: "Messages",
    tabProfile: "Profile", // New
    findUsers: "Find Users",
    messagesSectionTitle: "My Messages",
    loadingConversations: "Loading messages...",
    noConversations: "No conversations yet.",
    // Friends tab sub-sections
    friendsListTitle: "Friends List",
    friendRequestsTitle: "Friend Requests",
    findUsersTitle: "Find Users",
    // Profile tab translations
    profile: "Profile",
    profileSectionTitle: "My Profile",
    displayNameLabel: "Display Name:",
    idLabel: "ID:",
    emailLabel: "Email:",
    descriptionLabel: "Description:",
    saveProfile: "Save Profile",
    profileUpdated: "Profile updated successfully!",
    deletePost: "Delete Post",
    confirmDeletePost: "Are you sure you want to delete this post?",
    postDeleted: "Post deleted!",
    confirmRemoveFriend: "Are you sure you want to unfriend this person?",
    sentRequest: "Request Sent", // New
    confirm: "Confirm", // New
    cancel: "Cancel", // New
    thisIsYourProfile: "This is your profile.", // New translation for self-profile click
    edit: "Edit", // New translation for edit option
    editPostTitle: "Edit Post", // New
    editCommentTitle: "Edit Comment", // New
    save: "Save", // New
    editCommentConfirm: "Are you sure you want to delete this comment?", // New
    noChatSelected: "Select a conversation to start", // New
    recallMessage: "Recall", // New
    confirmRecallMessage:
      "Are you sure you want to recall this message? It will disappear for both sides.", // New
    messageRecalled: "Message recalled!", // New
    messageEdited: "Message edited!", // New
    messageRecalledText: "Message recalled", // New
  },
};

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
    forumTranslations[currentLanguage].forum;
  document.getElementById("headerTitle").textContent =
    forumTranslations[currentLanguage].mcpeAddons;
  document.getElementById("navHome").textContent =
    forumTranslations[currentLanguage].home;
  document.getElementById("navForum").textContent =
    forumTranslations[currentLanguage].forum;
  document.getElementById("settingsModalTitle").textContent =
    forumTranslations[currentLanguage].settings;
  document.getElementById("modalLangLabel").textContent =
    forumTranslations[currentLanguage].language + ":";
  document.getElementById("modalThemeLabel").textContent =
    forumTranslations[currentLanguage].theme + ":";
  document.getElementById("modalThemeDarkText").textContent =
    forumTranslations[currentLanguage].darkMode;
  document.getElementById("modalThemeLightText").textContent =
    forumTranslations[currentLanguage].lightMode;

  document.getElementById("newPostTitle").textContent =
    forumTranslations[currentLanguage].newPostTitle;
  document.getElementById("postContent").placeholder =
    forumTranslations[currentLanguage].postPlaceholder;
  document.getElementById("postImageUrl").placeholder =
    forumTranslations[currentLanguage].imageUrlPlaceholder;
  document.getElementById("createPostBtn").textContent =
    forumTranslations[currentLanguage].postBtn;
  document.getElementById("forumPostsTitle").textContent =
    forumTranslations[currentLanguage].recentPosts;
  document.getElementById("loadingPosts").textContent =
    forumTranslations[currentLanguage].loadingPosts;
  document.getElementById("logoutBtn").textContent =
    forumTranslations[currentLanguage].logout;

  // Chat elements (now part of the messages tab)
  document.getElementById("chatMessageInput").placeholder =
    forumTranslations[currentLanguage].typeMessage;
  document.getElementById("sendChatBtn").textContent =
    forumTranslations[currentLanguage].send;

  // Friends section
  document.getElementById("friendsSectionTitle").textContent =
    forumTranslations[currentLanguage].friends;
  document.getElementById("loadingFriends").textContent =
    forumTranslations[currentLanguage].loadingFriends;
  document.getElementById("friendRequestsSectionTitle").textContent =
    forumTranslations[currentLanguage].friendRequests;
  document.getElementById("loadingFriendRequests").textContent =
    forumTranslations[currentLanguage].loadingFriendRequests;
  document.getElementById("findUsersSectionTitle").textContent =
    forumTranslations[currentLanguage].findUsers;
  document.getElementById("findUserSearchInput").placeholder =
    forumTranslations[currentLanguage].searchUsers;

  // Messages section
  document.getElementById("messagesSectionTitle").textContent =
    forumTranslations[currentLanguage].messagesSectionTitle;
  document.getElementById("loadingConversations").textContent =
    forumTranslations[currentLanguage].loadingConversations;
  document.getElementById("noChatSelectedMessage").textContent =
    forumTranslations[currentLanguage].noChatSelected;

  // Tab buttons
  document.getElementById("tabPostsText").textContent =
    forumTranslations[currentLanguage].tabPosts;
  document.getElementById("tabFriendsText").textContent =
    forumTranslations[currentLanguage].tabFriends;
  document.getElementById("tabMessagesText").textContent =
    forumTranslations[currentLanguage].tabMessages;
  document.getElementById("tabProfileText").textContent = // New
    forumTranslations[currentLanguage].tabProfile; // New

  // Friends tab sidebar buttons
  document.getElementById("friendsListBtnText").textContent =
    forumTranslations[currentLanguage].friendsListTitle;
  document.getElementById("friendRequestsBtnText").textContent =
    forumTranslations[currentLanguage].friendRequestsTitle;
  document.getElementById("findUsersBtnText").textContent =
    forumTranslations[currentLanguage].findUsersTitle;

  // Profile tab elements
  document.getElementById("profileSectionTitle").textContent =
    forumTranslations[currentLanguage].profileSectionTitle;
  document.getElementById("profileDisplayNameLabel").textContent =
    forumTranslations[currentLanguage].displayNameLabel;
  document.getElementById("profileIdLabel").textContent =
    forumTranslations[currentLanguage].idLabel;
  document.getElementById("profileEmailLabel").textContent =
    forumTranslations[currentLanguage].emailLabel;
  document.getElementById("profileDescriptionLabel").textContent =
    forumTranslations[currentLanguage].descriptionLabel;
  document.getElementById("profileDescription").placeholder =
    forumTranslations[currentLanguage].descriptionLabel; // Placeholder for description
  document.getElementById("saveProfileBtn").textContent =
    forumTranslations[currentLanguage].saveProfile;

  // Confirmation Modal
  document.getElementById("confirmationModalTitle").textContent =
    forumTranslations[currentLanguage].confirm;
  document.getElementById("confirmActionBtn").textContent =
    forumTranslations[currentLanguage].confirm;
  document.getElementById("cancelActionBtn").textContent =
    forumTranslations[currentLanguage].cancel;

  // Context Menu
  document.getElementById("editOption").textContent =
    forumTranslations[currentLanguage].edit;
  document.getElementById("recallOption").textContent =
    forumTranslations[currentLanguage].recallMessage; // New
  document.getElementById("deleteOption").textContent =
    forumTranslations[currentLanguage].deletePost; // Reusing deletePost for comments too

  // Post Edit Modal
  document.getElementById("editPostTitle").textContent =
    forumTranslations[currentLanguage].editPostTitle;
  document.getElementById("editPostContent").placeholder =
    forumTranslations[currentLanguage].postPlaceholder;
  document.getElementById("editPostImageUrl").placeholder =
    forumTranslations[currentLanguage].imageUrlPlaceholder;
  document.getElementById("savePostEditBtn").textContent =
    forumTranslations[currentLanguage].save;
  document.getElementById("cancelPostEditBtn").textContent =
    forumTranslations[currentLanguage].cancel;

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
}

// Function to display messages
function showForumMessage(message, isError = false) {
  const forumMessage = document.getElementById("forumMessage");
  forumMessage.textContent = message;
  forumMessage.className = `forum-message ${isError ? "error" : "success"}`;
  forumMessage.style.display = "block";
  setTimeout(() => {
    forumMessage.style.display = "none";
  }, 3000);
}

// Function to switch main tabs (Posts, Friends, Messages, Profile)
function switchTab(tabName) {
  // Unsubscribe from previous listeners to prevent memory leaks and unnecessary calls
  if (unsubscribePostsListener) unsubscribePostsListener();
  if (unsubscribeFriendsListener) unsubscribeFriendsListener();
  if (unsubscribeFriendRequestsListener) unsubscribeFriendRequestsListener();
  if (unsubscribeConversationsListener) unsubscribeConversationsListener();
  // NEW: Unsubscribe from chat listener when switching away from messages tab
  if (unsubscribeChatListener) {
    unsubscribeChatListener();
    unsubscribeChatListener = null; // Reset to null after unsubscribing
    currentChatRecipientId = null; // Clear current chat recipient
    // Hide chat specific UI when leaving messages tab
    document.getElementById("chatHeader").style.display = "none";
    document.getElementById("chatMessages").style.display = "none";
    document.getElementById("chatInputArea").style.display = "none";
    document.getElementById("noChatSelectedMessage").style.display = "block";
  }

  // Ensure body scroll is re-enabled when switching tabs, as modals might have disabled it
  document.body.classList.remove("modal-open");

  // Deactivate all tab buttons and content
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.remove("active");
  });
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  // Activate the selected tab button and content
  document
    .querySelector(`.tab-button[data-tab="${tabName}"]`)
    .classList.add("active");
  document.getElementById(`${tabName}TabContent`).classList.add("active");

  // Load content specific to the tab
  if (tabName === "posts") {
    listenForPosts(); // Ensure posts are loaded/listened
  } else if (tabName === "friends") {
    // Default to showing friends list when friends tab is opened
    showFriendsSubSection("friendsList");
  } else if (tabName === "messages") {
    // For messages tab, hide chat content initially on mobile, show sidebar
    if (window.innerWidth <= 768) {
      document
        .getElementById("chatMainContent")
        .classList.add("hidden-on-mobile");
      document
        .querySelector(".messages-section")
        .classList.add("sidebar-visible");
    } else {
      document
        .getElementById("chatMainContent")
        .classList.remove("hidden-on-mobile");
      document
        .querySelector(".messages-section")
        .classList.remove("sidebar-visible");
    }
    // Only listen for conversations if the tab is active
    listenForConversations(true); // Load recent conversations and auto-select the latest
  } else if (tabName === "profile") {
    renderProfile(); // Load user profile
  }
}

// Function to switch sub-sections within the Friends tab
function showFriendsSubSection(sectionName) {
  // Deactivate all friends sidebar buttons
  document.querySelectorAll(".friends-sidebar-button").forEach((button) => {
    button.classList.remove("active");
  });

  // Hide all friends sub-sections
  document
    .querySelectorAll(".friends-sub-section")
    .forEach((section) => (section.style.display = "none"));

  // Activate the selected sidebar button
  document
    .querySelector(`.friends-sidebar-button[data-section="${sectionName}"]`)
    .classList.add("active");

  // Show the corresponding content
  document.getElementById(`${sectionName}Container`).style.display = "block";

  // Load data for the active sub-section
  if (sectionName === "friendsList") {
    listenForFriends();
  } else if (sectionName === "friendRequests") {
    listenForFriendRequests();
  } else if (sectionName === "findUsers") {
    // Clear search input and results when switching to find users
    document.getElementById("findUserSearchInput").value = "";
    document.getElementById("findUserSearchResults").innerHTML = "";
  }
}

// Initialize Firebase and set up auth listener
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize Firebase only once
  try {
    const initializedApp = initializeApp(firebaseConfig);
    auth = getAuth(initializedApp);
    db = getFirestore(initializedApp);
  } catch (e) {
    console.error("Firebase initialization error:", e);
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
  }

  applyTheme(currentTheme);
  updateUIText(); // Initial UI text update

  // Auth state listener
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      document.getElementById("userNameDisplay").textContent = `${
        forumTranslations[currentLanguage].welcome
      } ${user.displayName || user.email || "Ẩn danh"}`;
      document.getElementById(
        "userIdDisplay"
      ).textContent = `${forumTranslations[currentLanguage].userId} ${user.uid}`;
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

      // Save user info to a public 'users' collection for search functionality
      // Ensure db is initialized before calling doc
      if (db) {
        const userRef = doc(
          db,
          `artifacts/${appId}/public/data/users`,
          currentUser.uid
        );
        // Fetch existing user data to preserve description if it exists
        const userDocSnap = await getDoc(userRef);
        const existingUserData = userDocSnap.exists() ? userDocSnap.data() : {};

        await setDoc(
          userRef,
          {
            uid: currentUser.uid,
            displayName:
              currentUser.displayName || currentUser.email || "Ẩn danh",
            email: currentUser.email || "", // Store email
            photoURL: currentUser.photoURL || "",
            description: existingUserData.description || "", // Preserve existing description
            createdAt: currentUser.metadata.creationTime,
            lastActive: serverTimestamp(),
          },
          { merge: true }
        ); // Use merge to update existing fields without overwriting
      } else {
        console.error("Firestore DB not initialized. Cannot save user data.");
      }

      // Enable post creation if user is logged in
      document.getElementById("postContent").disabled = false;
      document.getElementById("postImageUrl").disabled = false;
      document.getElementById("createPostBtn").disabled = false;
      document.getElementById("createPostBtn").textContent =
        forumTranslations[currentLanguage].postBtn;

      // Initialize with the posts tab active
      switchTab("posts");
    } else {
      currentUser = null;
      document.getElementById(
        "userNameDisplay"
      ).textContent = `${forumTranslations[currentLanguage].welcome} Khách`;
      document.getElementById(
        "userIdDisplay"
      ).textContent = `${forumTranslations[currentLanguage].userId} Đang tải...`;
      document.getElementById("userAvatar").src =
        "https://placehold.co/40x40/333333/FFFFFF?text=U";
      document.getElementById("userProfileBtn").style.display = "block";

      // Disable post creation if not logged in
      document.getElementById("postContent").disabled = true;
      document.getElementById("postImageUrl").disabled = true;
      document.getElementById("createPostBtn").disabled = true;
      document.getElementById("createPostBtn").textContent =
        forumTranslations[currentLanguage].loginToPost;

      // Store the current page URL before redirecting to auth.html
      // Only redirect if not already on the auth page
      if (window.location.pathname !== "/auth.html") {
        localStorage.setItem("redirectAfterLogin", window.location.href);
        console.log(
          "Redirecting to auth.html. Stored return URL:",
          window.location.href
        );
        window.location.href = "auth.html";
        return; // Stop further execution on this page
      }

      // Unsubscribe from listeners if user logs out
      if (unsubscribePostsListener) unsubscribePostsListener();
      if (unsubscribeChatListener) unsubscribeChatListener();
      if (unsubscribeFriendsListener) unsubscribeFriendsListener();
      if (unsubscribeFriendRequestsListener)
        unsubscribeFriendRequestsListener();
      if (unsubscribeConversationsListener) unsubscribeConversationsListener();
    }
  });

  // Event Listeners for Header Controls (copied from script.js/addon.js)
  // Language Dropdown
  document.querySelectorAll(".dropdown-content a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentLanguage = e.target.dataset.lang;
      localStorage.setItem("language", currentLanguage);
      updateUIText();
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
    document.body.classList.add("modal-open"); // Disable body scroll
    updateUIText(); // Ensure modal content is in current language and theme buttons are active
  });

  closeSettingsModal.addEventListener("click", () => {
    settingsModal.style.display = "none";
    document.body.classList.remove("modal-open"); // Re-enable body scroll
  });

  window.addEventListener("click", (event) => {
    if (event.target == settingsModal) {
      settingsModal.style.display = "none";
      document.body.classList.remove("modal-open"); // Re-enable body scroll
    }
  });

  // Modal Language Select
  modalLangSelect.addEventListener("change", (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem("language", currentLanguage);
    updateUIText();
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
      showForumMessage(forumTranslations[currentLanguage].logoutError, true);
    }
  });

  // Create Post
  document
    .getElementById("createPostBtn")
    .addEventListener("click", async () => {
      if (!currentUser) {
        showForumMessage(forumTranslations[currentLanguage].loginToPost, true);
        return;
      }

      const postContent = document.getElementById("postContent").value.trim();
      const postImageUrl = document.getElementById("postImageUrl").value.trim();

      if (!postContent) {
        showForumMessage(
          forumTranslations[currentLanguage].postContentEmpty,
          true
        );
        return;
      }

      try {
        const postsCollection = collection(
          db,
          `artifacts/${appId}/public/data/posts`
        );
        await addDoc(postsCollection, {
          userId: currentUser.uid,
          authorName: currentUser.displayName || currentUser.email || "Ẩn danh",
          authorPhoto: currentUser.photoURL || "",
          content: postContent,
          imageUrl: postImageUrl,
          timestamp: serverTimestamp(),
        });
        document.getElementById("postContent").value = "";
        document.getElementById("postImageUrl").value = "";
        showForumMessage(forumTranslations[currentLanguage].postSuccess, false);
      } catch (error) {
        console.error("Error adding document: ", error);
        showForumMessage(
          forumTranslations[currentLanguage].postError + error.message,
          true
        );
      }
    });

  // Chat message input (now part of the messages tab)
  const chatMessageInput = document.getElementById("chatMessageInput");
  const sendChatBtn = document.getElementById("sendChatBtn");
  const attachFileBtn = document.getElementById("attachFileBtn");
  const chatUploadProgress = document.getElementById("chatUploadProgress");

  // Send message when Enter is pressed in chat input
  chatMessageInput.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent new line
      sendChatBtn.click(); // Trigger send button click
    }
  });

  // User Search Functionality (for "Find Users" in Friends tab)
  const findUserSearchInput = document.getElementById("findUserSearchInput");
  const findUserSearchResults = document.getElementById(
    "findUserSearchResults"
  );

  findUserSearchInput.addEventListener(
    "input",
    debounce(async (e) => {
      const searchTerm = e.target.value.trim();
      findUserSearchResults.innerHTML = ""; // Clear previous results

      if (searchTerm.length < 2) {
        // Require at least 2 characters for search
        return;
      }
      if (!currentUser) {
        findUserSearchResults.innerHTML = `<p class="no-users-found-message">${forumTranslations[currentLanguage].loginToPost}</p>`;
        return;
      }
      if (!db) {
        console.error("Firestore DB not initialized. Cannot search users.");
        findUserSearchResults.innerHTML = `<p class="error-message">${forumTranslations[currentLanguage].firebaseInitError}</p>`;
        return;
      }

      try {
        const usersRef = collection(db, `artifacts/${appId}/public/data/users`);
        const q = query(
          usersRef,
          // orderBy("displayName"), // Removed orderBy for Firestore query
          where("displayName", ">=", searchTerm),
          where("displayName", "<=", searchTerm + "\uf8ff")
        );
        const querySnapshot = await getDocs(q);

        const usersFound = [];
        for (const userDoc of querySnapshot.docs) {
          // Changed 'doc' to 'userDoc' to avoid conflict
          const userData = userDoc.data();
          if (
            userData.displayName &&
            userData.displayName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) &&
            userData.uid !== currentUser.uid
          ) {
            // Check if already friends or if a request is pending
            const isFriend = (
              await getDoc(
                doc(
                  // Ensure 'doc' is used here
                  db,
                  `artifacts/${appId}/public/data/users/${currentUser.uid}/friends`,
                  userData.uid
                )
              )
            ).exists();
            const isRequestSent = (
              await getDoc(
                doc(
                  // Ensure 'doc' is used here
                  db,
                  `artifacts/${appId}/public/data/friendRequests`,
                  `${currentUser.uid}_${userData.uid}`
                )
              )
            ).exists();
            const isRequestReceived = (
              await getDoc(
                doc(
                  // Ensure 'doc' is used here
                  db,
                  `artifacts/${appId}/public/data/friendRequests`,
                  `${userData.uid}_${currentUser.uid}`
                )
              )
            ).exists();

            usersFound.push({
              ...userData,
              isFriend,
              isRequestSent,
              isRequestReceived,
            });
          }
        }

        // Sort usersFound in memory by displayName
        usersFound.sort((a, b) => a.displayName.localeCompare(b.displayName));

        if (usersFound.length > 0) {
          usersFound.forEach((user) => {
            const userElement = document.createElement("div");
            userElement.className = "chat-search-result-item"; // Reusing this style
            let addFriendButtonHtml = "";
            if (user.isFriend) {
              addFriendButtonHtml = `<button class="btn" disabled><i class="fas fa-check"></i> ${forumTranslations[currentLanguage].friends}</button>`;
            } else if (user.isRequestSent) {
              addFriendButtonHtml = `<button class="btn" disabled><i class="fas fa-paper-plane"></i> ${forumTranslations[currentLanguage].sentRequest}</button>`;
            } else if (user.isRequestReceived) {
              addFriendButtonHtml = `<button class="btn accept-btn" data-request-id="${user.uid}_${currentUser.uid}" data-sender-id="${user.uid}" data-sender-name="${user.displayName}"><i class="fas fa-check"></i> ${forumTranslations[currentLanguage].accept}</button>`;
            } else {
              addFriendButtonHtml = `<button class="btn add-friend-btn" data-user-id="${user.uid}" data-user-name="${user.displayName}">
                                        <i class="fas fa-user-plus"></i> ${forumTranslations[currentLanguage].addFriend}
                                      </button>`;
            }

            userElement.innerHTML = `
            <img src="${
              user.photoURL ||
              `https://placehold.co/30x30/333333/FFFFFF?text=${user.displayName
                .charAt(0)
                .toUpperCase()}`
            }" alt="User Avatar" class="user-avatar" data-user-id="${
              user.uid
            }" data-user-name="${user.displayName}" data-user-photo="${
              user.photoURL
            }" onerror="this.onerror=null;this.src='https://placehold.co/30x30/333333/FFFFFF?text=U';" />
            <span>${user.displayName}</span>
            <button class="btn start-chat-btn" data-user-id="${
              user.uid
            }" data-user-name="${user.displayName}" data-user-photo="${
              user.photoURL
            }">
              <i class="fas fa-comment-dots"></i> ${
                forumTranslations[currentLanguage].chat
              }
            </button>
            ${addFriendButtonHtml}
          `;
            findUserSearchResults.appendChild(userElement);
          });

          // Add event listeners to "Start Chat" buttons
          document
            .querySelectorAll("#findUserSearchResults .start-chat-btn")
            .forEach((button) => {
              button.addEventListener("click", (e) => {
                const userId = e.target.dataset.userId;
                const userName = e.target.dataset.userName;
                const userPhoto = e.target.dataset.userPhoto;
                startConversation(userId, userName, userPhoto);
              });
            });

          // Add event listeners to "Add Friend" buttons
          document
            .querySelectorAll("#findUserSearchResults .add-friend-btn")
            .forEach((button) => {
              button.addEventListener("click", async (e) => {
                const userId = e.target.dataset.userId;
                await sendFriendRequest(userId);
                // After sending, update the button to "Sent Request"
                e.target.innerHTML = `<i class="fas fa-paper-plane"></i> ${forumTranslations[currentLanguage].sentRequest}`;
                e.target.disabled = true;
              });
            });

          // Add event listeners to "Accept" buttons for incoming requests
          document
            .querySelectorAll("#findUserSearchResults .accept-btn")
            .forEach((button) => {
              button.addEventListener("click", async (e) => {
                const requestId = e.currentTarget.dataset.requestId;
                const senderId = e.currentTarget.dataset.senderId;
                const senderName = e.currentTarget.dataset.senderName;
                await acceptFriendRequest(requestId, senderId, senderName);
              });
            });

          // Add event listener for avatar clicks in search results
          document
            .querySelectorAll("#findUserSearchResults .user-avatar")
            .forEach((avatar) => {
              avatar.addEventListener("click", (e) => {
                const targetUserId = e.currentTarget.dataset.userId;
                const targetUserName = e.currentTarget.dataset.userName;
                const targetPhotoURL = e.currentTarget.dataset.userPhoto;
                showUserInteractionPopup(
                  targetUserId,
                  targetUserName,
                  targetPhotoURL
                );
              });
            });
        } else {
          findUserSearchResults.innerHTML = `<p class="no-users-found-message">${forumTranslations[currentLanguage].noUsersFound}</p>`;
        }
      } catch (error) {
        console.error("Error searching users:", error);
        findUserSearchResults.innerHTML = `<p class="error-message">Error searching users.</p>`;
      }
    }, 300)
  ); // Debounce to prevent too many queries

  // Disable file attachment button and show message
  attachFileBtn.addEventListener("click", () => {
    showForumMessage(
      forumTranslations[currentLanguage].fileUploadDisabled,
      true
    );
  });

  sendChatBtn.addEventListener("click", async () => {
    const messageText = chatMessageInput.value.trim();
    if (messageText && currentUser && currentChatRecipientId && db) {
      // Ensure db is initialized
      try {
        await sendMessage(currentChatRecipientId, messageText);
        chatMessageInput.value = ""; // Clear input after sending
      } catch (error) {
        console.error("Error sending message:", error);
        showForumMessage(
          forumTranslations[currentLanguage].messageSendError + error.message,
          true
        );
      }
    } else if (!db) {
      showForumMessage(
        forumTranslations[currentLanguage].firebaseInitError,
        true
      );
    }
  });

  // Tab button event listeners
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", function () {
      // Changed to function() for 'this' context
      const tabName = this.dataset.tab;
      switchTab(tabName);
    });
  });

  // Friends tab sidebar button event listeners
  document.querySelectorAll(".friends-sidebar-button").forEach((button) => {
    button.addEventListener("click", function () {
      // Changed to function() for 'this' context
      const sectionName = this.dataset.section;
      showFriendsSubSection(sectionName);
    });
  });

  // Save Profile Button Listener
  document
    .getElementById("saveProfileBtn")
    .addEventListener("click", saveProfile);

  // Confirmation Modal Listeners
  const confirmationModal = document.getElementById("confirmationModal");
  const closeConfirmationModal = document.getElementById(
    "closeConfirmationModal"
  );
  const confirmActionBtn = document.getElementById("confirmActionBtn");
  const cancelActionBtn = document.getElementById("cancelActionBtn");

  closeConfirmationModal.addEventListener("click", () => {
    confirmationModal.style.display = "none";
    document.body.classList.remove("modal-open"); // Re-enable body scroll
  });

  cancelActionBtn.addEventListener("click", () => {
    confirmationModal.style.display = "none";
    document.body.classList.remove("modal-open"); // Re-enable body scroll
  });

  window.addEventListener("click", (event) => {
    if (event.target === confirmationModal) {
      confirmationModal.style.display = "none";
      document.body.classList.remove("modal-open"); // Re-enable body scroll
    }
  });

  // Context Menu Listeners
  const contextMenu = document.getElementById("contextMenu");
  const editOption = document.getElementById("editOption");
  const recallOption = document.getElementById("recallOption"); // New
  const deleteOption = document.getElementById("deleteOption");

  // Hide context menu if clicked outside
  document.addEventListener("click", (e) => {
    if (
      contextMenu.style.display === "block" &&
      !contextMenu.contains(e.target)
    ) {
      contextMenu.style.display = "none";
    }
  });

  // Prevent default context menu on right-click
  document.addEventListener("contextmenu", (e) => {
    // Only prevent default if we're showing our custom menu
    if (contextMenu.style.display === "block") {
      e.preventDefault();
    }
  });

  // Post Edit Modal Listeners
  const postEditModal = document.getElementById("postEditModal");
  const closePostEditModal = document.getElementById("closePostEditModal");
  const savePostEditBtn = document.getElementById("savePostEditBtn");
  const cancelPostEditBtn = document.getElementById("cancelPostEditBtn");

  closePostEditModal.addEventListener("click", () => {
    postEditModal.style.display = "none";
    document.body.classList.remove("modal-open"); // Re-enable body scroll
  });

  cancelPostEditBtn.addEventListener("click", () => {
    postEditModal.style.display = "none";
    document.body.classList.remove("modal-open"); // Re-enable body scroll
  });

  window.addEventListener("click", (event) => {
    if (event.target === postEditModal) {
      postEditModal.style.display = "none";
      document.body.classList.remove("modal-open"); // Re-enable body scroll
    }
  });
});

// Debounce function to limit how often a function is called
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

// Listen for real-time updates to posts
function listenForPosts() {
  if (unsubscribePostsListener) {
    unsubscribePostsListener(); // Unsubscribe from previous listener
  }
  if (!db) {
    console.error("Firestore DB not initialized. Cannot listen for posts.");
    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = `<p class="error-message">${forumTranslations[currentLanguage].firebaseInitError}</p>`;
    postsContainer.classList.add("empty");
    return;
  }

  const postsContainer = document.getElementById("postsContainer");
  const q = query(
    collection(db, `artifacts/${appId}/public/data/posts`),
    orderBy("timestamp", "desc")
  );

  unsubscribePostsListener = onSnapshot(
    q,
    async (snapshot) => {
      postsContainer.innerHTML = ""; // Clear existing posts
      postsContainer.classList.remove("empty"); // Remove empty class initially

      if (snapshot.empty) {
        postsContainer.innerHTML = `<p class="no-posts-message">${forumTranslations[currentLanguage].noPosts}</p>`;
        postsContainer.classList.add("empty"); // Add empty class if no posts
        return;
      }

      snapshot.forEach((doc) => {
        const post = doc.data();
        const postId = doc.id;
        const postElement = document.createElement("div");
        postElement.className = "forum-post-card";
        postElement.innerHTML = `
        <div class="post-header">
          <img src="${
            post.authorPhoto ||
            `https://placehold.co/40x40/333333/FFFFFF?text=${(
              post.authorName || "U"
            )
              .charAt(0)
              .toUpperCase()}`
          }" alt="${
          forumTranslations[currentLanguage].userAvatarAlt
        }" class="post-author-avatar" data-user-id="${
          post.userId
        }" data-user-name="${post.authorName}" data-user-photo="${
          post.authorPhoto
        }" onerror="this.onerror=null;this.src='https://placehold.co/40x40/333333/FFFFFF?text=U';" />
          <div class="post-info">
            <span class="post-author-name">${post.authorName}</span>
            <span class="post-timestamp">${
              post.timestamp
                ? new Date(post.timestamp.toDate()).toLocaleString()
                : "Đang tải..."
            }</span>
            ${
              currentUser && currentUser.uid === post.userId
                ? `<button class="btn post-options-btn" data-post-id="${postId}" data-type="post" data-content="${encodeURIComponent(
                    post.content
                  )}" data-image-url="${encodeURIComponent(
                    post.imageUrl || ""
                  )}">
                     <i class="fas fa-ellipsis-h"></i>
                   </button>`
                : ""
            }
          </div>
        </div>
        <div class="post-content">
          <p>${post.content}</p>
          ${
            post.imageUrl
              ? `<img src="${post.imageUrl}" alt="${forumTranslations[currentLanguage].postImageAlt}" class="post-image" onerror="this.onerror=null;this.src='https://placehold.co/400x300/CCCCCC/000000?text=${forumTranslations[currentLanguage].imageLoadError}';" />`
              : ""
          }
        </div>
        <div class="post-actions">
          <button class="toggle-comments-btn" data-post-id="${postId}">
            <i class="fas fa-comment"></i> ${
              forumTranslations[currentLanguage].comments
            }
          </button>
        </div>
        <div class="comments-section" id="comments-${postId}" style="display:none;">
          <div class="comments-list" id="commentsList-${postId}"></div>
          <div class="comment-input-area">
            <textarea class="comment-content" placeholder="${
              forumTranslations[currentLanguage].commentPlaceholder
            }" rows="2"></textarea>
            <button class="btn comment-btn" data-post-id="${postId}">${
          forumTranslations[currentLanguage].commentBtn
        }</button>
          </div>
        </div>
      `;
        postsContainer.appendChild(postElement);

        // Add event listener for post options button (for edit/delete)
        const postOptionsBtn = postElement.querySelector(".post-options-btn");
        if (postOptionsBtn) {
          postOptionsBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent click from bubbling up and closing menu
            const content = decodeURIComponent(e.currentTarget.dataset.content);
            const imageUrl = decodeURIComponent(
              e.currentTarget.dataset.imageUrl
            );
            showContextMenu(e, postId, "post", null, content, imageUrl);
          });
        }

        // Add event listener for avatar to show user interaction popup
        const postAuthorAvatar = postElement.querySelector(
          ".post-author-avatar"
        );
        if (postAuthorAvatar) {
          postAuthorAvatar.addEventListener("click", (e) => {
            const targetUserId = e.currentTarget.dataset.userId;
            const targetUserName = e.currentTarget.dataset.userName;
            const targetPhotoURL = e.currentTarget.dataset.userPhoto;
            showUserInteractionPopup(
              targetUserId,
              targetUserName,
              targetPhotoURL
            );
          });
        }

        // Add event listener for toggle comments button
        const toggleCommentsBtn = postElement.querySelector(
          ".toggle-comments-btn"
        );
        if (toggleCommentsBtn) {
          toggleCommentsBtn.addEventListener("click", () => {
            const commentsSection = document.getElementById(
              `comments-${postId}`
            );
            if (commentsSection.style.display === "none") {
              commentsSection.style.display = "block";
              listenForComments(postId); // Load comments when shown
            } else {
              commentsSection.style.display = "none";
              // Optionally unsubscribe from comments listener here if needed
            }
          });
        }

        // Add event listener for comment button
        const commentBtn = postElement.querySelector(".comment-btn");
        if (commentBtn) {
          commentBtn.addEventListener("click", async (e) => {
            if (!currentUser) {
              showForumMessage(
                forumTranslations[currentLanguage].loginToPost,
                true
              );
              return;
            }
            if (!db) {
              showForumMessage(
                forumTranslations[currentLanguage].firebaseInitError,
                true
              );
              return;
            }
            const commentContentInput = e.currentTarget.previousElementSibling;
            const commentContent = commentContentInput.value.trim();
            const postIdToComment = e.currentTarget.dataset.postId;

            if (commentContent) {
              try {
                const commentsCollection = collection(
                  db,
                  `artifacts/${appId}/public/data/posts/${postIdToComment}/comments`
                );
                await addDoc(commentsCollection, {
                  userId: currentUser.uid,
                  authorName:
                    currentUser.displayName || currentUser.email || "Ẩn danh",
                  authorPhoto: currentUser.photoURL || "",
                  content: commentContent,
                  timestamp: serverTimestamp(),
                });
                commentContentInput.value = "";
                showForumMessage(
                  forumTranslations[currentLanguage].commentSuccess,
                  false
                );
              } catch (error) {
                console.error("Error adding comment: ", error);
                showForumMessage(
                  forumTranslations[currentLanguage].commentError +
                    error.message,
                  true
                );
              }
            }
          });
        }
      });
    },
    (error) => {
      console.error("Error listening for posts:", error);
      postsContainer.innerHTML = `<p class="error-message">${forumTranslations[currentLanguage].postError} ${error.message}</p>`;
      postsContainer.classList.add("empty");
    }
  );
}

// Function to delete a post
async function deletePost(postId) {
  if (!currentUser) {
    showForumMessage(forumTranslations[currentLanguage].loginToPost, true);
    return;
  }
  if (!db) {
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
    return;
  }

  try {
    // Delete comments subcollection first (Firestore limitation: no cascading delete)
    const commentsRef = collection(
      db,
      `artifacts/${appId}/public/data/posts/${postId}/comments`
    );
    const commentsSnapshot = await getDocs(commentsRef);
    const deleteCommentPromises = [];
    commentsSnapshot.forEach((commentDoc) => {
      deleteCommentPromises.push(
        deleteDoc(
          doc(
            db,
            `artifacts/${appId}/public/data/posts/${postId}/comments`,
            commentDoc.id
          )
        )
      );
    });
    await Promise.all(deleteCommentPromises);

    // Then delete the post document
    const postRef = doc(db, `artifacts/${appId}/public/data/posts`, postId);
    await deleteDoc(postRef);
    showForumMessage(forumTranslations[currentLanguage].postDeleted, false);
  } catch (error) {
    console.error("Error deleting post:", error);
    showForumMessage(
      forumTranslations[currentLanguage].postError + error.message,
      true
    );
  }
}

// Function to edit a post
async function editPost(postId, currentContent, currentImageUrl) {
  if (!currentUser) {
    showForumMessage(forumTranslations[currentLanguage].loginToPost, true);
    return;
  }
  if (!db) {
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
    return;
  }

  const postEditModal = document.getElementById("postEditModal");
  const editPostContent = document.getElementById("editPostContent");
  const editPostImageUrl = document.getElementById("editPostImageUrl");
  const savePostEditBtn = document.getElementById("savePostEditBtn");
  const editPostTitle = document.getElementById("editPostTitle"); // Get the title element

  editPostTitle.textContent = forumTranslations[currentLanguage].editPostTitle; // Set correct title
  editPostContent.value = currentContent;
  editPostImageUrl.value = currentImageUrl;
  editPostImageUrl.style.display = "block"; // Ensure image URL is visible for posts
  postEditModal.style.display = "block";
  document.body.classList.add("modal-open"); // Disable body scroll

  // Remove previous event listener to prevent multiple calls
  const newSavePostEditBtn = savePostEditBtn.cloneNode(true);
  savePostEditBtn.parentNode.replaceChild(newSavePostEditBtn, savePostEditBtn);

  newSavePostEditBtn.addEventListener("click", async () => {
    const newContent = editPostContent.value.trim();
    const newImageUrl = editPostImageUrl.value.trim();

    if (!newContent) {
      showForumMessage(
        forumTranslations[currentLanguage].postContentEmpty,
        true
      );
      return;
    }

    try {
      const postRef = doc(db, `artifacts/${appId}/public/data/posts`, postId);
      await updateDoc(postRef, {
        content: newContent,
        imageUrl: newImageUrl,
        editedAt: serverTimestamp(),
      });
      showForumMessage("Bài đăng đã được cập nhật thành công!", false);
      postEditModal.style.display = "none";
      document.body.classList.remove("modal-open"); // Re-enable body scroll
    } catch (error) {
      console.error("Error updating post:", error);
      showForumMessage("Lỗi khi cập nhật bài đăng: " + error.message, true);
    }
  });
}

// Function to listen for comments on a specific post
function listenForComments(postId) {
  const commentsListContainer = document.getElementById(
    `commentsList-${postId}`
  );
  if (!commentsListContainer) return; // Exit if container not found
  if (!db) {
    console.error("Firestore DB not initialized. Cannot listen for comments.");
    commentsListContainer.innerHTML = `<p class="error-message">${forumTranslations[currentLanguage].firebaseInitError}</p>`;
    return;
  }

  const commentsRef = collection(
    db,
    `artifacts/${appId}/public/data/posts/${postId}/comments`
  );
  const q = query(commentsRef, orderBy("timestamp", "asc"));

  onSnapshot(
    q,
    (snapshot) => {
      commentsListContainer.innerHTML = ""; // Clear existing comments
      if (snapshot.empty) {
        commentsListContainer.innerHTML = `<p class="no-comments-message">${forumTranslations[currentLanguage].noComments}</p>`;
        return;
      }

      snapshot.forEach((doc) => {
        const comment = doc.data();
        const commentId = doc.id;
        const commentElement = document.createElement("div");
        commentElement.className = "comment-item";
        commentElement.innerHTML = `
        <img src="${
          comment.authorPhoto ||
          `https://placehold.co/30x30/333333/FFFFFF?text=${(
            comment.authorName || "U"
          )
            .charAt(0)
            .toUpperCase()}`
        }" alt="${
          forumTranslations[currentLanguage].commentUserAvatarAlt
        }" class="comment-author-avatar" data-user-id="${
          comment.userId
        }" data-user-name="${comment.authorName}" data-user-photo="${
          comment.authorPhoto
        }" onerror="this.onerror=null;this.src='https://placehold.co/30x30/333333/FFFFFF?text=U';" />
        <div class="comment-content-wrapper">
          <span class="comment-author-name">${comment.authorName}</span>
          <p class="comment-text">${comment.content}</p>
          <span class="comment-timestamp">${
            comment.timestamp
              ? new Date(comment.timestamp.toDate()).toLocaleString()
              : "Đang tải..."
          }</span>
          ${
            currentUser && currentUser.uid === comment.userId
              ? `<button class="btn comment-options-btn" data-post-id="${postId}" data-comment-id="${commentId}" data-type="comment" data-content="${encodeURIComponent(
                  comment.content
                )}">
                   <i class="fas fa-ellipsis-h"></i>
                 </button>`
              : ""
          }
        </div>
      `;
        commentsListContainer.appendChild(commentElement);

        // Add event listener to comment options button (for edit/delete)
        const commentOptionsBtn = commentElement.querySelector(
          ".comment-options-btn"
        );
        if (commentOptionsBtn) {
          commentOptionsBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent click from bubbling up and closing menu
            const content = decodeURIComponent(e.currentTarget.dataset.content);
            showContextMenu(e, postId, "comment", commentId, content);
          });
        }

        // Add event listener to comment author avatar
        const commentAuthorAvatar = commentElement.querySelector(
          ".comment-author-avatar"
        );
        if (commentAuthorAvatar) {
          commentAuthorAvatar.addEventListener("click", (e) => {
            const targetUserId = e.currentTarget.dataset.userId;
            const targetUserName = e.currentTarget.dataset.userName;
            const targetPhotoURL = e.currentTarget.dataset.userPhoto;
            showUserInteractionPopup(
              targetUserId,
              targetUserName,
              targetPhotoURL
            );
          });
        }
      });
    },
    (error) => {
      console.error("Error listening for comments:", error);
      commentsListContainer.innerHTML = `<p class="error-message">Lỗi tải bình luận: ${error.message}</p>`;
    }
  );
}

// Function to delete a comment
async function deleteComment(postId, commentId) {
  if (!currentUser) {
    showForumMessage(forumTranslations[currentLanguage].loginToPost, true);
    return;
  }
  if (!db) {
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
    return;
  }

  try {
    const commentRef = doc(
      db,
      `artifacts/${appId}/public/data/posts/${postId}/comments`,
      commentId
    );
    await deleteDoc(commentRef);
    showForumMessage("Bình luận đã được xóa!", false);
  } catch (error) {
    console.error("Error deleting comment:", error);
    showForumMessage("Lỗi khi xóa bình luận: " + error.message, true);
  }
}

// Function to edit a comment
async function editComment(postId, commentId, currentContent) {
  if (!currentUser) {
    showForumMessage(forumTranslations[currentLanguage].loginToPost, true);
    return;
  }
  if (!db) {
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
    return;
  }

  const postEditModal = document.getElementById("postEditModal");
  const editPostTitle = document.getElementById("editPostTitle");
  const editPostContent = document.getElementById("editPostContent");
  const editPostImageUrl = document.getElementById("editPostImageUrl"); // This will be hidden for comments
  const savePostEditBtn = document.getElementById("savePostEditBtn");

  editPostTitle.textContent =
    forumTranslations[currentLanguage].editCommentTitle;
  editPostContent.value = currentContent;
  editPostImageUrl.style.display = "none"; // Hide image URL input for comments
  postEditModal.style.display = "block";
  document.body.classList.add("modal-open"); // Disable body scroll

  // Remove previous event listener to prevent multiple calls
  const newSavePostEditBtn = savePostEditBtn.cloneNode(true);
  savePostEditBtn.parentNode.replaceChild(newSavePostEditBtn, savePostEditBtn);

  newSavePostEditBtn.addEventListener("click", async () => {
    const newContent = editPostContent.value.trim();

    if (!newContent) {
      showForumMessage(
        forumTranslations[currentLanguage].postContentEmpty, // Reusing for comment content empty
        true
      );
      return;
    }

    try {
      const commentRef = doc(
        db,
        `artifacts/${appId}/public/data/posts/${postId}/comments`,
        commentId
      );
      await updateDoc(commentRef, {
        content: newContent,
        editedAt: serverTimestamp(),
      });
      showForumMessage("Bình luận đã được cập nhật thành công!", false);
      postEditModal.style.display = "none";
      document.body.classList.remove("modal-open"); // Re-enable body scroll
      // Reset title and image URL visibility for next use
      editPostTitle.textContent =
        forumTranslations[currentLanguage].editPostTitle;
      editPostImageUrl.style.display = "block";
    } catch (error) {
      console.error("Error updating comment:", error);
      showForumMessage("Lỗi khi cập nhật bình luận: " + error.message, true);
    }
  });
}

// Function to show context menu (edit/delete/recall)
function showContextMenu(
  event,
  targetId, // postId or chatId
  type, // 'post', 'comment', 'chat'
  subId = null, // commentId or messageId
  currentContent = null,
  currentImageUrl = null
) {
  const contextMenu = document.getElementById("contextMenu");
  const editOption = document.getElementById("editOption");
  const recallOption = document.getElementById("recallOption");
  const deleteOption = document.getElementById("deleteOption");

  // Position the context menu
  contextMenu.style.left = `${event.pageX}px`;
  contextMenu.style.top = `${event.pageY}px`;
  contextMenu.style.display = "block";

  // Hide/Show options based on type
  recallOption.style.display = "none"; // Hide recall by default
  deleteOption.textContent = forumTranslations[currentLanguage].deletePost; // Default text

  // Clear previous listeners
  const newEditOption = editOption.cloneNode(true);
  editOption.parentNode.replaceChild(newEditOption, editOption);

  const newRecallOption = recallOption.cloneNode(true);
  recallOption.parentNode.replaceChild(newRecallOption, recallOption);

  const newDeleteOption = deleteOption.cloneNode(true);
  deleteOption.parentNode.replaceChild(newDeleteOption, deleteOption);

  if (type === "post") {
    newEditOption.onclick = () => {
      contextMenu.style.display = "none";
      editPost(targetId, currentContent, currentImageUrl);
    };
    newDeleteOption.onclick = () => {
      contextMenu.style.display = "none";
      showConfirmationModal(
        forumTranslations[currentLanguage].confirmDeletePost,
        () => deletePost(targetId)
      );
    };
  } else if (type === "comment") {
    newEditOption.onclick = () => {
      contextMenu.style.display = "none";
      editComment(targetId, subId, currentContent);
    };
    newDeleteOption.onclick = () => {
      contextMenu.style.display = "none";
      showConfirmationModal(
        forumTranslations[currentLanguage].editCommentConfirm, // Use specific translation for comment deletion
        () => deleteComment(targetId, subId)
      );
    };
  } else if (type === "chat") {
    recallOption.style.display = "block"; // Show recall option for chat messages
    deleteOption.textContent = "Xóa"; // Simpler "Delete" for chat, as recall is primary

    newEditOption.onclick = () => {
      contextMenu.style.display = "none";
      editChatMessage(targetId, subId, currentContent);
    };
    newRecallOption.onclick = () => {
      contextMenu.style.display = "none";
      showConfirmationModal(
        forumTranslations[currentLanguage].confirmRecallMessage,
        () => recallChatMessage(targetId, subId)
      );
    };
    // For now, deleteOption for chat will also perform a recall/full delete.
    // A true "delete only for me" requires a more complex data model.
    newDeleteOption.onclick = () => {
      contextMenu.style.display = "none";
      showConfirmationModal(
        forumTranslations[currentLanguage].confirmRecallMessage, // Reusing for now
        () => recallChatMessage(targetId, subId)
      );
    };
  }
}

// Function to handle opening chat from various places
async function startConversation(recipientId, recipientName, recipientPhoto) {
  if (!currentUser) {
    showForumMessage(forumTranslations[currentLanguage].loginToPost, true);
    return;
  }
  if (currentUser.uid === recipientId) {
    showForumMessage(forumTranslations[currentLanguage].chatWithSelf, true);
    return;
  }
  if (!db) {
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
    return;
  }

  // Set the current chat recipient ID
  currentChatRecipientId = recipientId; // IMPORTANT: Set this before calling listenForChatMessages

  const chatHeaderAvatar = document.getElementById("chatHeaderAvatar");
  const currentChatRecipientNameElement = document.getElementById(
    "currentChatRecipientName"
  );
  const chatMainContent = document.getElementById("chatMainContent");
  const chatHeader = document.getElementById("chatHeader");
  const chatMessagesContainer = document.getElementById("chatMessages");
  const chatInputArea = document.getElementById("chatInputArea");
  const noChatSelectedMessage = document.getElementById(
    "noChatSelectedMessage"
  );

  // Update chat header
  chatHeaderAvatar.src =
    recipientPhoto ||
    `https://placehold.co/40x40/333333/FFFFFF?text=${(recipientName || "U")
      .charAt(0)
      .toUpperCase()}`;
  currentChatRecipientNameElement.textContent = `${forumTranslations[currentLanguage].chatWith} ${recipientName}`;

  // Show chat elements and hide "no chat selected" message
  noChatSelectedMessage.style.display = "none";
  chatHeader.style.display = "flex";
  chatMessagesContainer.style.display = "flex";
  chatInputArea.style.display = "flex";

  // If on mobile, hide the conversations sidebar to show chat full screen
  if (window.innerWidth <= 768) {
    document.querySelector(".conversations-sidebar").style.display = "none";
    chatMainContent.classList.remove("hidden-on-mobile");
    document
      .querySelector(".messages-section")
      .classList.remove("sidebar-visible"); // Ensure sidebar is hidden
  } else {
    chatMainContent.classList.remove("hidden-on-mobile");
    document.querySelector(".conversations-sidebar").style.display = "flex"; // Ensure sidebar is visible on desktop
    document
      .querySelector(".messages-section")
      .classList.remove("sidebar-visible");
  }

  // Only switch tab if not already on the messages tab
  const messagesTabContent = document.getElementById("messagesTabContent");
  const isMessagesTabActive = messagesTabContent.classList.contains("active");

  if (!isMessagesTabActive) {
    switchTab("messages");
  } else {
    // If already on messages tab, ensure conversations are re-rendered/highlighted
    document.querySelectorAll(".message-list-item").forEach((item) => {
      item.classList.remove("active");
      if (item.dataset.chatPartnerId === recipientId) {
        item.classList.add("active");
      }
    });
  }

  // Always listen for chat messages for the new or re-selected recipient
  listenForChatMessages(recipientId);
  // Scroll to bottom after messages are loaded and rendered
  setTimeout(() => scrollToBottom("chatMessages"), 100);
}

// Function to get or create a chat ID between two users
async function getOrCreateChatId(user1Id, user2Id) {
  if (!db) {
    console.error(
      "Firestore DB not initialized. Cannot get or create chat ID."
    );
    return null;
  }
  const chatIds = [user1Id, user2Id].sort().join("_"); // Consistent ID regardless of order
  const chatRef = doc(db, `artifacts/${appId}/public/data/chats`, chatIds);

  try {
    const chatDoc = await getDoc(chatRef);
    if (!chatDoc.exists()) {
      await setDoc(chatRef, {
        participants: [user1Id, user2Id],
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        lastMessage: "",
      });
    }
    return chatIds;
  } catch (error) {
    console.error("Error getting or creating chat ID:", error);
    showForumMessage("Lỗi tạo cuộc trò chuyện: " + error.message, true);
    return null;
  }
}

// Function to send a chat message
async function sendMessage(recipientId, messageText) {
  if (!currentUser) {
    showForumMessage(forumTranslations[currentLanguage].loginToPost, true);
    return;
  }
  if (!db) {
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
    return;
  }

  try {
    const chatId = await getOrCreateChatId(currentUser.uid, recipientId);
    if (!chatId) return;

    const messagesCollection = collection(
      db,
      `artifacts/${appId}/public/data/chats/${chatId}/messages`
    );
    await addDoc(messagesCollection, {
      senderId: currentUser.uid,
      senderName: currentUser.displayName || currentUser.email || "Ẩn danh",
      senderPhoto: currentUser.photoURL || "",
      message: messageText,
      timestamp: serverTimestamp(),
      type: "text", // Can be 'text', 'image', 'file'
      edited: false, // New field for edited status
      recalled: false, // New field for recalled status
    });

    // Update the last message in the chat document for conversations list
    const chatRef = doc(db, `artifacts/${appId}/public/data/chats`, chatId);
    await updateDoc(chatRef, {
      lastMessageAt: serverTimestamp(),
      lastMessage: messageText,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    showForumMessage(
      forumTranslations[currentLanguage].messageSendError + error.message,
      true
    );
  }
}

// Function to listen for chat messages (called when opening chat with someone)
function listenForChatMessages(recipientId) {
  // Line 766: Unsubscribe from previous chat listener to prevent duplicates
  if (unsubscribeChatListener) {
    unsubscribeChatListener();
  }
  if (!currentUser) {
    console.warn("User not logged in, cannot listen for chat messages.");
    return;
  }
  if (!db) {
    console.error(
      "Firestore DB not initialized. Cannot listen for chat messages."
    );
    return;
  }

  // Get or create chatId
  getOrCreateChatId(currentUser.uid, recipientId)
    .then((chatId) => {
      if (!chatId) return;

      const messagesRef = collection(
        db,
        `artifacts/${appId}/public/data/chats/${chatId}/messages`
      );
      // Line 781: Fetch messages without orderBy in query, sort in memory
      const q = query(messagesRef);

      unsubscribeChatListener = onSnapshot(
        q,
        (snapshot) => {
          const messages = [];
          snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
          });
          // Sort messages by timestamp in memory
          messages.sort((a, b) => {
            const timeA = a.timestamp ? a.timestamp.toMillis() : 0;
            const timeB = b.timestamp ? b.timestamp.toMillis() : 0;
            return timeA - timeB;
          });
          renderChatMessages(messages, chatId); // Pass chatId to render function
          // Add a small delay to ensure rendering is complete before scrolling
          setTimeout(() => scrollToBottom("chatMessages"), 50);
        },
        (error) => {
          console.error("Error listening for chat messages:", error);
          showForumMessage("Lỗi tải tin nhắn: " + error.message, true);
        }
      );
    })
    .catch((error) => {
      console.error("Error getting chat ID for listener:", error);
      showForumMessage("Lỗi khởi tạo trò chuyện: " + error.message, true);
    });
}

// Function to render chat messages
function renderChatMessages(messages, chatId) {
  const chatMessagesContainer = document.getElementById("chatMessages");
  // Clear existing messages to prevent duplication
  chatMessagesContainer.innerHTML = "";

  if (messages.length === 0) {
    chatMessagesContainer.innerHTML = `<p class="no-messages-message">${forumTranslations[currentLanguage].noMessages}</p>`;
    return;
  }

  messages.forEach((msg) => {
    const messageElement = document.createElement("div");
    // Apply 'my-message' or 'other-message' class for alignment
    messageElement.className = `chat-message ${
      msg.senderId === currentUser.uid ? "my-message" : "other-message"
    }`;

    let messageContent = "";
    let messageBubbleClasses = "message-bubble";

    if (msg.recalled) {
      messageContent = `<p class="message-text">${forumTranslations[currentLanguage].messageRecalledText}</p>`;
      messageBubbleClasses += " recalled";
    } else if (msg.type === "text") {
      messageContent = `<p class="message-text">${msg.message}</p>`;
      if (msg.edited) {
        messageBubbleClasses += " edited";
        messageContent += `<span class="message-timestamp">(Đã chỉnh sửa)</span>`; // Add edited indicator
      }
    } else if (msg.type === "image" && msg.fileUrl) {
      messageContent = `<img src="${msg.fileUrl}" alt="Attached Image" class="chat-image" onclick="window.open('${msg.fileUrl}', '_blank');" style="max-width: 100%; height: auto; border-radius: 8px; cursor: pointer;" />`;
    } else if (msg.type === "file" && msg.fileUrl && msg.fileName) {
      messageContent = `
        <i class="fas fa-file-alt"></i>
        <a href="${msg.fileUrl}" target="_blank" download="${msg.fileName}" class="chat-file-link">${msg.fileName}</a>
        <button onclick="downloadChatFile('${msg.fileUrl}', '${msg.fileName}')" class="btn download-btn"><i class="fas fa-download"></i></button>
      `;
    }

    // New Zalo-like styling for message bubble and avatar
    messageElement.innerHTML = `
      ${
        // Only show avatar for 'other-message'
        msg.senderId !== currentUser.uid
          ? `<img src="${
              msg.senderPhoto ||
              `https://placehold.co/40x40/333333/FFFFFF?text=${(
                msg.senderName || "U"
              )
                .charAt(0)
                .toUpperCase()}`
            }" alt="Avatar" class="chat-avatar" onerror="this.onerror=null;this.src='https://placehold.co/40x40/333333/FFFFFF?text=U';"/>`
          : ""
      }
      <div class="${messageBubbleClasses}">
        ${
          // Only show sender name for 'other-message'
          msg.senderId !== currentUser.uid
            ? `<span class="sender-name">${msg.senderName}</span>`
            : ""
        }
        ${messageContent}
        ${
          !msg.edited && !msg.recalled
            ? `<span class="message-timestamp">${
                msg.timestamp
                  ? new Date(msg.timestamp.toDate()).toLocaleString()
                  : ""
              }</span>`
            : ""
        }
      </div>
      ${
        currentUser && currentUser.uid === msg.senderId && !msg.recalled
          ? `<button class="btn message-options-btn" data-chat-id="${chatId}" data-message-id="${
              msg.id
            }" data-content="${encodeURIComponent(msg.message)}">
               <i class="fas fa-ellipsis-h"></i>
             </button>`
          : ""
      }
    `;
    chatMessagesContainer.appendChild(messageElement);

    // Add event listener for message options button
    const messageOptionsBtn = messageElement.querySelector(
      ".message-options-btn"
    );
    if (messageOptionsBtn) {
      messageOptionsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const msgChatId = e.currentTarget.dataset.chatId;
        const msgId = e.currentTarget.dataset.messageId;
        const msgContent = decodeURIComponent(e.currentTarget.dataset.content);
        showChatContextMenu(e, msgChatId, msgId, msgContent);
      });
    }
  });
}

// Function to edit a chat message
async function editChatMessage(chatId, messageId, currentContent) {
  if (!currentUser) {
    showForumMessage(forumTranslations[currentLanguage].loginToPost, true);
    return;
  }
  if (!db) {
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
    return;
  }

  const postEditModal = document.getElementById("postEditModal");
  const editPostTitle = document.getElementById("editPostTitle");
  const editPostContent = document.getElementById("editPostContent");
  const editPostImageUrl = document.getElementById("editPostImageUrl"); // This will be hidden for chat messages
  const savePostEditBtn = document.getElementById("savePostEditBtn");

  editPostTitle.textContent =
    forumTranslations[currentLanguage].editCommentTitle; // Reusing for chat message edit
  editPostContent.value = currentContent;
  editPostImageUrl.style.display = "none"; // Hide image URL input for chat messages
  postEditModal.style.display = "block";
  document.body.classList.add("modal-open"); // Disable body scroll

  // Remove previous event listener to prevent multiple calls
  const newSavePostEditBtn = savePostEditBtn.cloneNode(true);
  savePostEditBtn.parentNode.replaceChild(newSavePostEditBtn, savePostEditBtn);

  newSavePostEditBtn.addEventListener("click", async () => {
    const newContent = editPostContent.value.trim();

    if (!newContent) {
      showForumMessage(
        forumTranslations[currentLanguage].postContentEmpty, // Reusing for message content empty
        true
      );
      return;
    }

    try {
      const messageRef = doc(
        db,
        `artifacts/${appId}/public/data/chats/${chatId}/messages`,
        messageId
      );
      await updateDoc(messageRef, {
        message: newContent,
        edited: true, // Mark as edited
        timestamp: serverTimestamp(), // Update timestamp to reflect edit
      });
      showForumMessage(forumTranslations[currentLanguage].messageEdited, false);
      postEditModal.style.display = "none";
      document.body.classList.remove("modal-open"); // Re-enable body scroll
      // Reset title and image URL visibility for next use
      editPostTitle.textContent =
        forumTranslations[currentLanguage].editPostTitle;
      editPostImageUrl.style.display = "block";
    } catch (error) {
      console.error("Error updating chat message:", error);
      showForumMessage("Lỗi khi cập nhật tin nhắn: " + error.message, true);
    }
  });
}

// Function to recall a chat message (deletes for both sender and recipient)
async function recallChatMessage(chatId, messageId) {
  if (!currentUser) {
    showForumMessage(forumTranslations[currentLanguage].loginToPost, true);
    return;
  }
  if (!db) {
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
    return;
  }

  try {
    const messageRef = doc(
      db,
      `artifacts/${appId}/public/data/chats/${chatId}/messages`,
      messageId
    );
    // Instead of deleting, mark as recalled and change content
    await updateDoc(messageRef, {
      message: forumTranslations[currentLanguage].messageRecalledText,
      recalled: true,
      edited: false, // Reset edited status if recalled
      timestamp: serverTimestamp(),
    });
    showForumMessage(forumTranslations[currentLanguage].messageRecalled, false);
  } catch (error) {
    console.error("Error recalling message:", error);
    showForumMessage("Lỗi khi thu hồi tin nhắn: " + error.message, true);
  }
}

// Function to show context menu for chat messages
function showChatContextMenu(event, chatId, messageId, messageContent) {
  const contextMenu = document.getElementById("contextMenu");
  const editOption = document.getElementById("editOption");
  const recallOption = document.getElementById("recallOption");
  const deleteOption = document.getElementById("deleteOption");

  // Position the context menu
  contextMenu.style.left = `${event.pageX}px`;
  contextMenu.style.top = `${event.pageY}px`;
  contextMenu.style.display = "block";

  // Show/Hide options
  editOption.style.display = "block"; // Edit is always available for own messages
  recallOption.style.display = "block"; // Recall is always available for own messages
  deleteOption.style.display = "none"; // Hide general delete for chat, use recall instead

  // Clear previous listeners
  const newEditOption = editOption.cloneNode(true);
  editOption.parentNode.replaceChild(newEditOption, editOption);

  const newRecallOption = recallOption.cloneNode(true);
  recallOption.parentNode.replaceChild(newRecallOption, recallOption);

  // Attach new listeners
  newEditOption.onclick = () => {
    contextMenu.style.display = "none";
    editChatMessage(chatId, messageId, messageContent);
  };
  newRecallOption.onclick = () => {
    contextMenu.style.display = "none";
    showConfirmationModal(
      forumTranslations[currentLanguage].confirmRecallMessage,
      () => recallChatMessage(chatId, messageId)
    );
  };
}

// Function to scroll chat to bottom
function scrollToBottom(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
}

// Function to listen for real-time updates to current user's friends list
function listenForFriends() {
  if (unsubscribeFriendsListener) {
    unsubscribeFriendsListener(); // Unsubscribe from previous listener
  }
  if (!currentUser) {
    console.warn("User not logged in, cannot listen for friends.");
    const friendsList = document.getElementById("friendsList");
    friendsList.innerHTML = `<p class="no-friends-message">${forumTranslations[currentLanguage].loginToPost}</p>`;
    friendsList.classList.add("empty");
    return;
  }
  if (!db) {
    console.error("Firestore DB not initialized. Cannot listen for friends.");
    const friendsList = document.getElementById("friendsList");
    friendsList.innerHTML = `<p class="error-message">${forumTranslations[currentLanguage].firebaseInitError}</p>`;
    friendsList.classList.add("empty");
    return;
  }

  const friendsList = document.getElementById("friendsList");
  friendsList.classList.remove("empty"); // Remove empty class initially

  const friendsRef = collection(
    db,
    `artifacts/${appId}/public/data/users/${currentUser.uid}/friends`
  );
  const q = query(friendsRef, orderBy("addedAt", "desc"));

  unsubscribeFriendsListener = onSnapshot(
    q,
    async (snapshot) => {
      friendsList.innerHTML = ""; // Clear existing friends

      if (snapshot.empty) {
        friendsList.innerHTML = `<p class="no-friends-message">${forumTranslations[currentLanguage].noFriends}</p>`;
        friendsList.classList.add("empty");
        return;
      }

      const friendUids = snapshot.docs.map((doc) => doc.id);
      const friendProfiles = await Promise.all(
        friendUids.map(async (uid) => {
          const userDoc = await getDoc(
            doc(db, `artifacts/${appId}/public/data/users`, uid)
          );
          return userDoc.exists() ? userDoc.data() : null;
        })
      );

      friendProfiles.forEach((friend) => {
        if (friend) {
          const friendItem = document.createElement("li");
          friendItem.className = "friend-item";
          friendItem.innerHTML = `
            <img src="${
              friend.photoURL ||
              `https://placehold.co/40x40/333333/FFFFFF?text=${friend.displayName
                .charAt(0)
                .toUpperCase()}`
            }" alt="Friend Avatar" class="user-avatar" data-user-id="${
            friend.uid
          }" data-user-name="${friend.displayName}" data-user-photo="${
            friend.photoURL
          }" onerror="this.onerror=null;this.src='https://placehold.co/40x40/333333/FFFFFF?text=U';" />
            <span>${friend.displayName}</span>
            <button class="btn chat-btn" data-recipient-id="${
              friend.uid
            }" data-recipient-name="${
            friend.displayName
          }" data-recipient-photo="${friend.photoURL}">
              <i class="fas fa-comment-dots"></i> ${
                forumTranslations[currentLanguage].chat
              }
            </button>
            <button class="btn remove-friend-btn" data-friend-id="${
              friend.uid
            }">
              <i class="fas fa-user-minus"></i> ${
                forumTranslations[currentLanguage].removeFriend
              }
            </button>
          `;
          friendsList.appendChild(friendItem);

          // Add event listeners for buttons
          friendItem
            .querySelector(".chat-btn")
            .addEventListener("click", (e) => {
              const recipientId = e.currentTarget.dataset.recipientId;
              const recipientName = e.currentTarget.dataset.recipientName;
              const recipientPhoto = e.currentTarget.dataset.recipientPhoto;
              startConversation(recipientId, recipientName, recipientPhoto);
            });
          friendItem
            .querySelector(".remove-friend-btn")
            .addEventListener("click", (e) => {
              const friendId = e.currentTarget.dataset.friendId;
              showConfirmationModal(
                forumTranslations[currentLanguage].confirmRemoveFriend,
                () => removeFriend(friendId)
              );
            });
          // Add event listener for avatar to show user interaction popup
          friendItem
            .querySelector(".user-avatar")
            .addEventListener("click", (e) => {
              const targetUserId = e.currentTarget.dataset.userId;
              const targetUserName = e.currentTarget.dataset.userName;
              const targetPhotoURL = e.currentTarget.dataset.userPhoto;
              showUserInteractionPopup(
                targetUserId,
                targetUserName,
                targetPhotoURL
              );
            });
        }
      });
    },
    (error) => {
      console.error("Error listening for friends:", error);
      const friendsList = document.getElementById("friendsList");
      friendsList.innerHTML = `<p class="error-message">${forumTranslations[currentLanguage].friendRequestError} ${error.message}</p>`;
      friendsList.classList.add("empty");
    }
  );
}

// Function to send a friend request
async function sendFriendRequest(recipientId) {
  if (!currentUser) {
    showForumMessage(forumTranslations[currentLanguage].loginToPost, true);
    return;
  }
  if (currentUser.uid === recipientId) {
    showForumMessage("Bạn không thể gửi yêu cầu kết bạn cho chính mình.", true);
    return;
  }
  if (!db) {
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
    return;
  }

  try {
    const requestRef = doc(
      db,
      `artifacts/${appId}/public/data/friendRequests`,
      `${currentUser.uid}_${recipientId}`
    );
    // Check if a request already exists to prevent duplicates
    const requestDoc = await getDoc(requestRef);
    if (requestDoc.exists()) {
      showForumMessage(forumTranslations[currentLanguage].sentRequest, false); // Already sent
      return;
    }

    await setDoc(requestRef, {
      from: currentUser.uid,
      to: recipientId,
      status: "pending",
      timestamp: serverTimestamp(),
    });
    showForumMessage(
      forumTranslations[currentLanguage].friendRequestSent,
      false
    );
  } catch (error) {
    console.error("Error sending friend request:", error);
    showForumMessage(
      forumTranslations[currentLanguage].friendRequestError + error.message,
      true
    );
  }
}

// Function to listen for real-time updates to friend requests
function listenForFriendRequests() {
  if (unsubscribeFriendRequestsListener) {
    unsubscribeFriendRequestsListener(); // Unsubscribe from previous listener
  }
  if (!currentUser) {
    console.warn("User not logged in, cannot listen for friend requests.");
    const friendRequestsList = document.getElementById("friendRequestsList");
    friendRequestsList.innerHTML = `<p class="no-requests-message">${forumTranslations[currentLanguage].loginToPost}</p>`;
    friendRequestsList.classList.add("empty");
    return;
  }
  if (!db) {
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
    return;
  }

  const friendRequestsList = document.getElementById("friendRequestsList");
  friendRequestsList.classList.remove("empty"); // Remove empty class initially

  const requestsRef = collection(
    db,
    `artifacts/${appId}/public/data/friendRequests`
  );
  const q = query(
    requestsRef,
    where("to", "==", currentUser.uid),
    where("status", "==", "pending"),
    orderBy("timestamp", "desc")
  );

  unsubscribeFriendRequestsListener = onSnapshot(
    q,
    async (snapshot) => {
      friendRequestsList.innerHTML = ""; // Clear existing requests

      if (snapshot.empty) {
        friendRequestsList.innerHTML = `<p class="no-requests-message">${forumTranslations[currentLanguage].noFriendRequests}</p>`;
        friendRequestsList.classList.add("empty");
        return;
      }

      const requestPromises = snapshot.docs.map(async (requestDoc) => {
        const request = requestDoc.data();
        const fromUserDoc = await getDoc(
          doc(db, `artifacts/${appId}/public/data/users`, request.from)
        );
        return fromUserDoc.exists()
          ? { id: requestDoc.id, ...request, fromUser: fromUserDoc.data() }
          : null;
      });

      const requestsWithUserData = (await Promise.all(requestPromises)).filter(
        Boolean
      );

      requestsWithUserData.forEach((request) => {
        const requestItem = document.createElement("li");
        requestItem.className = "friend-item";
        requestItem.innerHTML = `
          <img src="${
            request.fromUser.photoURL ||
            `https://placehold.co/40x40/333333/FFFFFF?text=${request.fromUser.displayName
              .charAt(0)
              .toUpperCase()}`
          }" alt="User Avatar" class="user-avatar" data-user-id="${
          request.fromUser.uid
        }" data-user-name="${request.fromUser.displayName}" data-user-photo="${
          request.fromUser.photoURL
        }" onerror="this.onerror=null;this.src='https://placehold.co/40x40/333333/FFFFFF?text=U';" />
          <span>${request.fromUser.displayName}</span>
          <button class="btn accept-btn" data-request-id="${
            request.id
          }" data-sender-id="${request.fromUser.uid}" data-sender-name="${
          request.fromUser.displayName
        }">
            <i class="fas fa-check"></i> ${
              forumTranslations[currentLanguage].accept
            }
          </button>
          <button class="btn decline-btn" data-request-id="${request.id}">
            <i class="fas fa-times"></i> ${
              forumTranslations[currentLanguage].decline
            }
          </button>
        `;
        friendRequestsList.appendChild(requestItem);

        // Add event listeners for buttons
        requestItem
          .querySelector(".accept-btn")
          .addEventListener("click", (e) => {
            const requestId = e.currentTarget.dataset.requestId;
            const senderId = e.currentTarget.dataset.senderId;
            const senderName = e.currentTarget.dataset.senderName;
            acceptFriendRequest(requestId, senderId, senderName);
          });
        requestItem
          .querySelector(".decline-btn")
          .addEventListener("click", (e) => {
            const requestId = e.currentTarget.dataset.requestId;
            declineFriendRequest(requestId);
          });
        // Add event listener for avatar to show user interaction popup
        requestItem
          .querySelector(".user-avatar")
          .addEventListener("click", (e) => {
            const targetUserId = e.currentTarget.dataset.userId;
            const targetUserName = e.currentTarget.dataset.userName;
            const targetPhotoURL = e.currentTarget.dataset.userPhoto;
            showUserInteractionPopup(
              targetUserId,
              targetUserName,
              targetPhotoURL
            );
          });
      });
    },
    (error) => {
      console.error("Error listening for friend requests:", error);
      const friendRequestsList = document.getElementById("friendRequestsList");
      friendRequestsList.innerHTML = `<p class="error-message">${forumTranslations[currentLanguage].friendRequestError} ${error.message}</p>`;
      friendRequestsList.classList.add("empty");
    }
  );
}

// Function to accept a friend request
async function acceptFriendRequest(requestId, senderId, senderName) {
  if (!currentUser) return;
  if (!db) {
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
    return;
  }
  try {
    // 1. Add sender to current user's friends list
    const currentUserFriendRef = doc(
      db,
      `artifacts/${appId}/public/data/users/${currentUser.uid}/friends`,
      senderId
    );
    await setDoc(currentUserFriendRef, {
      uid: senderId,
      addedAt: serverTimestamp(),
    });

    // 2. Add current user to sender's friends list
    const senderFriendRef = doc(
      db,
      `artifacts/${appId}/public/data/users/${senderId}/friends`,
      currentUser.uid
    );
    await setDoc(senderFriendRef, {
      uid: currentUser.uid,
      addedAt: serverTimestamp(),
    });

    // 3. Delete the friend request
    const requestRef = doc(
      db,
      `artifacts/${appId}/public/data/friendRequests`,
      requestId
    );
    await deleteDoc(requestRef);

    showForumMessage(
      forumTranslations[currentLanguage].friendRequestAccepted,
      false
    );
  } catch (error) {
    console.error("Error accepting friend request:", error);
    showForumMessage(
      forumTranslations[currentLanguage].friendRequestError + error.message,
      true
    );
  }
}

// Function to decline a friend request
async function declineFriendRequest(requestId) {
  if (!db) {
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
    return;
  }
  try {
    const requestRef = doc(
      db,
      `artifacts/${appId}/public/data/friendRequests`,
      requestId
    );
    await deleteDoc(requestRef);
    showForumMessage(
      forumTranslations[currentLanguage].friendRequestDeclined,
      false
    );
  } catch (error) {
    console.error("Error declining friend request:", error);
    showForumMessage(
      forumTranslations[currentLanguage].friendRequestError + error.message,
      true
    );
  }
}

/**
 * Removes a friend from the current user's friends list.
 * @param {string} friendId The UID of the friend to remove.
 */
async function removeFriend(friendId) {
  if (!db) {
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
    return;
  }
  try {
    // Remove friend from current user's friends list
    const currentUserFriendRef = doc(
      db,
      `artifacts/${appId}/public/data/users/${currentUser.uid}/friends`,
      friendId
    );
    await deleteDoc(currentUserFriendRef);

    // Remove current user from friend's friends list
    const friendUserFriendRef = doc(
      db,
      `artifacts/${appId}/public/data/users/${friendId}/friends`,
      currentUser.uid
    );
    await deleteDoc(friendUserFriendRef);

    showForumMessage(forumTranslations[currentLanguage].friendRemoved, false);
  } catch (error) {
    console.error("Error removing friend:", error);
    showForumMessage(
      forumTranslations[currentLanguage].removeFriendError + error.message,
      true
    );
  }
}

// Function to listen for real-time updates to user's conversations list
async function listenForConversations(autoSelectLatest = false) {
  if (unsubscribeConversationsListener) {
    unsubscribeConversationsListener(); // Unsubscribe from previous listener
  }
  if (!currentUser) {
    console.warn("User not logged in, cannot listen for conversations.");
    const conversationsList = document.getElementById("conversationsList");
    conversationsList.innerHTML = `<p class="no-conversations-message">${forumTranslations[currentLanguage].loginToPost}</p>`;
    conversationsList.classList.add("empty");
    return;
  }
  if (!db) {
    console.error(
      "Firestore DB not initialized. Cannot listen for conversations."
    );
    const conversationsList = document.getElementById("conversationsList");
    conversationsList.innerHTML = `<p class="error-message">${forumTranslations[currentLanguage].firebaseInitError}</p>`;
    conversationsList.classList.add("empty");
    return;
  }

  const conversationsList = document.getElementById("conversationsList");
  conversationsList.classList.remove("empty"); // Remove empty class initially

  const chatsRef = collection(db, `artifacts/${appId}/public/data/chats`);
  const q = query(
    chatsRef,
    where("participants", "array-contains", currentUser.uid),
    orderBy("lastMessageAt", "desc")
  );

  unsubscribeConversationsListener = onSnapshot(
    q,
    async (snapshot) => {
      conversationsList.innerHTML = ""; // Clear existing conversations to prevent duplicates

      if (snapshot.empty) {
        conversationsList.innerHTML = `<p class="no-conversations-message">${forumTranslations[currentLanguage].noConversations}</p>`;
        conversationsList.classList.add("empty");
        // Hide chat main content if no conversations
        document.getElementById("chatHeader").style.display = "none";
        document.getElementById("chatMessages").style.display = "none";
        document.getElementById("chatInputArea").style.display = "none";
        document.getElementById("noChatSelectedMessage").style.display =
          "block";
        return;
      }

      let firstConversationPartnerId = null;
      let firstConversationPartnerName = null;
      let firstConversationPartnerPhoto = null;

      for (const chatDoc of snapshot.docs) {
        const chat = chatDoc.data();
        const otherParticipantId = chat.participants.find(
          (uid) => uid !== currentUser.uid
        );

        if (otherParticipantId) {
          const otherUserDoc = await getDoc(
            doc(db, `artifacts/${appId}/public/data/users`, otherParticipantId)
          );
          const otherUser = otherUserDoc.exists()
            ? otherUserDoc.data()
            : {
                displayName: "Người dùng không rõ",
                photoURL: "https://placehold.co/40x40/333333/FFFFFF?text=?",
                uid: otherParticipantId, // Ensure uid is present even for unknown users
              };

          const conversationItem = document.createElement("li");
          conversationItem.className = "message-list-item";
          conversationItem.dataset.chatPartnerId = otherUser.uid;
          conversationItem.dataset.chatPartnerName = otherUser.displayName;
          conversationItem.dataset.chatPartnerPhoto = otherUser.photoURL;

          conversationItem.innerHTML = `
            <img src="${
              otherUser.photoURL ||
              `https://placehold.co/50x50/333333/FFFFFF?text=${otherUser.displayName
                .charAt(0)
                .toUpperCase()}`
            }" alt="Chat Partner Avatar" class="user-avatar" onerror="this.onerror=null;this.src='https://placehold.co/50x50/333333/FFFFFF?text=U';"/>
            <div class="message-info">
              <span class="chat-partner-name">${otherUser.displayName}</span>
              <p class="last-message-preview">${
                chat.lastMessage || "Chưa có tin nhắn nào."
              }</p>
            </div>
            <span class="message-timestamp">${
              chat.lastMessageAt
                ? new Date(chat.lastMessageAt.toDate()).toLocaleString()
                : ""
            }</span>
          `;
          conversationsList.appendChild(conversationItem);

          // Store the first conversation for auto-selection
          if (firstConversationPartnerId === null) {
            firstConversationPartnerId = otherUser.uid;
            firstConversationPartnerName = otherUser.displayName;
            firstConversationPartnerPhoto = otherUser.photoURL;
          }

          conversationItem.addEventListener("click", (e) => {
            const recipientId = e.currentTarget.dataset.chatPartnerId;
            const recipientName = e.currentTarget.dataset.chatPartnerName;
            const recipientPhoto = e.currentTarget.dataset.chatPartnerPhoto;
            startConversation(recipientId, recipientName, recipientPhoto);
          });
        }
      }

      // Auto-select the latest conversation if requested and available
      if (autoSelectLatest && firstConversationPartnerId) {
        // Find the corresponding list item and add 'active' class
        const activeItem = conversationsList.querySelector(
          `[data-chat-partner-id="${firstConversationPartnerId}"]`
        );
        if (activeItem) {
          activeItem.classList.add("active");
        }
        startConversation(
          firstConversationPartnerId,
          firstConversationPartnerName,
          firstConversationPartnerPhoto
        );
      }
    },
    (error) => {
      console.error("Error listening for conversations:", error);
      const conversationsList = document.getElementById("conversationsList");
      conversationsList.innerHTML = `<p class="error-message">Lỗi tải cuộc trò chuyện: ${error.message}</p>`;
      conversationsList.classList.add("empty");
    }
  );
}

// Function to render user profile
async function renderProfile() {
  if (!currentUser) {
    document.getElementById("profileDisplayName").textContent =
      forumTranslations[currentLanguage].loginToPost;
    return;
  }
  if (!db) {
    console.error("Firestore DB not initialized. Cannot render profile.");
    document.getElementById("profileDisplayName").textContent =
      forumTranslations[currentLanguage].firebaseInitError;
    return;
  }

  const profileAvatar = document.getElementById("profileAvatar");
  const profileDisplayName = document.getElementById("profileDisplayName");
  const profileId = document.getElementById("profileId");
  const profileEmail = document.getElementById("profileEmail");
  const profileDescription = document.getElementById("profileDescription");

  // Fetch the detailed user data from Firestore
  const userDocRef = doc(
    db,
    `artifacts/${appId}/public/data/users`,
    currentUser.uid
  );
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    profileAvatar.src =
      userData.photoURL ||
      `https://placehold.co/100x100/333333/FFFFFF?text=${(
        userData.displayName || "U"
      )
        .charAt(0)
        .toUpperCase()}`;
    profileDisplayName.textContent = userData.displayName || "N/A";
    profileId.textContent = userData.uid;
    profileEmail.textContent = userData.email || "N/A";
    profileDescription.value = userData.description || "";
  } else {
    // Fallback to currentUser object if Firestore doc doesn't exist for some reason
    profileAvatar.src =
      currentUser.photoURL ||
      `https://placehold.co/100x100/333333/FFFFFF?text=${(
        currentUser.displayName || "U"
      )
        .charAt(0)
        .toUpperCase()}`;
    profileDisplayName.textContent = currentUser.displayName || "N/A";
    profileId.textContent = currentUser.uid;
    profileEmail.textContent = currentUser.email || "N/A";
    profileDescription.value = ""; // No description if doc doesn't exist
  }
}

// Function to save profile updates
async function saveProfile() {
  if (!currentUser) {
    showForumMessage(forumTranslations[currentLanguage].loginToPost, true);
    return;
  }
  if (!db) {
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
    return;
  }

  const newDescription = document
    .getElementById("profileDescription")
    .value.trim();
  const newDisplayName = document
    .getElementById("profileDisplayName")
    .textContent.trim(); // Assuming display name is not directly editable here, but fetched from auth

  try {
    const userRef = doc(
      db,
      `artifacts/${appId}/public/data/users`,
      currentUser.uid
    );
    await updateDoc(userRef, {
      description: newDescription,
      // displayName: newDisplayName // If display name was editable, update here too
    });

    // Optionally update Firebase Auth profile display name if it was edited
    // if (currentUser.displayName !== newDisplayName) {
    //     await updateProfile(currentUser, { displayName: newDisplayName });
    // }

    showForumMessage(forumTranslations[currentLanguage].profileUpdated, false);
  } catch (error) {
    console.error("Error saving profile:", error);
    showForumMessage("Lỗi khi lưu hồ sơ: " + error.message, true);
  }
}

// Function to show a generic confirmation modal
function showConfirmationModal(message, onConfirmCallback) {
  const confirmationModal = document.getElementById("confirmationModal");
  const confirmationMessage = document.getElementById("confirmationMessage");
  const confirmActionBtn = document.getElementById("confirmActionBtn");

  confirmationMessage.textContent = message;
  confirmationModal.style.display = "block";
  document.body.classList.add("modal-open"); // Disable body scroll

  // Remove previous event listener to prevent multiple calls
  const newConfirmActionBtn = confirmActionBtn.cloneNode(true);
  confirmActionBtn.parentNode.replaceChild(
    newConfirmActionBtn,
    confirmActionBtn
  );

  newConfirmActionBtn.addEventListener("click", () => {
    onConfirmCallback();
    confirmationModal.style.display = "none";
    document.body.classList.remove("modal-open"); // Re-enable body scroll
  });
}

// Function to show user interaction popup (chat, add friend, remove friend)
async function showUserInteractionPopup(
  targetUserId,
  targetUserName,
  targetPhotoURL
) {
  console.log("showUserInteractionPopup called for:", {
    targetUserId,
    targetUserName,
    targetPhotoURL,
  });

  const popup = document.getElementById("userInteractionPopup");
  const popupUserAvatar = document.getElementById("popupUserAvatar");
  const popupUserName = document.getElementById("popupUserName");
  const popupUserId = document.getElementById("popupUserId");
  const popupChatBtn = document.getElementById("popupChatBtn");
  const popupAddFriendBtn = document.getElementById("popupAddFriendBtn");
  const popupRemoveFriendBtn = document.getElementById("popupRemoveFriendBtn");
  const popupCloseBtn = document.getElementById("popupCloseBtn");

  // Always reset and populate basic user info first
  popupUserAvatar.src =
    targetPhotoURL ||
    `https://placehold.co/60x60/333333/FFFFFF?text=${(targetUserName || "U")
      .charAt(0)
      .toUpperCase()}`;
  popupUserName.textContent = targetUserName;
  popupUserId.textContent = `ID: ${targetUserId}`;

  // Reset button states before conditional logic
  popupChatBtn.style.display = "block";
  popupAddFriendBtn.style.display = "block";
  popupRemoveFriendBtn.style.display = "none"; // Default to hidden
  popupAddFriendBtn.disabled = false;
  popupAddFriendBtn.innerHTML = `<i class="fas fa-user-plus"></i> ${forumTranslations[currentLanguage].addFriend}`;
  popupAddFriendBtn.classList.remove("accept-btn"); // Remove accept class by default

  if (!currentUser) {
    console.log("No current user logged in. Hiding interaction buttons.");
    showForumMessage(forumTranslations[currentLanguage].loginToPost, true);
    popupChatBtn.style.display = "none";
    popupAddFriendBtn.style.display = "none";
    popupRemoveFriendBtn.style.display = "none";
    popup.style.display = "block";
    document.body.classList.add("modal-open"); // Disable body scroll
    return;
  }

  if (currentUser.uid === targetUserId) {
    console.log("Interacting with own profile. Switching to profile tab.");
    showForumMessage(
      forumTranslations[currentLanguage].thisIsYourProfile,
      false
    );
    switchTab("profile"); // Automatically switch to profile tab
    popup.style.display = "none"; // Hide the interaction popup
    document.body.classList.remove("modal-open"); // Re-enable body scroll
    return;
  }

  if (!db) {
    console.error(
      "Firestore DB not initialized. Cannot check friendship status."
    );
    showForumMessage(
      forumTranslations[currentLanguage].firebaseInitError,
      true
    );
    popupChatBtn.style.display = "none";
    popupAddFriendBtn.style.display = "none";
    popupRemoveFriendBtn.style.display = "none";
    popup.style.display = "block";
    document.body.classList.add("modal-open"); // Disable body scroll
    return;
  }

  // Check friendship status
  const isFriend = (
    await getDoc(
      doc(
        db,
        `artifacts/${appId}/public/data/users/${currentUser.uid}/friends`,
        targetUserId
      )
    )
  ).exists();
  const isRequestSent = (
    await getDoc(
      doc(
        db,
        `artifacts/${appId}/public/data/friendRequests`,
        `${currentUser.uid}_${targetUserId}`
      )
    )
  ).exists();
  const isRequestReceived = (
    await getDoc(
      doc(
        db,
        `artifacts/${appId}/public/data/friendRequests`,
        `${targetUserId}_${currentUser.uid}`
      )
    )
  ).exists();

  console.log("Friendship Status for", targetUserName, ":", {
    isFriend,
    isRequestSent,
    isRequestReceived,
  });

  if (isFriend) {
    popupAddFriendBtn.style.display = "none";
    popupRemoveFriendBtn.style.display = "block";
  } else if (isRequestSent) {
    popupAddFriendBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${forumTranslations[currentLanguage].sentRequest}`;
    popupAddFriendBtn.disabled = true;
  } else if (isRequestReceived) {
    popupAddFriendBtn.innerHTML = `<i class="fas fa-check"></i> ${forumTranslations[currentLanguage].accept}`;
    popupAddFriendBtn.classList.add("accept-btn");
    popupAddFriendBtn.disabled = false;
    // Store necessary data for acceptance on the button itself
    popupAddFriendBtn.dataset.requestId = `${targetUserId}_${currentUser.uid}`;
    popupAddFriendBtn.dataset.senderId = targetUserId;
    popupAddFriendBtn.dataset.senderName = targetUserName;
  } else {
    // Default state: show "Add Friend"
    popupAddFriendBtn.innerHTML = `<i class="fas fa-user-plus"></i> ${forumTranslations[currentLanguage].addFriend}`;
    popupAddFriendBtn.disabled = false;
  }

  // Clone and re-add event listeners to prevent multiple listeners on the same element
  // IMPORTANT: Perform cloning AFTER setting initial states based on friendship status
  const newPopupChatBtn = popupChatBtn.cloneNode(true);
  popupChatBtn.parentNode.replaceChild(newPopupChatBtn, popupChatBtn);

  const newPopupAddFriendBtn = popupAddFriendBtn.cloneNode(true);
  popupAddFriendBtn.parentNode.replaceChild(
    newPopupAddFriendBtn,
    popupAddFriendBtn
  );

  const newPopupRemoveFriendBtn = popupRemoveFriendBtn.cloneNode(true);
  popupRemoveFriendBtn.parentNode.replaceChild(
    newPopupRemoveFriendBtn,
    popupRemoveFriendBtn
  );

  const newPopupCloseBtn = popupCloseBtn.cloneNode(true);
  popupCloseBtn.parentNode.replaceChild(newPopupCloseBtn, popupCloseBtn);

  newPopupChatBtn.addEventListener("click", () => {
    console.log("Chat button clicked for:", targetUserId);
    // Directly call startConversation without opening a modal
    startConversation(targetUserId, targetUserName, targetPhotoURL);
    popup.style.display = "none"; // Hide the user interaction popup
    document.body.classList.remove("modal-open"); // Re-enable body scroll
  });

  // Attach event listener for Add Friend / Accept button unconditionally
  newPopupAddFriendBtn.addEventListener("click", async () => {
    if (newPopupAddFriendBtn.classList.contains("accept-btn")) {
      // Check the class on the NEW button
      console.log("Accept friend request button clicked for:", targetUserId);
      await acceptFriendRequest(
        `${targetUserId}_${currentUser.uid}`,
        targetUserId,
        targetUserName
      );
    } else {
      console.log("Send friend request button clicked for:", targetUserId);
      await sendFriendRequest(targetUserId);
    }
    popup.style.display = "none";
    document.body.classList.remove("modal-open"); // Re-enable body scroll
  });

  newPopupRemoveFriendBtn.addEventListener("click", () => {
    console.log("Remove friend button clicked for:", targetUserId);
    showConfirmationModal(
      forumTranslations[currentLanguage].confirmRemoveFriend,
      async () => {
        await removeFriend(targetUserId);
        popup.style.display = "none";
        document.body.classList.remove("modal-open"); // Re-enable body scroll
      }
    );
  });

  newPopupCloseBtn.addEventListener("click", () => {
    console.log("Close button clicked.");
    popup.style.display = "none";
    document.body.classList.remove("modal-open"); // Re-enable body scroll
  });

  popup.style.display = "block";
  document.body.classList.add("modal-open"); // Disable body scroll
}
