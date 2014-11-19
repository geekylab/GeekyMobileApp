(function () {
    //var controllersModule = angular.module('geekyMenuMobile.controllers', ['geekyMenuMobile', 'geekyMenuMobile.services', 'geekyMenuMobile.controllers', 'geekyMenuMobile.directives', 'geekyMenuMobile.config']);
    var controllersModule = angular.module('geekyMenuMobile.controllers', ['geekyMenuMobile']);

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

        Model.getByStatus('orders', 1).then(function (order) {
            $scope.orderStatus = order;
        });

        $scope.addItem = function () {
            var insertQuery = 'INSERT INTO order_items (name, quantity, price) VALUES ("Teste", 10, 2.63)';
            DB.query(insertQuery);
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

        $scope.searchStores = function () {
            $scope.isSearching = true;
            SearchService.setFilter($scope.searchFilter);
            $http.post(HOST_NAME + '/open-api/store/search', $scope.searchFilter)
                .success(function (result) {
                    $scope.isSearching = false;
                    $scope.searchResults = result;
                    SearchService.setResult(result);
                    $scope.searchNavigator.pushPage('search-results.html');
                }).error(function () {
                    alert('error search stores');
                });
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

        $scope.showStoreDetails = function (store) {
            Data.setData('store', store);
            $scope.searchNavigator.pushPage('store.html');
        };
    });


    controllersModule.controller('StoreController', function ($scope, Data, Store, Model, ORDER_STATUSES) {
        $scope.storeInfo = Data.getData('store');

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

        $scope.showStoreMenu = function () {
            $scope.searchNavigator.pushPage('store-menu.html');
        };
    });

    controllersModule.controller('StoreMenuController', function ($scope, Data, Store, Model, OrderFactory) {
        $scope.showFood = false;
        $scope.showDrinks = false;
        $scope.showTopItems = true;

        OrderFactory.getActiveOrder().then(function (order) {

            Data.setData('order', order);

            console.log('StoreMenuController - order');
            console.log(order);
            console.log('//StoreMenuController - order');

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

        //$scope.$apply();
    });

    controllersModule.controller('OrderController', function ($scope, Data, OrderFactory) {
        //var order = Data.getData('order');
        //
        //console.log('OrderController - order');
        //console.log(order);
        //console.log('//OrderController - order');
        //
        //$scope.order = order;
        //OrderFactory.getOrderItems(order.id).then(function (orderItems) {
        //    $scope.orderItems = orderItems;
        //
        //    $scope.showOrder = function () {
        //        $scope.orderModal.show();
        //    };
        //});
        //OrderFactory.getTableTotals().then(function (data) {
        //    $scope.orderShortcut = data;
        //});
    });

})();