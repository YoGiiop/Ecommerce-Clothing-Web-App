import mongoose from "mongoose";
import Product from "../models/product.model.js";
import dotenv from "dotenv";

dotenv.config();

const addStockToProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Update all products that don't have a stock field
    const result = await Product.updateMany(
      { stock: { $exists: false } },
      { $set: { stock: 50 } }
    );

    console.log(`✅ Migration completed!`);
    console.log(`   - Products updated: ${result.modifiedCount}`);
    console.log(`   - Each product now has stock: 50`);

    // Show updated products count
    const totalProducts = await Product.countDocuments();
    console.log(`   - Total products in database: ${totalProducts}`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("\n✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error during migration:", error.message);
    process.exit(1);
  }
};

addStockToProducts();
