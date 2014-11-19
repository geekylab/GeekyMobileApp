(function () {
    //var directivesModule = angular.module('geekyMenuMobile.directives', ['geekyMenuMobile.services', 'geekyMenuMobile.config']);
    var directivesModule = angular.module('geekyMenuMobile.directives', ['geekyMenuMobile']);

    directivesModule.directive('geekyBackgroundImage', function (UserSettings) {
        return {
            restrict: 'A',
            scope: {
                geekyBackgroundImage: '@'
            },
            link: function (scope, element, attrs) {
                var unwatch = scope.$watch('geekyBackgroundImage', function (v) {
                    if (v != '') {
                        var data = angular.fromJson(v);
                        if (data.length > 0) {
                            var url = UserSettings.apiHostname;
                            var str = 'url(' + url + data[0].path + ')';
                            element.css('background-image', str);
                        }
                        //console.log(data);
                    }
                });
            }
        }
    });

    directivesModule.directive('geekyGettext', function (UserSettings) {
        var setElementText = function (scope, element, attrs) {
            var defaultLang = UserSettings.defaultLang;
            var systemDefaultLang = UserSettings.systemDefaultLang;
            if (attrs.geekyGettext != undefined && attrs.geekyGettext != '') {
                var data = attrs.geekyGettext;
                data = angular.fromJson(data);
                if (data[defaultLang] != undefined) {
                    element.text(data[defaultLang]);
                } else {
                    element.text(data[systemDefaultLang]);
                }
            }
        };

        return {
            restrict: 'A',
            scope: {            // scopeにオブジェクトを指定すると、分離スコープの作成.
                geekyGettext: '@' // '='は双方向バインディング
            },
            transclude: true,
            link: function (scope, element, attrs) {
                var unwatch = scope.$watch('geekyGettext', function (v) {
                    setElementText(scope, element, attrs)
                });
            }
        };
    });

    directivesModule.directive('menuFood', function () {
        return {
            restrict: 'E',
            templateUrl: 'template-includes/store-menu-food.html'
        };
    });

    directivesModule.directive('menuDrinks', function () {
        return {
            restrict: 'E',
            templateUrl: "template-includes/store-menu-drinks.html"
        };
    });

    directivesModule.directive('menuTopItems', function () {
        return {
            restrict: 'E',
            templateUrl: "template-includes/store-menu-top-items.html"
        };
    });

    directivesModule.directive('menuItem', function () {
        return {
            restrict: 'E',
            templateUrl: 'template-includes/store-menu-order-item.html'
        };
    });

    directivesModule.directive('order', function () {
        return {
            restrict: 'E',
            templateUrl: 'template-includes/store-menu-order.html'
        };
    });

    directivesModule.directive('cartShortcut', function () {
        return {
            restrict: 'E',
            controller: function ($scope, DB, Model, OrderFactory) {

            },
            templateUrl: 'template-includes/store-menu-cart-shortcut.html'
        };
    });

})
();