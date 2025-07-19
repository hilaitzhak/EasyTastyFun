#!/bin/bash

# MongoDB Add Cake Subcategories Script
# This script adds cake subcategories with proper UUID generation

# Configuration
DB_NAME="recipes_app"
MONGO_URI="mongodb+srv://hila87219:Aa123456@cluster0.wgfux.mongodb.net/recipes_app"

echo "Starting MongoDB cake subcategories addition script"
echo "Database: $DB_NAME"
echo "URI: $MONGO_URI"
echo ""

# Check if mongosh is available, fallback to mongo
if command -v mongosh &> /dev/null; then
    MONGO_CLIENT="mongosh"
    echo "Using mongosh (MongoDB Shell)"
elif command -v mongo &> /dev/null; then
    MONGO_CLIENT="mongo"
    echo "Using mongo (Legacy MongoDB Shell)"
else
    echo "Error: Neither mongosh nor mongo command found!"
    echo "Please install MongoDB Shell first."
    exit 1
fi

# MongoDB script to add subcategories
mongo_script="
use $DB_NAME;

// Function to generate UUID (simple version)
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// First, find the cakes category
var cakesCategory = db.categories.findOne({nameKey: 'nav.cakes'});

if (!cakesCategory) {
    print('Error: Cakes category not found!');
    quit(1);
}

print('Found cakes category with ID: ' + cakesCategory._id);
print('');

// Define the subcategories to add with manual UUID generation
var subcategoriesToAdd = [
    {
        id: generateUUID(),
        nameKey: 'nav.subCategories.carrotCake',
        path: '/categories/cakes/carrot',
        categoryId: cakesCategory._id,
        isActive: true
    },
    {
        id: generateUUID(),
        nameKey: 'nav.subCategories.appleCake',
        path: '/categories/cakes/apple',
        categoryId: cakesCategory._id,
        isActive: true
    },
    {
        id: generateUUID(),
        nameKey: 'nav.subCategories.lemonCake',
        path: '/categories/cakes/lemon',
        categoryId: cakesCategory._id,
        isActive: true
    },
    {
        id: generateUUID(),
        nameKey: 'nav.subCategories.poppySeedCake',
        path: '/categories/cakes/poppy-seed',
        categoryId: cakesCategory._id,
        isActive: true
    },
    {
        id: generateUUID(),
        nameKey: 'nav.subCategories.shortcrustPastryCakes',
        path: '/categories/cakes/shortcrust-pastry',
        categoryId: cakesCategory._id,
        isActive: true
    }
];

print('Adding ' + subcategoriesToAdd.length + ' subcategories...');
print('');

var addedCount = 0;
var skippedCount = 0;
var errorCount = 0;

subcategoriesToAdd.forEach(function(subcat) {
    // Check if subcategory already exists
    var existing = db.subcategories.findOne({nameKey: subcat.nameKey});
    
    if (existing) {
        print('SKIPPED: ' + subcat.nameKey + ' (already exists)');
        skippedCount++;
    } else {
        try {
            // Add the subcategory
            var result = db.subcategories.insertOne(subcat);
            
            if (result.acknowledged) {
                print('ADDED: ' + subcat.nameKey + ' -> ' + subcat.path + ' (ID: ' + subcat.id + ')');
                addedCount++;
            } else {
                print('ERROR: Failed to add ' + subcat.nameKey);
                errorCount++;
            }
        } catch (error) {
            print('EXCEPTION adding ' + subcat.nameKey + ': ' + error.message);
            errorCount++;
        }
    }
});

print('');
print('=== SUMMARY ===');
print('Total subcategories processed: ' + subcategoriesToAdd.length);
print('Successfully added: ' + addedCount);
print('Skipped (already exist): ' + skippedCount);
print('Errors: ' + errorCount);
print('');

// Verify the additions
print('=== VERIFICATION ===');
print('Current subcategories under cakes category:');
db.subcategories.find({categoryId: cakesCategory._id}).forEach(function(subcat) {
    print('  - ' + subcat.nameKey + ' -> ' + subcat.path + ' (ID: ' + subcat._id + ', custom id: ' + subcat.id + ')');
});

print('');
print('Script completed successfully!');
"

# Execute the MongoDB script
echo "$mongo_script" | $MONGO_CLIENT "$MONGO_URI" --quiet