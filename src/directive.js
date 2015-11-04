/*
   Created by Gabriel Grinberg on 6/13/14.
   */

(function() {
  'use strict';
  angular.module('gg.editableText', ['puElasticInput'])
    .directive('editableText', ['$timeout', 'EditableTextHelper', function($timeout, EditableTextHelper) {
      return {
        scope: {
          editableText: '=',
          editMode: '=',
          placeholder: '@',
          onChange: '&',
          onReject: '&'
        },
        transclude: true,
        template:
          '<span ng-class="{\'is-placeholder\': placeholder && !editingValue}" ng-style="{\'max-width\': \'inherit\'}" >' +
            '<input ng-blur="onInputBlur()" ng-click="onInputClick()" ng-keydown="onKeyPress($event)" ng-model="editingValue" placeholder="{{placeholder}}"' +
              'type="text" pu-elastic-input pu-elastic-input-minwidth="auto" pu-elastic-input-maxwidth="inherit" />' +

          // '<span ng-show="isWorking" class="' + EditableTextHelper.workingClassName + '">' + EditableTextHelper.workingText + '</span>' +
          '</span>',
        link: function(scope, elem, attrs) {
          var input = elem.find('input');
          var lastValue;

          scope.isEditing = !!scope.editMode;

          scope.editingValue = scope.editableText;

          elem.addClass('gg-editable-text');

          scope.onInputClick = function() {
            scope.isEditing = true;
            if (attrs.hasOwnProperty('selectAll')) {
              input.select();
            }
          };

          $timeout(function() {
            $(input[0]).width($(elem).width());
          });

          scope.onInputBlur = function() {
            scope.isEditing = false;

            // Kind of a hacky way, would be great to not have to do this
            $timeout(function() {
              $(input[0]).width($(elem).width());
            });
          };

          scope.onKeyPress = function(e) {
            var inputElem = input[0];
            if (e.which === 13) {
              $(inputElem).blur();
            } else if (e.which === 27) {
              scope.editingValue = scope.editableText;
              $(inputElem).blur();
            }
          };

          scope.$watch('isEditing', function(val, oldVal) {
            var editPromise;
            var inputElm = input[0];
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

                    if (scope.onReject) {
                      scope.onReject();
                    }

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
    } ]);
})();
