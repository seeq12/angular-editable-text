/**
 * Based on gg.editableText, originally created by Gabriel Grinberg on 6/13/14.
 */

(function () {
  'use strict';
  angular.module('gg.editableText', ['puElasticInput']);

})();

/**
 * Based on gg.editableText, originally created by Gabriel Grinberg on 6/13/14.
 */

(function () {
  'use strict';
  angular.module('gg.editableText').directive('ggEditableText', ggEditableText);

  function ggEditableText($rootScope, $q, $timeout, EditableTextHelper) {
    return {
      restrict: 'EA',
      scope: {
        editableText: '=ggEditableText',
        isEditing: '=ggIsEditing',
        showEllipsis: '=ggShowEllipsis',
        placeholder: '@',
        autocomplete: '@',
        onChange: '&ggOnChange'
      },
      transclude: true,
      template:
        '<span ng-class="{\'is-placeholder\': placeholder && !editingValue}" ng-style="{\'max-width\': \'inherit\'}" >' +
          '<input class="no-animate" ng-show="!showEllipsis || (isEditing && showEllipsis)" ng-focus="onInputFocus()" ' +
            'ng-blur="onInputBlur()" ng-keydown="onKeyPress($event)" ' +
            'ng-model="editingValue" ng-attr-autocomplete="{{autocomplete}}" ng-attr-placeholder="{{placeholder}}" type="text" ' +
            'pu-elastic-input pu-elastic-input-minwidth="inherit" pu-elastic-input-maxwidth="100%" />' +
          '<div class="no-animate" ng-show="!isEditing && showEllipsis" ng-click="onInputFocus()">{{editingValue}}</div>' +
          '<span class="no-animate" ng-hide="isEditing" ng-transclude></span>' +
          '<span class="no-animate" ng-show="isWorking && EditableTextHelper.workingText.length" class="' +
            EditableTextHelper.workingClassName + '">' +
            EditableTextHelper.workingText + '</span>' +
        '</span>',
      link: link
    };

    function link(scope, elem, attrs) {
      var input, lastValue;

      activate();

      /**
       * Initialize the directive
       */
      function activate() {
        elem.addClass('gg-editable-text');

        input = elem.find('input')[0];
        scope.editingValue = scope.editableText;

        scope.$watch('isEditing', onIsEditing);
        scope.$watch('editableText', function (newVal) {
          lastValue = newVal;
          scope.editingValue = newVal;
          checkSelectAll();
        });
      }

      /**
       * Handler for 'focus' event from input field
       */
      scope.onInputFocus = function () {
        scope.isEditing = true;
      };

      /**
       * Handler for 'blur' event from input field
       */
      scope.onInputBlur = function () {
        scope.isEditing = false;
      };

      /**
       * Handler for 'keypress' event from input field
       * @param {Object} e - $event for keypress event
       */
      scope.onKeyPress = function (e) {
        if (e.which === 13) {
          // Enter/Return key
          $(input).blur();

          // If keep-focus attribute set, call onInputFocus again after processing the change
          if (attrs.hasOwnProperty('ggKeepFocus')) {
            $timeout(scope.onInputFocus, 20);
          }
        } else if (e.which === 27) {
          // Escape key
          scope.editingValue = scope.editableText;
          $(input).blur();
        }
      };

      /**
       * Select all text in input field if proper conditions exist
       */
      function checkSelectAll() {
        if (scope.isEditing && attrs.hasOwnProperty('ggSelectAll')) {
          scope.$applyAsync(function () {
            input.focus();
            input.setSelectionRange(0, scope.editingValue.length);
          });
        }
      }

      /**
       * Process changes in/out of edit mode, calling onChange handler when isEditing transitions to false
       * @param {Boolean} isEditing - New value of isEditing
       * @param {Boolean} oldIsEditing - Previous value of isEditing
       */
      function onIsEditing(isEditing, oldIsEditing) {
        elem[isEditing ? 'addClass' : 'removeClass']('editing');
        if (isEditing) {

          input.focus();
          checkSelectAll();

        } else {
          if (attrs.hasOwnProperty('ggOnChange') && isEditing !== oldIsEditing && scope.editingValue !== lastValue) {
            scope.isWorking = true;

            // Wrap the return of onChange so that promises and values are treated the same.
            $q.when(scope.onChange({ value: scope.editingValue }))
              .then(
                function (value) {
                  if (typeof value !== 'undefined') {
                    scope.editingText = scope.editingValue = value;
                  }
                },

                function () {
                  scope.editingValue = scope.editableText;
                })
              .finally(function () {
                scope.isWorking = false;
                checkSelectAll();
              });
          } else {
            scope.editableText = scope.editingValue;
            checkSelectAll();
          }
        }
      }
    }
  }
})();

/**
 * Based on gg.editableText, originally created by Gabriel Grinberg on 6/13/14.
 */
(function () {
  'use strict';
  angular.module('gg.editableText').provider('EditableTextHelper', EditableTextHelper);

  function EditableTextHelper() {

    var workingText = '';
    var workingClassName = '';

    this.setWorkingText = function (text) {
      workingText = text;
      return this;
    };

    this.setWorkingClassName = function (name) {
      workingClassName = name;
      return this;
    };

    this.$get = function () {
      return {
        workingText: workingText,
        workingClassName: workingClassName
      };
    };

  }
})();
