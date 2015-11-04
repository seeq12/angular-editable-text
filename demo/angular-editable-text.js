/**
 * Created by Gabriel_Grinberg on 6/13/14.
 */

(function() {
  'use strict';
  angular.module('gg.editableText', []);

})();

/*
   Created by Gabriel Grinberg on 6/13/14.
   */

(function() {
  'use strict';
<<<<<<< HEAD
  angular.module('gg.editableText')
    .directive('editableText', ['EditableTextHelper', function(EditableTextHelper) {
=======
  angular.module('gg.editableText', ['puElasticInput'])
<<<<<<< HEAD
    .directive('editableText', ['$timeout', 'EditableTextHelper', function ($timeout, EditableTextHelper) {
>>>>>>> Added dependency on elastic input
=======
    .directive('editableText', ['EditableTextHelper', function(EditableTextHelper) {
>>>>>>> Added 'selectAll' attribute, to automatically select the contents of the input when editing starts
      return {
        scope: {
          editableText: '=',
          editMode: '=',
          placeholder: '@',
          onChange: '&'
        },
        transclude: true,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        template: '<span ng-class="{\'is-placeholder\': placeholder && !editingValue}">' +
        '<input ng-show="isEditing" ng-blur="isEditing=false;" ng-keypress="($event.which === 13) && (isEditing = false)" ng-model="editingValue" placeholder="{{placeholder}}"/>' +
        '<span ng-hide="isEditing || isWorking" class="original-text" tabindex="0" ng-click="isEditing=true" ng-focus="isEditing=true;">{{placeholder ? (editingValue ? editingValue : placeholder) : editingValue}}</span>' +
        '<span ng-hide="isEditing" ng-transclude></span>' +
        '<span ng-show="isWorking" class="' + EditableTextHelper.workingClassName + '">' + EditableTextHelper.workingText + '</span>' +
        '</span>',
        link: function(scope, elem, attrs) {
=======
        template: '<span ng-class="{\'is-placeholder\': placeholder && !editingValue}" tooltip-placement="bottom" tooltip="Rename">' +
=======
        template: '<span ng-class="{\'is-placeholder\': placeholder && !editingValue}">' +
>>>>>>> General cleanup
          '<input ng-blur="isEditing=false;" ng-click="onInputClick()" ng-keydown="onKeyPress($event)" ng-model="editingValue" placeholder="{{placeholder}}" type="text" pu-elastic-input pu-elastic-input-minwidth="auto" pu-elastic-input-maxwidth="auto" />' +
=======
        template:
          '<span ng-class="{\'is-placeholder\': placeholder && !editingValue}">' +
            '<input ng-blur="isEditing=false;" ng-click="onInputClick()" ng-keydown="onKeyPress($event)" ng-model="editingValue" placeholder="{{placeholder}}"' + 
              'type="text" pu-elastic-input pu-elastic-input-minwidth="auto" pu-elastic-input-maxwidth="auto" />' +
>>>>>>> Minor fixes, including escape behavior
          // '<span ng-show="isWorking" class="' + EditableTextHelper.workingClassName + '">' + EditableTextHelper.workingText + '</span>' +
          '</span>',
<<<<<<< HEAD
        link: function (scope, elem, attrs) {
>>>>>>> Added dependency on elastic input
=======
        link: function(scope, elem, attrs) {
>>>>>>> Added 'selectAll' attribute, to automatically select the contents of the input when editing starts
          var input = elem.find('input');
          var lastValue;

          // Set the width of the input element on DOM load
          $timeout(function() {
            $(input[0]).width($(elem).width());
          });

          scope.isEditing = !!scope.editMode;

          scope.editingValue = scope.editableText;

          elem.addClass('gg-editable-text');

<<<<<<< HEAD
<<<<<<< HEAD
          scope.$watch('isEditing', function(val, oldVal) {
            var editPromise;
            var inputElm = input[0];
=======
          scope.spanClick = function(e) {
            console.log(e);
            scope.isEditing = true;
          };

=======
>>>>>>> General cleanup
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
>>>>>>> Added dependency on elastic input
            if (attrs.editMode !== undefined) {
              scope.editMode = val;
            }

            elem[val ? 'addClass' : 'removeClass']('editing');
<<<<<<< HEAD
            if (val) {
<<<<<<< HEAD
              inputElm.focus();
              inputElm.selectionStart = inputElm.selectionEnd = scope.editingValue ? scope.editingValue.length : 0;

              //fix for FF
=======
>>>>>>> Added dependency on elastic input
            } else {
=======
            if (!val) {
>>>>>>> General cleanup
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
<<<<<<< HEAD
        }
      };
    }]);
=======
        },
      };
    },]);
>>>>>>> Added 'selectAll' attribute, to automatically select the contents of the input when editing starts
})();

/**
 * Created by Gabriel_Grinberg on 6/29/14.
 */
'use strict';
(function() {
  angular.module('gg.editableText')
        .provider('EditableTextHelper', function() {

          var workingText = 'Working..';
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

        });
})();

