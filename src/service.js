/**
 * Based on gg.editableText, originally created by Gabriel Grinberg on 6/13/14.
 */
(function() {
  'use strict';
  angular.module('gg.editableText').provider('EditableTextHelper', EditableTextHelper);

  function EditableTextHelper() {

    var workingText = '';
    var workingClassName = '';

    this.setWorkingText = function(text) {
      workingText = text;
      return this;
    };

    this.setWorkingClassName = function(name) {
      workingClassName = name;
      return this;
    };

    this.$get = function() {
      return {
        workingText: workingText,
        workingClassName: workingClassName
      };
    };

  }
})();
