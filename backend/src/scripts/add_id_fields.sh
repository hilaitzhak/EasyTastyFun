#!/bin/bash

# MongoDB Fix Category SubCategory References Script
# This script converts ObjectId references to custom string IDs in categories

# Configuration
DB_NAME="recipes_app"
MONGO_URI="mongodb+srv://hila87219:Aa123456@cluster0.wgfux.mongodb.net/recipes_app"

echo "Starting MongoDB category references fix script..."
echo "Database: $DB_NAME"
echo ""

# Check if mongosh is available
if command -v mongosh &> /dev/null; then
    MONGO_CLIENT="mongosh"
    echo "Using mongosh (MongoDB Shell)"
else
    echo "Error: mongosh not found!"
    exit 1
fi

# MongoDB script to fix category references
mongo_script="
use $DB_NAME;

print('=== FIX CATEGORY SUBCATEGORY REFERENCES ===');
print('');

// Get all categories
var categories = db.categories.find({}).toArray();

print('Found ' + categories.length + ' categories to process');
print('');

categories.forEach(function(category, index) {
    print('Processing category ' + (index + 1) + ': ' + category.nameKey);
    
    if (category.subCategories && category.subCategories.length > 0) {
        print('  Current subCategories: ' + category.subCategories.length);
        
        var customIds = [];
        var objectIdCount = 0;
        var stringIdCount = 0;
        
        category.subCategories.forEach(function(subcatRef) {
            if (typeof subcatRef === 'string') {
                // Already a string, check if it's a valid custom ID
                var subcat = db.subcategories.findOne({id: subcatRef});
                if (subcat) {
                    customIds.push(subcatRef);
                    stringIdCount++;
                } else {
                    print('    WARNING: String ID not found: ' + subcatRef);
                }
            } else {
                // It's an ObjectId, convert to custom ID
                var subcat = db.subcategories.findOne({_id: subcatRef});
                if (subcat && subcat.id) {
                    customIds.push(subcat.id);
                    objectIdCount++;
                    print('    Converted ObjectId ' + subcatRef + ' -> ' + subcat.id);
                } else {
                    print('    WARNING: ObjectId not found or missing custom ID: ' + subcatRef);
                }
            }
        });
        
        print('  ObjectIds converted: ' + objectIdCount);
        print('  String IDs kept: ' + stringIdCount);
        print('  Total valid custom IDs: ' + customIds.length);
        
        // Update the category with custom string IDs
        if (customIds.length > 0) {
            var result = db.categories.updateOne(
                {_id: category._id},
                {\$set: {subCategories: customIds}}
            );
            
            if (result.acknowledged) {
                print('  ✓ Category updated successfully');
            } else {
                print('  ✗ Failed to update category');
            }
        } else {
            // Set empty array if no valid subcategories
            db.categories.updateOne(
                {_id: category._id},
                {\$set: {subCategories: []}}
            );
            print('  Set empty subCategories array');
        }
    } else {
        print('  No subcategories to process');
    }
    print('');
});

print('=== VERIFICATION ===');
print('');

// Verify all categories now have string references
db.categories.find({}).forEach(function(category) {
    print('Category: ' + category.nameKey + ' (id: ' + category.id + ')');
    
    if (category.subCategories && category.subCategories.length > 0) {
        print('  subCategories (' + category.subCategories.length + '):');
        
        category.subCategories.forEach(function(subcatId, index) {
            var subcat = db.subcategories.findOne({id: subcatId});
            
            if (subcat) {
                print('    ' + (index + 1) + '. ' + subcat.nameKey + ' (id: ' + subcatId + ')');
            } else {
                print('    ' + (index + 1) + '. ✗ NOT FOUND: ' + subcatId);
            }
        });
    } else {
        print('  No subcategories');
    }
    print('');
});

// Check for any remaining ObjectId references in subCategories arrays
print('=== CHECKING FOR REMAINING OBJECTID REFERENCES ===');
var categoriesWithObjectIds = db.categories.find({
    'subCategories': {\$elemMatch: {\$type: 'objectId'}}
}).toArray();

if (categoriesWithObjectIds.length > 0) {
    print('⚠️  WARNING: ' + categoriesWithObjectIds.length + ' categories still have ObjectId references:');
    categoriesWithObjectIds.forEach(function(cat) {
        print('  - ' + cat.nameKey);
    });
} else {
    print('✓ All categories now use string subcategory references');
}

print('');
print('=== SCRIPT COMPLETED ===');
"

# Execute the MongoDB script
echo "$mongo_script" | $MONGO_CLIENT "$MONGO_URI" --quiet