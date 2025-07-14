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
    image: "images/skills/skill-system.png",
    video: "https://www.youtube.com/watch?v=8njgICxykg0",

    versions: [
      {
        versionName: "1.0.1",
        releaseDate: "6/7/2025",
        title: {
          vi: "Hệ Thống Kỹ Năng v1.0.1",
          en: "Skill System v1.0.1",
        },
        description: {
          vi: "Phiên bản đầu tiên của Hệ Thống Kỹ Năng, tương thích với Minecraft Bedrock 1.21.90+.",
          en: "Initial release of the Skill System, compatible with Minecraft Bedrock 1.21.90+.",
        },
        images: [
          {
            src: "images/skills/alchemy.png",
            captions: {
              vi: "Kỹ năng mới: Giả kim thuật.",
              en: "New Skill Alchemy.",
            },
          },
          {
            src: "images/skills/building.png",
            captions: {
              vi: "Kỹ năng mới: Xây dựng.",
              en: "New Skill Building.",
            },
          },
          {
            src: "images/skills/diving.png",
            captions: {
              vi: "Kỹ năng mới: Lặn.",
              en: "New Skill Diving",
            },
          },
          {
            src: "images/skills/crafting.png",
            captions: {
              vi: "Kỹ năng mới: Chế tạo.",
              en: "New Skill Crafting",
            },
          },
        ],
        videos: [
          "https://www.youtube.com/embed/8njgICxykg0", // YouTube embed link
        ],
        changelog: {
          vi: `
            Hệ Thống Kỹ Năng - Phiên bản 1.0.1 - Nhật ký thay đổi
            Cập nhật mới: Đã thêm 4 kỹ năng mới:

            - Giả kim thuật
            Nhận XP khi sử dụng thuốc dựa trên loại thuốc.
            Lưu ý: XP sẽ không được thêm nếu hiệu ứng tương tự đã có và chưa hết hạn.

            Kỹ năng 3 - Giả kim thuật: Nhấp chuột phải vào bột Blaze

            - Xây dựng
            Nhận XP khi đặt khối. Hầu hết các khối Minecraft đều được hỗ trợ.

            Kỹ năng 3 - Xây dựng: Nhấp chuột phải vào Gạch đá về phía một hướng/thực thể/khối

            - Lặn
            Nhận XP bằng cách thực hiện các hành động dưới nước.

            Kỹ năng 3 - Lặn: Nhấp chuột phải vào Trái tim của biển về phía một hướng/thực thể

            - Chế tạo
            Nhận XP cho mỗi vật phẩm được chế tạo. Các vật phẩm đặc biệt mang lại nhiều XP hơn.

            Kỹ năng 3 - Chế tạo: Nhấp chuột phải vào Bàn chế tạo
          `,
          en: `
Skill System - Version 1.0.1 - Changelog
New Update: 4 New Skills added:

- Alchemy
Gain XP when using potions based on the potion type.
Note: XP will not be added if the same effect is already active and hasn't expired.

Skill 3 - Alchemy: Right-click Blaze Powder



- Building
Gain XP when placing blocks. Almost all Minecraft blocks are supported.

Skill 3 - Building: Right-click Stone Bricks toward a direction/entity/block



- Diving
Gain XP by performing actions underwater.

Skill 3 - Diving: Right-click Heart of the Sea toward a direction/entity

- Crafting
Gain XP for each crafted item. Special items yield more XP.

Skill 3 - Crafting: Right-click Crafting Table
          `,
        },
        file: "addons/Skill System 1.21.90 - 1.0.0.zip",
      },
      // ===============================================================================================================
      {
        versionName: "1.0.0",
        releaseDate: "1/7/2025",
        title: {
          vi: "Hệ Thống Kỹ Năng v1.0.0",
          en: "Skill System v1.0.0",
        },
        description: {
          vi: "Phiên bản đầu tiên của Hệ Thống Kỹ Năng, tương thích với Minecraft Bedrock 1.21.90+.",
          en: "Initial release of the Skill System, compatible with Minecraft Bedrock 1.21.90+.",
        },
        images: [
          {
            src: "images/skills/fishing-skill.png",
            captions: {
              vi: "Kỹ năng mới: Câu cá.",
              en: "New Skill Fishing",
            },
          },
          {
            src: "images/skills/leaderboard-skill.png",
            captions: {
              vi: "Bảng xếp hạng kỹ năng.",
              en: "Leaderboard Skill.",
            },
          },
          {
            src: "images/skills/stats-system.png",
            captions: {
              vi: "Hệ thống thống kê.",
              en: "Stats System.",
            },
          },
          {
            src: "images/skills/languages.png",
            captions: {
              vi: "Hỗ trợ hai ngôn ngữ: Tiếng Anh / Tiếng Việt",
              en: "Supports two languages: English / Vietnamese",
            },
          },
        ],
        videos: [
          "https://www.youtube.com/embed/4uA5U38iYgQ?si=VTaxyvpln_M4jPFx", // YouTube embed link
        ],
        changelog: {
          vi: `
            - Đã chỉnh sửa lại một số kỹ năng bị động và chủ động.
            - Đã thêm kỹ năng mới: Câu cá.
            - Đã thêm tính năng bảng xếp hạng.
            - Đã thêm hệ thống thống kê người chơi.
            - Đã thêm tính năng quản lý kỹ năng cho mỗi người chơi.
            - Hỗ trợ hai ngôn ngữ: Tiếng Anh / Tiếng Việt.
            - Đã sửa đổi phương pháp nhận kinh nghiệm.
            - Cài đặt giờ đây cho phép bật/tắt HUD Sức khỏe và Giáp.
            - Và một vài cải tiến nhỏ khác...
          `,
          en: `
- Reworked several passive and active skills

- Added new skill: Fishing

- Added leaderboard feature

- Added player stats system

- Added skill management feature for each player

- Supports two languages: English / Vietnamese

- Modified experience gain method

- Settings now allow toggling Health and Armor HUD

- And a few other small improvements...
          `,
        },
        file: "addons/Skill System 1.21.90 - 1.0.0.zip",
      },
    ],
  },

  //=====================================================================================================

  {
    id: 2,
    title: {
      vi: "Hệ Thống Nhiệm Vụ",
      en: "Quest System",
    },
    description: {
      vi: "Một hệ thống nhiệm vụ tùy chỉnh cho Minecraft Bedrock.",
      en: "A custom quest system for Minecraft Bedrock.",
    },
    // The top-level image, video, file can be considered as the latest version's default or a general overview.
    // Specific versions will have their own details.
    image: "images/quests/quest-system.png",
    video: "https://www.youtube.com/embed/662yrKIFmq4?si=M2bzUc6rJKr8EJ_o",

    versions: [
      {
        versionName: "1.0.0",
        releaseDate: "26/6/2025",
        title: {
          vi: "Hệ Thống Nhiệm Vụ v1.0.0",
          en: "Quest System v1.0.0",
        },
        description: {
          vi: "Tùy chỉnh nhiệm vụ của bạn với Minecraft Bedrock 1.21.90+.",
          en: "Custom your quests with Minecraft Bedrock 1.21.90+.",
        },
        images: [
          {
            src: "images/quests/open_player_quest.png",
            captions: {
              vi: "Hình ảnh 1.",
              en: "Images 1",
            },
          },
        ],
        videos: [
          "https://www.youtube.com/embed/bnSMqxUJccY?si=JmnfjmdXhCZSIiij", // YouTube embed link
        ],
        changelog: {
          vi: `
            Hệ Thống Nhiệm Vụ - Phiên bản 1.0.0 - Nhật ký thay đổi

            - Cho phép tạo nhiều điều kiện và phần thưởng.

            - Cho phép hiển thị tiến trình nhiệm vụ trên màn hình.

            - Giới thiệu 4 điều kiện: Có Vật phẩm, Phá Khối, Đặt Khối và Giết Quái vật.

            - Giới thiệu 3 phần thưởng: Tặng Vật phẩm (có phù phép, mô tả, thẻ tên), Bảng điểm, và Cấu trúc.

            - Nhiệm vụ giờ đây có thể có số lượng hoàn thành hữu hạn hoặc vô hạn.

            - Đã thêm tính năng khóa nhiệm vụ.

            - Và nhiều tiện ích khác...
          `,
          en: `
Quest System - Version 1.0.0 - Changelog

- Allow for the creation of multiple conditions and rewards.

- Enable the display of quest progress on-screen.

- Introduced 4 conditions: Has Item, Break Block, Place Block, and Kill Mob.

- Introduced 3 rewards: Give Item (with enchantments, lore, and name tags), Scoreboard, and Structure.

- Quests can now have a finite or infinite completion count.

- Added a quest locking feature.

- And various other utilities...
          `,
        },
        file: "addons/Quest System 1.21.90 - 1.0.0.zip",
      },
      {
        versionName: "1.0.1",
        releaseDate: "8/7/2025",
        title: {
          vi: "Hệ Thống Nhiệm Vụ v1.0.1",
          en: "Quest System v1.0.1",
        },
        description: {
          vi: "Tùy chỉnh nhiệm vụ của bạn với Minecraft Bedrock 1.21.90+.",
          en: "Custom your quests with Minecraft Bedrock 1.21.90+.",
        },
        images: [
          {
            src: "images/quests/duplicate.png",
            captions: {
              vi: "Sao chép nhiệm vụ.",
              en: "Duplicate Quest",
            },
          },
          {
            src: "images/quests/languages.png",
            captions: {
              vi: "Hỗ trợ ba ngôn ngữ.",
              en: "Support three languages",
            },
          },
        ],
        videos: [
          "https://www.youtube.com/embed/662yrKIFmq4?si=M2bzUc6rJKr8EJ_o", // YouTube embed link
        ],
        changelog: {
          vi: `
            ✨ NHẬT KÝ THAY ĐỔI Hệ Thống Nhiệm Vụ v1.0.1
            🚀 Tính năng mới
            - Kiểm tra một lần & liên tục

              - Một lần: Hoàn thành một lần, lưu vĩnh viễn.

              - Liên tục: Kiểm tra trực tiếp (cập nhật điểm/thuộc tính theo thời gian thực).

            - Hỗ trợ các toán tử so sánh

              - Sử dụng >, <, =, !=, >=, <= trong kiểm tra bảng điểm & thuộc tính.

            - Sao chép nhiệm vụ

              - Nhiệm vụ giờ đây có thể được sao chép.

            - Hỗ trợ đa ngôn ngữ

            - Loại yêu cầu (Đã thêm 4 yêu cầu mới)

              - Vị trí

              - Bảng điểm

              - Thẻ

              - Thuộc tính động

              - Mỗi loại hỗ trợ mô tả và thông tin ẩn trong nhật ký nhiệm vụ của người chơi.

            - Loại phần thưởng (Đã thêm 3 phần thưởng mới)

              - Lệnh

              - Tập lệnh

              - Thuộc tính động

            - Hoàn thành im lặng

              - Nếu tin nhắn hoàn thành phần thưởng = "none", sẽ không có tin nhắn nào được hiển thị.

              - Thanh hành động: Hiển thị phần trăm nhiệm vụ + yêu cầu tiếp theo trực tiếp.

            🧹 Sửa lỗi & cải tiến
              ✔️ Tự động dọn dẹp các nhiệm vụ đã bị xóa khỏi dữ liệu người chơi.

              🐞 Đã sửa lỗi kiểm tra isValid và các vấn đề đồng bộ hóa điểm số.

              🔇 Đã loại bỏ nhật ký gỡ lỗi gây nhiễu.
          `,
          en: `
✨ CHANGELOG Quest System v1.0.1
🚀 New Features
- One-Time & Continuous Checks

  - One-Time: Complete once, saved permanently.

  - Continuous: Live checking (score/property updates in real-time).

- Comparison Operators Supported

  - Use >, <, =, !=, >=, <= in scoreboard & property checks.

- Duplicate Quests

  - Quests can now be duplicated.

- Multi-language Support

- Requirement Types (Added 4 new requirements)

  - Location

  - Scoreboard

  - Tag

  - Dynamic Property

  - Each supports descriptions and hidden information in the player's quest log.

- Reward Types (Added 3 new rewards)

  - Command

  - Script

  - Dynamic Property

- Silent Completion

  - If reward completionMessage = "none", no message will be shown.

  - ActionBar: Shows quest percentage + next requirement live.

🧹 Fixes & Improvements
  ✔️ Auto-cleanup of removed quests from player data.

  🐞 Fixed isValid checks and score synchronization issues.

  🔇 Removed debug spam.
          `,
        },
        file: "addons/Quest System 1.21.90 - 1.0.1.zip",
      },
      // ==============================================================================================================
    ],
  },

  // Add
  {
    id: 3,
    title: {
      vi: "Chest Spawner",
      en: "Chest Spawner",
    },
    description: {
      vi: "Hồi sinh/Tái sinh vật phẩm trong rương cho Minecraft Bedrock.",
      en: "Spawn/Respawn item in chest for Minecraft Bedrock.",
    },
    image: "images/chest_spawner/cs_v1_m2.png",
    video: "https://www.youtube.com/embed/IjODNOW32zg?si=UTZIJbqG1nCBoOtR",
    versions: [
      {
        versionName: "1.0.1",
        releaseDate: "6/7/2025",
        title: {
          vi: "Hệ Thống Kỹ Năng v1.0.1",
          en: "Skill System v1.0.1",
        },
        description: {
          vi: "Addon này cho phép quản trị viên tạo và quản lý các spawner rương tùy chỉnh tự động điền lại vật phẩm theo thời gian, cung cấp các tùy chọn ngẫu nhiên hóa và hồi sinh khác nhau. Hỗ trợ Minecraft Bedrock 1.21.90+.",
          en: "This addon allows admins to create and manage custom chest spawners that automatically refill with items over time, offering various randomization and respawn options.Support Minecraft Bedrock 1.21.90+.",
        },
        images: [
          {
            src: "images/chest_spawner/cs_v1_m1.png",
            captions: {
              vi: "Trước",
              en: "Before",
            },
          },
          {
            src: "images/chest_spawner/cs_v1_m2.png",
            captions: {
              vi: "Sau",
              en: "After",
            },
          },
        ],
        videos: [
          "https://www.youtube.com/embed/IjODNOW32zg?si=UTZIJbqG1nCBoOtR",
        ],
        changelog: {
          vi: '-\n- Changelog Addon Chest Spawner v1.0.0\n\nCơ chế hoạt động\n\n-   Công cụ đặc biệt: Gậy "Chest Spawner Tool" để cấu hình.\n-   Lưu trữ: Cấu hình rương và cài đặt addon được lưu trữ toàn cầu.\n-   Khôi phục khối: Tự động khôi phục các khối rương bị hỏng hoặc thiếu.\n-   Không thể phá hủy: Tùy chọn làm cho rương không thể bị phá vỡ.\n-   Theo dõi thời gian: Ghi lại thời gian mở rương lần cuối cho các chế độ hồi sinh cụ thể.\n\nChế độ & Cài đặt\n\nCấu hình rương\n\n-   Thời gian hồi sinh: Đặt khoảng thời gian hồi sinh (giây).\n-   Loại hồi sinh: "Mọi lúc" hoặc "Sau lần mở đầu tiên".\n-   Vị trí vật phẩm: "Cố định" hoặc "Ngẫu nhiên" các ô.\n-   Ngẫu nhiên hóa ô: Bật/tắt điền ô ngẫu nhiên.\n-   Ngẫu nhiên hóa số lượng: Bật/tắt ngẫu nhiên số lượng vật phẩm mỗi ô.\n-   Không thể phá hủy: Làm cho rương không thể bị phá hủy.\n\nCài đặt Addon:\n\n-   ID gậy đặc biệt: Tùy chỉnh vật phẩm công cụ.\n-   Lore gậy đặc biệt: Tùy chỉnh mô tả công cụ.\n-   Chế độ gỡ lỗi: Bật/tắt ghi nhật ký chi tiết.\n\nLệnh\n\n-   /cs menu :scroll:: Mở menu chính (quản lý rương, cài đặt).\n-   /cs item :magic_wand:: Cung cấp "Công cụ hồi sinh rương".\n-   /cs debug :lady_beetle:: Xem/xóa nhật ký gỡ lỗi.\n\nTương tác\n\n-   Cấu hình/Quản lý: Nhấp chuột phải vào rương bằng "Công cụ hồi sinh rương".\n-   Tạm dừng Spawner: Lén lút + Nhấp chuột phải vào rương đã cấu hình bằng công cụ.\n-   Mở rương: Mở bình thường sẽ cập nhật thời gian mở lần cuối cho các chế độ liên quan.\n          ',
          en: '\n- Chest Spawner Addon Changelog v1.0.0\n\nMechanics\n\n-   Special Tool: "Chest Spawner Tool" stick for configuration.\n-   Persistence: Chest configs and addon settings save globally.\n-   Block Restoration: Auto-restores broken or missing chest blocks.\n-   Indestructible: Option to make chests unbreakable.\n-   Time Tracking: Records last opened time for specific respawn modes.\n\nModes & Settings\n\nChest Configuration\n\n-   Respawn Time: Set respawn interval (seconds).\n-   Respawn Type: "Every Time" or "After First Open".\n-   Item Position: "Fixed" or "Random" slots.\n-   Randomize Slots: Toggle random slot filling.\n-   Randomize Quantity: Toggle random item quantities per slot.\n-   Indestructible: Make the chest indestructible.\n\nAddon Settings:\n\n-   Special Stick ID: Customize tool item.\n-   Special Stick Lore: Customize tool description.\n-   Debug Mode: Enable/disable detailed logging.\n\nCommands\n\n-   /cs menu :scroll:: Opens main menu (manage chests, settings).\n-   /cs item :magic_wand:: Gives "Chest Spawner Tool".\n-   /cs debug :lady_beetle:: View/clear debug logs.\n\nInteractions\n\n-   Configure/Manage: Right-click chest with "Chest Spawner Tool".\n-   Pause Spawner: Sneak + Right-click configured chest with tool.\n-   Open Chest: Normal opening updates last opened time for relevant modes.\n          ',
        },
        file: "addons/Chest Spawner 1.21.90 - 1.0.0.zip",
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
    mcpeAddons: "Dienkon Addons", // Updated
    addonDetails: "Chi tiết Addon",
    addonGallery: "📦 Thư viện Addon MCPE",
    close: "Đóng",
    selectVersion: "Chọn phiên bản:",
    images: "Hình ảnh",
    videos: "Video",
    changelog: "Nhật ký thay đổi",
    download: "Tải xuống",
    forum: "Diễn đàn",
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
    mcpeAddons: "Dienkon Addons", // Updated
    addonDetails: "Addon Details",
    addonGallery: "📦 MCPE Addon Gallery",
    close: "Close",
    selectVersion: "Select version:",
    images: "Images",
    videos: "Videos",
    changelog: "Changelog",
    download: "Download",
    forum: "Forum",
    welcome: "Welcome,",
    userId: "ID:",
    logout: "Logout",
  },
};
