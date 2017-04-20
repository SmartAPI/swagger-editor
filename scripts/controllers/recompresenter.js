'use strict';

var yaml = require('yaml-js');
// var _ = require('lodash');
var angular = require('angular');
var changeCase = require('change-case');

SwaggerEditor.controller('RecomPresenterCtrl', function RecomPresenterCtrl($scope, $uibModal,
  $stateParams, $state, $rootScope, Storage, Builder, FileLoader, Editor,
  Codegen, Preferences, YAML, defaults, strings, $localStorage, $http) {
  var recomArray = [{
    info: ["termsOfService"]
  }, {
    parameters: ["parameterType", "parameterValueType"]
  }, {
    responses: ["responseDataType"]
  }, "produces", "schemes", "externalDocs"];
  var keys = [];
  var str = "";
  // var flag = false;
  // get the editor json document
  $scope.getEditorValueJS = function() {
    var value = $rootScope.editorValue;
    Storage.save('yaml', value);
    var jsonObject = yaml.load(value);

    return jsonObject;
  };

  $scope.findRecomValue = function() {
    $scope.recoms = [];
    $scope.recomLinks = [];
    var editorObj = $scope.getEditorValueJS();
    $scope.traverseObject(editorObj);
    $scope.searchObject(recomArray);
  };

  $scope.traverseObject = function(obj) {
    angular.forEach(obj, function(value, key) {
      if (typeof value === 'object') {
        $scope.traverseObject(value);
      }
      keys.push(key);
    });
    return keys;
  };

  $scope.searchObject = function(obj) {
    angular.forEach(obj, function(value, key) {
      if (angular.isArray(value) || angular.isObject(value)) {
        if (typeof key === 'string') {
          str = key;
        }
        $scope.searchObject(value);
      } else if (keys.indexOf(value) === -1) {
        if (recomArray.indexOf(value) === -1) {
          $scope.recoms.push(str + "." + value);
        } else {
          $scope.recoms.push(value);
        }
        value = changeCase.headerCase(value);
        value = changeCase.lowerCase(value);
        $scope.recomLinks.push("https://websmartapi.github.io/smartapi_specification/#" + value);
      }
    });
  };

  $scope.isCollapsed = true;

  /**
   * Toggle the collapsed state of the modal
   *
   */
  $scope.toggleCollapse = function() {
    $scope.isCollapsed = !$scope.isCollapsed;
    $scope.findRecomValue();
  };
});
