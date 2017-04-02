# smartAPI Editor Developer Guide

smartAPI editor is an extentetion to Swagger editor. This guideline helps the developers find the right place in the code to modify: 


### smartAPI specification
The JSON schema, the editor uses to validate the API document:
```shell
node_modules/swagger-schema-official/schema.json
```
### Auto-completion functionality for suggesting metadata elements and values
```shell
scripts/services/KeywordMap.js
scripts/services/autocomplete.js
node_modules/brace/ext/language_tools.js
```
### Right-hand preview panel
HTML templates 
```shell
templates/
```
### smartAPI Recommendation
collapsable div on top of preview panel
```shell
templates/recom-presenter.html
scripts/services/controllers/recompresenter.js
```
