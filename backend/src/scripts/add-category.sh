#!/bin/bash

# ========================================
# UNIVERSAL ADD CATEGORY SCRIPT
# ========================================
# This script adds a new category to your MongoDB database
# Only change the variables in the CONFIGURATION section below

# ========================================
# CONFIGURATION - CHANGE THESE VALUES
# ========================================

# Category configuration (CHANGE THESE FOR EACH NEW CATEGORY)
CATEGORY_NAME_KEY="nav.soups"           # Translation key (e.g., "nav.soups", "nav.salads")
CATEGORY_PATH="soups"                   # URL path (e.g., "soups", "salads", "drinks")
CATEGORY_ORDER=10                       # Display order (number)

# Translation values
CATEGORY_NAME_ENGLISH="Soups"           # English display name
CATEGORY_NAME_HEBREW="מרקים"            # Hebrew display name

# Database configuration (USUALLY NO NEED TO CHANGE)
DB_NAME="recipes_app"
MONGO_URI="mongodb+srv://hila87219:Aa123456@cluster0.wgfux.mongodb.net/recipes_app"

# ========================================
# SCRIPT EXECUTION (DO NOT CHANGE BELOW)
# ========================================

echo "=========================================="
echo "UNIVERSAL ADD CATEGORY SCRIPT"
echo "=========================================="
echo "Adding category: $CATEGORY_NAME_ENGLISH ($CATEGORY_NAME_KEY)"
echo "Database: $DB_NAME"
echo "URI: $MONGO_URI"
echo ""

# Check if mongosh is available
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

echo ""
echo "Category Details:"
echo "  Name Key: $CATEGORY_NAME_KEY"
echo "  Path: /categories/$CATEGORY_PATH"
echo "  Order: $CATEGORY_ORDER"
echo "  English: $CATEGORY_NAME_ENGLISH"
echo "  Hebrew: $CATEGORY_NAME_HEBREW"
echo ""


# MongoDB script to add category
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

print('=== UNIVERSAL ADD CATEGORY SCRIPT ===');
print('');

// Check if category already exists
var existingCategory = db.categories.findOne({nameKey: '$CATEGORY_NAME_KEY'});

if (existingCategory) {
    print('ERROR: Category with nameKey \"$CATEGORY_NAME_KEY\" already exists!');
    print('Existing category details:');
    print('  ID: ' + existingCategory.id);
    print('  Name Key: ' + existingCategory.nameKey);
    print('  Path: ' + existingCategory.path);
    print('  Order: ' + existingCategory.order);
    quit(1);
}

// Check if path already exists
var existingPath = db.categories.findOne({path: '/categories/$CATEGORY_PATH'});

if (existingPath) {
    print('ERROR: Category with path \"/categories/$CATEGORY_PATH\" already exists!');
    print('Existing category details:');
    print('  ID: ' + existingPath.id);
    print('  Name Key: ' + existingPath.nameKey);
    print('  Path: ' + existingPath.path);
    quit(1);
}

// Generate new category
var newCategory = {
    id: generateUUID(),
    nameKey: '$CATEGORY_NAME_KEY',
    path: '/categories/$CATEGORY_PATH',
    isActive: true,
    order: $CATEGORY_ORDER,
    subCategories: []
};

print('Adding new category...');
print('  Custom ID: ' + newCategory.id);
print('  Name Key: ' + newCategory.nameKey);
print('  Path: ' + newCategory.path);
print('  Order: ' + newCategory.order);
print('');

try {
    var result = db.categories.insertOne(newCategory);
    
    if (result.acknowledged) {
        print('✓ SUCCESS: Category added successfully!');
        print('  Inserted ID: ' + result.insertedId);
        print('  Custom ID: ' + newCategory.id);
    } else {
        print('✗ ERROR: Failed to add category');
        print('  Result: ' + JSON.stringify(result));
        quit(1);
    }
} catch (error) {
    print('✗ EXCEPTION: ' + error.message);
    quit(1);
}

print('');
print('=== VERIFICATION ===');

// Verify the category was added
var addedCategory = db.categories.findOne({id: newCategory.id});

if (addedCategory) {
    print('Category successfully added:');
    print('  MongoDB _id: ' + addedCategory._id);
    print('  Custom id: ' + addedCategory.id);
    print('  nameKey: ' + addedCategory.nameKey);
    print('  path: ' + addedCategory.path);
    print('  order: ' + addedCategory.order);
    print('  isActive: ' + addedCategory.isActive);
    print('  subCategories: ' + addedCategory.subCategories.length + ' items');
} else {
    print('✗ ERROR: Could not verify category addition');
}

print('');
print('=== ALL CATEGORIES ===');
print('Current categories in database:');

db.categories.find({}).sort({order: 1}).forEach(function(category, index) {
    print('  ' + (index + 1) + '. ' + category.nameKey + ' (order: ' + category.order + ', path: ' + category.path + ')');
});

print('');
print('=== SCRIPT COMPLETED ===');
"

# Execute the MongoDB script
echo "$mongo_script" | $MONGO_CLIENT "$MONGO_URI" --quiet

echo ""
echo "=========================================="
echo "POST-ADDITION CHECKLIST"
echo "=========================================="
echo "□ Add translation keys to your translation files:"
echo ""
echo "English (en.json):"
echo "{"
echo "  \"nav\": {"
echo "    \"$CATEGORY_NAME_KEY\": \"$CATEGORY_NAME_ENGLISH\""
echo "  }"
echo "}"
echo ""
echo "Hebrew (he.json):"
echo "{"
echo "  \"nav\": {"
echo "    \"$CATEGORY_NAME_KEY\": \"$CATEGORY_NAME_HEBREW\""
echo "  }"
echo "}"
echo ""
echo "=========================================="