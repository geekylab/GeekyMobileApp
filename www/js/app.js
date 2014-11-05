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

    $scope.$on('fblogin', function(name, response) {
        console.log("AppController event");
        console.log(response);
        $scope.isLogin = true;
    });
}).controller('LoginController', function($scope, $http, MyUser) {

    $scope.loadingFlg = false;
    $scope.isLoggedIn = false;
    $scope.user = MyUser.user();

    if ($scope.user) {
        MyUser.isLogin()
            .then(function(isLoggedIn) {
                $scope.isLoggedIn = isLoggedIn;
            }, function(err) {
                //error
                console.log(err);
            }, function() {
                $scope.loadingFlg = true;
                $scope.modal.show();
            }).finally(function() {
                $scope.loadingFlg = false;
                $scope.modal.hide();
            });
    }

    $scope.doLogin = function() {
        MyUser.login()
            .then(function(response) {
                $scope.isLoggedIn = true;
                $scope.user = response;
            }, function(err) {
                $scope.isLoggedIn = false;
                console.log(err);
            }, function() {
                $scope.loadingFlg = true;
                $scope.modal.show();
            }).finally(function() {
                $scope.loadingFlg = false;
                $scope.modal.hide();
            });

    };

    $scope.doLogout = function() {
        MyUser.logout()
            .then(function(response) {
                $scope.isLoggedIn = false;
            }, function() {
                alert('error');
            });
    };

}).controller('StoreController', function($scope) {
    $scope.storeInfo = {
        _id: '1',
        name: 'Awesome Restaurant',
        desc: 'Meat specialties',
        open_days: 'everyday',
        open_time: 'From 10am to 10pm',
        public_rating: 3.7,
        my_rating: 5,
        address: 'Av. Pres. Wilson, 2131 - Santos/SP',
        location: {
            lat: '-23.9691553',
            long: '-46.3750582'
        },
        features: {
            'kids_space': true,
            'parking': true,
            'smoke': true,
            'non_smoke': true
        },
        phone: '1'
    };

    $scope.rateStore = function() {

    };

}).controller('SearchController', function($scope) {
    $scope.searchResults = [
        {
            _id: '1',
            name: 'Awesome Restaurant',
            desc: 'Meat specialties',
            open_days: 'everyday',
            open_time: 'From 10am to 10pm',
            public_rating: 3.7,
            my_rating: 5,
            address: 'Av. Pres. Wilson, 2131 - Santos/SP',
            location: {
                lat: '-23.9691553',
                long: '-46.3750582'
            },
            features: {
                'kids_space': true,
                'parking': true,
                'smoking': true,
                'non_smoking': true
            },
            phone: '1'
        }
    ];

    $scope.showStoreDetails = function(storeId) {
        $scope.ons.navigator.pushPage('store.html', {storeId: storeId});
    };

    $scope.searchStores = function(searchFilter) {
        console.log(searchFilter);

        $scope.ons.navigator.pushPage('search-results.html');
    };

    $scope.getFeatureClass = function(status) {
        return {
            'feature-active': status,
            'feature-inactive': !status
        }
    };

}).factory('MyUser', function($rootScope, $q, $http, $timeout) {
    var storeUserKey = 'currentUser';

    var fbPlugin = facebookConnectPlugin;
    var currentUser = JSON.parse(window.localStorage.getItem(storeUserKey));

    var isLogin = false;
    if (currentUser && currentUser._id != undefined)
        isLogin = true;

    return {
        login: function() {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.notify('In progress')
            }, 0);
            facebookConnectPlugin.login(["email"],
                function(response) {
                    $http.post(hostname + '/open-api/auth/facebook/token', {access_token: response.authResponse.accessToken}).
                        success(function(user) {
                            isLogin = true;
                            currentUser = user;
                            facebookConnectPlugin.api("/me/picture?redirect=0&type=small&width=60", ["basic_info"],
                                function(res) {
                                    currentUser.imageUrl = res.data.url;
                                    window.localStorage.setItem(storeUserKey, JSON.stringify(currentUser));
                                    $rootScope.$broadcast('fblogin', currentUser);
                                    deferred.resolve(currentUser);
                                }, function() {
                                    console.log('error');
                                    deferred.reject('error');
                                }
                            );
                        }).error(function(err) {
                            deferred.reject(err);
                        });
                }, function(response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }, api: function(path) {
            var deferred = $q.defer();
            facebookConnectPlugin.api(path, ["basic_info"],
                function(response) {
                    deferred.resolve(response);
                },
                function(response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }, logout: function() {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.notify('In progress')
            }, 0);
            this.isLogin()
                .then(function(res) {
                    if (res) {
                        facebookConnectPlugin.logout(
                            function(response) {
                                console.log('fb_logout');
                                isLogin = false;
                                currentUser = {};
                                $rootScope.$broadcast('fblogout');
                                window.localStorage.removeItem(storeUserKey);
                                $http.get(hostname + '/open-api/logout').
                                    success(function () {
                                        deferred.resolve(response);
                                    })
                                    .error(function (err) {
                                        deferred.reject(err);
                                    });
                            },
                            function(response) {
                                isLogin = false;
                                console.log('fb_logout error');
                                console.log(response);
                                deferred.reject(response);
                            });
                    }
                });
            return deferred.promise;
        },
        isLogin: function() {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.notify('In progress')
            }, 0);
            facebookConnectPlugin.getLoginStatus(function(data) {
                deferred.resolve(data.status == "connected");
            }, function(response) {
                deferred.reject(response);
            });
            return deferred.promise;
        },
        user: function() {
            return currentUser;
        }
    }

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
