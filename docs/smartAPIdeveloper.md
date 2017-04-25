# smartAPI editor: Developer Guide

smartAPI editor is an extentetion to Swagger editor. This guideline helps the developers find the right place in the code to modify. 

:exclamation: Make sure you are in swagger-editor directory; and have run *npm install*.

### smartAPI specification
  The JSON schema, the editor uses to validate the API document:
```shell
node_modules/swagger-schema-official/schema.json
```
### Auto-completion functionality for suggesting metadata elements and values
```shell
scripts/services/KeywordMap.js
scripts/ace/swagger.snippet.js
scripts/services/autocomplete.js
node_modules/brace/ext/language_tools.js
```
### Integration with Profiler and responseDataType automatic annotation
```shell
scripts/services/autocomplete.js
scripts/directives/compile-template.js
```
### Right-hand preview panel
  HTML templates for rendering
```shell
templates/
scripts/controllers/
```
### smartAPI Recommendation
  Collapsable div on top of preview panel
```shell
templates/recom-presenter.html
scripts/controllers/recompresenter.js
styles/components/error-presenter.less
```
### Validation Errors
  Collapsable red div on top of preview panel that shows up if error occurs
```shell
templates/error-presenter.html
scripts/controllers/errorpresenter.js
styles/components/error-presenter.less
```
### Auto-suggestion service URL and other Preferences tab settings
  For Auto-suggestion service URL, look for *suggestionServiceBasePath*
```shell
templates/preferences.html
scripts/controllers/preferences.js
configs/defaults.js
```
### Save functionality
  Look for *saveAPIdoc* function 
```shell
views/header/header.html
scripts/controllers/header.js
```
### New File, Default API document and other Example YAML documents
```shell
spec-files/guide.yaml
spec-files/default.yaml
spec-files/xxx.yaml
```
### Dependencies
```shell
package.json
```
