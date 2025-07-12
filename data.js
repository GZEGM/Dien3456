// data.js
const addons = [
  {
    id: 1,
    title: {
      vi: "Hệ Thống Kỹ Năng",
      en: "Skill System",
    },
    description: {
      vi: "Một hệ thống kỹ năng toàn diện cho Minecraft Bedrock.",
      en: "A comprehensive skill system for Minecraft Bedrock.",
    },
    // The top-level image, video, file can be considered as the latest version's default or a general overview.
    // Specific versions will have their own details.
    image: "https://placehold.co/600x400/00e676/FFFFFF?text=Skill+System",
    video: "https://www.youtube.com/watch?v=8njgICxykg0",

    versions: [
      {
        versionName: "1.0.1",
        releaseDate: "2024-07-01",
        title: {
          vi: "Hệ Thống Kỹ Năng v1.0.1",
          en: "Skill System v1.0.1",
        },
        description: {
          vi: "Phiên bản đầu tiên của Hệ Thống Kỹ Năng, tương thích với Minecraft Bedrock 1.21.90+.",
          en: "Initial release of the Skill System, compatible with Minecraft Bedrock 1.21.90+.",
        },
        images: [
          "https://placehold.co/600x400/00e676/FFFFFF?text=Skill+System+Image+1",
          "https://placehold.co/600x400/00e676/FFFFFF?text=Skill+System+Image+2",
        ],
        videos: [
          "https://www.youtube.com/embed/8njgICxykg0", // YouTube embed link
        ],
        changelog: {
          vi: `
            - Thêm hệ thống kỹ năng cơ bản.
            - Tương thích với Minecraft Bedrock 1.21.90+.
            - Sửa lỗi nhỏ và cải thiện hiệu suất.
          `,
          en: `
            - Added basic skill system.
            - Compatible with Minecraft Bedrock 1.21.90+.
            - Minor bug fixes and performance improvements.
          `,
        },
        file: "addons/Skill System 1.21.90 - 1.0.1.zip",
      },
      {
        versionName: "1.0.0",
        releaseDate: "2024-06-15",
        title: {
          vi: "Hệ Thống Kỹ Năng v1.0.0 (Alpha)",
          en: "Skill System v1.0.0 (Alpha)",
        },
        description: {
          vi: "Phiên bản alpha đầu tiên của Hệ Thống Kỹ Năng, chỉ dành cho thử nghiệm.",
          en: "First alpha version of the Skill System, for testing purposes only.",
        },
        images: [
          "https://placehold.co/600x400/00e676/FFFFFF?text=Skill+System+Alpha+Image+1",
        ],
        videos: [],
        changelog: {
          vi: `
            - Phát hành thử nghiệm ban đầu.
            - Các chức năng cơ bản.
          `,
          en: `
            - Initial experimental release.
            - Basic functionalities.
          `,
        },
        file: "addons/Skill System 1.21.90 - 1.0.0 Alpha.zip",
      },
    ],
  },
  {
    id: 2,
    title: {
      vi: "Addon Sinh Tồn Mới",
      en: "New Survival Addon",
    },
    description: {
      vi: "Thêm các vật phẩm, quái vật và cơ chế mới vào chế độ sinh tồn.",
      en: "Adds new items, mobs, and mechanics to survival mode.",
    },
    image: "https://placehold.co/600x400/FF5722/FFFFFF?text=Survival+Addon",
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Example video
    versions: [
      {
        versionName: "1.0.0",
        releaseDate: "2024-07-10",
        title: {
          vi: "Addon Sinh Tồn Mới v1.0.0",
          en: "New Survival Addon v1.0.0",
        },
        description: {
          vi: "Phiên bản đầu tiên với các công cụ và áo giáp Ruby, quái vật mới.",
          en: "Initial release with Ruby tools and armor, new mobs.",
        },
        images: [
          "https://placehold.co/600x400/FF5722/FFFFFF?text=Survival+Addon+Image+1",
          "https://placehold.co/600x400/FF5722/FFFFFF?text=Survival+Addon+Image+2",
        ],
        videos: [
          "https://www.youtube.com/embed/dQw4w9WgXcQ", // YouTube embed link
        ],
        changelog: {
          vi: `
            - Giới thiệu công cụ và áo giáp Ruby.
            - Cập nhật công thức chế tạo.
          `,
          en: `
            - Introduced Ruby tools and armor.
            - Updated crafting recipes.
          `,
        },
        file: "addons/New Survival Addon 1.0.0 Alpha.zip",
      },
    ],
  },
];

// Translations for general UI elements
const translations = {
  vi: {
    home: "Trang chủ",
    settings: "Cài đặt",
    language: "Ngôn ngữ",
    theme: "Chủ đề",
    darkMode: "Chế độ Tối",
    lightMode: "Chế độ Sáng",
    searchPlaceholder: "Tìm kiếm addon...",
    downloadAddon: "Tải Addon",
    loadingAddon: "Đang tải addon...",
    addonNotFound: "Không tìm thấy addon.",
    mcpeAddons: "🧩 MCPE Addons",
    addonDetails: "Chi tiết Addon",
    addonGallery: "📦 Thư viện Addon MCPE",
    close: "Đóng",
    selectVersion: "Chọn phiên bản:",
    images: "Hình ảnh",
    videos: "Video",
    changelog: "Nhật ký thay đổi",
    download: "Tải xuống",
    forum: "Diễn đàn", // Thêm bản dịch cho Diễn đàn
    welcome: "Chào mừng,",
    userId: "ID:",
    logout: "Đăng xuất",
  },
  en: {
    home: "Home",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    searchPlaceholder: "Search addons...",
    downloadAddon: "Download Addon",
    loadingAddon: "Loading addon...",
    addonNotFound: "Addon not found.",
    mcpeAddons: "🧩 MCPE Addons",
    addonDetails: "Addon Details",
    addonGallery: "📦 MCPE Addon Gallery",
    close: "Close",
    selectVersion: "Select version:",
    images: "Images",
    videos: "Videos",
    changelog: "Changelog",
    download: "Download",
    forum: "Forum", // Add translation for Forum
    welcome: "Welcome,",
    userId: "ID:",
    logout: "Logout",
  },
};
