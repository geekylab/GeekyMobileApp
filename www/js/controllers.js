(function () {
    var controllersModule = angular.module('geekyMenuMobile.controllers', ['geekyMenuMobile', 'geekyMenuMobile.services', 'geekyMenuMobile.controllers', 'geekyMenuMobile.directives', 'geekyMenuMobile.config']);

    controllersModule.controller('DocumentCtrl', function ($scope, Model, Data, DB, OrderFactory) {
        $scope.buttonText = 'Adicionar Item';
        $scope.items = [];
        $scope.item = null;
        $scope.order = null;
        $scope.orderStatus = null;

        Model.all('order_items').then(function (items) {
            $scope.items = items;
        });

        Model.all('orders').then(function (orders) {
            $scope.orders = orders;
        });

        Model.getById('order_items', 2).then(function (item) {
            $scope.item = item;
        });

        Model.getById('orders', 1).then(function (order) {
            $scope.order = order;
        });

        var where = ' status = 1';
        Model.where('orders', where).then(function (order) {
            $scope.orderStatus = order;
        });

        $scope.addItem = function () {
            var insertQuery = 'INSERT INTO order_items (name, quantity, price) VALUES ("Teste", 10, 2.63)';
            DB.query(insertQuery);
        };
    });

    controllersModule.controller('StoreController', function ($scope, Data, Store, Model, ORDER_STATUSES) {
        var storeId = Data.getData('storeId');
        $scope.storeInfo = {};

        Store.get({id: storeId}, function (data) {
            $scope.storeInfo = data;
        });

        $scope.openMap = function (location) {
            window.open("geo:" + location[1] + ',' + location[0], '_system');
        };

        $scope.openDialer = function (tel) {
            console.log(tel);
            if (tel)
                window.open('tel:' + tel, '_system');
            else
                console.log('no number');
        };

        /* TODO: RATING */
        //var intRating = parseInt($scope.storeInfo.public_rating);
        //$scope.ratingFull = [];
        //for (i = 0; i < intRating; i++) {
        //    $scope.ratingFull[i] = i;
        //}
        //$scope.ratingHalf = 0;
        //if ($scope.storeInfo.public_rating % 2 > 0) {
        //    $scope.ratingHalf = 1;
        //}
        //$scope.ratingEmpty = new Array(5 - (intRating + $scope.ratingHalf));

        $scope.showStoreMenu = function () {
            Data.setData('store', $scope.storeInfo);
            $scope.searchNavigator.pushPage('store-menu.html');
        };
    });

    controllersModule.controller('StoreMenuController', function ($scope, Data, Store, Model, OrderFactory) {
        //MenuFactory.getStorMenu(storeId).then(function(menuItems){

        $scope.showFood = false;
        $scope.showDrinks = false;
        $scope.showTopItems = true;

        OrderFactory.getActiveOrder().then(function (order) {
            $scope.storeTopItems = [
                {
                    _id: 1,
                    type: 1,
                    name: 'Feijoada do Johna',
                    desc: 'Feijoada do Johna',
                    price: 25.00,
                    image: 'http://localhost:8901/images/feijoada_johna.jpg',
                    serve: 4
                },
                {
                    _id: 2,
                    type: 1,
                    name: 'Carbonara do Johna',
                    desc: 'Carbonara do Johna',
                    price: 30.00,
                    image: 'http://localhost:8901/images/carbonara_johna.jpg',
                    serve: 2
                },
                {
                    _id: 3,
                    type: 2,
                    name: 'Cerveja Kirin Ichiban',
                    desc: 'Cerveja Kirin Ichiban',
                    price: 10.00,
                    image: 'http://localhost:8901/images/cerveja_kirin.jpg',
                    serve: 1
                }
            ];

            $scope.searchBox = false;
            $scope.toggleSearch = function () {
                $scope.searchBox = !$scope.searchBox;
            };

            $scope.showOrderItem = function (item) {
                $scope.orderItemModal.show();

                $scope.orderedItem = item;

                item.ingredients = [
                    {
                        _id: 3,
                        can_remove: false,
                        use_flag: true,
                        name: 'Arroz'
                    },
                    {
                        _id: 4,
                        can_remove: false,
                        use_flag: true,
                        name: 'Feijão preto'
                    },
                    {
                        _id: 5,
                        can_remove: true,
                        use_flag: true,
                        name: 'Cebola'
                    },
                    {
                        _id: 6,
                        can_remove: true,
                        use_flag: true,
                        name: 'Carnes'
                    },
                    {
                        _id: 7,
                        can_remove: true,
                        use_flag: true,
                        name: 'Farofa'
                    },
                    {
                        _id: 8,
                        can_remove: true,
                        use_flag: true,
                        name: 'Laranja'
                    }
                ];
                item.order_id = order.id;
                item.quantity = 1;
                $scope.addQuant = function () {
                    item.quantity++;
                };
                $scope.removeQuant = function () {
                    if (item.quantity > 1) {
                        item.quantity--;
                    }
                };

                $scope.addToOrder = function (item) {
                    OrderFactory.saveOrderItem(item);
                    $scope.orderItemModal.hide();
                };
            };

        });

        $scope.$apply();
    });

    controllersModule.controller('OrderController', function ($scope, Data, OrderFactory) {
        OrderFactory.getActiveOrder().then(function (order) {
            $scope.order = order;

            OrderFactory.getOrderItems(order.id).then(function (orderItems) {
                $scope.orderItems = orderItems;

                $scope.showOrder = function () {
                    $scope.orderModal.show();
                };
            });
        });

        OrderFactory.getOrderTotals().then(function (data) {
            $scope.orderShortcut = data;
        });
    });

    controllersModule.controller('SearchResultsController', function ($scope, SearchService, UserSettings, Data) {
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
            $scope.ons.navigator.pushPage('store.html#' + storeId);
        };


    });

    controllersModule.controller('SearchController', function ($scope, $http, SearchService, UserSettings, HOST_NAME) {

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
            $http.post(HOST_NAME + '/open-api/store/search', $scope.searchFilter)
                //$http.post('http://192.168.111.102' + '/open-api/store/search', $scope.searchFilter)
                .success(function (result) {
                    $scope.isSearching = false;
                    $scope.searchResults = result;
                    SearchService.setResult(result);
                    $scope.ons.navigator.pushPage('search-results.html');
                }).error(function () {
                    alert('error search stores');
                });

//        $scope.ons.navigator.pushPage('search-results.html');
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
            $scope.ons.navigator.pushPage('store-menu.html');
        };

    });
})();