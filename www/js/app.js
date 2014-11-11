(function () {
    //var hostname = 'http://192.168.111.102';
    var app = angular.module('geekyMenuMobile', ['onsen', 'ngResource', 'geekyMenuMobile.services', 'geekyMenuMobile.controllers', 'geekyMenuMobile.directives', 'geekyMenuMobile.config']);

    app.value('HOST_NAME', 'http://192.168.111.102');

    app.run(function (DB) {
        DB.init();
    });

    if (window.cordova) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        document.addEventListener("DOMContentLoaded", onDeviceReady, false);
    }

    function onDeviceReady() {
        angular.bootstrap(document, ['geekyMenuMobile']);
        if (navigator && navigator.splashscreen)
            navigator.splashscreen.hide();

        console.log('onDeviceReady');
    }

    app.controller('AppController', function ($scope, $http, HOST_NAME) {
        $scope.nearStores = [];
        $scope.isLoading = false;

        console.log('AppController');
        console.log(HOST_NAME);

        $scope.findStoreByGPS = function () {
            $scope.isLoading = true;
            $scope.nearStores = [];
            if (navigator && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    $http.get('http://192.168.111.102' + '/open-api/store/near/' + position.coords.longitude + '/' + position.coords.latitude)
                        .success(function (data) {
                            $scope.nearStores = data;
                            $scope.isLoading = false;
                        });
                }, function (error) {
                    alert(error);
                });
            }
        };

        //console.log(navigator.globalization);
        //setTimeout(function () {
        //    console.log(navigator.globalization);
        //}, 1000);

        $scope.$on('fblogin', function (name, response) {
            console.log("AppController event");
            console.log(response);
            $scope.isLogin = true;
        });
    });

    app.controller('LoginController', function ($scope, $http, MyUser) {
        $scope.loadingFlg = false;
        $scope.isLoggedIn = false;
        $scope.user = MyUser.user();

        if ($scope.user) {
            MyUser.isLogin()
                .then(function (isLoggedIn) {
                    $scope.isLoggedIn = isLoggedIn;
                }, function (err) {
                    //error
                    console.log(err);
                }, function () {
                    $scope.loadingFlg = true;
                    $scope.modal.show();
                }).finally(function () {
                    $scope.loadingFlg = false;
                    $scope.modal.hide();
                });
        }

        $scope.doLogin = function () {
            MyUser.login()
                .then(function (response) {
                    $scope.isLoggedIn = true;
                    $scope.user = response;
                }, function (err) {
                    $scope.isLoggedIn = false;
                    console.log(err);
                }, function () {
                    $scope.loadingFlg = true;
                    $scope.modal.show();
                }).finally(function () {
                    $scope.loadingFlg = false;
                    $scope.modal.hide();
                });
        };

        $scope.doLogout = function () {
            MyUser.logout()
                .then(function (response) {
                    $scope.isLoggedIn = false;
                }, function () {
                    alert('error');
                });
        };

    });
})
();
