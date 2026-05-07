import { sql } from "drizzle-orm";
import crypto from "crypto";
import { db } from "./index.js";
import { categories, brands, products, projects, users } from "./schema.js";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function seed() {
  console.log("🌱 Seeding database with updated categories, brands, products, projects, and users...");

  try {
    // 0. Clean old records
    console.log("Cleaning old records...");
    await db.delete(products);
    await db.delete(projects);
    await db.delete(categories);
    await db.delete(brands);
    await db.delete(users);

    // Reset ID sequences so they always restart beautifully from 1!
    console.log("Resetting ID auto-increment sequences...");
    try {
      await db.execute(sql`ALTER SEQUENCE products_id_seq RESTART WITH 1;`);
      await db.execute(sql`ALTER SEQUENCE categories_id_seq RESTART WITH 1;`);
      await db.execute(sql`ALTER SEQUENCE brands_id_seq RESTART WITH 1;`);
      await db.execute(sql`ALTER SEQUENCE projects_id_seq RESTART WITH 1;`);
      await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);
      console.log("✅ ID sequences reset successfully!");
    } catch (seqError) {
      console.warn("⚠️ Could not reset sequences (this is normal if using a different PG environment):", (seqError as Error).message);
    }

    // 1. Seed Categories
    console.log("Seeding categories...");
    const seededCategories = await db.insert(categories).values([
      {
        name: "Máy bơm nước ngưng điều hòa",
        nameEn: "Air Conditioner Condensate Pumps",
        slug: "may-bom-nuoc-ngung-dieu-hoa",
        description: "Các dòng máy bơm nước thải máy lạnh chất lượng cao của Kingpump, Hi-tech...",
        descriptionEn: "High-quality air conditioner condensate pumps from Kingpump, Hi-tech...",
      },
      {
        name: "Quạt chắn gió",
        nameEn: "Air Curtains",
        slug: "quat-chan-gio",
        description: "Quạt chắn gió ngăn thất thoát nhiệt điều hòa hãng Nedfon, Kyungjin, Nanyoo...",
        descriptionEn: "Nedfon, Kyungjin, Nanyoo air curtains to prevent cool air leakage...",
      },
      {
        name: "Quạt lạnh di động",
        nameEn: "Mobile Air Coolers",
        slug: "quat-lanh-di-dong",
        description: "Máy làm mát không khí hơi nước di động công suất lớn cho quán ăn, gia đình, nhà xưởng...",
        descriptionEn: "High-capacity mobile air coolers and evaporative coolers for restaurants, homes, workshops...",
      },
      {
        name: "Máy ĐHKK Nagakawa",
        nameEn: "Nagakawa Air Conditioners",
        slug: "may-dhkk-nagakawa",
        description: "Hệ thống điều hòa không khí chính hãng Nagakawa treo tường, âm trần, tủ đứng tiết kiệm điện...",
        descriptionEn: "Genuine Nagakawa air conditioning systems - wall-mounted, cassette, floor-standing...",
      },
      {
        name: "Máy ĐHKK Panasonic",
        nameEn: "Panasonic Air Conditioners",
        slug: "may-dhkk-panasonic",
        description: "Hệ thống điều hòa không khí cao cấp Panasonic Inverter nanoeX lọc sạch không khí diệt khuẩn...",
        descriptionEn: "Premium Panasonic Inverter air conditioning systems with nanoeX air purification...",
      }
    ]).returning();

    const [catPump, catCurtain, catCooler, catNagakawa, catPanasonic] = seededCategories;

    // 2. Seed Brands (Panasonic, Oulai, King Pump, Hitech, KoolMan, Nagakawa, Nanyoo)
    console.log("Seeding brands...");
    const seededBrands = await db.insert(brands).values([
      {
        name: "Panasonic",
        slug: "panasonic",
        description: "Thương hiệu điều hòa không khí và điện tử gia dụng hàng đầu thế giới từ Nhật Bản.",
        logo: "https://images.unsplash.com/photo-1614607248054-f2af247b9148?w=500&auto=format&fit=crop",
      },
      {
        name: "Oulai",
        slug: "oulai",
        description: "Hãng sản xuất quạt lạnh di động và máy làm mát hơi nước bền bỉ công nghệ hiện đại.",
        logo: "https://images.unsplash.com/photo-1618944847023-38aa001235f0?w=500&auto=format&fit=crop",
      },
      {
        name: "King Pump",
        slug: "king-pump",
        description: "Nhà sản xuất máy bơm nước thải điều hòa, máy bơm nước ngưng uy tín số 1 Đài Loan.",
        logo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop",
      },
      {
        name: "Hitech",
        slug: "hitech",
        description: "Thương hiệu máy bơm thoát nước ngưng máy lạnh siêu êm ái, hoạt động tin cậy.",
        logo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop",
      },
      {
        name: "KoolMan",
        slug: "koolman",
        description: "Thương hiệu điều hòa di động và thiết bị làm mát thương mại chất lượng cao.",
        logo: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&auto=format&fit=crop",
      },
      {
        name: "Nagakawa",
        slug: "nagakawa",
        description: "Tập đoàn điện lạnh gia dụng bền bỉ, uy tín hàng đầu tại thị trường Việt Nam.",
        logo: "https://images.unsplash.com/photo-1614607248054-f2af247b9148?w=500&auto=format&fit=crop",
      },
      {
        name: "Nanyoo",
        slug: "nanyoo",
        description: "Thương hiệu quạt chắn gió và quạt thông gió công nghiệp nổi tiếng thế giới.",
        logo: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop",
      }
    ]).returning();

    const [brandPanasonic, brandOulai, brandKingPump, brandHitech, brandKoolMan, brandNagakawa, brandNanyoo] = seededBrands;

    // 3. Seed Products with Category IDs, Brand IDs, Codes, Origins, Stock, Views, Slugs, shortDescription, Specs, and Sub-images
    console.log("Seeding products...");
    await db.insert(products).values([
      {
        name: "Máy Bơm Nước Ngưng Kingpump Hippo 9M",
        slug: "may-bom-nuoc-ngung-kingpump-hippo-9m",
        code: "KHP-9M",
        origin: "Đài Loan",
        shortDescription: "Bơm nước xả máy lạnh tủ đứng, áp trần công suất lớn, lực đẩy cao lên tới 9m chuyên nghiệp.",
        description: "Dòng máy bơm nước ngưng Kingpump Hippo được thiết kế đặc biệt chuyên dụng cho hệ thống điều hòa tủ đứng, điều hòa áp trần công suất lớn. Máy hoạt động hoàn toàn tự động, tự khởi động bơm khi nước xả máy lạnh dâng lên đầy bình chứa và tự ngắt khi bơm hết nước. Động cơ bền bỉ mang đến hiệu năng vận hành ổn định trong thời gian dài.",
        price: 1350000,
        brand: "King Pump",
        type: "Máy bơm",
        categoryId: catPump.id,
        brandId: brandKingPump.id,
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop", "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop"],
        isAvailable: true,
        stock: 45,
        views: 248,
        specs: {
          "Nguồn điện": "220V - 50Hz",
          "Độ cao đẩy tối đa": "9m",
          "Công suất": "70W",
          "Lưu lượng tối đa": "450 lít/giờ",
          "Trọng lượng": "1.8 kg"
        }
      },
      {
        name: "Máy Bơm Nước Ngưng Hitech Sani 12M",
        slug: "may-bom-nuoc-ngung-hitech-sani-12m",
        code: "HTS-12M",
        origin: "Hàn Quốc",
        shortDescription: "Bơm thoát nước ngưng điều hòa siêu bền, lực đẩy 12m, vận hành cực kỳ êm ái phù hợp phòng ngủ, phòng khách.",
        description: "Bơm thoát nước ngưng điều hòa Hitech Sani 12M là giải pháp tối ưu cho phòng khách và phòng ngủ yêu cầu không gian yên tĩnh tuyệt đối nhờ động cơ siêu êm ái độc quyền từ Hàn Quốc. Lực đẩy cao lên tới 12m giúp thoát nước dễ dàng qua các vị trí hộp kỹ thuật chật hẹp, gãy khúc hoặc đi trần cao.",
        price: 1100000,
        brand: "Hitech",
        type: "Máy bơm",
        categoryId: catPump.id,
        brandId: brandHitech.id,
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop", "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop"],
        isAvailable: true,
        stock: 30,
        views: 185,
        specs: {
          "Nguồn điện": "220V - 50Hz",
          "Độ cao đẩy tối đa": "12m",
          "Công suất": "100W",
          "Lưu lượng tối đa": "500 lít/giờ",
          "Độ ồn": "< 25 dB"
        }
      },
      {
        name: "Quạt Chắn Gió Nanyoo FM-1209L-2",
        slug: "quat-chan-gio-nanyoo-fm-1209l-2",
        code: "NY-1209",
        origin: "Trung Quốc",
        shortDescription: "Quạt chắn gió ngăn thất thoát hơi lạnh điều hòa độ dài 0.9m, lực gió mạnh mẽ, bền bỉ.",
        description: "Quạt chắn gió Nanyoo FM-1209L-2 được lắp đặt tại các cửa ra vào văn phòng, siêu thị, trung tâm thương mại hoặc nhà hàng. Máy tạo ra một bức tường gió vô hình ngăn cản hoàn toàn sự trao đổi nhiệt giữa không khí bên ngoài và bên trong phòng điều hòa, giúp tối ưu chi phí tiền điện và ngăn bụi bẩn, côn trùng cực kỳ hiệu quả.",
        price: 3600000,
        brand: "Nanyoo",
        type: "Quạt chắn gió",
        categoryId: catCurtain.id,
        brandId: brandNanyoo.id,
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop", "https://images.unsplash.com/photo-1621905251289-08b45d6a269e?w=500&auto=format&fit=crop"],
        isAvailable: true,
        stock: 12,
        views: 310,
        specs: {
          "Chiều dài máy": "0.9m",
          "Công suất": "160W",
          "Tốc độ gió tối đa": "15 m/s",
          "Nguồn điện": "220V - 50Hz",
          "Độ ồn": "< 48 dB"
        }
      },
      {
        name: "Quạt Lạnh Di Động Oulai OL-35",
        slug: "quat-lanh-di-dong-oulai-ol-35",
        code: "OL-35",
        origin: "Trung Quốc",
        shortDescription: "Máy làm mát hơi nước Oulai dung tích 35 lít, thích hợp cho phòng khách rộng, văn phòng và quán cafe.",
        description: "Quạt lạnh di động Oulai OL-35 ứng dụng nguyên lý bay hơi nước tự nhiên thông qua các tấm làm mát Cooling Pad hiện đại để thổi luồng gió mát mẻ, sâu lắng tương tự gió tự nhiên. Bình chứa dung tích 35 lít đáp ứng thời gian vận hành liên tục cả ngày mà không cần đổ nước nhiều lần. Thích hợp cho không gian mở.",
        price: 3200000,
        brand: "Oulai",
        type: "Quạt lạnh",
        categoryId: catCooler.id,
        brandId: brandOulai.id,
        image: "https://images.unsplash.com/photo-1618944847023-38aa001235f0?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1618944847023-38aa001235f0?w=500&auto=format&fit=crop", "https://images.unsplash.com/photo-1618944848023-38aa001235f0?w=500&auto=format&fit=crop"],
        isAvailable: true,
        stock: 25,
        views: 142,
        specs: {
          "Dung tích bình nước": "35 lít",
          "Công suất": "130W",
          "Lưu lượng gió": "3500 m3/h",
          "Diện tích làm mát": "20 - 35 m2",
          "Trọng lượng": "10.5 kg"
        }
      },
      {
        name: "Quạt Lạnh Di Động KoolMan KM-5000",
        slug: "quat-lanh-di-dong-koolman-km-5000",
        code: "KM-5000",
        origin: "Malaysia",
        shortDescription: "Máy làm mát không khí KoolMan công suất lớn, thích hợp sự kiện ngoài trời, nhà xưởng và quán ăn diện tích rộng.",
        description: "Máy làm mát không khí di động KoolMan KM-5000 sản xuất và nhập khẩu nguyên chiếc từ Malaysia với công suất thổi gió khổng lồ. Thiết bị là lựa chọn hàng đầu cho các trung tâm hội nghị, quán ăn sân vườn, xưởng sản xuất nhờ độ bền động cơ cực cao và hiệu quả giảm nhiệt nhanh từ 5 - 10 độ C trong điều kiện nhiệt độ ngoài trời gay gắt.",
        price: 4900000,
        brand: "KoolMan",
        type: "Quạt lạnh",
        categoryId: catCooler.id,
        brandId: brandKoolMan.id,
        image: "https://images.unsplash.com/photo-1618944847023-38aa001235f0?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1618944847023-38aa001235f0?w=500&auto=format&fit=crop", "https://images.unsplash.com/photo-1618944848023-38aa001235f0?w=500&auto=format&fit=crop"],
        isAvailable: true,
        stock: 8,
        views: 95,
        specs: {
          "Dung tích bình nước": "60 lít",
          "Công suất": "200W",
          "Lưu lượng gió": "5000 m3/h",
          "Diện tích làm mát": "40 - 60 m2",
          "Điều khiển từ xa": "Có"
        }
      },
      {
        name: "Máy Lạnh Âm Trần Nagakawa 3.0 HP",
        slug: "may-lanh-am-tran-nagakawa-3-0-hp",
        code: "NAG-3.0HP",
        origin: "Malaysia",
        shortDescription: "Hệ thống điều hòa không khí âm trần cassette Nagakawa công suất 3.0 HP thổi gió 360 độ làm lạnh nhanh.",
        description: "Điều hòa âm trần cassette Nagakawa 3.0 HP mang đến thiết kế âm trần sang trọng, hiện đại, tối ưu không gian thẩm mỹ cho văn phòng công ty hoặc showroom. Trang bị hệ mặt nạ đa hướng thổi 360 độ độc đáo phân bổ luồng gió lạnh đồng đều tới mọi ngóc ngách, loại bỏ hoàn toàn các vùng khí nóng cục bộ.",
        price: 24500000,
        brand: "Nagakawa",
        type: "Âm trần",
        categoryId: catNagakawa.id,
        brandId: brandNagakawa.id,
        image: "https://images.unsplash.com/photo-1614607248054-f2af247b9148?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1614607248054-f2af247b9148?w=500&auto=format&fit=crop", "https://images.unsplash.com/photo-1614607248054-f2af247b9148?w=500&auto=format&fit=crop"],
        isAvailable: true,
        stock: 15,
        views: 420,
        specs: {
          "Công suất làm lạnh": "3.0 HP (28,000 BTU)",
          "Nguồn điện": "220V - 1 Pha",
          "Môi chất lạnh": "R32",
          "Công nghệ tiết kiệm điện": "Inverter",
          "Đóng tuyết": "Không"
        }
      },
      {
        name: "Máy Lạnh Treo Tường Panasonic Inverter 1.5 HP",
        slug: "may-lanh-treo-tuong-panasonic-inverter-1-5-hp",
        code: "PAN-1.5HP",
        origin: "Thái Lan",
        shortDescription: "Điều hòa treo tường cao cấp Panasonic Inverter 1.5 HP trang bị công nghệ nanoeX lọc sạch bụi mịn và diệt khuẩn.",
        description: "Máy lạnh treo tường cao cấp Panasonic Inverter 1.5 HP đại diện cho chuẩn mực sống trong lành mới với bộ phát nanoeX phát ra hàng nghìn tỷ gốc OH gốc nước chủ động tiêu diệt vi khuẩn, virus, nấm mốc và giảm thiểu mùi hôi khó chịu trong phòng. Động cơ Inverter thế hệ mới vận hành êm ru và tiết kiệm điện chuẩn 5 Sao năng lượng.",
        price: 11500000,
        brand: "Panasonic",
        type: "Treo tường",
        categoryId: catPanasonic.id,
        brandId: brandPanasonic.id,
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&auto=format&fit=crop", "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&auto=format&fit=crop"],
        isAvailable: true,
        stock: 20,
        views: 560,
        specs: {
          "Công suất làm lạnh": "1.5 HP (12,000 BTU)",
          "Công nghệ lọc khí": "nanoeX diệt khuẩn 99%",
          "Công nghệ tiết kiệm điện": "Inverter",
          "Môi chất lạnh": "R32",
          "Hiệu suất năng lượng": "5 Sao"
        }
      }
    ]);

    // 4. Seed Projects
    console.log("Seeding projects...");
    await db.insert(projects).values([
      {
        title: "Thi Công Hệ Thống Máy Lạnh Trung Tâm VRV Daikin",
        description: "Cung cấp và lắp đặt hệ thống máy lạnh trung tâm VRV Daikin công suất lớn cho toà nhà văn phòng Etown.",
        location: "Quận Tân Bình, TP.HCM",
        year: 2025,
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop",
      },
      {
        title: "Lắp Đặt Hệ Thống Quạt Chắn Gió Nedfon",
        description: "Lắp đặt 12 bộ quạt chắn gió Nedfon tại các cửa ra vào trung tâm thương mại Aeon Mall Bình Tân.",
        location: "Quận Bình Tân, TP.HCM",
        year: 2024,
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop",
      }
    ]);

    // 5. Seed Users (Admin & Regular User)
    console.log("Seeding users...");
    await db.insert(users).values([
      {
        name: "Admin Điện Máy",
        email: "admin@dienmaytrandien.com",
        password: hashPassword("admin123"),
        role: "admin",
      },
      {
        name: "Khách Hàng Trần Điền",
        email: "user@dienmaytrandien.com",
        password: hashPassword("user123"),
        role: "user",
      }
    ]);

    console.log("✅ Seeding successfully completed with updated categories, brands, products, projects, and users!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    process.exit(0);
  }
}

seed();
