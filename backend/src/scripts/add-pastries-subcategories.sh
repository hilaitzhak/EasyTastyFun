#!/bin/bash

# MongoDB Add Pastries Subcategories Script
# This script adds pastries subcategories with proper UUID generation

# Configuration
DB_NAME="recipes_app"
MONGO_URI="mongodb+srv://hila87219:Aa123456@cluster0.wgfux.mongodb.net/recipes_app"

echo "Starting MongoDB pastries subcategories addition script"
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

// First, find the pastries category
var pastriesCategory = db.categories.findOne({nameKey: 'nav.pastries'});

if (!pastriesCategory) {
    print('Error: Pastries category not found!');
    print('Available categories:');
    db.categories.find({}, {nameKey: 1, id: 1}).forEach(function(cat) {
        print('  - nameKey: ' + cat.nameKey + ', custom id: ' + cat.id);
    });
    quit(1);
}

print('Found pastries category with custom ID: ' + pastriesCategory.id);
print('Category nameKey: ' + pastriesCategory.nameKey);
print('');

// Define the subcategories to add with manual UUID generation
var subcategoriesToAdd = [
    {
        id: generateUUID(),
        nameKey: 'nav.subCategories.parvePastries',
        path: '/categories/pastries/parve',
        categoryId: pastriesCategory.id, // Use custom id, not ObjectId
        isActive: true
    }
];

print('Adding ' + subcategoriesToAdd.length + ' subcategory...');
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
                print('ADDED: ' + subcat.nameKey + ' -> ' + subcat.path + ' (Custom ID: ' + subcat.id + ')');
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

// Update the pastries category to include the new subcategories
print('=== UPDATING PASTRIES CATEGORY ===');
var allPastriesSubcategories = db.subcategories.find({categoryId: pastriesCategory.id}).toArray();
var subcategoryCustomIds = allPastriesSubcategories.map(function(subcat) {
    return subcat.id; // Use custom id, not ObjectId
});

try {
    var updateResult = db.categories.updateOne(
        { id: pastriesCategory.id }, // Use custom id for query
        { \$set: { subCategories: subcategoryCustomIds } }
    );
    
    if (updateResult.acknowledged) {
        print('Updated pastries category with ' + subcategoryCustomIds.length + ' subcategories');
    } else {
        print('WARNING: Failed to update pastries category');
    }
} catch (error) {
    print('ERROR updating pastries category: ' + error.message);
}

// Verify the additions
print('');
print('=== VERIFICATION ===');
print('Current subcategories under pastries category:');
db.subcategories.find({categoryId: pastriesCategory.id}).forEach(function(subcat) {
    print('  - ' + subcat.nameKey + ' -> ' + subcat.path + ' (Custom ID: ' + subcat.id + ')');
});

// Verify category update
var updatedPastriesCategory = db.categories.findOne({id: pastriesCategory.id});
print('');
print('Pastries category subCategories array:');
if (updatedPastriesCategory.subCategories && updatedPastriesCategory.subCategories.length > 0) {
    updatedPastriesCategory.subCategories.forEach(function(subcatId, index) {
        var subcat = db.subcategories.findOne({id: subcatId});
        if (subcat) {
            print('  ' + (index + 1) + '. ' + subcat.nameKey + ' -> ' + subcat.path + ' (Custom ID: ' + subcatId + ')');
        } else {
            print('  ' + (index + 1) + '. MISSING SUBCATEGORY (Custom ID: ' + subcatId + ')');
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