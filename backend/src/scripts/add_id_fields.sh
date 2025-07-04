#!/bin/bash

# MongoDB Add ID Field Script
# This script adds an 'id' field to categories and subcategories collections
# The 'id' field will contain the string representation of the _id field

# Configuration
DB_NAME="recipes_app"
MONGO_URI="mongodb+srv://hila87219:Aa123456@cluster0.wgfux.mongodb.net/recipes_app"

echo "Starting MongoDB ID field addition script..."
echo "Database: $DB_NAME"
echo "URI: $MONGO_URI"
echo ""

# Function to add id field to a collection
add_id_field() {
    local collection_name=$1
    echo "Processing collection: $collection_name"
    
    # MongoDB command to add id field
    mongo_command="
    db = db.getSiblingDB('$DB_NAME');
    
    // Find documents that don't have an 'id' field
    var docs = db.$collection_name.find({id: {\$exists: false}});
    var count = 0;
    
    docs.forEach(function(doc) {
        // Add 'id' field with string representation of _id
        db.$collection_name.updateOne(
            {_id: doc._id},
            {\$set: {id: doc._id.toString()}}
        );
        count++;
    });
    
    print('Updated ' + count + ' documents in $collection_name collection');
    
    // Verify the update
    var totalDocs = db.$collection_name.countDocuments();
    var docsWithId = db.$collection_name.countDocuments({id: {\$exists: true}});
    
    print('Total documents: ' + totalDocs);
    print('Documents with id field: ' + docsWithId);
    print('');
    "
    
    # Execute the MongoDB command
    echo "$mongo_command" | mongosh "$MONGO_URI" --quiet
}

# Add id field to categories collection
echo "=== UPDATING CATEGORIES COLLECTION ==="
add_id_field "categories"

# Add id field to subcategories collection  
echo "=== UPDATING SUBCATEGORIES COLLECTION ==="
add_id_field "subcategories"

echo "=== SCRIPT COMPLETED ==="
echo ""
echo "Summary:"
echo "- Added 'id' field to categories collection"
echo "- Added 'id' field to subcategories collection"
echo "- The 'id' field contains the string representation of the _id field"
echo ""
echo "You can now use either '_id' or 'id' field in your application."
echo "Remember to update your API endpoints to use the 'id' field if needed."