angular.module('app', ['onsen', 'ngResource']);
var hostname = 'http://192.168.111.103';
angular.module('app').controller('AppController', function ($scope, $http) {

    $scope.nearStores = [];
    $scope.isLoading = false;

    $scope.findStoreByGPS = function () {
        $scope.isLoading = true;
        $scope.nearStores = [];
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                $http.get(hostname + '/open-api/store/near/' + position.coords.longitude + '/' + position.coords.latitude)
                    .success(function (data) {
                        $scope.nearStores = data;
                        $scope.isLoading = false;
                    });
            }, function (error) {
                alert(error);
            });
        }
    };

    $scope.findStoreByGPS();

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

    $scope.doSomething = function () {
        console.log('doSomething');

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

}).factory('Store', function ($resource) {
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
