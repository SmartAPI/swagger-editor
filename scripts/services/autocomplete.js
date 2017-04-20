'use strict';

var angular = require('angular');
var _ = require('lodash');
var yaml = require('yaml-js');
/*
 * Autocomplete service extends Ace's completion mechanism to provide more
 * relevant completion candidates based on Swagger document.
 */
SwaggerEditor.service('Autocomplete', function($rootScope, snippets,
  KeywordMap, Preferences, ASTManager, YAML, $sce, $compile, $window, $http) {
  // Ace KeywordCompleter object

  var flagSrc = "src1";
  var profilerFlag = false;
  var fieldName = "";
  var suggestions = [];
  var identifierSuggestions = [];
  var counts = [];
  var myArr = [];
  var countIndex = 0;
  var mustList = KeywordMap.getMust();
  var check = "";

  var KeywordCompleter = {

    // this method is being called by Ace to get a list of completion candidates
    getCompletions: function(editor, session, pos, prefix, callback) {
      var startTime = Date.now();
      // Do not make any suggestions when autoComplete preference is off

      /* if (!Preferences.get('autoComplete')) {
         return callback(null, []);
       }*/

      // Let Ace select the first candidate
      editor.completer.autoSelect = true;
      check = pos;
      $window.addEventListener('message', function(evt) {
        var ind = 0;
        var outd = 0;
        if (!profilerFlag) {
          var profilerData = yaml.dump(evt.data);
          for (var i = 0, l = evt.data.length; i < l; i++) {
            profilerData = "- " + yaml.dump(evt.data[i]);
            ind = outd = 0;
            while (outd < 6) {
              editor.execCommand("outdent");
              outd++;
            }
            while (ind < 5) {
           // for (var j = 0, k = 6; j < k; j++) {
              editor.execCommand("indent");
              ind++;
            }
            editor.execCommand("insertstring", profilerData);
          }
          profilerFlag = true;
          angular.element('#profiler').remove();
        }
      });

      getPathForPosition(pos, prefix).then(function(path) {
        // These function might shift or push to paths, therefore we're passing
        // a clone of path to them
        if (pos.column > 1) {
          if (path.length === 0) {
            path = ['dummy'];
          } else if (path.length > 3) {
            if (!isNaN(parseInt(path[path.length - 1], 10)))
              path[path.length - 1] = '0';
          }
        }
        var keywordsForPos = getKeywordsForPosition(_.clone(path));
        var snippetsForPos = getSnippetsForPosition(_.clone(path));

        if (_.last(path) === '$ref') {
          return get$refs().then(function($refs) {
            callback(null, $refs);
          });
        }

        // Disable autocomplete and increase debounce time automatically if
        // document is too large (takes more than 200ms to compose AST)
        var totalTime = Date.now() - startTime;
        if (totalTime > 200) {
          console.info('autocomplete took ' + totalTime + 'ms. Turning it off');
          Preferences.set('autoComplete', false);
          Preferences.set('keyPressDebounceTime', totalTime * 3);
        }
        var keywordNsnippet = snippetsForPos.concat(keywordsForPos);
        callback(null, _.uniqBy(keywordNsnippet, 'caption'));
      });
    }
  };

  /*
   * Initializes autocomplete service. This method should be called after editor
   *   is ready
   *
   * @param {object} e - the Ace editor object
   */
  this.init = function(editor) {
    editor.completers = [KeywordCompleter];
  };

  /*
   * Construct an Ace compatible snippet from a snippet object that is made from
   *  snippets made from our snippets
   *
   * @param {object} snippet - a snippet from snippet.js file
   *
   * @returns {object} - an Ace compatible snippet object
   */
  var constructAceSnippet = function(snippet) {
    var snp = '{Required}';
    var score = 550;
    if (mustList.indexOf(snippet.name) === -1)
      snp = '{Recommended}';
    score = 500;
    return {
      caption: snippet.name,
      snippet: snippet.content,
      score: score,
      meta: snp
    };
  };

  /**
   * Gets keyword path for specified position
   *
   * @param {position} pos - AST Mark position
   *
   * @param {prefix} prefix - Prefix
   *
   * @return {Promise<array>} - a list of keywords to reach to provided
   *   position based in the YAML document
   */
  function getPathForPosition(pos, prefix) {
    var value = $rootScope.editorValue;
    var prefixWithoutInsertedChar = prefix.substr(0, prefix.length - 1);
    var lines = value.split('\n');
    var currentLine = lines[pos.row];
    fieldName = currentLine.substring(0, currentLine.indexOf(':'));
    fieldName = fieldName.trim().replace("-", "");
    // if position is at root path is [], quickly resolve to root path
    if (pos.column === 1) {
      return new Promise(function(resolve) {
        resolve([]);
      });
    }
    // if position is at root path is [], quickly resolve to root path

    // if current position is in at a free line with whitespace insert a fake
    // key value pair so the generated AST in ASTManager has current position in
    // editing node
    if (currentLine.replace(prefixWithoutInsertedChar, '').trim() === '') {
      currentLine += 'a: b'; // fake key value pair
      pos.column += 1;
    }

    // append inserted character in currentLine for better AST results
    currentLine += prefix;
    lines[pos.row] = currentLine;
    value = lines.join('\n');

    return ASTManager.pathForPosition(value, {
      line: pos.row,
      column: pos.column
    });
  }

  function getQueryString() {
    var value = $rootScope.editorValue;
    var lines = value.split('\n');
    var currentLine = lines[check.row];

    return currentLine;
  }

  /*
   * Check if a path is match with a matcher path
   * @param {array} path - path
   * @param {array} matcher - matcher
   * @returns {boolean} - true if it's match
   */
  var isMatchPath = function(path, matcher) {
    if (!_.isArray(path) || !_.isArray(matcher)) {
      return false;
    }

    if (path.length !== matcher.length) {
      return false;
    }

    for (var i = 0, l = path.length; i < l; i++) {
      var matches = (new RegExp(matcher[i])).test(path[i]);

      // if it's not matching quickly return false
      if (!matches) {
        return false;

        // only return true if it's last item in path and it matches
      } else if (i === l - 1) {
        return true;
      }
    }

    return true;
  };

  /*
   * Gest filter function for snippets based on a cursor position
   *
   * @param {object} - cursor position
   *
   * @returns {function} - filter function for selection proper snippets based
   *  on provided position
   */
  var filterForSnippets = function(path) {
    return function filter(snippet) {
      return isMatchPath(path, snippet.path);
    };
  };

  /*
   * With a given object returns the child that it's key matches provided key
   *
   * @param {object} object - the object to look into
   * @param {key} - the key used for lookup
   *
   * @returns {object} - the object that is matched
   */
  var getChild = function(object, key) {
    var keys = Object.keys(object);
    var regex;

    for (var i = 0; i < keys.length; i++) {
      regex = new RegExp(keys[i]);

      if (regex.test(key) && object[keys[i]]) {
        return object[keys[i]];
      }
    }
  };

  /**
   * Gets array of keywords based on a position
   *
   * @param {array} path - the path to get keywords from
   *
   * @return {array} - list of keywords for provided position
   */
  function getKeywordsForPosition(path) {
    flagSrc = "src1";
    var keywordsMap = KeywordMap.get();
    var key = path.shift();
    var field = key;
    var pathLocalName = "";
    if (path[1] === undefined)
      path[1] = fieldName;
    if (path[1] !== undefined)
      field = key + "." + path[0] + "." + path[1];
    if (path[0] !== undefined) {
      if (path[0].indexOf("/") === 0) {
        field = 'operations.' + path[2] + '.' + path[path.length - 1];
      }

      pathLocalName = field;
      if (pathLocalName.indexOf('0') !== -1) {
        pathLocalName += fieldName.trim();
        pathLocalName = pathLocalName.replace('0', "");
      }
      if (pathLocalName.indexOf("responseDataType") !== -1) {
        //	'<button ng-click="showIframe = !showIframe">X</button>
        $rootScope.html = '<iframe id="profiler" width="800" height="1000" frameborder="0"  src="http://smart-api.info/profiler/" ng-if="!showIframe"></iframe>';
        $rootScope.profiler = $sce.trustAsHtml($rootScope.html);
      }
      /* if (pathLocalName.indexOf("parameterValueType") !== -1) {
        identifiers = getSuggestedIdentifiers("http://localhost:5000/api/v1/search?q=protein");
        flagSrc = "src3";
        keywordsMap = identifiers;
        keywordsMap.map(constructAceCompletion);

      }*/

      if (path.length > 1 && path[path.length - 1] !== '0') {
        pathLocalName = path[path.length - 1];
      }
    }
    // is getting path was not successful stop here and return no candidates
    if (!_.isArray(path)) {
      return [];
    }
    // traverse down the keywordsMap for each key in the path until there is
    // no key in the path
    while (key && _.isObject(keywordsMap)) {
      // _.forOwn(keywordsMap, function(value, key) { if (key === "name") {alert(key+"**"+value);}} );
      keywordsMap = getChild(keywordsMap, key);
      var oldkey = key;
      key = path.shift();
      if (key === undefined && oldkey.indexOf('0') !== -1) {
        key = fieldName;
      }
    }
    // if no keywordsMap was found after the traversal return no candidates
    if (!_.isObject(keywordsMap)) {
      //	this is one of our keys
      // 	do a search
      //	if empty then
      if (pathLocalName === "parameterValueType") {
        var queryString = getQueryString();
        while (queryString.length < 0) {
          queryString = getQueryString();
        }
        queryString = (queryString.replace("-", "")).replace(/\s+/g, '');
        identifierSuggestions = getSuggestedIdentifiers("http://localhost:5000/api/v1/search?q=" + queryString);
        var pvtURL = Preferences.get('suggestionServiceBasePath') + 'operations.parameters.parameterValueType';
        suggestions = [];
        var repoSuggestions = getSuggestedValues(pvtURL);
        _.pull(repoSuggestions, 'string');
        suggestions = identifierSuggestions;
       /* if (_.intersection(repoSuggestions, identifierSuggestions) !== null){
          suggestions = _.intersection(repoSuggestions, identifierSuggestions);
        }*/
        flagSrc = "src3";
        keywordsMap = suggestions;
        keywordsMap.map(constructAceCompletion);
      } else if (KeywordMap.getNonSuggestible().indexOf(pathLocalName) === -1 && pathLocalName !== undefined) {
        flagSrc = "src2";
        suggestions = [];
        if (field.indexOf('.0') !== -1) {
          field = pathLocalName;
        }
        var url = Preferences.get('suggestionServiceBasePath') + field;
        suggestions = getSuggestedValues(url);
        keywordsMap = suggestions;
        keywordsMap.map(constructAceCompletion);

       /* xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            myArr = JSON.parse(xhr.responseText);
            var arrayLength = myArr.field_values.buckets.length;
            for (var i = 0; i < arrayLength; i++) {
              suggestions.push(myArr.field_values.buckets[i].key);
              counts.push(myArr.field_values.buckets[i].doc_count);
            }
            keywordsMap = suggestions;
            keywordsMap.map(constructAceCompletion);
          }
        };
        xhr.open('GET', url, false);
        xhr.send();*/
      }

      // otherwise store the values in the map
    }

    // if keywordsMap is an array of strings, return the array as list of
    // suggestions
    if (_.isArray(keywordsMap) && keywordsMap.every(_.isString)) {
      // if (flag)
      // flag = true;
      return keywordsMap.map(constructAceCompletion);
    }

    // If keywordsMap is describing an array unwrap the inner map so we can
    // suggest for array items
    if (_.isArray(keywordsMap)) {
      keywordsMap = keywordsMap[0];
    }

    // if keywordsMap is not an object at this point return no candidates
    if (!_.isObject(keywordsMap)) {
      return [];
    }

    // for each key in keywordsMap map construct a completion candidate and
    // return the array
    return _.keys(keywordsMap).map(constructAceCompletion);
  }

  /**
   * Constructs an Ace compatible completion candidate from a keyword
   *
   * @param {string} keyword - keyword
   *
   * @return {object} - Ace compatible completion candidate
   */
  function constructAceCompletion(keyword) {
    var shouldList = KeywordMap.getShould();
    // var suggestibleList = KeywordMap.getSuggestible();
    var level = '';
    var meta = 'keyword';
    var score = 300;
    if (flagSrc === "src1") {
      if (shouldList.indexOf(keyword) === -1) {
        level = 'may';
        meta = 'Optional';
      } else {
        level = 'should';
        meta = 'Recommended';
        score = 350;
      }
    } else if (flagSrc === "src2") {
      countIndex = _.findIndex(myArr.field_values.buckets, function(o) {
        return o.key === keyword;
      });
      if (counts[countIndex] === undefined)
        counts[countIndex] = 0;
      level = 'should';
      meta = 'Frequency=' + counts[countIndex];
      score = 350 + parseInt(counts[countIndex], 10);
    } else {
      countIndex = _.findIndex(myArr.field_values.buckets, function(o) {
        return o.key === keyword;
      });
      if (counts[countIndex] === undefined)
        counts[countIndex] = 0;
      level = 'should';
      meta = 'Frequency=' + counts[countIndex];
      score = 350 + parseInt(counts[countIndex], 10);
    }
    return {
      caption: keyword,
      name: keyword,
      value: keyword,
      score: score,
      smartAPIlevel: level,
      meta: meta
    };
  }

  /**
   * Gets array of snippets based on a position
   *
   * @param {array} path - the path to get snippets from
   *
   * @return {array} - list of snippets for provided position
   */
  function getSnippetsForPosition(path) {
    // find all possible snippets, modify them to be compatible with Ace and
    // sort them based on their position. Sorting is done by assigning a score
    // to each snippet, not by sorting the array
    return snippets
      .filter(filterForSnippets(path))
      .map(constructAceSnippet)
      .map(snippetSorterForPos(path));
  }

  /**
   * Returns a function that gives score to snippet based on their position
   *
   * Note: not fully implemented method
   *
   * @param {object} path - current cursor position
   *
   * @return {function} - applies snippet with score based on position
   */
  function snippetSorterForPos(path) {
    // this function is used in Array#map
    return function sortSnippets(snippet) {
      // by default score is high
      var score = 1000;

      // if snippets content has the keyword it will get a lower score because
      // it's more likely less relevant
      // (FIX) is this logic work for all cases?
      path.forEach(function(keyword) {
        if (snippet.snippet.indexOf(keyword)) {
          score = 500;
        }
      });

      snippet.score = score;

      return snippet;
    };
  }

  /**
   * Returns values for $ref JSON Pointer references
   *
   * @return {Promise<array>} - list of auto-complete suggestions for $ref
   * values
   */
  function get$refs() {
    return new Promise(function(resolve) {
      YAML.load($rootScope.editorValue, function(err, json) {
        if (err) {
          return resolve([]);
        }

        var definitions = _.keys(json.definitions).map(function(def) {
          return '"#/definitions/' + def + '"';
        });
        var parameters = _.keys(json.parameters).map(function(param) {
          return '"#/parameters/' + param + '"';
        });
        var responses = _.keys(json.responses).map(function(resp) {
          return '"#/responses/' + resp + '"';
        });

        var allRefs = definitions.concat(parameters).concat(responses);

        resolve(allRefs.map(function(ref) {
          return {
            name: ref,
            value: ref,
            score: 500,
            meta: '$ref'
          };
        }));
      });
    });
  }

  function getSuggestedValues(url) {
    suggestions = [];
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        myArr = JSON.parse(xhr.responseText);
        var arrayLength = myArr.field_values.buckets.length;
        for (var i = 0; i < arrayLength; i++) {
          suggestions.push(myArr.field_values.buckets[i].key);
          counts.push(myArr.field_values.buckets[i].doc_count);
        }
      }
    };
    xhr.open('GET', url, false);
    xhr.send();
    return suggestions;
  }

  function getSuggestedIdentifiers(elasticURL) {
    var idfs = [];
    var newArr = [];
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        newArr = JSON.parse(xhr.responseText);
        var arrayLength = newArr.length;
        for (var i = 0; i < arrayLength; i++) {
          idfs.push(newArr[i].url);
         // counts.push(4);
        }
      }
    };
    xhr.open('GET', elasticURL, false);
    xhr.send();
    return idfs;
  }
});
