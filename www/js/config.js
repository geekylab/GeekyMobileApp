angular.module('geekyMenuMobile.config', [])
    .constant('DB_CONFIG', {
        name: 'DB',
        tables: [
            {
                name: 'items',
                columns: [
                    {name: 'id', type: 'integer primary key'},
                    {name: 'name', type: 'text'},
                    {name: 'quantity', type: 'integer'}
                    //{name: 'quantity', type: 'integer'},
                    //{name: 'value', type: 'float'}
                ]
            }
        ]
    });
//.constant('HOST_NAME', 'http://192.168.111.102');