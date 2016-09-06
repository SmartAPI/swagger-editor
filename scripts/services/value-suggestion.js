'use strict';

var _ = require('lodash');
var angular = require('angular');

SwaggerEditor.service('ValueSuggestion', function ValueSuggestion(defaults) {
  /*
   * JSON Schema completion map constructor
   *
   * This is necessary because JSON Schema completion map has recursive
   * pointers
  */
  /* eslint quote-props: ["error", "as-needed", { "keywords": false, "unnecessary": false }]*/
  
  
  this.getSuggestedValues = function(field) {
     var url = "http://smart-api.info/api/suggestion?field="+field;
     var xhr = new XMLHttpRequest();
     xhr.onreadystatechange = function() {
     if (xhr.readyState == 4 && xhr.status == 200) {
        var myArr = JSON.parse(xhr.responseText);
        //alert(JSON.stringify(myArr.field_values.buckets));
       // return myArr.field_values.buckets;
       /* var arrayLength = myArr.field_values.buckets.length;
        for (var i = 0; i < arrayLength; i++) {
        	alert(JSON.stringify(myArr.field_values.buckets[i].key));
        	}*/
        return myArr;
       
    }
  };
     xhr.open('GET',url, true);
     xhr.send();
};
  
    
});
