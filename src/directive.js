/*
   Created by Gabriel Grinberg on 6/13/14.
   */

(function() {
  'use strict';
  angular.module('gg.editableText', ['puElasticInput'])
    .directive('editableText', ['EditableTextHelper', function(EditableTextHelper) {
      return {
        scope: {
          editableText: '=',
          editMode: '=',
          placeholder: '@',
          onChange: '&',
        },
        transclude: true,
        template:
          '<span ng-class="{\'is-placeholder\': placeholder && !editingValue}">' +
            '<input ng-blur="isEditing=false;" ng-click="onInputClick()" ng-keydown="onKeyPress($event)" ng-model="editingValue" placeholder="{{placeholder}}"' + 
              'type="text" pu-elastic-input pu-elastic-input-minwidth="auto" pu-elastic-input-maxwidth="auto" />' +
          // '<span ng-show="isWorking" class="' + EditableTextHelper.workingClassName + '">' + EditableTextHelper.workingText + '</span>' +
          '</span>',
        link: function(scope, elem, attrs) {
          var input = elem.find('input');
          var lastValue;

          // Set the width of the input element on DOM load
          $timeout(function() {
            $(input[0]).width($(elem).width());
          });

          scope.isEditing = !!scope.editMode;

          scope.editingValue = scope.editableText;

          elem.addClass('gg-editable-text');

          scope.onInputClick = function() {
            scope.isEditing = true;
            if (attrs.hasOwnProperty('selectAll')) {
              input.select();
            }
          };

          scope.onKeyPress = function(e) {
            var inputElem = input[0];
            if (e.which === 13) {
              $(inputElem).blur();
              // Kind of a hacky way, would be great to not have to do this
              $timeout(function() {
                $(input[0]).width($(elem).width());
              });
            } else if (e.which === 27) {
              scope.editingValue = scope.editableText;
              $(inputElem).blur();
            }
          };

          scope.$watch('isEditing', function(val, oldVal) {
            var editPromise, inputElm = input[0];
            if (attrs.editMode !== undefined) {
              scope.editMode = val;
            }

            elem[val ? 'addClass' : 'removeClass']('editing');
            if (!val) {
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
        },
      };
    }, ]);
})();
