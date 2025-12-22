import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import Product from "../models/product.model.js";
import { productSeedData } from "./productSeedData.js";
import { fileURLToPath } from "url";

dotenv.config();

/* Required for ES modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ✅ CORRECT assets path (client project) */
const assetsPath = path.join(__dirname, "../../client/src/assets");

const migrateProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("✅ Cloudinary connected");

    for (const product of productSeedData) {
      /* 🛑 SAFETY CHECK */
      if (!product.imageFiles || !Array.isArray(product.imageFiles)) {
        console.error("❌ imageFiles missing for:", product.name);
        continue;
      }

      const uploadedImages = [];

      for (const fileName of product.imageFiles) {
        if (!fileName) {
          console.error(`❌ Empty image filename in ${product.name}`);
          continue;
        }

        const imagePath = path.join(assetsPath, fileName);

        if (!fs.existsSync(imagePath)) {
          console.error(`❌ Image not found: ${imagePath}`);
          continue;
        }

        const result = await cloudinary.uploader.upload(imagePath, {
          folder: "ecommerce-products",
        });

        uploadedImages.push(result.secure_url);
      }

      if (uploadedImages.length === 0) {
        console.error(`❌ No images uploaded for ${product.name}`);
        continue;
      }

      await Product.create({
        name: product.name,
        description:
          product.description && product.description.trim().length > 0
            ? product.description
            : "High-quality fashion product.",
        price: product.price,
        image: uploadedImages,
        category: product.category,
        subCategory: product.subCategory,
        sizes: product.sizes,
        bestseller: product.bestseller ?? false,
        date: Date.now(),
      });

      console.log(`✅ Inserted: ${product.name}`);
    }

    console.log("🎉 Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

migrateProducts();
