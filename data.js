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
      // ===============================================================================================================
      {
        versionName: "1.0.1",
        releaseDate: "6/7/2025",
        title: {
          vi: "Hệ Thống Kỹ Năng v1.0.1",
          en: "Skill System v1.0.1",
        },
        description: {
          vi: "Phiên bản cập nhật của Hệ Thống Kỹ Năng, tương thích với Minecraft Bedrock 1.21.90+.",
          en: "Updated version of the Skill System, compatible with Minecraft Bedrock 1.21.90+.",
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
        file: "addons/Skill System 1.21.90 - 1.0.1.zip",
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
      // ==============================================================================================================
      {
        versionName: "1.0.2",
        releaseDate: "21/7/2025",
        title: {
          vi: "Hệ Thống Kỹ Năng v1.0.2",
          en: "Skill System v1.0.2",
        },
        description: {
          vi: "Phiên bản cập nhật của Hệ Thống Kỹ Năng, tương thích với Minecraft Bedrock 1.21.90+.",
          en: "Updated version of the Skill System, compatible with Minecraft Bedrock 1.21.90+.",
        },
        images: [
          {
            src: "images/skills/1.0.2/gluttony.png",
            captions: {
              vi: "Kỹ năng mới: Tham ăn.",
              en: "New Skill Gluttony.",
            },
          },
          {
            src: "images/skills/1.0.2/beastShepherd.png",
            captions: {
              vi: "Kỹ năng mới: Thủ lĩnh thú hoang.",
              en: "New Skill Beast Shepherd.",
            },
          },
          {
            src: "images/skills/1.0.2/xp_msg.png",
            captions: {
              vi: "Bật/Tắt thông báo XP.",
              en: "Turn on/off XP message.",
            },
          },
          {
            src: "images/skills/1.0.2/activate_with_item.png",
            captions: {
              vi: "Kích hoạt kỹ năng bằng vật phẩm.",
              en: "Activate skills with items.",
            },
          },
          {
            src: "images/skills/1.0.2/activate_with_command.png",
            captions: {
              vi: "Kích hoạt kỹ năng bằng lệnh.",
              en: "Activate skills with commands.",
            },
          },
          {
            src: "images/skills/1.0.2/update_data.png",
            captions: {
              vi: "Khi bạn tải xuống phiên bản mới nhất vào thế giới trước đó, hãy chọn tùy chọn này để dữ liệu có thể được đồng bộ hóa với phiên bản mới mà không mất dữ liệu.",
              en: "When you download the latest version into the previous world, select this option so that the data can be synchronized with the new version without losing all the data.",
            },
          },
          {
            src: "images/skills/1.0.2/sort_a_z.png",
            captions: {
              vi: "Sắp xếp theo A-Z.",
              en: "Sort by A-Z.",
            },
          },
          {
            src: "images/skills/1.0.2/sort_low_high.png",
            captions: {
              vi: "Sắp xếp theo Tăng dần - Giảm dần",
              en: "Sort by Low-High.",
            },
          },
          {
            src: "images/skills/1.0.2/search.png",
            captions: {
              vi: "Bây giờ, bạn có thể tìm kiếm các vật phẩm và mob theo tên hoặc theo XP trong phần xem XP.",
              en: "Now, you can search for items and mobs by their names or by their XP in the XP viewing section.",
            },
          },
        ],
        videos: [
          "https://www.youtube.com/embed/ROJ8mHB-F3o?si=AuTZC8rk-cIKU02M", // YouTube embed link
        ],
        changelog: {
          vi: `
Hệ Thống Kỹ Năng - Phiên bản 1.0.2 - Thay đổi

Cập nhật mới: Thêm 2 kỹ năng mới:

* Thực Thần (Gluttony)
  Nhận XP khi ăn thức ăn dựa trên loại thức ăn.
  *Kỹ năng 3 - Thực Thần*: Nhấp chuột phải vào một món ăn.

* Người Chăn Thú (Beast Shepherd)
  Nhận XP khi thuần hóa hoặc phối giống động vật.
  *Kỹ năng 3 - Người Chăn Thú*: Nhấp chuột phải vào một bông hoa anh túc (poppy).

Tính năng mới:

* Trang Cài Đặt

  * Bật/tắt thông báo nhận XP.
  * Kích hoạt kỹ năng bằng vật phẩm.
  * Kích hoạt kỹ năng bằng lệnh.
  * Cập nhật dữ liệu: Khi bạn tải phiên bản mới nhất vào thế giới đã chơi trước đó, chọn tùy chọn này để đồng bộ dữ liệu với phiên bản mới mà không mất dữ liệu cũ.

* Phần xem XP:

  * Sắp xếp theo tên (A-Z).
  * Sắp xếp theo XP (Tăng dần).
  * Tìm kiếm: Giờ đây bạn có thể tìm kiếm vật phẩm và mob theo tên hoặc lượng XP của chúng trong phần xem XP.

Sửa lỗi:

* Sửa lỗi bảng xếp hạng không hoạt động ở các chiều Nether và The End.
* Sửa lỗi không nhận XP từ kỹ năng xây dựng khi đặt block.
* Và nhiều lỗi nhỏ khác cùng với các cải tiến hiệu năng.

          `,
          en: `
Skill System - Version 1.0.2 - Changelog

New Update: 2 New Skills added:
- Gluttony
Gain XP when eating food based on the food type.
Skill 3 - Gluttony: Right-click on a food item

- Beast Shepherd
Gain XP when taming or breeding animals.
Skill 3 - Beast Shepherd: Right-click on a poppy

* New Features:
  * Setting Page
    - Turn on/off XP message
    - Activate skills with items
    - Activate skills with commands
    - Update data: When you download the latest version into the previous world, select this option so that the data can be synchronized with the new version without losing all the data.
  * Xp viewing section:
    - Sort by A-Z
    - Sort by Low-High
    - Search: Now, you can search for items and mobs by their names or by their XP in the XP viewing section.

* Bug Fixes:
  - Fix Leaderboard Data not activating at nether and the end dimensions.
  - Fix Xp from building not gaining when placing blocks.
  - And various other minor bug fixes and improvements.
          `,
        },
        file: "addons/Skill System 1.21.90 - 1.0.2.zip",
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
        versionName: "1.0.0",
        releaseDate: "6/7/2025",
        title: {
          vi: "Chest Spawner v1.0.0",
          en: "Chest Spawner v1.0.0",
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

  // =========================================================================================================

  {
    id: 4,
    title: {
      vi: "Minigame Wordle",
      en: "Minigame Wordle",
    },
    description: {
      vi: "Đoán từ trong Minecraft Bedrock.",
      en: "Quess the word.",
    },
    image: "images/wordle/wordle.png",
    video: "https://www.youtube.com/embed/5qOM1TP4PhU?si=biGkJTCyxAcxewb1",
    versions: [
      {
        versionName: "1.0.1",
        releaseDate: "23/7/2025",
        title: {
          vi: "Wordle v1.0.1",
          en: "Wordle v1.0.1",
        },
        description: {
          vi: "Addon này cho phép quản trị viên tạo và quản lý các spawner rương tùy chỉnh tự động điền lại vật phẩm theo thời gian, cung cấp các tùy chọn ngẫu nhiên hóa và hồi sinh khác nhau. Hỗ trợ Minecraft Bedrock 1.21.90+.",
          en: "Welcome to the major update of the Wordle Addon! Version v1.0.1 brings many new features, significantly improving user experience and customization capabilities. Support Minecraft Bedrock 1.21.90+.",
        },
        images: [
          {
            src: "images/wordle/1.0.1/command.png",
            captions: {
              vi: "Sử dụng lệnh để bắt đầu trò chơi.\n/wordle play để bắt đầu trò chơi.\n/wordle config để mở menu cấu hình.",
              en: `Use the command to start the game.\n/wordle play to start the game.\n/wordle config to open the configuration menu.`,
            },
          },
          {
            src: "images/wordle/1.0.1/setting_1.png",
            captions: {
              vi: "Cấu hình trò chơi với các tùy chọn như số lần đoán, độ dài từ, và ngôn ngữ.",
              en: "General Settings",
            },
          },
          {
            src: "images/wordle/1.0.1/setting_2.png",
            captions: {
              vi: "Cấu hình trò chơi với các tùy chọn như số lần đoán, độ dài từ, và ngôn ngữ.",
              en: "General Settings",
            },
          },
          {
            src: "images/wordle/1.0.1/word_settings.png",
            captions: {
              vi: "Cài đặt từ",
              en: "Word Settings",
            },
          },
        ],
        videos: [
          "https://www.youtube.com/embed/5qOM1TP4PhU?si=biGkJTCyxAcxewb1", // No video available
        ],
        changelog: {
          vi: `Wordle Addon v1.0.1 Cập nhật
- Cài đặt Bền vững: Tất cả cấu hình (cược, tiền, ngôn ngữ, v.v.) giờ đây được lưu trữ vĩnh viễn.
- Quản lý Từ Linh hoạt:
      - Thêm, chỉnh sửa, xóa từ cá nhân.
      - Xem, tìm kiếm và xóa toàn bộ danh sách từ.
      - Tự động bao gồm 100 từ mặc định khi cài đặt lần đầu. 
- Cài đặt Chi tiết:
    - Tùy chọn đặt số lần đoán (mặc định 5).
    - Bật/tắt cược (mặc định bật) để chơi giải trí không có tiền cược.
    - Hỗ trợ tiếng Anh và tiếng Việt.
- Trải nghiệm Cải tiến:
    - Hiển thị rõ ràng hơn các thông báo và lỗi.
    - Tối ưu hóa mã.
`,
          en: `Wordle Addon v1.0.1 Update
- Persistent Settings: All configurations (betting, money, language, etc.) are now saved permanently.
- Flexible Word Management:
     - Add, edit, delete individual words.
     - View, search, and clear the entire word list.
     - Automatically includes 100 default words on first install.
 - Detailed Settings:
    - Option to set number of chances (default 5).
    - Toggle betting on/off (default on) for casual play without stakes.
    - Supports English and Vietnamese.
- Improved Experience:
    - Clearer display of messages and errors.
    - Optimized code.
`,
        },
        file: "addons/Wordle - 1.0.1.zip",
      },
    ],
  },

  // ==========================================================================================================

  {
    id: 5,
    title: {
      vi: "Hệ Thống Rơi Vật Phẩm Mob",
      en: "Mob Drop System",
    },
    description: {
      vi: "Rơi vật phẩm tùy chỉnh từ mob.",
      en: "Custome item drop from mob.",
    },
    image: "images/mob_drop/mob_drop.png",
    video: "not_Supported",
    versions: [
      {
        versionName: "1.0.1",
        releaseDate: "23/7/2025",
        title: {
          vi: "Hệ Thống Rơi Vật Phẩm Mob v1.0.1",
          en: "Mob Drop System v1.0.1",
        },
        description: {
          vi: "Addon này là một công cụ mạnh mẽ cho phép bạn tùy chỉnh và quản lý hệ thống rơi vật phẩm từ các thực thể (mob) trong thế giới Minecraft của bạn. Với addon này, bạn có toàn quyền kiểm soát những mob sẽ rơi vật phẩm gì, cách chúng rơi, và các điều kiện kích hoạt những rơi này. Hỗ trợ Minecraft Bedrock 1.21.90+.",
          en: "This addon is a powerful tool that allows you to customize and manage the item drop system from entities (mobs) within your Minecraft world. With this addon, you have full control over what mobs will drop, how they drop, and the conditions that trigger these drops. Support Minecraft Bedrock 1.21.90+.",
        },
        images: [
          {
            src: "images/mob_drop/1.0.1/create_entity.png",
            captions: {
              vi: "Tính năng mới khi tạo thực thể",
              en: "New Feature when creating entity",
            },
          },
          {
            src: "images/mob_drop/1.0.1/ui.png",
            captions: {
              vi: "Giao diện",
              en: "UI",
            },
          },
          {
            src: "images/mob_drop/1.0.1/drop.png",
            captions: {
              vi: "Giờ đây bạn có thể thêm vật phẩm, bảng điểm và lệnh để rơi từ thực thể.",
              en: "Now you can add item, scoreboear and command to drop from entity.",
            },
          },
          {
            src: "images/mob_drop/1.0.1/duplicate.png",
            captions: {
              vi: "Giờ đây bạn có thể sao chép cấu hình rơi vật phẩm từ thực thể khác.",
              en: "Duplicate Item Drop.",
            },
          },
        ],
        videos: [
          "https://www.youtube.com/embed/rMfV9m1cnH4?si=27vrTaAdnhpSBSk_",
        ],
        changelog: {
          vi: `Cập nhật Hệ Thống Rơi Vật Phẩm Mob v1.0.1 - Hỗ trợ 1.21.90+
- Cài đặt Vật phẩm Mới - Giới thiệu tùy chọn addDirectlyToInventory để kiểm soát việc thêm trực tiếp vật phẩm vào kho đồ.

- Các Loại Rơi Đa Dạng - Giờ đây hỗ trợ các loại rơi mới bao gồm vật phẩm, bảng điểm và thực thi lệnh.

- Cải thiện Xử lý Kho Đồ - Thêm chức năng ưu tiên thêm vật phẩm vào kho đồ; nếu đầy, vật phẩm sẽ rơi xuống đất.

- Nâng cao Logic Ưu Tiên Rơi - Cải thiện hệ thống ưu tiên rơi vật phẩm mob, cho phép cấu hình chi tiết hơn theo tên và thẻ.

- Tính Năng Sao Chép - Cho phép sao chép cấu hình rơi vật phẩm mob hiện có.
`,
          en: `Mob Drop v1.0.1 Update - Support 1.21.90+

- New Item Setting - Introduced addDirectlyToInventory option to control direct item addition to inventory.

- Diverse Drop Types - Now supports new drop types including items, scoreboard, and command execution.

- Improved Inventory Handling - Added a function that prioritizes adding items to inventory; if full, items will drop on the ground.

- Enhanced Drop Priority Logic - Improved the mob drop priority system, allowing more detailed configuration by name and tag.

- Duplication Feature - Enabled copying of existing mob drop configurations.
`,
        },
        file: "addons/Custom Mob Drop - 1.21.90 - 1.0.1.zip",
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
