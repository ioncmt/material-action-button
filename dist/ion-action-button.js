function actionButtonFactory(t, n, o, e, i) {
  function a(i) {
    var a = t.$new(!0),
      s = !0;
    a.options = i, a.options.removeOnStateChange = !0, a.options.bottom = a.options.hasTab ? "55px" : "15px", a.options
      .menuBottom = a.options.hasTab ? "115px" : "90px", a.menuOpened = !1;
    var c, u, l = a.element = n(
      '<material-action-button on-create="show()" options="options" dispatcher="buttonClicked(data)"></material-action-button>'
    )(a);
    return o.append(l), a.removeButton = function() {
      if (!a.removed) return a.removed = !0, e.addClass(c, "action-button-hide").then(function() {
        s = !1, a.$destroy(), l.remove()
      })
    }, a.buttonClicked = function(t) {
      if ("main" === t.type) {
        if (!t.openMenu) {
          if (a.options.mainAction.onClick) return a.options.mainAction.onClick(t.ngEvent);
          return
        }
        a.menuOpened ? (l.removeClass("action-button-menu-show"), l.addClass("action-button-menu-hide"), e.addClass(u,
          "action-button-small-hide").then(function() {
          u.removeClass("action-button-small-show"), u.removeClass("action-button-small-hide"), u.addClass(
            "action-button-small-container__hidden"), a.menuOpened = !1
        })) : (l.removeClass("action-button-menu-hide"), l.addClass("action-button-menu-show"), u.removeClass(
          "action-button-small-container__hidden"), e.addClass(u, "action-button-small-show").then(function() {
          a.menuOpened = !0
        }))
      }
      if ("secondary" !== t.type);
      else if (a.options.buttons[t.index].onClick) return a.options.buttons[t.index].onClick(t.ngEvent, t.index)
    }, a.show = function() {
      e.addClass(l, "button-active").then(function() {
        if (s = !0, c = angular.element(l[0].getElementsByClassName("action-button")), u = angular.element(l[0].getElementsByClassName(
            "action-button-small-container")), !a.options.startHidden) return e.addClass(c, "action-button-show")
      })
    }, a.showButton = function() {
      return e.addClass(c, "action-button-show").then(function() {
        s = !0
      })
    }, a.hideButton = function() {
      return e.addClass(c, "action-button-hide").then(function() {
        c.removeClass("action-button-show"), c.removeClass("action-button-hide"), l.removeClass(
          "action-button-menu-hide"), s = !1
      })
    }, t.$on("$stateChangeSuccess", function() {
      if (a.options.removeOnStateChange) return void a.removeButton()
    }), {
      show: function() {
        return a.showButton()
      },
      hide: function() {
        return a.hideButton()
      },
      visible: function() {
        return s
      }
    }
  }
  return {
    create: a
  }
}
angular.module("$actionButton", ["ngAnimate"]).factory("$actionButton", ["$rootScope", "$compile", "$ionicBody",
  "$animate", "$ionicTabsDelegate", actionButtonFactory
]).component("materialActionButton", {
  templateUrl: "template.html",
  bindings: {
    options: "<",
    dispatcher: "&",
    onCreate: "&"
  },
  controller: ["$timeout", function(t) {
    var n = this;
    this.closeMenu = function(t) {
      t.openMenu = !0, n.dispatcher({
        data: t
      })
    }, this.$postLink = function() {
      t(function() {
        n.onCreate()
      })
    }, this.buttonClicked = function(t) {
      return n.options.buttons && n.options.buttons.length && "main" === t.type ? (t.openMenu = !0, void n.dispatcher({
        data: t
      })) : void n.dispatcher({
        data: t
      })
    }
  }]
}), angular.module("$actionButton").run(["$templateCache", function(t) {
  t.put("template.html",
    '\r\n<div ng-animate-children="true">\r\n\t<div class="action-button-small-container" ng-click="$ctrl.closeMenu({type: \'main\', backgroundClick: true})" ng-style="{\'padding-bottom\':$ctrl.options.menuBottom}">\r\n\t\t<div class="action-button-small-container--individual" ng-repeat="button in $ctrl.options.buttons" ng-click="$ctrl.buttonClicked({ngEvent:$event, type: \'secondary\', index: $index})">\r\n\t\t\t<span class="action-button-small--label" ng-if="button.label">{{button.label}}</span>\r\n\t\t\t<button class="action-button-small" ng-class="{\'destructive\': button.destructive}">\r\n\t\t\t\t<i class="action-button-small--icon icon" ng-class="button.icon"><span class="action-button-small--icon__label" ng-if="!button.icon">{{button.letter || button.label[0]}}</span></i>\r\n\t\t\t</button>\r\n\t\t</div>\r\n\t</div>\r\n\t<button class="action-button" ng-click="$ctrl.buttonClicked({ngEvent:$event, type: \'main\'})" ng-style="{bottom:$ctrl.options.bottom}">\r\n\t\t<i class=\'action-button--icon icon action-button--icon__main\' ng-class="$ctrl.options.mainAction.icon"></i>\r\n\t\t<i class=\'action-button--icon action-button-icon__close\' ng-class="$ctrl.options.mainAction.closeIcon"></i>\r\n\t</button>\r\n</div>\r\n'
  )
}]);
//# sourceMappingURL=maps/ion-action-button.js.map