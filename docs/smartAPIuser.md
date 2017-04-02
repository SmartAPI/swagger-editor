## Welcome to the swagger-editor wiki!
Want to create a swagger document for your API for the first time? Go to the [editor](http://smart-api.info/editor/) and Follow these steps and/or watch Our [live demo](https://www.youtube.com/watch?v=EQpUEiOu1ng&t=31s)!

Once you are done, Please take a quick [survey](https://github.com/WebsmartAPI/swagger-editor/wiki/Saving-and-Retrieving--API-documents)! 

### Some notes before you start:

a) The Swagger API document is in **YAML** notation, which is sensitive to indentation. So, it is important where your cursor is currently at, and where you insert the meta-data fields and values. Please follow our guidelines and you will be fine! 

b) The auto-suggestion functionality is available for both the meta-data fields and values. To get the list of suggestions available for the position you're cursor is currently at, either press _**Ctrl-Space**_ (to get all the suggestions) or **start typing** (to get the matched suggestions). 

### You are ready to start: 

1)  Open **File** menu and choose **New**. This is a guide to get you started quickly and generate your API metadata.
Don't worry about the errors on the right panel. As we add the meta-data the errors will be resolved. 

2) Follow the instructions and be cautious about your cursor position, since **YAML** is  sensitive to indentation. 

 2.1. insert 'info' block to add general information about your API. To do this either press Ctrl-Space to get a list of possible meta-data for that position or start typing "info". Select "info" from the list and you will see that a snippet is inserted to the editor. Add values for the snippet elements (e.g. Version, Title). 

[[wiki_images/figure1.jpg]]

[[wiki_images/f2.jpg]]

 2.2. add "contact" under the info as instructed. Contact snippet is inserted. Add the values (e.g. responsibleOrganization, etc.)

[[wiki_images/f3.jpg]]

[[wiki_images/f4.jpg]]

3)  Add other meta-data (e.g. schemes, basePath, host) as instructed.

[[wiki_images/f5.jpg]]

4)  Add "paths" and add a name for your path, add the operation (e.g. Get, Post, etc.), then add the "parameter" snippet. Add values for the snippet elements. Again, the auto-suggestion functionality is available either by pressing Ctrl-Space (to get all the suggestions) or start typing (to get the matched suggestions).
 
[[wiki_images/f6.jpg]]

[[wiki_images/f7.jpg]]

[[wiki_images/f8.jpg]]

[[wiki_images/f9.jpg]]

[[wiki_images/f10.jpg]]

 **Note:** If you want to add more paths, we recommend that you add it on top of your last path, closest to the "paths" element. This makes it much easier to follow the correct indentation. 

Want to save your document to our registry? Please follow the instructions [here](https://github.com/WebsmartAPI/swagger-editor/wiki/Saving-and-Retrieving--API-documents)
