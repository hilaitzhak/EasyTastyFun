/*
 * Adds "Gluten-Free" and "Passover" categories, each with "Cakes" and "Cookies"
 * subcategories, matching the existing data model:
 *   - db.categories  : has a subCategories[] array of subcategory UUID ids
 *   - db.subcategories: joined by that UUID array
 *
 * Reuses the backend's MONGO_URI from .env and the mongoose driver — no MongoDB shell needed.
 * Idempotent: re-running skips anything that already exists (matched by path/nameKey).
 *
 * Run from the backend folder:   node src/scripts/add-glutenfree-passover-categories.js
 */
const path = require('path');
const { randomUUID } = require('node:crypto');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

async function ensureSubcategory(db, categoryId, nameKey, subPath) {
  const existing = await db.collection('subcategories').findOne({ path: subPath });
  if (existing) {
    console.log('SKIPPED subcategory (exists): ' + nameKey);
    return existing.id;
  }
  const sub = { id: randomUUID(), categoryId, nameKey, path: subPath, isActive: true };
  await db.collection('subcategories').insertOne(sub);
  console.log('ADDED subcategory: ' + nameKey + ' -> ' + subPath);
  return sub.id;
}

async function ensureCategory(db, nameKey, catPath, order, subDefs) {
  const existing = await db.collection('categories').findOne({ nameKey });
  if (existing) {
    console.log('SKIPPED category (exists): ' + nameKey);
    return;
  }
  const categoryId = randomUUID();
  const subIds = [];
  for (const s of subDefs) {
    subIds.push(await ensureSubcategory(db, categoryId, s.nameKey, s.path));
  }
  await db.collection('categories').insertOne({
    id: categoryId,
    nameKey,
    path: catPath,
    isActive: true,
    order,
    subCategories: subIds,
  });
  console.log('ADDED category: ' + nameKey + ' -> ' + catPath + ' (subcategories: ' + subIds.length + ')');
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI not found in backend/.env');
  }
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;

  await ensureCategory(db, 'nav.glutenFree', '/categories/gluten-free', 20, [
    { nameKey: 'nav.subCategories.glutenFreeCakes', path: '/categories/gluten-free/cakes' },
    { nameKey: 'nav.subCategories.glutenFreeCookies', path: '/categories/gluten-free/cookies' },
  ]);

  await ensureCategory(db, 'nav.passover', '/categories/passover', 21, [
    { nameKey: 'nav.subCategories.passoverCakes', path: '/categories/passover/cakes' },
    { nameKey: 'nav.subCategories.passoverCookies', path: '/categories/passover/cookies' },
  ]);

  console.log('\n=== Current categories ===');
  const cats = await db.collection('categories').find({}).sort({ order: 1 }).toArray();
  cats.forEach((c) =>
    console.log('  ' + c.order + '. ' + c.nameKey + ' (' + (c.subCategories ? c.subCategories.length : 0) + ' subcategories)')
  );

  await mongoose.disconnect();
  console.log('\nDone. Hard-refresh the app (the navbar caches categories in sessionStorage) to see the new menus.');
}

main().catch((err) => {
  console.error('Seeder failed:', err);
  process.exit(1);
});
