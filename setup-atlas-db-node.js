// ============================================================
// WashFlow Microservices — MongoDB Atlas Database Setup (Node.js)
// ============================================================
// Creates 3 databases on your Atlas cluster:
//   1. washflow_users   → users               (user-auth-service)
//   2. washflow_catalog → laundry_services     (laundry-service)
//   3. washflow_orders  → orders               (order-pickup-service)
// ============================================================

const { MongoClient } = require("mongodb");

// Direct connection string (bypasses SRV DNS lookup issues with local network)
const ATLAS_URI =
    "mongodb://buddhika:tTafUEkZ84qyRK85@ac-bprxfbz-shard-00-00.ysbgvyo.mongodb.net:27017,ac-bprxfbz-shard-00-01.ysbgvyo.mongodb.net:27017,ac-bprxfbz-shard-00-02.ysbgvyo.mongodb.net:27017/?ssl=true&replicaSet=atlas-m1fuf4-shard-0&authSource=admin&appName=Cluster0";

async function setup() {
    const client = new MongoClient(ATLAS_URI);

    try {
        await client.connect();
        console.log("✔ Connected to MongoDB Atlas\n");

        // ───────────────────────────────────────
        // 1. washflow_users — user-auth-service
        // ───────────────────────────────────────
        console.log(">>> Setting up database: washflow_users");
        const usersDb = client.db("washflow_users");

        // Drop existing collection if present
        const usersCols = await usersDb.listCollections({ name: "users" }).toArray();
        if (usersCols.length > 0) {
            await usersDb.dropCollection("users");
            console.log("    Dropped existing 'users' collection.");
        }

        // Create collection with schema validation
        await usersDb.createCollection("users", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["name", "email", "password", "createdAt"],
                    properties: {
                        name: { bsonType: "string", description: "Full name of the user" },
                        email: { bsonType: "string", description: "Email address — must be unique" },
                        password: { bsonType: "string", description: "Hashed password" },
                        createdAt: { bsonType: "date", description: "Account creation timestamp" },
                    },
                },
            },
            validationLevel: "moderate",
            validationAction: "warn",
        });
        console.log("    ✔ Created 'users' collection with schema validation.");

        // Unique index on email (matches @Indexed(unique=true) in User.java)
        await usersDb.collection("users").createIndex({ email: 1 }, { unique: true, name: "idx_email_unique" });
        console.log("    ✔ Created unique index on 'email'.");

        // Sample data
        await usersDb.collection("users").insertMany([
            { name: "Sajini Perera", email: "sajini@washflow.lk", password: "$2a$10$hashedPasswordExample1", createdAt: new Date() },
            { name: "Buddhika Silva", email: "buddhika@washflow.lk", password: "$2a$10$hashedPasswordExample2", createdAt: new Date() },
        ]);
        console.log("    ✔ Inserted 2 sample users.\n");

        // ───────────────────────────────────────
        // 2. washflow_catalog — laundry-service
        // ───────────────────────────────────────
        console.log(">>> Setting up database: washflow_catalog");
        const catalogDb = client.db("washflow_catalog");

        const laundryCols = await catalogDb.listCollections({ name: "laundry_services" }).toArray();
        if (laundryCols.length > 0) {
            await catalogDb.dropCollection("laundry_services");
            console.log("    Dropped existing 'laundry_services' collection.");
        }

        await catalogDb.createCollection("laundry_services", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["name", "price", "estimatedMinutes", "createdAt"],
                    properties: {
                        name: { bsonType: "string", description: "Laundry service name" },
                        description: { bsonType: "string", description: "Service description" },
                        price: { bsonType: "double", description: "Service price (>= 0)" },
                        estimatedMinutes: { bsonType: "int", description: "Duration in minutes (>= 1)" },
                        createdAt: { bsonType: "date", description: "Record creation timestamp" },
                    },
                },
            },
            validationLevel: "moderate",
            validationAction: "warn",
        });
        console.log("    ✔ Created 'laundry_services' collection with schema validation.");

        await catalogDb.collection("laundry_services").createIndex({ name: 1 }, { name: "idx_service_name" });
        console.log("    ✔ Created index on 'name'.");
        await catalogDb.collection("laundry_services").createIndex({ price: 1 }, { name: "idx_service_price" });
        console.log("    ✔ Created index on 'price'.");

        // Sample laundry services
        const services = await catalogDb.collection("laundry_services").insertMany([
            { name: "Wash & Fold", description: "Standard washing and folding service for everyday clothes", price: 500.0, estimatedMinutes: 60, createdAt: new Date() },
            { name: "Dry Cleaning", description: "Professional dry cleaning for delicate fabrics and formal wear", price: 1200.0, estimatedMinutes: 120, createdAt: new Date() },
            { name: "Ironing Only", description: "Steam ironing service for pre-washed garments", price: 300.0, estimatedMinutes: 30, createdAt: new Date() },
            { name: "Premium Wash", description: "Premium wash with fabric softener and stain removal treatment", price: 800.0, estimatedMinutes: 90, createdAt: new Date() },
            { name: "Express Wash", description: "Quick turnaround wash and fold — 30-minute guaranteed", price: 750.0, estimatedMinutes: 30, createdAt: new Date() },
        ]);
        console.log("    ✔ Inserted 5 sample laundry services.\n");

        // ───────────────────────────────────────
        // 3. washflow_orders — order-pickup-service
        // ───────────────────────────────────────
        console.log(">>> Setting up database: washflow_orders");
        const ordersDb = client.db("washflow_orders");

        const ordersCols = await ordersDb.listCollections({ name: "orders" }).toArray();
        if (ordersCols.length > 0) {
            await ordersDb.dropCollection("orders");
            console.log("    Dropped existing 'orders' collection.");
        }

        await ordersDb.createCollection("orders", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["serviceId", "serviceName", "weightKg", "pickupDate", "address", "status", "userId", "createdAt"],
                    properties: {
                        serviceId: { bsonType: "string", description: "Reference to laundry service ID" },
                        serviceName: { bsonType: "string", description: "Name of the selected service" },
                        weightKg: { bsonType: "double", description: "Weight in kilograms (> 0)" },
                        pickupDate: { bsonType: "string", description: "Pickup date (yyyy-MM-dd)" },
                        address: { bsonType: "string", description: "Pickup address" },
                        status: {
                            bsonType: "string",
                            enum: ["ORDER_PLACED", "PICKED_UP", "IN_PROGRESS", "READY", "DELIVERED", "CANCELLED"],
                            description: "Order status",
                        },
                        userId: { bsonType: "string", description: "Reference to the user who placed the order" },
                        createdAt: { bsonType: "date", description: "Order creation timestamp" },
                    },
                },
            },
            validationLevel: "moderate",
            validationAction: "warn",
        });
        console.log("    ✔ Created 'orders' collection with schema validation.");

        await ordersDb.collection("orders").createIndex({ userId: 1 }, { name: "idx_order_userId" });
        console.log("    ✔ Created index on 'userId'.");
        await ordersDb.collection("orders").createIndex({ status: 1 }, { name: "idx_order_status" });
        console.log("    ✔ Created index on 'status'.");
        await ordersDb.collection("orders").createIndex({ userId: 1, status: 1 }, { name: "idx_order_userId_status" });
        console.log("    ✔ Created compound index on 'userId' + 'status'.");
        await ordersDb.collection("orders").createIndex({ pickupDate: 1 }, { name: "idx_order_pickupDate" });
        console.log("    ✔ Created index on 'pickupDate'.");

        // Sample orders (referencing sample user and service)
        const sampleUser = await usersDb.collection("users").findOne({ email: "sajini@washflow.lk" });
        const sampleService = await catalogDb.collection("laundry_services").findOne({ name: "Wash & Fold" });

        await ordersDb.collection("orders").insertMany([
            {
                serviceId: sampleService._id.toString(),
                serviceName: "Wash & Fold",
                weightKg: 3.5,
                pickupDate: "2026-08-15",
                address: "123 Galle Road, Colombo 03",
                status: "ORDER_PLACED",
                userId: sampleUser._id.toString(),
                createdAt: new Date(),
            },
            {
                serviceId: sampleService._id.toString(),
                serviceName: "Wash & Fold",
                weightKg: 2.0,
                pickupDate: "2026-08-16",
                address: "45 Temple Lane, Kandy",
                status: "PICKED_UP",
                userId: sampleUser._id.toString(),
                createdAt: new Date(),
            },
        ]);
        console.log("    ✔ Inserted 2 sample orders.\n");

        // ─────────────────────────────────────
        // Summary
        // ─────────────────────────────────────
        console.log("=========================================");
        console.log("  ✅  Setup Complete!");
        console.log("=========================================\n");
        console.log("  Databases & Collections created:\n");
        console.log("  ┌────────────────────┬─────────────────────┬───────────────────────┐");
        console.log("  │ Database           │ Collection          │ Microservice          │");
        console.log("  ├────────────────────┼─────────────────────┼───────────────────────┤");
        console.log("  │ washflow_users     │ users               │ user-auth-service     │");
        console.log("  │ washflow_catalog   │ laundry_services    │ laundry-service       │");
        console.log("  │ washflow_orders    │ orders              │ order-pickup-service  │");
        console.log("  └────────────────────┴─────────────────────┴───────────────────────┘\n");
        console.log("  Each database stores ONLY data related to its own microservice.");
        console.log("  Your .env connection strings are already configured correctly.\n");

    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    } finally {
        await client.close();
        console.log("Connection closed.");
    }
}

setup();
