#!/bin/bash
# Replace some files in node_modules with modified ones in node_modules_changes

# extended specification
cp ./node_modules_changes/schema.json ./node_modules/swagger-schema-official/.
printf "[OK] Extended schema.js copied to './node_modules/swagger-schema-official'\n"

# modified language_tools (controls the auto-suggestion popup features) 
cp ./node_modules_changes/language_tools.js ./node_modules/brace/ext/.
printf "[OK] Modified language_tools.js copied to './node_modules/brace/ext/'\n"

# fix the URL redirection in angular.js 
sed -i '' "s/hashPrefix = '!'/hashPrefix = ''/g" ./node_modules/angular/angular.js
printf "[OK] URL redirection is fixed in './node_modules/angular/angular.js'\n"
