/**
 * Private method doing the factory
 */
function actionButtonFactory($rootScope, $compile, $ionicBody, $animate, $ionicTabsDelegate) {
  return {
    create: actionButton
  };

  function actionButton(options) {
    var scope = $rootScope.$new(true);
    var visible = true;
    scope.options = options;
    scope.options.removeOnStateChange = true;
    scope.options.bottom = scope.options.hasTab ? '55px' : '15px';
    scope.options.menuBottom = scope.options.hasTab ? '115px' : '90px';
    scope.menuOpened = false;
    // Compile the template
    var element = scope.element = $compile(
      '<material-action-button on-create="show()" options="options" dispatcher="buttonClicked(data)"></material-action-button>'
    )(scope);
    var mainButtonElement;
    var secondaryButtonsContainer;
    //append to the body
    $ionicBody.append(element);
    /**
     * Button remove
     */
    scope.removeButton = function() {
      if (scope.removed) {
        return;
      }
      scope.removed = true;
      return $animate.addClass(mainButtonElement, 'action-button-hide').then(function() {
        visible = false;
        scope.$destroy();
        element.remove();
        return;
      });
    };
    /**
     * Button clicked
     */
    scope.buttonClicked = function(data) {
      //we handle main button clicks
      if (data.type === 'main') {
        //if we have secondary actions...
        if (data.openMenu) {
          //if menu is opened, we close it
          if (scope.menuOpened) {
            element.removeClass('action-button-menu-show');
            element.addClass('action-button-menu-hide');
            $animate.addClass(secondaryButtonsContainer, 'action-button-small-hide').then(function() {
              secondaryButtonsContainer.removeClass('action-button-small-show');
              secondaryButtonsContainer.removeClass('action-button-small-hide');
              secondaryButtonsContainer.addClass('action-button-small-container__hidden');
              scope.menuOpened = false;
            });
          } else {
            //if menu is closed, we open it
            element.removeClass('action-button-menu-hide');
            element.addClass('action-button-menu-show');
            secondaryButtonsContainer.removeClass('action-button-small-container__hidden');
            $animate.addClass(secondaryButtonsContainer, 'action-button-small-show').then(function() {
              scope.menuOpened = true;
            });
          }
        } else {
          //if we don't have secondary actions
          if (scope.options.mainAction.onClick) {
            return scope.options.mainAction.onClick(data.ngEvent);
          }
          return;
        }
      }
      if (data.type === 'secondary') {
        if (scope.options.buttons[data.index].onClick) {
          return scope.options.buttons[data.index].onClick(data.ngEvent, data.index);
        }
        return;
      }
    };
    /**
     * Show the menu
     */
    scope.show = function() {
      $animate.addClass(element, 'button-active') //hack to wait till the element is appended? dont know...
        .then(function() {
          visible = true;
          mainButtonElement = angular.element(element[0].getElementsByClassName('action-button'));
          secondaryButtonsContainer = angular.element(element[0].getElementsByClassName(
            'action-button-small-container'));
          if (scope.options.startHidden) {
            return;
          }
          return $animate.addClass(mainButtonElement, 'action-button-show');
        });
    };
    scope.showButton = function() {
      return $animate.addClass(mainButtonElement, 'action-button-show').then(function() {
        visible = true;
        return;
      });
    };
    scope.hideButton = function() {
      return $animate.addClass(mainButtonElement, 'action-button-hide').then(function() {
        mainButtonElement.removeClass('action-button-show');
        mainButtonElement.removeClass('action-button-hide');
        element.removeClass('action-button-menu-hide');
        visible = false;
        return;
      });
    };
    //auto remove when state changes
    $rootScope.$on('$stateChangeSuccess', function() {
      if (scope.options.removeOnStateChange) {
        scope.removeButton();
        return;
      }
    });
    return {
      show: function() {
        return scope.showButton();
      },
      hide: function() {
        return scope.hideButton();
      },
      visible: function() {
        return visible;
      }
    };
  }
}
/**
 * Action Button module is initialized here
 */
angular.module('$actionButton', ['ngAnimate'])
  .factory('$actionButton', [
    '$rootScope',
    '$compile',
    '$ionicBody',
    '$animate',
    '$ionicTabsDelegate',
    actionButtonFactory
  ])
  .component('materialActionButton', {
    templateUrl: 'template.html',
    bindings: {
      options: '<',
      dispatcher: '&',
      onCreate: '&'
    },
    controller: [
      '$timeout',
      function($timeout) {
        var _this = this;
        // this.opened = false;
        this.closeMenu = function(data) {
          //we simulate a main button touch order to close
          data.openMenu = true;
          _this.dispatcher({
            data: data
          });
          return;
        };
        this.$postLink = function() {
          $timeout(function() {
            _this.onCreate();
          });
        };
        this.buttonClicked = function(data) {
          //if the element has no buttons configured...
          if (!_this.options.buttons || !_this.options.buttons.length) {
            _this.dispatcher({
              data: data
            });
            return;
          }
          //if the element has buttons configured...
          //we pass the openMenu true prop...
          if (data.type === 'main') {
            data.openMenu = true;
            _this.dispatcher({
              data: data
            });
            return;
          }
          //any other click here has to be from a small button
          _this.dispatcher({
            data: data
          });
        };
      }
    ]
  });