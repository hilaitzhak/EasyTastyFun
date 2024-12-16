import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function seedData() {
  try {
    await client.connect();
    const database = client.db("recipes_app");

    // References to collections
    const categoriesCollection = database.collection("categories");
    const subCategoriesCollection = database.collection("subcategories");

    // Clear existing collections
    await categoriesCollection.drop().catch(() => console.log("No existing categories to drop"));
    await subCategoriesCollection.drop().catch(() => console.log("No existing subcategories to drop"));

    // Insert subcategories first
    const subCategoriesData = [
      { nameKey: "nav.subCategories.chocolateCakes", path: "/category/cakes/chocolate", isActive: true },
      { nameKey: "nav.subCategories.cheesecakes", path: "/category/cakes/cheese", isActive: true },
      { nameKey: "nav.subCategories.sweetDesserts", path: "/category/desserts/sweet", isActive: true },
      { nameKey: "nav.subCategories.savoryDesserts", path: "/category/desserts/savory", isActive: true },
    ];
    const subCategoriesResult = await subCategoriesCollection.insertMany(subCategoriesData);

    // Map subcategories' _id to use them in the categories collection
    const subCategoriesMap = {
      chocolateCakes: subCategoriesResult.insertedIds[0],
      cheesecakes: subCategoriesResult.insertedIds[1],
      sweetDesserts: subCategoriesResult.insertedIds[2],
      savoryDesserts: subCategoriesResult.insertedIds[3],
    };

    // Insert categories with references to subcategories
    const categoriesData = [
      {
        nameKey: "nav.allRecipes",
        path: "/recipes",
        order: 1,
        isActive: true,
      },
      {
        nameKey: "nav.cakes",
        path: "/category/cakes",
        order: 2,
        isActive: true,
        subCategories: [
          subCategoriesMap.chocolateCakes,
          subCategoriesMap.cheesecakes,
        ],
      },
      {
        nameKey: "nav.desserts",
        path: "/category/desserts",
        order: 3,
        isActive: true,
        subCategories: [
          subCategoriesMap.sweetDesserts,
          subCategoriesMap.savoryDesserts,
        ],
      },
      {
        nameKey: "nav.hotStews",
        path: "/category/stews",
        order: 4,
        isActive: true,
      },
      {
        nameKey: "nav.pasta",
        path: "/category/pasta",
        order: 5,
        isActive: true,
      },
      {
        nameKey: "nav.salads",
        path: "/category/salads",
        order: 6,
        isActive: true,
      },
    ];

    // Insert categories
    const categoriesResult = await categoriesCollection.insertMany(categoriesData);

    console.log("Subcategories inserted successfully:", subCategoriesResult.insertedCount);
    console.log("Categories inserted successfully:", categoriesResult.insertedCount);
  } finally {
    await client.close();
  }
}

seedData().catch(console.error);