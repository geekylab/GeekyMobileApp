angular.module('geekyMenuMobile.config', [])
    .constant('DB_CONFIG', {
        name: 'DB',
        tables: [
            {
                name: 'orders',
                columns: [
                    {name: 'id', type: 'integer primary key'},
                    {name: 'total', type: 'float'},
                    {name: 'status', type: 'integer'},
                    {name: 'date_opened', type: 'datetime'},
                    {name: 'date_closed', type: 'datetime'}
                ]
            },
            {
                name: 'items',
                columns: [
                    {name: 'id', type: 'integer primary key'},
                    {name: 'order_id', type: 'integer'},
                    {name: 'name', type: 'text'},
                    {name: 'quantity', type: 'integer'},
                    {name: 'value', type: 'float'}
                ]
            }
        ]
    });