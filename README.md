# smartAPI Editor: A tool for semantic annotation of Web APIs

smartAPI Editor is an an extension to [Swagger Editor](https://github.com/swagger-api/swagger-editor/releases). Swagger Editor lets you edit your API document in in YAML inside your browser and to preview documentations in real time. 

**[LIVE DEMO](https://www.youtube.com/watch?v=EQpUEiOu1ng&t=2s)**

[![Screenshot of the smartAPI Editor](docs/screenshot.png "Annotating your Web API with smartAPI Editor")]()

smartAPI editor:
 * Validates your API document against [smartAPI specifications](https://github.com/WebsmartAPI/swagger-editor/blob/master/node_modules_changes/schema.json), an extended version of openAPI specification.
 
 * Lets you Save your API document into [smartAPI registry](http://smart-api.info/registry/).
 
 * Enhances auto-suggestion functionality for metadata *elements* by providing the element's conformance level (Required, Recommended, Optional).
 
 * Enhances auto-suggestion functionality for metadata *values* by suggesting a list of values used by other APIs along with and sorted by their usage frequency.
 
 * Enables semantic annotation of *parameters* and *responses* of the API:
    * auto-suggests values for *parameters.parameterValueType* from [identifiers.org](http://identifiers.org/) along with their usage frequency by other APIs. 
    * Integrates the editor with [smartAPI profiler](http://smart-api.info/profiler) which automatically annotates the *responses.responseDataType* of the API. 


#### Building From Source

Make sure you have [Node.js](http://nodejs.org/) installed. 
Running the editor:

```shell
git clone https://github.com/WebsmartAPI/swagger-editor.git
cd swagger-editor
npm install
chmod 755 scripts/nmchange.sh
./scripts/nmchange.sh
npm start
```
Make sure you have [elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html) installed. 
Running elasticsearch:
```shell
./elasticsearch
```

Running the Identifiers API ( an elasticsearch-based tornado app providing the identifiers from identifiers.org indexed using their names,synonyms, description, and URL)
```shell
cd identifiers
make index
make backend
```
#### Documentations
* [smartAPI Developer Guide](./docs/smartAPIdeveloper.md)
* [smartAPI User Guide](./docs/smartAPIuser.md)

#### Other Swagger Documentations
* [Importing your Swagger document](./docs/import.md)
* [Development Guide](./docs/development.md)
* [Configuration Guide](./docs/config.md)
* [Cross Origin Request(CORS) issues](docs/cors.md)

[Contributing](./CONTRIBUTING.md)

[LICENSE](./LICENSE)

---
<img src="http://swagger.io/wp-content/uploads/2016/02/logo.jpg"/>
