import { db } from "./index.js";
import { products, projects } from "./schema.js";
async function seed() {
    console.log("🌱 Seeding database...");
    try {
        // 1. Seed Products
        console.log("Seeding products...");
        await db.insert(products).values([
            {
                name: "Máy Bơm Nước Ngưng Kingpump Hippo 9M",
                description: "Máy bơm nước ngưng công suất lớn chuyên dùng cho điều hòa tủ đứng, áp trần.",
                price: 1350000,
                brand: "Kingpump",
                type: "Máy bơm",
                image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop",
                isAvailable: true,
            },
            {
                name: "Quạt Chắn Gió Nedfon FM3512DY",
                description: "Quạt chắn gió ngăn thất thoát nhiệt điều hòa dài 1.2 mét cho cửa hàng, văn phòng.",
                price: 4200000,
                brand: "Nedfon",
                type: "Quạt chắn gió",
                image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop",
                isAvailable: true,
            },
            {
                name: "Máy Lạnh Treo Tường Panasonic Inverter 1.5 HP",
                description: "Điều hòa không khí tiết kiệm điện năng thế hệ mới nanoeX diệt khuẩn.",
                price: 11500000,
                brand: "Panasonic",
                type: "Treo tường",
                image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&auto=format&fit=crop",
                isAvailable: true,
            },
            {
                name: "Máy Lạnh Âm Trần Nagakawa 3.0 HP",
                description: "Điều hòa âm trần cassette 360 độ thổi gió mát đồng đều diện tích lớn.",
                price: 24500000,
                brand: "Nagakawa",
                type: "Âm trần",
                image: "https://images.unsplash.com/photo-1614607248054-f2af247b9148?w=500&auto=format&fit=crop",
                isAvailable: true,
            }
        ]);
        // 2. Seed Projects
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
        console.log("✅ Seeding successfully completed!");
    }
    catch (error) {
        console.error("❌ Seeding failed:", error);
    }
    finally {
        process.exit(0);
    }
}
seed();
