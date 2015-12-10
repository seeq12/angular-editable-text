/**
 * Based on gg.editableText, originally created by Gabriel Grinberg on 6/13/14.
 */

(function() {
  'use strict';
  angular.module('gg.editableText', ['puElasticInput']);

})();

/**
 * Based on gg.editableText, originally created by Gabriel Grinberg on 6/13/14.
 */

(function() {
  'use strict';
  angular.module('gg.editableText').directive('ggEditableText', ggEditableText);

  function ggEditableText($rootScope, $q, EditableTextHelper) {
    return {
      restrict: 'EA',
      scope: {
        editableText: '=ggEditableText',
        editMode: '=ggIsEditing',
        placeholder: '@',
        onChange: '&ggOnChange'
      },
      transclude: true,
      template:
        '<span ng-class="{\'is-placeholder\': placeholder && !editingValue}" ng-style="{\'max-width\': \'inherit\'}" >' +
          '<input ng-blur="onInputBlur()" ng-click="onInputClick()" ng-keydown="onKeyPress($event)" ng-model="editingValue" ' +
            'placeholder="{{placeholder}}" type="text" pu-elastic-input pu-elastic-input-minwidth="auto" pu-elastic-input-maxwidth="inherit" />' +
          '<span ng-hide="isEditing" ng-transclude></span>' +
          '<span ng-show="isWorking && EditableTextHelper.workingText.length" class="' + EditableTextHelper.workingClassName + '">' +
            EditableTextHelper.workingText + '</span>' +
        '</span>',
      link: link
    };

    function link(scope, elem, attrs) {
      var input = elem.find('input');
      var lastValue;
      var wasClicked = false;

      scope.$watch('isEditing', onIsEditing);
      scope.$watch('editMode', function(val) {
        scope.isEditing = !!val;
      });

      scope.$watch('editableText', function(newVal) {
        lastValue = newVal;
        scope.editingValue = newVal;
      });

      $rootScope.$evalAsync(function() {
        $(input[0]).width($(elem).width());
      });

      scope.isEditing = !!scope.editMode;
      scope.editingValue = scope.editableText;

      elem.addClass('gg-editable-text');

      scope.onInputClick = function() {
        scope.isEditing = true;
        wasClicked = true;
      };

      scope.onInputBlur = function() {
        scope.isEditing = false;

        // Kind of a hacky way, would be great to not have to do this
        $rootScope.$evalAsync(function() {
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

      function onIsEditing(isEditing, oldIsEditing) {
        var inputElm = input[0];
        if (!attrs.hasOwnProperty('ggEditMode')) {
          scope.editMode = isEditing;
        }

        elem[isEditing ? 'addClass' : 'removeClass']('editing');
        if (isEditing) {
          inputElm.focus();
          if (!wasClicked) {
            inputElm.selectionStart = inputElm.selectionEnd = scope.editingValue ? scope.editingValue.length : 0;
          }

          wasClicked = false;

          if (attrs.hasOwnProperty('ggSelectAll')) {
            inputElm.select();
          }

        } else {
          if (attrs.hasOwnProperty('ggOnChange') && isEditing !== oldIsEditing && scope.editingValue !== lastValue) {
            scope.isWorking = true;

            // Wrap the return of onChange so that promises and values are treated the same.
            $q.when(scope.onChange({ value: scope.editingValue }))
              .then(
                function(value) {
                  if (typeof value !== 'undefined') {
                    scope.editingText = scope.editingValue = value;
                  }
                },

                function() {
                  scope.editingValue = scope.editableText;
                })
              .finally(function() {
                scope.isWorking = false;
              });
          } else {
            scope.editableText = scope.editingValue;
          }
        }
      }
    }
  }
})();

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
