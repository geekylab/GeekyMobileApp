(function () {
    var hostname = 'http://192.168.111.103';
    var app = angular.module('app', ['onsen', 'ngResource']);


    if (window.cordova) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        document.addEventListener("DOMContentLoaded", onDeviceReady, false);
    }

    function onDeviceReady() {
        angular.bootstrap(document, ['app']);
        if (navigator && navigator.splashscreen)
            navigator.splashscreen.hide();
    }


    app.controller('AppController', function ($scope, $http) {
        $scope.nearStores = [];
        $scope.isLoading = false;

        //navigator.globalization.getPreferredLanguage(
        //    function (language) {alert('language: ' + language.value + '\n');},
        //    function () {alert('Error getting language\n');}
        //);


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

        //console.log(navigator.globalization);
        //setTimeout(function () {
        //    console.log(navigator.globalization);
        //}, 1000);

        $scope.$on('fblogin', function (name, response) {
            console.log("AppController event");
            console.log(response);
            $scope.isLogin = true;
        });
    }).controller('LoginController', function ($scope, $http, MyUser) {

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

    }).controller('StoreController', function ($scope, Data, Store) {
        var storeId = Data.getData('storeId');
        $scope.storeInfo = {};

        Store.get({id: storeId}, function (data) {
            $scope.storeInfo = data;
            console.log($scope.storeInfo);
        });

        //$scope.storeInfo = {
        //    _id: '1',
        //    store_name: {"br":"McDonald's Sao vicente","us":"McDonald's Sao vicente","jp":"マクドナルド サンビセンテ"},
        //    desc: 'Meat specialties',
        //    open_days: 'everyday',
        //    open_time: 'From 10am to 10pm',
        //    public_rating: 3.7,
        //    my_rating: 5,
        //    address: 'Av. Pres. Wilson, 2131 - Santos/SP',
        //    location: {
        //        lat: '-23.9691553',
        //        long: '-46.3750582'
        //    },
        //    features: {
        //        'kids_space': true,
        //        'parking': true,
        //        'smoke': true,
        //        'non_smoke': true
        //    },
        //    phone: '1'
        //};

        $scope.storeTopItems = [
            {
                _id: 1,
                type: 1,
                name: 'Feijoada do Johna',
                desc: 'Feijoada do Johna',
                price: {
                    brl: 25.00,
                    yen: 1000.00,
                    usd: 10.00
                },
                image: 'feijoada_johna.jpg',
                serve: 4
            },
            {
                _id: 2,
                type: 1,
                name: 'Carbonara do Johna',
                desc: 'Carbonara do Johna',
                price: {
                    brl: 50.00,
                    yen: 2500.00,
                    usd: 25.00
                },
                image: 'carbonara_johna.jpg',
                serve: 2
            },
            {
                _id: 3,
                type: 2,
                name: 'Cerveja Kirin Ichiban',
                desc: 'Cerveja Kirin Ichiban',
                price: {
                    brl: 10.00,
                    yen: 400.00,
                    usd: 4.00
                },
                image: 'cerveja_kirin.jpg',
                serve: 1
            }
        ];

        $scope.showItemDetail = function (itemId) {

        };

        $scope.openMap = function (location) {
            window.open("http://maps.apple.com/maps?ll=" + location[0] + ',' + location[1], '_system');
        };

        $scope.showStoreMenu = function () {
            $scope.searchNavigator.pushPage('store-menu.html');
        };

        $scope.searchBox = false;
        $scope.toggleSearch = function () {
            $scope.searchBox = !$scope.searchBox;
        };

        $scope.searchBox = false;
        $scope.toggleSearch = function () {
            $scope.searchBox = !$scope.searchBox;
        };

        $scope.orderedItem = null;
        $scope.showOrderModal = function (item) {
            $scope.orderedItem = item;
            $scope.orderModal.show();
        };

        $scope.itemQuant = 1;
        $scope.addItem = function () {
            $scope.itemQuant++;
            $scope.$apply();
        };

        $scope.removeItem = function () {
            if ($scope.itemQuant > 0) {
                $scope.itemQuant--;
                $scope.$apply();
            }
        }

    }).controller('SearchResultsController', function ($scope, SearchService, UserSettings, Data) {

        $scope.searchResults = SearchService.getResult();
        $scope.searchFilter = SearchService.getFilter();
        $scope.userSettings = UserSettings;


        $scope.getImageUrl = function (store) {
            return $scope.userSettings.apiHostname + store.images[0].path;
        };

        $scope.getFeatureClass = function (feature, targetOpts) {
            var idx = targetOpts.indexOf(feature);

            return {
                'feature-active': idx != -1,
                'feature-inactive': idx == -1
            }
        };

        $scope.showStoreDetails = function (storeId) {
            Data.setData('storeId', storeId);
            $scope.searchNavigator.pushPage('store.html#' + storeId);
        };


    }).controller('SearchController', function ($scope, $http, SearchService, UserSettings) {

        $scope.isSearching = false;
        $scope.userSettings = UserSettings;
        $scope.searchFilter = {
            store_name: 'store_name',
            region_name: 'test',
            features: []
        };

        //    [
        //    {
        //        _id: '1',
        //        name: 'Awesome Restaurant',
        //        desc: 'Meat specialties',
        //        open_days: 'everyday',
        //        open_time: 'From 10am to 10pm',
        //        public_rating: 3.7,
        //        my_rating: 5,
        //        address: 'Av. Pres. Wilson, 2131 - Santos/SP',
        //        location: {
        //            lat: '-23.9691553',
        //            long: '-46.3750582'
        //        },
        //        features: {
        //            'kids_space': true,
        //            'parking': true,
        //            'smoking': true,
        //            'non_smoking': true
        //        },
        //        phone: '1'
        //    }
        //];

        $scope.searchStores = function () {
            $scope.isSearching = true;
            SearchService.setFilter($scope.searchFilter);
            $http.post(hostname + '/open-api/store/search', $scope.searchFilter)
                .success(function (result) {
                    $scope.isSearching = false;
                    $scope.searchResults = result;
                    SearchService.setResult(result);
                    $scope.searchNavigator.pushPage('search-results.html');
                }).error(function () {
                    alert('error');
                });

//        $scope.searchNavigator.pushPage('search-results.html');
        };

        $scope.featuresToggleCheck = function (feature) {
            var idx = $scope.searchFilter.features.indexOf(feature);
            if (angular.equals(idx, -1)) {
                $scope.searchFilter.features.push(feature);
            }
            else {
                $scope.searchFilter.features.splice(idx, 1);
            }
        };

        $scope.showStoreMenu = function (searchFilter) {
            $scope.searchNavigator.pushPage('store-menu.html');
        };

    }).factory('MyUser', function ($rootScope, $q, $http, $timeout) {
        var storeUserKey = 'currentUser';

        var fbPlugin = facebookConnectPlugin;
        var currentUser = JSON.parse(window.localStorage.getItem(storeUserKey));

        var isLogin = false;
        if (currentUser && currentUser._id != undefined)
            isLogin = true;

        return {
            login: function () {
                var deferred = $q.defer();
                $timeout(function () {
                    deferred.notify('In progress')
                }, 0);
                facebookConnectPlugin.login(["email"],
                    function (response) {
                        $http.post(hostname + '/open-api/auth/facebook/token', {access_token: response.authResponse.accessToken}).
                            success(function (user) {
                                isLogin = true;
                                currentUser = user;
                                facebookConnectPlugin.api("/me/picture?redirect=0&type=small&width=60", ["basic_info"],
                                    function (res) {
                                        currentUser.imageUrl = res.data.url;
                                        window.localStorage.setItem(storeUserKey, JSON.stringify(currentUser));
                                        $rootScope.$broadcast('fblogin', currentUser);
                                        deferred.resolve(currentUser);
                                    }, function () {
                                        console.log('error');
                                        deferred.reject('error');
                                    }
                                );
                            }).error(function (err) {
                                deferred.reject(err);
                            });
                    }, function (response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }, api: function (path) {
                var deferred = $q.defer();
                facebookConnectPlugin.api(path, ["basic_info"],
                    function (response) {
                        deferred.resolve(response);
                    },
                    function (response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }, logout: function () {
                var deferred = $q.defer();
                $timeout(function () {
                    deferred.notify('In progress')
                }, 0);
                this.isLogin()
                    .then(function (res) {
                        if (res) {
                            facebookConnectPlugin.logout(
                                function (response) {
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
                                function (response) {
                                    isLogin = false;
                                    console.log('fb_logout error');
                                    console.log(response);
                                    deferred.reject(response);
                                });
                        }
                    });
                return deferred.promise;
            },
            isLogin: function () {
                var deferred = $q.defer();
                $timeout(function () {
                    deferred.notify('In progress')
                }, 0);
                facebookConnectPlugin.getLoginStatus(function (data) {
                    deferred.resolve(data.status == "connected");
                }, function (response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            user: function () {
                return currentUser;
            }
        }

    })
    /**
     * factories
     */
        .factory('Data', function () {
            var data = {};
            return {
                setData: function (key, val) {
                    data[key] = val;
                },
                getData: function (key) {
                    if (data[key] != undefined) {
                        return data[key];
                    }
                    return null;
                }
            }
        })
        .factory('SearchService', function () {
            var result = [];
            var filter = {};
            return {
                setResult: function (res) {
                    result = res;
                },
                getResult: function () {
                    return result;
                },
                setFilter: function (f) {
                    filter = f;
                },
                getFilter: function () {
                    return filter;
                }
            }
        }).factory('UserSettings', function () {
            return {
                defaultLang: 'us',
                systemDefaultLang: 'us',
                apiHostname: hostname,
                features: [
                    'parking',
                    'wifi',
                    'live_show',
                    'kids_space',
                    'non_smoking'
                ]
            }
        }).factory('Store', function ($resource) {
            return $resource(hostname + '/open-api/store/:id/:lang/:longitude/:latitude', {
                id: '@_id'
            }, {
                update: {
                    method: 'PUT',
                    params: {
                        id: "@id"
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
        })

    /**
     * directives
     */
        .directive('geekyBackgroundImage', function (UserSettings) {
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
                            console.log(data);
                        }
                    });
                }
            }
        })
        .directive('geekyGettext', function (UserSettings) {

            var setTextElement = function (scope, element, attrs) {
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
                        setTextElement(scope, element, attrs)
                    });
                }
            };
        });
})();
