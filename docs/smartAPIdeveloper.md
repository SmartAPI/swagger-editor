# smartAPI editor Developer Guide

smartAPI editor is an extentetion to Swagger editor. This guideline helps the developers find the right place in the code to modify: 


### smartAPI specification: The editor validates the API document against:
```shell
swagger-editor/node_modules/swagger-schema-official/schema.json
```
### Modifications to Auto-suggestion functionality for metadata elements and values involve several angular services:
List of metadata elements, and enumerated values for auto-suggestion 
  scripts/services/KeywordMap.js
  
  scripts/services/autocomplete.js



