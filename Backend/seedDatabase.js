require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Import models
const User = require("./models/User");
const Transaction = require("./models/Transaction");
const Budget = require("./models/Budget");
const Category = require("./models/Category");
const TaxEstimate = require("./models/TaxEstimate");
const Report = require("./models/Report");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// Demo data
const seedData = async () => {
  try {
    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});
    await Category.deleteMany({});
    await TaxEstimate.deleteMany({});
    await Report.deleteMany({});
    console.log("✅ Existing data cleared");

    // Create demo users
    console.log("👥 Creating demo users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = await User.create([
      {
        name: "Hanika Sharma",
        email: "hanika@taxpal.com",
        password: hashedPassword,
        country: "India",
        income_bracket: "High",
        isEmailVerified: true,
      },
      {
        name: "Sairam Kumar",
        email: "sairam@taxpal.com",
        password: hashedPassword,
        country: "India",
        income_bracket: "Middle",
        isEmailVerified: true,
      },
      {
        name: "Manasvi Patel",
        email: "manasvi@taxpal.com",
        password: hashedPassword,
        country: "USA",
        income_bracket: "High",
        isEmailVerified: true,
      },
      {
        name: "Shruthe Reddy",
        email: "shruthe@taxpal.com",
        password: hashedPassword,
        country: "India",
        income_bracket: "Middle",
        isEmailVerified: true,
      },
      {
        name: "Aditya Singh",
        email: "aditya@taxpal.com",
        password: hashedPassword,
        country: "USA",
        income_bracket: "Low",
        isEmailVerified: true,
      },
    ]);
    console.log(`✅ Created ${users.length} demo users`);

    // Use first user for detailed demo data
    const demoUser = users[0];

    // Create categories
    console.log("🏷️  Creating categories...");
    const categories = await Category.create([
      // Income categories
      { userId: demoUser._id, name: "Salary", type: "income" },
      { userId: demoUser._id, name: "Freelance", type: "income" },
      { userId: demoUser._id, name: "Investment Returns", type: "income" },
      { userId: demoUser._id, name: "Rental Income", type: "income" },
      { userId: demoUser._id, name: "Business Income", type: "income" },
      
      // Expense categories
      { userId: demoUser._id, name: "Groceries", type: "expense" },
      { userId: demoUser._id, name: "Rent", type: "expense" },
      { userId: demoUser._id, name: "Utilities", type: "expense" },
      { userId: demoUser._id, name: "Transportation", type: "expense" },
      { userId: demoUser._id, name: "Entertainment", type: "expense" },
      { userId: demoUser._id, name: "Healthcare", type: "expense" },
      { userId: demoUser._id, name: "Education", type: "expense" },
      { userId: demoUser._id, name: "Shopping", type: "expense" },
      { userId: demoUser._id, name: "Dining Out", type: "expense" },
      { userId: demoUser._id, name: "Insurance", type: "expense" },
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // Create income transactions
    console.log("💰 Creating income transactions...");
    const incomeTransactions = await Transaction.create([
      {
        userId: demoUser._id,
        type: "income",
        description: "Monthly Salary - January",
        amount: 75000,
        category: "Salary",
        date: new Date("2026-01-05"),
        notes: "Regular monthly salary payment",
      },
      {
        userId: demoUser._id,
        type: "income",
        description: "Monthly Salary - February",
        amount: 75000,
        category: "Salary",
        date: new Date("2026-02-05"),
        notes: "Regular monthly salary payment",
      },
      {
        userId: demoUser._id,
        type: "income",
        description: "Website Development Project",
        amount: 35000,
        category: "Freelance",
        date: new Date("2026-01-15"),
        notes: "Client project completion payment",
      },
      {
        userId: demoUser._id,
        type: "income",
        description: "Mobile App Development",
        amount: 45000,
        category: "Freelance",
        date: new Date("2026-02-10"),
        notes: "Freelance project milestone payment",
      },
      {
        userId: demoUser._id,
        type: "income",
        description: "Stock Dividends",
        amount: 8500,
        category: "Investment Returns",
        date: new Date("2026-01-20"),
        notes: "Quarterly dividend payout",
      },
      {
        userId: demoUser._id,
        type: "income",
        description: "Apartment Rent Received",
        amount: 25000,
        category: "Rental Income",
        date: new Date("2026-01-01"),
        notes: "Monthly rent from tenant",
      },
      {
        userId: demoUser._id,
        type: "income",
        description: "Apartment Rent Received",
        amount: 25000,
        category: "Rental Income",
        date: new Date("2026-02-01"),
        notes: "Monthly rent from tenant",
      },
      {
        userId: demoUser._id,
        type: "income",
        description: "Consulting Services",
        amount: 15000,
        category: "Business Income",
        date: new Date("2026-02-15"),
        notes: "Business consulting payment",
      },
    ]);
    console.log(`✅ Created ${incomeTransactions.length} income transactions`);

    // Create expense transactions
    console.log("💸 Creating expense transactions...");
    const expenseTransactions = await Transaction.create([
      {
        userId: demoUser._id,
        type: "expense",
        description: "Monthly Grocery Shopping",
        amount: 8500,
        category: "Groceries",
        date: new Date("2026-01-10"),
        notes: "Supermarket monthly stock",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Weekly Groceries",
        amount: 3200,
        category: "Groceries",
        date: new Date("2026-02-08"),
        notes: "Fresh vegetables and fruits",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "House Rent - January",
        amount: 20000,
        category: "Rent",
        date: new Date("2026-01-01"),
        notes: "Monthly rent payment",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "House Rent - February",
        amount: 20000,
        category: "Rent",
        date: new Date("2026-02-01"),
        notes: "Monthly rent payment",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Electricity Bill",
        amount: 2500,
        category: "Utilities",
        date: new Date("2026-01-15"),
        notes: "Monthly electricity payment",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Internet & Phone Bill",
        amount: 1500,
        category: "Utilities",
        date: new Date("2026-01-20"),
        notes: "Broadband and mobile",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Fuel & Transportation",
        amount: 4500,
        category: "Transportation",
        date: new Date("2026-01-12"),
        notes: "Monthly commute expenses",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Uber Rides",
        amount: 1200,
        category: "Transportation",
        date: new Date("2026-02-05"),
        notes: "Weekend rides",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Movie Tickets",
        amount: 800,
        category: "Entertainment",
        date: new Date("2026-01-18"),
        notes: "Weekend entertainment",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Streaming Subscriptions",
        amount: 1500,
        category: "Entertainment",
        date: new Date("2026-02-01"),
        notes: "Netflix, Spotify, Prime",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Doctor Consultation",
        amount: 1500,
        category: "Healthcare",
        date: new Date("2026-01-25"),
        notes: "Regular checkup",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Medicines",
        amount: 800,
        category: "Healthcare",
        date: new Date("2026-02-12"),
        notes: "Monthly medications",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Online Course",
        amount: 5000,
        category: "Education",
        date: new Date("2026-01-08"),
        notes: "Professional development course",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Clothing Shopping",
        amount: 6500,
        category: "Shopping",
        date: new Date("2026-01-22"),
        notes: "New winter clothes",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Electronics - Headphones",
        amount: 3500,
        category: "Shopping",
        date: new Date("2026-02-18"),
        notes: "Noise cancelling headphones",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Restaurant Dinner",
        amount: 2500,
        category: "Dining Out",
        date: new Date("2026-01-28"),
        notes: "Family dinner",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Lunch Meetings",
        amount: 1800,
        category: "Dining Out",
        date: new Date("2026-02-14"),
        notes: "Client meetings",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Health Insurance Premium",
        amount: 3500,
        category: "Insurance",
        date: new Date("2026-01-05"),
        notes: "Monthly health insurance",
      },
      {
        userId: demoUser._id,
        type: "expense",
        description: "Car Insurance",
        amount: 2000,
        category: "Insurance",
        date: new Date("2026-02-10"),
        notes: "Vehicle insurance payment",
      },
    ]);
    console.log(`✅ Created ${expenseTransactions.length} expense transactions`);

    // Create budgets
    console.log("📊 Creating budgets...");
    const budgets = await Budget.create([
      {
        userId: demoUser._id,
        category: "Groceries",
        amount: 15000,
        month: "2026-02",
        description: "Monthly grocery budget",
      },
      {
        userId: demoUser._id,
        category: "Rent",
        amount: 20000,
        month: "2026-02",
        description: "Housing rent",
      },
      {
        userId: demoUser._id,
        category: "Utilities",
        amount: 5000,
        month: "2026-02",
        description: "Electricity, water, internet",
      },
      {
        userId: demoUser._id,
        category: "Transportation",
        amount: 6000,
        month: "2026-02",
        description: "Fuel and commute",
      },
      {
        userId: demoUser._id,
        category: "Entertainment",
        amount: 3000,
        month: "2026-02",
        description: "Movies, subscriptions",
      },
      {
        userId: demoUser._id,
        category: "Healthcare",
        amount: 3000,
        month: "2026-02",
        description: "Medical expenses",
      },
      {
        userId: demoUser._id,
        category: "Dining Out",
        amount: 5000,
        month: "2026-02",
        description: "Restaurant and food delivery",
      },
      {
        userId: demoUser._id,
        category: "Shopping",
        amount: 8000,
        month: "2026-02",
        description: "Clothing and electronics",
      },
    ]);
    console.log(`✅ Created ${budgets.length} budgets`);

    // Create tax estimates
    console.log("🧮 Creating tax estimates...");
    const taxEstimates = await TaxEstimate.create([
      {
        user_id: demoUser._id,
        quarter: "Q1",
        estimated_tax: 45000,
        country: "India",
      },
      {
        user_id: demoUser._id,
        quarter: "Q4",
        estimated_tax: 42000,
        country: "India",
      },
      {
        user_id: users[2]._id,
        quarter: "Q1",
        estimated_tax: 12500,
        country: "USA",
      },
    ]);
    console.log(`✅ Created ${taxEstimates.length} tax estimates`);

    // Create sample reports
    console.log("📄 Creating sample reports...");
    const reports = await Report.create([
      {
        userId: demoUser._id,
        reportType: "Expense Summary",
        period: "Last Month",
        format: "PDF",
        fileName: "Expense_Summary_1708560000000.pdf",
      },
      {
        userId: demoUser._id,
        reportType: "Income Summary",
        period: "This Month",
        format: "CSV",
        fileName: "Income_Summary_1708646400000.csv",
      },
      {
        userId: demoUser._id,
        reportType: "Overall Summary",
        period: "Last 3 Months",
        format: "PDF",
        fileName: "Overall_Summary_1708732800000.pdf",
      },
    ]);
    console.log(`✅ Created ${reports.length} sample reports`);

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log("\n📊 Summary:");
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🏷️  Categories: ${categories.length}`);
    console.log(`   💰 Income Transactions: ${incomeTransactions.length}`);
    console.log(`   💸 Expense Transactions: ${expenseTransactions.length}`);
    console.log(`   📊 Budgets: ${budgets.length}`);
    console.log(`   🧮 Tax Estimates: ${taxEstimates.length}`);
    console.log(`   📄 Reports: ${reports.length}`);
    console.log("\n🔐 Demo Login Credentials:");
    console.log("   Email: hanika@taxpal.com");
    console.log("   Password: password123");
    console.log("\n   (All demo users use the same password)");
    console.log("=".repeat(50) + "\n");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};

// Run the seed script
const runSeed = async () => {
  try {
    await connectDB();
    await seedData();
    console.log("✅ Closing database connection...");
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed script failed:", error);
    process.exit(1);
  }
};

runSeed();
