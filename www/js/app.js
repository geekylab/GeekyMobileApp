var hostname = 'http://192.168.111.102';
angular.module('app', ['onsen', 'ngResource']);
angular.module('app').controller('AppController', function($scope, $http) {
    $scope.nearStores = [];
    $scope.isLoading = false;

    $scope.findStoreByGPS = function() {
        $scope.isLoading = true;
        $scope.nearStores = [];
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                $http.get(hostname + '/open-api/store/near/' + position.coords.longitude + '/' + position.coords.latitude)
                    .success(function(data) {
                        $scope.nearStores = data;
                        $scope.isLoading = false;
                    });
            }, function(error) {
                alert(error);
            });
        }
    };

    $scope.findStoreByGPS();


    //$scope.doSomething = function () {
    //    setTimeout(function () {
    //        myNavigator.pushPage('page2.html', {animation: 'slide'})
    //    }, 100);
    //};
    //
    //$scope.refresh = function () {
    //    $http.get('http://192.168.111.103/api/item').
    //        success(function (json) {
    //            $scope.items = json;
    //        }).
    //        error(function (data, status, headers, config) {
    //            // called asynchronously if an error occurs
    //            // or server returns response with an error status.
    //            alert(status);
    //        });
    //};
    //
    //$scope.refresh();

}).controller('LoginController', function ($scope, $http) {

    $scope.nome = "tets";
    $scope.isLoggedIn = false;

    $scope.doSomething = function () {

        if (!window.cordova) {
            var appId = prompt("Enter FB Application ID", "");
            facebookConnectPlugin.browserInit(appId);
        }

        //facebookConnectPlugin.api("me/?fields=id,email", ["public_profile"],
        //    function (response) {
        //        console.log(response)
        //    },
        //    function (response) {
        //        console.log(response)
        //    });

        facebookConnectPlugin.login(["email", "user_friends"],
            function (response) {
                console.log(response);
                $scope.nome = "success";
                $scope.isLoggedIn = true;

                facebookConnectPlugin.api("me", ["user_friends"],
                    function (response) {
                        console.log(response)
                    },
                    function (response) {
                        console.log(response)
                    });

            },
            function (response) {
                $scope.nome = "falied";
                console.log(response);
            });

    };

}).controller('StoreController', function($scope) {
    $scope.storeInfo = {
        id: '1',
        name: 'Awesome Restaurant',
        desc: 'Meat specialties',
        open_days: 'everyday',
        open_time: 'From 10am to 10pm',
        rating: 3.7,
        address: 'Av. Pres. Wilson, 2131 - Santos/SP',
        location: {
            lat: '-23.9691553',
            long: '-46.3750582'
        },
        phone: '1'
    };

}).factory('Store', function($resource) {
    return $resource(hostname + '/open-api/store/:id/:lang/:longitude/:latitude', {
        id: '@_id'
    }, {
        update: {
            method: 'PUT',
            params: {
                id: "@_id"
            }
        },
        near: {
            method: 'get',
            params: {
                longitude: "@longitude",
                latitude: "@latitude"
            }
        }
    });
});
