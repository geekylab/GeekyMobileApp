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
                    {name: 'date_opened', type: 'integer'},
                    {name: 'date_closed', type: 'integer'}
                ]
            },
            {
                name: 'order_items',
                columns: [
                    {name: 'id', type: 'integer primary key'},
                    {name: 'item_id', type: 'integer'},
                    {name: 'order_id', type: 'integer'},
                    {name: 'name', type: 'text'},
                    {name: 'quantity', type: 'integer'},
                    {name: 'price', type: 'float'},
                    {name: 'total', type: 'float'}
                ]
            },
            {
                name: 'item_ingredients',
                columns: [
                    {name: 'id', type: 'integer primary key'},
                    {name: 'order_item_id', type: 'integer'},
                    {name: 'use_flag', type: 'integer'}
                ]
            }
        ]
    });