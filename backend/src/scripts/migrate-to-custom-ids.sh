#!/bin/bash

# MongoDB Complete Migration Script to Custom String IDs
# This script converts all ObjectId references to custom string IDs

# Configuration
DB_NAME="recipes_app"
MONGO_URI="mongodb+srv://hila87219:Aa123456@cluster0.wgfux.mongodb.net/recipes_app"

echo "Starting MongoDB complete migration to custom string IDs..."
echo "Database: $DB_NAME"
echo "URI: $MONGO_URI"
echo ""
echo "⚠️  WARNING: This script will modify all recipes, categories, and subcategories!"
echo "⚠️  Make sure you have a backup before proceeding!"
echo ""
read -p "Do you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration cancelled."
    exit 1
fi

# Check if mongosh is available
if command -v mongosh &> /dev/null; then
    MONGO_CLIENT="mongosh"
    echo "Using mongosh (MongoDB Shell)"
else
    echo "Error: mongosh not found!"
    exit 1
fi

# MongoDB migration script
mongo_script="
use $DB_NAME;

// Function to generate UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

print('=== COMPLETE MIGRATION TO CUSTOM STRING IDs ===');
print('');

// STEP 1: Ensure all categories have custom id fields
print('STEP 1: Processing Categories...');
var categories = db.categories.find({}).toArray();
var categoryMapping = {}; // ObjectId -> custom id mapping

categories.forEach(function(category, index) {
    print('Processing category ' + (index + 1) + '/' + categories.length + ': ' + category.nameKey);
    
    var customId = category.id;
    if (!customId) {
        customId = generateUUID();
        db.categories.updateOne(
            {_id: category._id},
            {\$set: {id: customId}}
        );
        print('  Generated new custom ID: ' + customId);
    } else {
        print('  Using existing custom ID: ' + customId);
    }
    
    categoryMapping[category._id.toString()] = customId;
});

print('Category mapping created: ' + Object.keys(categoryMapping).length + ' categories');
print('');

// STEP 2: Update subcategories to use custom categoryId
print('STEP 2: Processing Subcategories...');
var subcategories = db.subcategories.find({}).toArray();
var subcategoryMapping = {}; // ObjectId -> custom id mapping

subcategories.forEach(function(subcat, index) {
    print('Processing subcategory ' + (index + 1) + '/' + subcategories.length + ': ' + subcat.nameKey);
    
    // Ensure subcategory has custom id
    var subcatCustomId = subcat.id;
    if (!subcatCustomId) {
        subcatCustomId = generateUUID();
        print('  Generated new subcategory custom ID: ' + subcatCustomId);
    } else {
        print('  Using existing subcategory custom ID: ' + subcatCustomId);
    }
    
    subcategoryMapping[subcat._id.toString()] = subcatCustomId;
    
    // Convert categoryId from ObjectId to custom string id
    var categoryCustomId = categoryMapping[subcat.categoryId.toString()];
    
    if (categoryCustomId) {
        var updateFields = {
            id: subcatCustomId,
            categoryId: categoryCustomId
        };
        
        db.subcategories.updateOne(
            {_id: subcat._id},
            {\$set: updateFields}
        );
        
        print('  Updated categoryId: ' + subcat.categoryId + ' -> ' + categoryCustomId);
    } else {
        print('  ERROR: Could not find category mapping for: ' + subcat.categoryId);
    }
});

print('Subcategory mapping created: ' + Object.keys(subcategoryMapping).length + ' subcategories');
print('');

// STEP 3: Update categories subCategories array to use custom IDs
print('STEP 3: Updating Category subCategories arrays...');
categories.forEach(function(category) {
    var subcats = db.subcategories.find({categoryId: categoryMapping[category._id.toString()]}).toArray();
    var subcatCustomIds = subcats.map(function(subcat) {
        return subcat.id;
    });
    
    db.categories.updateOne(
        {_id: category._id},
        {\$set: {subCategories: subcatCustomIds}}
    );
    
    print('Updated ' + category.nameKey + ' with ' + subcatCustomIds.length + ' subcategory custom IDs');
});
print('');

// STEP 4: Update all recipes to use custom string IDs
print('STEP 4: Processing Recipes...');
var recipes = db.recipes.find({}).toArray();
var recipesUpdated = 0;
var recipesWithErrors = 0;

recipes.forEach(function(recipe, index) {
    print('Processing recipe ' + (index + 1) + '/' + recipes.length + ': ' + recipe.name);
    
    try {
        var updateFields = {};
        var hasUpdates = false;
        
        // Convert category ObjectId to custom string id
        if (recipe.category) {
            var categoryCustomId = categoryMapping[recipe.category.toString()];
            if (categoryCustomId) {
                updateFields.category = categoryCustomId;
                hasUpdates = true;
                print('  Updated category: ' + recipe.category + ' -> ' + categoryCustomId);
            } else {
                print('  WARNING: Category not found in mapping: ' + recipe.category);
            }
        }
        
        // Convert subcategory ObjectId to custom string id (if exists)
        if (recipe.subcategory) {
            var subcategoryCustomId = subcategoryMapping[recipe.subcategory.toString()];
            if (subcategoryCustomId) {
                updateFields.subcategory = subcategoryCustomId;
                hasUpdates = true;
                print('  Updated subcategory: ' + recipe.subcategory + ' -> ' + subcategoryCustomId);
            } else {
                print('  WARNING: Subcategory not found in mapping: ' + recipe.subcategory);
                // Set to null if not found
                updateFields.subcategory = null;
                hasUpdates = true;
            }
        }
        
        // Update updatedAt timestamp
        updateFields.updatedAt = new Date();
        
        if (hasUpdates) {
            var result = db.recipes.updateOne(
                {_id: recipe._id},
                {\$set: updateFields}
            );
            
            if (result.acknowledged) {
                recipesUpdated++;
                print('  ✓ Recipe updated successfully');
            } else {
                print('  ✗ Failed to update recipe');
                recipesWithErrors++;
            }
        } else {
            print('  - No updates needed');
        }
        
    } catch (error) {
        print('  ERROR processing recipe: ' + error.message);
        recipesWithErrors++;
    }
    print('');
});

print('=== MIGRATION SUMMARY ===');
print('Categories processed: ' + categories.length);
print('Subcategories processed: ' + subcategories.length);
print('Recipes processed: ' + recipes.length);
print('Recipes updated: ' + recipesUpdated);
print('Recipes with errors: ' + recipesWithErrors);
print('');

// VERIFICATION
print('=== VERIFICATION ===');
print('');

// Verify categories
print('Categories with custom IDs:');
db.categories.find({}).forEach(function(category) {
    var subcatCount = db.subcategories.countDocuments({categoryId: category.id});
    print('  - ' + category.nameKey + ' (id: ' + category.id + ', subcategories: ' + subcatCount + ')');
});
print('');

// Verify subcategories
print('Subcategories with string categoryId:');
db.subcategories.find({}).limit(5).forEach(function(subcat) {
    print('  - ' + subcat.nameKey + ' (categoryId: ' + subcat.categoryId + ', type: ' + typeof subcat.categoryId + ')');
});
print('');

// Verify recipes
print('Sample recipes with string category/subcategory:');
db.recipes.find({}).limit(3).forEach(function(recipe) {
    print('  - ' + recipe.name);
    print('    category: ' + recipe.category + ' (type: ' + typeof recipe.category + ')');
    if (recipe.subcategory) {
        print('    subcategory: ' + recipe.subcategory + ' (type: ' + typeof recipe.subcategory + ')');
    } else {
        print('    subcategory: null');
    }
    print('');
});

// Check for any remaining ObjectId references
print('Checking for remaining ObjectId references...');
var recipesWithObjectIds = db.recipes.countDocuments({
    \$or: [
        {category: {\$type: 'objectId'}},
        {subcategory: {\$type: 'objectId'}}
    ]
});

if (recipesWithObjectIds > 0) {
    print('⚠️  WARNING: ' + recipesWithObjectIds + ' recipes still have ObjectId references!');
} else {
    print('✓ All recipes now use string IDs');
}

var subcatsWithObjectIds = db.subcategories.countDocuments({
    categoryId: {\$type: 'objectId'}
});

if (subcatsWithObjectIds > 0) {
    print('⚠️  WARNING: ' + subcatsWithObjectIds + ' subcategories still have ObjectId categoryId!');
} else {
    print('✓ All subcategories now use string categoryId');
}

print('');
print('=== MIGRATION COMPLETED ===');
print('');
print('Next steps:');
print('1. Update your Mongoose schemas to use String types');
print('2. Test your application thoroughly');
print('3. Update any API endpoints that reference ObjectIds');
print('4. Consider creating indexes on the new string fields if needed');
"

# Execute the MongoDB script
echo "$mongo_script" | $MONGO_CLIENT "$MONGO_URI" --quiet

echo ""
echo "=== POST-MIGRATION CHECKLIST ==="
echo "□ Update Recipe schema: category and subcategory to String type"
echo "□ Update SubCategory schema: categoryId to String type" 
echo "□ Update Category schema: subCategories array to [String] type"
echo "□ Test recipe creation/editing functionality"
echo "□ Test category/subcategory filtering"
echo "□ Verify all API endpoints work correctly"
echo "□ Update any frontend code that expects ObjectIds"