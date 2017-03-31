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
      '		#add parameter snippet',
      '     ${3}',
      '  responses:',
      '    ${4:200:}',
      '      description: ${5:OK}',
      '		 #optional: insert more response elements',
      '      ${6}',
      '${7}'
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
        '  # add "contact" info:',
        '  ${5}'
      ].join('\n')
    },

    {
      name: 'contact',
      trigger: 'contact',
      path: ['info'],
      content: [
        'contact:',
        '  responsibleOrganization: ${1}',
        '  responsibleDeveloper: ${2}',
        '  url: ${3}',
        '  email: ${4}',
        '  # optional: add more contact metadata',
        '${5}'
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
        '  #insert a "path" snippet',
        '  ${1}'
      ].join('\n')
    },

    {
      name: 'parameterValueType',
      trigger: 'parameterValueType',
      path: ['paths', '.', '.', 'parameters', '0'],
      content: [
        'parameterValueType:',
        ' #enter search term(s) followed by a SPACE. Then hit CTRL-SPACE to get the identifiers',
        ' - ${1}'
      ].join('\n')
    },

    {
      name: 'responseDataType',
      trigger: 'responseDataType',
      path: ['paths', '.', '.', 'responses', '.'],
      content: [
        'responseDataType:',
        ' #Press CTRL-SPACE. The Profiler will open on the right panel',
        ' ${1}'
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
        '/${1}: #choose a name for your path',
        '	#add the http operation snippet',
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
        'required: ${5}',
        '#optional: insert another parameter snippet',
        '${6}'
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
        'required: ${5}',
        '${6}'
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
