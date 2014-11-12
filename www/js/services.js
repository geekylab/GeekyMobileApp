var servicesModule = angular.module('geekyMenuMobile.services', ['geekyMenuMobile', 'geekyMenuMobile.services', 'geekyMenuMobile.controllers', 'geekyMenuMobile.directives', 'geekyMenuMobile.config']);

servicesModule.factory('MyUser', function ($rootScope, $q, $http, $timeout, HOST_NAME) {
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
                    $http.post(HOST_NAME + '/open-api/auth/facebook/token', {access_token: response.authResponse.accessToken}).
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
                                $http.get(HOST_NAME + '/open-api/logout').
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

});

servicesModule.factory('Data', function () {
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
});

servicesModule.factory('SearchService', function () {
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
});

servicesModule.factory('UserSettings', function (HOST_NAME) {
    return {
        defaultLang: 'us',
        systemDefaultLang: 'us',
        apiHostname: HOST_NAME,
        features: [
            'parking',
            'wifi',
            'live_show',
            'kids_space',
            'non_smoking'
        ]
    }
});

servicesModule.factory('Store', function ($resource, HOST_NAME) {
    return $resource(HOST_NAME + '/open-api/store/:id/:lang/:longitude/:latitude', {
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
});

servicesModule.factory('DB', function ($q, DB_CONFIG, Data) {
    var self = this;
    self.db = null;

    self.init = function () {
        //Use self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name}); in production
        self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);

        angular.forEach(DB_CONFIG.tables, function (table) {
            var columns = [];

            angular.forEach(table.columns, function (column) {
                columns.push(column.name + ' ' + column.type);
            });

            var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
            self.query(query);
            //console.log('Table ' + table.name + ' initialized');

            //var insertQuery = 'INSERT INTO items (name, quantity) VALUES ("Teste", 10)';
            //self.query(insertQuery);
            //Data.setData('sqliteInsertQuery', insertQuery);
            //console.log('Insert statement executed')
        });
    };

    self.query = function (query, bindings) {
        bindings = typeof bindings !== 'undefined' ? bindings : [];
        var deferred = $q.defer();

        self.db.transaction(function (transaction) {
            transaction.executeSql(query, bindings, function (transaction, result) {
                deferred.resolve(result);
            }, function (transaction, error) {
                deferred.reject(error);
            });
        });

        return deferred.promise;
    };

    self.fetchAll = function (result) {
        var output = [];
        for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        return output;
    };

    self.fetch = function (result) {
        var ret = {};
        if (result.rows.item(0)) {
            ret = result.rows.item(0);
        }
        return ret;
    };

    return self;
});

servicesModule.factory('Model', function (DB) {
    var self = this;

    self.all = function (tableName) {
        return DB.query('SELECT * FROM ' + tableName)
            .then(function (result) {
                return DB.fetchAll(result);
            });
    };

    self.where = function (tableName, where) {
        return DB.query('SELECT * FROM ' + tableName + ' WHERE ' + where)
            .then(function (result) {
                return DB.fetch(result);
            });
    };

    self.getById = function (tableName, id) {
        return DB.query('SELECT * FROM ' + tableName + ' WHERE id = ?', [id])
            .then(function (result) {
                return DB.fetch(result);
            });
    };

    self.query = function (query) {
        return DB.query(query)
            .then(function (result) {
                return DB.fetch(result);
            });
    };

    return self;
});

servicesModule.service('DateFormatter', function () {
    var self = this;

    self.UTC = function () {
        var d = new Date();
        var dObj = {
            year: d.getUTCFullYear(),
            month: d.getUTCMonth(),
            day: d.getUTCDay(),
            hour: d.getUTCHours() - (d.getTimezoneOffset() / 60),
            minute: d.getUTCMinutes(),
            second: d.getUTCSeconds()
        };
        var date = dObj.year + '-' + dObj.month + '-' + dObj.day + ' ' + dObj.hour + ':' + dObj.minute + ':' + dObj.second;

        return date;
    };

    return self;
});