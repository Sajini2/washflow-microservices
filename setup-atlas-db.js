// ============================================================
// WashFlow Microservices — MongoDB Atlas Database Setup Script
// ============================================================
// This script creates 3 separate databases on your Atlas cluster,
// each storing data related to a specific microservice:
//
//   1. washflow_users   → users collection       (user-auth-service)
//   2. washflow_catalog → laundry_services coll.  (laundry-service)
//   3. washflow_orders  → orders collection       (order-pickup-service)
//
// Run with:  mongosh "mongodb+srv://<user>:<pass>@cluster0.ysbgvyo.mongodb.net" setup-atlas-db.js
// ============================================================

print("=========================================");
print("  WashFlow — MongoDB Atlas DB Setup");
print("=========================================\n");

// ─────────────────────────────────────────────
// 1. DATABASE: washflow_users
//    Service : user-auth-service (port 8081)
//    Purpose : Stores user accounts & auth data
// ─────────────────────────────────────────────
print(">>> Setting up database: washflow_users");
const usersDb = db.getSiblingDB("washflow_users");

// Drop existing collection if it exists (fresh setup)
usersDb.getCollectionNames().forEach(function (col) {
    if (col === "users") {
        usersDb.users.drop();
        print("    Dropped existing 'users' collection.");
    }
});

// Create 'users' collection with JSON Schema validation
usersDb.createCollection("users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "email", "password", "createdAt"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "Auto-generated document ID"
                },
                name: {
                    bsonType: "string",
                    description: "Full name of the user — required"
                },
                email: {
                    bsonType: "string",
                    pattern: "^.+@.+\\..+$",
                    description: "Email address — required, must be unique"
                },
                password: {
                    bsonType: "string",
                    description: "Hashed password — required"
                },
                createdAt: {
                    bsonType: "date",
                    description: "Account creation timestamp — required"
                }
            }
        }
    },
    validationLevel: "moderate",
    validationAction: "warn"
});
print("    ✔ Created 'users' collection with schema validation.");

// Create unique index on email (matches @Indexed(unique=true) in User.java)
usersDb.users.createIndex({ email: 1 }, { unique: true, name: "idx_email_unique" });
print("    ✔ Created unique index on 'email'.");

// Insert sample user data
usersDb.users.insertMany([
    {
        name: "Sajini Perera",
        email: "sajini@washflow.lk",
        password: "$2a$10$exampleHashedPassword1234567890abcdef",
        createdAt: new Date()
    },
    {
        name: "Buddhika Silva",
        email: "buddhika@washflow.lk",
        password: "$2a$10$exampleHashedPassword0987654321fedcba",
        createdAt: new Date()
    }
]);
print("    ✔ Inserted 2 sample users.\n");


// ─────────────────────────────────────────────
// 2. DATABASE: washflow_catalog
//    Service : laundry-service (port 8082)
//    Purpose : Stores laundry service catalog
// ─────────────────────────────────────────────
print(">>> Setting up database: washflow_catalog");
const catalogDb = db.getSiblingDB("washflow_catalog");

catalogDb.getCollectionNames().forEach(function (col) {
    if (col === "laundry_services") {
        catalogDb.laundry_services.drop();
        print("    Dropped existing 'laundry_services' collection.");
    }
});

// Create 'laundry_services' collection with JSON Schema validation
catalogDb.createCollection("laundry_services", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "price", "estimatedMinutes", "createdAt"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "Auto-generated document ID"
                },
                name: {
                    bsonType: "string",
                    description: "Laundry service name — required"
                },
                description: {
                    bsonType: "string",
                    description: "Service description — optional"
                },
                price: {
                    bsonType: "double",
                    minimum: 0,
                    description: "Service price — required, must be >= 0"
                },
                estimatedMinutes: {
                    bsonType: "int",
                    minimum: 1,
                    description: "Estimated duration in minutes — required, must be >= 1"
                },
                createdAt: {
                    bsonType: "date",
                    description: "Record creation timestamp — required"
                }
            }
        }
    },
    validationLevel: "moderate",
    validationAction: "warn"
});
print("    ✔ Created 'laundry_services' collection with schema validation.");

// Create index on name for fast catalog lookups
catalogDb.laundry_services.createIndex({ name: 1 }, { name: "idx_service_name" });
print("    ✔ Created index on 'name'.");

// Create index on price for sorting/filtering by price
catalogDb.laundry_services.createIndex({ price: 1 }, { name: "idx_service_price" });
print("    ✔ Created index on 'price'.");

// Insert sample laundry services
catalogDb.laundry_services.insertMany([
    {
        name: "Wash & Fold",
        description: "Standard washing and folding service for everyday clothes",
        price: 500.0,
        estimatedMinutes: NumberInt(60),
        createdAt: new Date()
    },
    {
        name: "Dry Cleaning",
        description: "Professional dry cleaning for delicate fabrics and formal wear",
        price: 1200.0,
        estimatedMinutes: NumberInt(120),
        createdAt: new Date()
    },
    {
        name: "Ironing Only",
        description: "Steam ironing service for pre-washed garments",
        price: 300.0,
        estimatedMinutes: NumberInt(30),
        createdAt: new Date()
    },
    {
        name: "Premium Wash",
        description: "Premium wash with fabric softener and stain removal treatment",
        price: 800.0,
        estimatedMinutes: NumberInt(90),
        createdAt: new Date()
    },
    {
        name: "Express Wash",
        description: "Quick turnaround wash and fold — 30-minute guaranteed",
        price: 750.0,
        estimatedMinutes: NumberInt(30),
        createdAt: new Date()
    }
]);
print("    ✔ Inserted 5 sample laundry services.\n");


// ─────────────────────────────────────────────
// 3. DATABASE: washflow_orders
//    Service : order-pickup-service (port 8083)
//    Purpose : Stores customer pickup orders
// ─────────────────────────────────────────────
print(">>> Setting up database: washflow_orders");
const ordersDb = db.getSiblingDB("washflow_orders");

ordersDb.getCollectionNames().forEach(function (col) {
    if (col === "orders") {
        ordersDb.orders.drop();
        print("    Dropped existing 'orders' collection.");
    }
});

// Create 'orders' collection with JSON Schema validation
ordersDb.createCollection("orders", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["serviceId", "serviceName", "weightKg", "pickupDate", "address", "status", "userId", "createdAt"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "Auto-generated document ID"
                },
                serviceId: {
                    bsonType: "string",
                    description: "Reference to laundry service ID — required"
                },
                serviceName: {
                    bsonType: "string",
                    description: "Name of the selected service — required"
                },
                weightKg: {
                    bsonType: "double",
                    minimum: 0.1,
                    description: "Weight in kilograms — required, must be > 0"
                },
                pickupDate: {
                    bsonType: "string",
                    description: "Pickup date in ISO format (yyyy-MM-dd) — required"
                },
                address: {
                    bsonType: "string",
                    description: "Pickup address — required"
                },
                status: {
                    bsonType: "string",
                    enum: ["ORDER_PLACED", "PICKED_UP", "IN_PROGRESS", "READY", "DELIVERED", "CANCELLED"],
                    description: "Order status — required, must be one of the allowed values"
                },
                userId: {
                    bsonType: "string",
                    description: "Reference to the user who placed the order — required"
                },
                createdAt: {
                    bsonType: "date",
                    description: "Order creation timestamp — required"
                }
            }
        }
    },
    validationLevel: "moderate",
    validationAction: "warn"
});
print("    ✔ Created 'orders' collection with schema validation.");

// Create index on userId for fetching user's orders
ordersDb.orders.createIndex({ userId: 1 }, { name: "idx_order_userId" });
print("    ✔ Created index on 'userId'.");

// Create index on status for filtering orders by status
ordersDb.orders.createIndex({ status: 1 }, { name: "idx_order_status" });
print("    ✔ Created index on 'status'.");

// Create compound index on userId + status (common query pattern)
ordersDb.orders.createIndex({ userId: 1, status: 1 }, { name: "idx_order_userId_status" });
print("    ✔ Created compound index on 'userId' + 'status'.");

// Create index on pickupDate for date-range queries
ordersDb.orders.createIndex({ pickupDate: 1 }, { name: "idx_order_pickupDate" });
print("    ✔ Created index on 'pickupDate'.");

// Insert sample orders
const sampleUserId = usersDb.users.findOne({ email: "sajini@washflow.lk" })._id.toString();
const sampleServiceId = catalogDb.laundry_services.findOne({ name: "Wash & Fold" })._id.toString();

ordersDb.orders.insertMany([
    {
        serviceId: sampleServiceId,
        serviceName: "Wash & Fold",
        weightKg: 3.5,
        pickupDate: "2026-08-15",
        address: "123 Galle Road, Colombo 03",
        status: "ORDER_PLACED",
        userId: sampleUserId,
        createdAt: new Date()
    },
    {
        serviceId: sampleServiceId,
        serviceName: "Wash & Fold",
        weightKg: 2.0,
        pickupDate: "2026-08-16",
        address: "45 Temple Lane, Kandy",
        status: "PICKED_UP",
        userId: sampleUserId,
        createdAt: new Date()
    }
]);
print("    ✔ Inserted 2 sample orders.\n");


// ─────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────
print("=========================================");
print("  ✅  Setup Complete!  ");
print("=========================================");
print("");
print("  Databases created:");
print("  ┌────────────────────┬─────────────────────┬───────────────────────┐");
print("  │ Database           │ Collection          │ Microservice          │");
print("  ├────────────────────┼─────────────────────┼───────────────────────┤");
print("  │ washflow_users     │ users               │ user-auth-service     │");
print("  │ washflow_catalog   │ laundry_services    │ laundry-service       │");
print("  │ washflow_orders    │ orders              │ order-pickup-service  │");
print("  └────────────────────┴─────────────────────┴───────────────────────┘");
print("");
print("  Each database is isolated to store only its service's data.");
print("  Connection strings in your .env are already configured correctly.");
print("");
