#!/bin/bash

# MongoDB Add Pie Subcategories Script
# This script adds pie subcategories with proper UUID generation

# Configuration
DB_NAME="recipes_app"
MONGO_URI="mongodb+srv://hila87219:Aa123456@cluster0.wgfux.mongodb.net/recipes_app"

echo "Starting MongoDB pie subcategories addition script"
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

// First, find the pies category
var piesCategory = db.categories.findOne({nameKey: 'nav.pies'});

if (!piesCategory) {
    print('Error: Pies category not found!');
    print('Available categories:');
    db.categories.find({}, {nameKey: 1, _id: 1}).forEach(function(cat) {
        print('  - nameKey: ' + cat.nameKey + ', _id: ' + cat._id);
    });
    quit(1);
}

print('Found pies category with ID: ' + piesCategory._id);
print('Category nameKey: ' + piesCategory.nameKey);
print('');

// Define the subcategories to add with manual UUID generation
var subcategoriesToAdd = [
    {
        id: generateUUID(),
        nameKey: 'nav.subCategories.dairyPies',
        path: '/categories/pies/dairy',
        categoryId: piesCategory._id,
        isActive: true
    },
    {
        id: generateUUID(),
        nameKey: 'nav.subCategories.parevePies',
        path: '/categories/pies/pareve',
        categoryId: piesCategory._id,
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

// Update the pies category to include the new subcategories
print('=== UPDATING PIES CATEGORY ===');
var allPieSubcategories = db.subcategories.find({categoryId: piesCategory._id}).toArray();
var subcategoryIds = allPieSubcategories.map(function(subcat) {
    return subcat._id;
});

try {
    var updateResult = db.categories.updateOne(
        { _id: piesCategory._id },
        { \$set: { subCategories: subcategoryIds } }
    );
    
    if (updateResult.acknowledged) {
        print('Updated pies category with ' + subcategoryIds.length + ' subcategories');
    } else {
        print('WARNING: Failed to update pies category');
    }
} catch (error) {
    print('ERROR updating pies category: ' + error.message);
}

// Verify the additions
print('');
print('=== VERIFICATION ===');
print('Current subcategories under pies category:');
db.subcategories.find({categoryId: piesCategory._id}).forEach(function(subcat) {
    print('  - ' + subcat.nameKey + ' -> ' + subcat.path + ' (ObjectId: ' + subcat._id + ', custom id: ' + subcat.id + ')');
});

// Verify category update
var updatedPiesCategory = db.categories.findOne({_id: piesCategory._id});
print('');
print('Pies category subCategories array:');
if (updatedPiesCategory.subCategories && updatedPiesCategory.subCategories.length > 0) {
    updatedPiesCategory.subCategories.forEach(function(subcatId, index) {
        var subcat = db.subcategories.findOne({_id: subcatId});
        if (subcat) {
            print('  ' + (index + 1) + '. ' + subcat.nameKey + ' -> ' + subcat.path);
        }
    });
} else {
    print('  No subcategories found in category array');
}

print('');
print('Script completed successfully!');
print('');
"

# Execute the MongoDB script
echo "$mongo_script" | $MONGO_CLIENT "$MONGO_URI" --quiet