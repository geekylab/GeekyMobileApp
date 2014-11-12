var controllersModule = angular.module('geekyMenuMobile.controllers', ['geekyMenuMobile', 'geekyMenuMobile.services', 'geekyMenuMobile.controllers', 'geekyMenuMobile.directives', 'geekyMenuMobile.config']);

controllersModule.controller('DocumentCtrl', function ($scope, Model, Data) {
    $scope.documents = [];
    $scope.document = null;

    $scope.queryResult = Data.getData('sqlQueryResult');

    console.log($scope.queryResult);

    console.log(Model.all().then(function(documents){}));


    Model.all().then(function (documents) {
        $scope.documents = documents;
    });

    Model.getById(2).then(function (document) {
        $scope.document = document;
    });
});

controllersModule.controller('LoginController', function ($scope, $http, MyUser) {
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

controllersModule.controller('OrderController', function ($scope, Data) {
    $scope.storeInfo = Data.getData('storeInfo');
    $scope.orderedItem = Data.getData('item');
    $scope.orderedItem.ingredients = [
        {
            _id: 3,
            can_remove: false,
            name: 'Arroz'
        },
        {
            _id: 4,
            can_remove: false,
            name: 'Feijão preto'
        },
        {
            _id: 5,
            can_remove: true,
            name: 'Cebola'
        },
        {
            _id: 6,
            can_remove: true,
            name: 'Carnes'
        },
        {
            _id: 7,
            name: 'Farofa'
        },
        {
            _id: 8,
            name: 'Laranja'
        }
    ];

    $scope.orderedItem.quant = 1;
    $scope.addQuant = function () {
        $scope.orderedItem.quant++;
    };
    $scope.removeQuant = function () {
        if ($scope.orderedItem.quant > 1) {
            $scope.orderedItem.quant--;
        }
    };

    $scope.order = [];
    $scope.addToOrder = function (item) {
        item.quant = $scope.orderedItem.quant;
        $scope.order.push(item);

        $scope.cartShortcutInfo = {
            totalItems: 0,
            totalOrder: 0.0
        };
        angular.forEach($scope.order, function (orderItem, key) {
            $scope.cartShortcutInfo.totalItems += orderItem.quant;
            $scope.cartShortcutInfo.totalOrder += (orderItem.quant * orderItem.price);
        });

        console.log($scope.cartShortcutInfo);

        $scope.ons.navigator.popPage('store-menu-order-item.html', {animation: 'fade'});
    };

    $scope.$apply();
});

controllersModule.controller('StoreController', function ($scope, Data, Store) {
    var storeId = Data.getData('storeId');
    $scope.storeInfo = {};

    Store.get({id: storeId}, function (data) {
        $scope.storeInfo = data;
    });

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
            price: 25.00,
            image: 'feijoada_johna.jpg',
            serve: 4
        },
        {
            _id: 2,
            type: 1,
            name: 'Carbonara do Johna',
            desc: 'Carbonara do Johna',
            price: 30.00,
            image: 'carbonara_johna.jpg',
            serve: 2
        },
        {
            _id: 3,
            type: 2,
            name: 'Cerveja Kirin Ichiban',
            desc: 'Cerveja Kirin Ichiban',
            price: 10.00,
            image: 'cerveja_kirin.jpg',
            serve: 1
        }
    ];

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
        Data.setData('store', $scope.storeInfo);
        $scope.searchNavigator.pushPage('store-menu.html');
    };

    $scope.showOrderItem = function (item) {
        Data.setData('storeInfo', $scope.storeInfo);
        Data.setData('item', item);
        $scope.ons.navigator.pushPage('store-menu-order-item.html', {animation: 'fade'});

        //$scope.orderedItem = item;
        //$scope.orderedItem.ingredients = [
        //    {
        //        _id: 3,
        //        can_remove: false,
        //        name: 'Arroz'
        //    },
        //    {
        //        _id: 4,
        //        can_remove: false,
        //        name: 'Feijão preto'
        //    },
        //    {
        //        _id: 5,
        //        can_remove: true,
        //        name: 'Cebola'
        //    },
        //    {
        //        _id: 6,
        //        can_remove: true,
        //        name: 'Carnes'
        //    }
        //];
        //$scope.orderModal.getDeviceBackButtonHandler().enable();
        //$scope.orderModal.show();
    };

    $scope.searchBox = false;
    $scope.toggleSearch = function () {
        $scope.searchBox = !$scope.searchBox;
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
                alert('error');
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