import dotenv from "dotenv";
import { MongoClient } from 'mongodb';

dotenv.config();
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function seedCategories() {
  try {
    await client.connect();
    const database = client.db("recipes_app");
    const categories = database.collection("categories");

    // Clear existing categories
    await categories.drop().catch(() => console.log('No existing categories to drop'));

    // Insert new categories
    const result = await categories.insertMany([
      {
        nameKey: "nav.allRecipes",
        path: "/recipes",
        order: 1,
        isActive: true
      },
      {
        nameKey: "nav.cakes",
        path: "/category/cakes",
        order: 2,
        isActive: true,
        subCategories: [
          {
            nameKey: "nav.subCategories.birthdayCakes",
            path: "/category/cakes/birthday",
            isActive: true
          },
          {
            nameKey: "nav.subCategories.weddingCakes",
            path: "/category/cakes/wedding",
            isActive: true
          }
        ]
      },
      {
        nameKey: "nav.desserts",
        path: "/category/desserts",
        order: 3,
        isActive: true,
        subCategories: [
          {
            nameKey: "nav.subCategories.cookies",
            path: "/category/desserts/cookies",
            isActive: true
          },
          {
            nameKey: "nav.subCategories.pies",
            path: "/category/desserts/pies",
            isActive: true
          }
        ]
      },
      {
        nameKey: "nav.hotStews",
        path: "/category/stews",
        order: 4,
        isActive: true
      },
      {
        nameKey: "nav.pasta",
        path: "/category/pasta",
        order: 5,
        isActive: true
      },
      {
        nameKey: "nav.salads",
        path: "/category/salads",
        order: 6,
        isActive: true
      }
    ]);

    console.log('Categories inserted successfully!');
    console.log('Inserted documents:', result.insertedCount);

  } finally {
    await client.close();
  }
}

seedCategories().catch(console.error);