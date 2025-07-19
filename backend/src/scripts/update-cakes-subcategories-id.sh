#!/bin/bash

# MongoDB Update Category SubCategories Script
# This script updates the category document to include all its subcategories

# Configuration
DB_NAME="recipes_app"
MONGO_URI="mongodb+srv://hila87219:Aa123456@cluster0.wgfux.mongodb.net/recipes_app"

echo "Starting MongoDB category subcategories update script..."
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

# MongoDB script to update category subcategories
mongo_script="
use $DB_NAME;

print('=== UPDATE CATEGORY SUBCATEGORIES SCRIPT ===');
print('');

// Find the cakes category
var cakesCategory = db.categories.findOne({nameKey: 'nav.cakes'});

if (!cakesCategory) {
    print('Error: Cakes category not found!');
    quit(1);
}

print('Found cakes category:');
print('  ID: ' + cakesCategory._id);
print('  nameKey: ' + cakesCategory.nameKey);
print('  Current subCategories count: ' + (cakesCategory.subCategories ? cakesCategory.subCategories.length : 0));
print('');

// Find all subcategories that belong to this category
var allCakeSubcategories = db.subcategories.find({categoryId: cakesCategory._id}).toArray();

print('Found ' + allCakeSubcategories.length + ' subcategories in subcategories collection:');
allCakeSubcategories.forEach(function(subcat, index) {
    print('  ' + (index + 1) + '. ' + subcat.nameKey + ' (ObjectId: ' + subcat._id + ')');
});
print('');

// Extract just the ObjectIds for the subCategories array
var subcategoryIds = allCakeSubcategories.map(function(subcat) {
    return subcat._id;
});

print('Updating cakes category with ' + subcategoryIds.length + ' subcategory references...');

try {
    var result = db.categories.updateOne(
        { _id: cakesCategory._id },
        { \$set: { subCategories: subcategoryIds } }
    );
    
    if (result.acknowledged && result.modifiedCount === 1) {
        print('SUCCESS: Updated cakes category with all subcategories');
    } else {
        print('WARNING: Update acknowledged but no documents modified');
        print('Result: ' + JSON.stringify(result));
    }
} catch (error) {
    print('ERROR: ' + error.message);
    quit(1);
}

print('');

// Verify the update
print('=== VERIFICATION ===');
var updatedCategory = db.categories.findOne({_id: cakesCategory._id});

print('Updated cakes category:');
print('  ID: ' + updatedCategory._id);
print('  nameKey: ' + updatedCategory.nameKey);
print('  subCategories count: ' + (updatedCategory.subCategories ? updatedCategory.subCategories.length : 0));

if (updatedCategory.subCategories && updatedCategory.subCategories.length > 0) {
    print('  subCategories array:');
    updatedCategory.subCategories.forEach(function(subcatId, index) {
        var subcat = db.subcategories.findOne({_id: subcatId});
        if (subcat) {
            print('    ' + (index + 1) + '. ' + subcat.nameKey + ' -> ' + subcat.path);
            print('       ObjectId: ' + subcat._id + ', Custom ID: ' + subcat.id);
        } else {
            print('    ' + (index + 1) + '. MISSING SUBCATEGORY (ObjectId: ' + subcatId + ')');
        }
    });
}

print('');
print('=== UPDATE ALL CATEGORIES ===');
print('Updating all categories to have correct subcategory references...');

var allCategories = db.categories.find({}).toArray();
var categoriesUpdated = 0;

allCategories.forEach(function(category) {
    var categorySubcats = db.subcategories.find({categoryId: category._id}).toArray();
    var subcatIds = categorySubcats.map(function(subcat) { return subcat._id; });
    
    if (subcatIds.length > 0) {
        var updateResult = db.categories.updateOne(
            { _id: category._id },
            { \$set: { subCategories: subcatIds } }
        );
        
        if (updateResult.acknowledged) {
            print('Updated ' + category.nameKey + ' with ' + subcatIds.length + ' subcategories');
            categoriesUpdated++;
        }
    } else {
        // Set empty array if no subcategories
        db.categories.updateOne(
            { _id: category._id },
            { \$set: { subCategories: [] } }
        );
        print('Set empty subCategories array for ' + category.nameKey);
    }
});

print('');
print('=== FINAL SUMMARY ===');
print('Categories updated: ' + categoriesUpdated);

// Final verification - show all categories and their subcategories
print('');
print('=== ALL CATEGORIES WITH SUBCATEGORIES ===');
db.categories.find({}).forEach(function(category) {
    print('');
    print('Category: ' + category.nameKey + ' (ID: ' + category._id + ')');
    print('  subCategories array length: ' + (category.subCategories ? category.subCategories.length : 0));
    
    if (category.subCategories && category.subCategories.length > 0) {
        category.subCategories.forEach(function(subcatId, index) {
            var subcat = db.subcategories.findOne({_id: subcatId});
            if (subcat) {
                print('    ' + (index + 1) + '. ' + subcat.nameKey + ' -> ' + subcat.path);
            }
        });
    }
});

print('');
print('Script completed successfully!');
"

# Execute the MongoDB script
echo "$mongo_script" | $MONGO_CLIENT "$MONGO_URI" --quiet