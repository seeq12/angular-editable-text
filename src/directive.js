/*
   Created by Gabriel Grinberg on 6/13/14.
   */

(function() {
  'use strict';
  angular.module('gg.editableText', ['puElasticInput'])
    .directive('editableText', ['$timeout', 'EditableTextHelper', function ($timeout, EditableTextHelper) {
      return {
        scope: {
          editableText: '=',
          editMode: '=',
          placeholder: '@',
          onChange: '&'
        },
        transclude: true,
        template: '<span ng-class="{\'is-placeholder\': placeholder && !editingValue}" tooltip-placement="bottom" tooltip="Rename">' +
          '<input ng-blur="isEditing=false;" ng-click="onInputClick()" ng-keydown="onKeyPress($event)" ng-model="editingValue" placeholder="{{placeholder}}" type="text" pu-elastic-input pu-elastic-input-minwidth="auto" pu-elastic-input-maxwidth="auto" />' +
          '<span ng-hide="isEditing" ng-transclude></span>' +
          '<span ng-show="isWorking" class="' + EditableTextHelper.workingClassName + '">' + EditableTextHelper.workingText + '</span>' +
          '</span>',
        link: function (scope, elem, attrs) {
          var input = elem.find('input');
          var lastValue;

          scope.isEditing = !!scope.editMode;

          scope.editingValue = scope.editableText;

          elem.addClass('gg-editable-text');

          scope.spanClick = function(e) {
            console.log(e);
            scope.isEditing = true;
          }

          scope.onInputClick = function() {
            scope.isEditing = true;
          }

          scope.onKeyPress = function(e) {
            console.log(e);
            var inputElem = input[0];
            if (e.which === 13) {
              $(inputElem).blur();
              return;
            }
          }

          scope.$watch('isEditing', function (val, oldVal) {
            var editPromise, inputElm = input[0];
            if (attrs.editMode !== undefined) {
              scope.editMode = val;
            }

            elem[val ? 'addClass' : 'removeClass']('editing');
            if (val) {
            } else {
              if (attrs.onChange && val !== oldVal && scope.editingValue != lastValue) {
                //accept promise, or plain function..
                editPromise = scope.onChange({value: scope.editingValue});
                if (editPromise && editPromise.then) {
                  scope.isWorking = true;
                  editPromise.then(function(value) {
                    scope.editableText = scope.editingValue = value;
                    scope.isWorking = false;
                  }, function() {

                    scope.editingValue = scope.editableText;
                    scope.isWorking = false;
                  });
                } else if (editPromise) {
                  scope.editableText = scope.editingValue = editPromise;
                } else {
                  scope.editingValue = scope.editableText;
                }
              } else {
                scope.editableText = scope.editingValue;
              }
            }
          });

          scope.$watch('editMode', function(val) {
            scope.isEditing = !!val;
          });

          scope.$watch('editableText', function(newVal) {
            lastValue = newVal;
            scope.editingValue = newVal;
          });
        }
      };
    }]);
})();

