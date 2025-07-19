#!/bin/bash

# MongoDB Update All Categories SubCategories Script
# This script updates all category documents to include their subcategories

# Configuration
DB_NAME="recipes_app"
MONGO_URI="mongodb+srv://hila87219:Aa123456@cluster0.wgfux.mongodb.net/recipes_app"

echo "Starting MongoDB all categories subcategories update script..."
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

# MongoDB script to update all category subcategories
mongo_script="
use $DB_NAME;

print('=== UPDATE ALL CATEGORIES SUBCATEGORIES SCRIPT ===');
print('');

// Get all categories
var allCategories = db.categories.find({}).toArray();

print('Found ' + allCategories.length + ' categories to process');
print('');

var categoriesUpdated = 0;
var categoriesWithSubcats = 0;
var categoriesWithoutSubcats = 0;

print('=== PROCESSING ALL CATEGORIES ===');

allCategories.forEach(function(category, index) {
    print('Processing #' + (index + 1) + ': ' + category.nameKey + ' (ID: ' + category._id + ')');
    
    // Find all subcategories that belong to this category
    var categorySubcats = db.subcategories.find({categoryId: category._id}).toArray();
    
    print('  Found ' + categorySubcats.length + ' subcategories');
    
    if (categorySubcats.length > 0) {
        // Extract ObjectIds for the subCategories array
        var subcatIds = categorySubcats.map(function(subcat) { return subcat._id; });
        
        try {
            var updateResult = db.categories.updateOne(
                { _id: category._id },
                { \$set: { subCategories: subcatIds } }
            );
            
            if (updateResult.acknowledged) {
                print('  -> SUCCESS: Updated with ' + subcatIds.length + ' subcategories');
                categoriesUpdated++;
                categoriesWithSubcats++;
                
                // List the subcategories
                categorySubcats.forEach(function(subcat, subcatIndex) {
                    print('    ' + (subcatIndex + 1) + '. ' + subcat.nameKey + ' -> ' + subcat.path);
                });
            } else {
                print('  -> WARNING: Update failed');
            }
        } catch (error) {
            print('  -> ERROR: ' + error.message);
        }
    } else {
        // Set empty array if no subcategories
        try {
            var updateResult = db.categories.updateOne(
                { _id: category._id },
                { \$set: { subCategories: [] } }
            );
            
            if (updateResult.acknowledged) {
                print('  -> Set empty subCategories array');
                categoriesUpdated++;
                categoriesWithoutSubcats++;
            }
        } catch (error) {
            print('  -> ERROR setting empty array: ' + error.message);
        }
    }
    print('');
});

print('=== PROCESSING SUMMARY ===');
print('Total categories processed: ' + allCategories.length);
print('Categories updated: ' + categoriesUpdated);
print('Categories with subcategories: ' + categoriesWithSubcats);
print('Categories without subcategories: ' + categoriesWithoutSubcats);
print('');

// Final verification - show all categories and their subcategories
print('=== FINAL VERIFICATION ===');
print('All categories with their subcategories:');

db.categories.find({}).forEach(function(category) {
    print('');
    print('Category: ' + category.nameKey + ' (ID: ' + category._id + ')');
    print('  subCategories array length: ' + (category.subCategories ? category.subCategories.length : 0));
    
    if (category.subCategories && category.subCategories.length > 0) {
        category.subCategories.forEach(function(subcatId, index) {
            var subcat = db.subcategories.findOne({_id: subcatId});
            if (subcat) {
                print('    ' + (index + 1) + '. ' + subcat.nameKey + ' -> ' + subcat.path);
                print('       ObjectId: ' + subcat._id + ', Custom ID: ' + subcat.id);
            } else {
                print('    ' + (index + 1) + '. MISSING SUBCATEGORY (ObjectId: ' + subcatId + ')');
            }
        });
    } else {
        print('    No subcategories');
    }
});

print('');

// Additional verification - check for orphaned subcategories
print('=== ORPHANED SUBCATEGORIES CHECK ===');
var allSubcategories = db.subcategories.find({}).toArray();
var orphanedSubcats = [];

allSubcategories.forEach(function(subcat) {
    var parentCategory = db.categories.findOne({_id: subcat.categoryId});
    if (!parentCategory) {
        orphanedSubcats.push(subcat);
    }
});

if (orphanedSubcats.length > 0) {
    print('WARNING: Found ' + orphanedSubcats.length + ' orphaned subcategories:');
    orphanedSubcats.forEach(function(subcat, index) {
        print('  ' + (index + 1) + '. ' + subcat.nameKey + ' (categoryId: ' + subcat.categoryId + ')');
    });
} else {
    print('✓ No orphaned subcategories found');
}

print('');

// Check for categories not referenced by any subcategory
print('=== CATEGORIES WITHOUT SUBCATEGORIES ===');
var categoriesWithoutAnySubcats = [];

allCategories.forEach(function(category) {
    var hasSubcats = db.subcategories.findOne({categoryId: category._id});
    if (!hasSubcats) {
        categoriesWithoutAnySubcats.push(category);
    }
});

if (categoriesWithoutAnySubcats.length > 0) {
    print('Categories with no subcategories:');
    categoriesWithoutAnySubcats.forEach(function(category, index) {
        print('  ' + (index + 1) + '. ' + category.nameKey + ' (ID: ' + category._id + ')');
    });
} else {
    print('✓ All categories have subcategories');
}

print('');
print('=== SCRIPT COMPLETED SUCCESSFULLY ===');
print('All category documents have been updated with their subcategory references');
"

# Execute the MongoDB script
echo "$mongo_script" | $MONGO_CLIENT "$MONGO_URI" --quiet