'use strict';

SwaggerEditor.config(function($provide) {
  var operationRegex = 'get|put|post|delete|options|head|patch';
  /**
   * Makes an HTTP operation snippet's content based on operation name
   *
   * @param {string} operationName - the HTTP verb
   *
   * @return {string} - the snippet content for that operation
  */
  function makeOperationSnippet(operationName) {
  
    return [
      '${1:' + operationName + '}:',
      '  summary: ${2}',
      '  description: ${2}',
      '  parameters:',
      '  responses:',
      '    ${3:200:}',
      '      description: ${4:OK}',
      '${5}'
    ].join('\n');
  }
  
      
  
  
  /**
   * Makes an HTTP response code snippet's content based on code
   *
   * @param {string} code - HTTP Response Code
   *
   * @return {string} - Snippet content
  */
  function makeResponseCodeSnippet(code) {
    return [
      '${1:' + code + '}:',
      '  description: ${2}',
      '${3}'
    ].join('\n');
  }

  $provide.constant('snippets', [
    
    {
      name: 'info',
      trigger: 'info',
      path: [],
      content: [
        'info:',
        '  version: ${1:0.0.0}',
        '  title: ${2}',
        '  description: ${3}',
        '  termsOfService: ${4}',
        '  contact:',
        '    name: ${7}',
        '    url: ${8}',
        '    email: ${9}',
        '${10}'
      ].join('\n')
    },	
	
	{
      name: 'contact',
      trigger: 'contact',
      path: ['info'],
      content: [
        'contact:',
        '  name: ${1}',
        '  responsibleOrganization: ${2}',
        '  responsibleDeveloper: ${3}',
        '  url: ${4}',
        '  email: ${5}',
        '${6}'
      ].join('\n')
    },	
    
    {
      name: 'schemes',
      trigger: 'schemes',
      path: [],
      content: [
        'schemes:',
        '	- ${1}',
        '${2}'
      ].join('\n')
    },
    
    {
      name: 'paths',
      trigger: 'pa',
      path: [],
      content: [
        'paths:',
        '  ${1}'
      ].join('\n')
    },

    {
      name: 'definitions',
      trigger: 'def',
      path: [],
      content: [
        'definitions:',
        '  ${1}'
      ].join('\n')
    },

    {
      name: 'path',
      trigger: 'path',
      path: ['paths'],
      content: [
        '/${1}:',
        '  ${2}'
      ].join('\n')
    },

    {
      name: 'get',
      trigger: 'get',
      path: ['paths', '.'],
      content: makeOperationSnippet('get')
    },

    {
      name: 'post',
      trigger: 'post',
      path: ['paths', '.'],
      content: makeOperationSnippet('post')
    },

    {
      name: 'put',
      trigger: 'put',
      path: ['paths', '.'],
      content: makeOperationSnippet('put')
    },

    {
      name: 'delete',
      trigger: 'delete',
      path: ['paths', '.'],
      content: makeOperationSnippet('delete')
    },

    {
      name: 'patch',
      trigger: 'patch',
      path: ['paths', '.'],
      content: makeOperationSnippet('patch')
    },

    {
      name: 'options',
      trigger: 'options',
      path: ['paths', '.'],
      content: makeOperationSnippet('options')
    },

    // operation level parameter
    {
      name: 'parameter',
      trigger: 'param',
      path: ['paths', '.', '.', 'parameters'],
      content: [
        '- name: ${1}',
        '  in: ${2}',
        '  description: ${3}',
        '  type: ${4}',
        '${5}'
      ].join('\n')
    },
    
     // other level parameter
    {
      name: 'parameter',
      trigger: 'param',
      path: ['dummy'],
      content: [
        '- name: ${1}',
        '  in: ${2}',
        '  description: ${3}',
        '  type: ${4}',
        '${5}'
      ].join('\n')
    },

    // path level parameter
    {
      name: 'parameter',
      trigger: 'param',
      path: ['paths', '.', 'parameters'],
      content: [
        '- name: ${1:parameter_name}',
        '  in: ${2:path}',
        '  required: true',
        '  description: ${3:description}',
        '  type: ${4:string}',
        '${5}'
      ].join('\n')
    },
	
    {
      name: 'response',
      trigger: 'resp',
      path: ['paths', '.', '.', 'responses'],
      content: [
        '${1:code}:',
        '  description: ${2}',
        '  schema: ${3}',
        '${4}'
      ].join('\n')
    },

    {
      name: '200',
      trigger: '200',
      path: ['paths', '.', operationRegex, 'responses'],
      content: makeResponseCodeSnippet('200')
    },

    {
      name: '300',
      trigger: '300',
      path: ['paths', '.', operationRegex, 'responses'],
      content: makeResponseCodeSnippet('300')
    },

    {
      name: '400',
      trigger: '400',
      path: ['paths', '.', operationRegex, 'responses'],
      content: makeResponseCodeSnippet('400')
    },

    {
      name: '500',
      trigger: '500',
      path: ['paths', '.', operationRegex, 'responses'],
      content: makeResponseCodeSnippet('500')
    },

    {
      name: 'model',
      trigger: 'mod|def',
      regex: 'mod|def',
      path: ['definitions'],
      content: [
        '${1:ModelName}:',
        '  properties:',
        '    ${2}'
      ]
    }
  ]);
});
