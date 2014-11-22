angular.module('geekyMenuMobile.config', [])
    .constant('DB_CONFIG', {
        name: 'DB',
        tables: [
            {
                name: 'orders',
                columns: [
                    {name: 'id', type: 'integer primary key'},
                    {name: 'items', type: 'integer'},
                    {name: 'total', type: 'float'},
                    {name: 'status', type: 'integer'},
                    {name: 'date_opened', type: 'integer'},
                    {name: 'date_closed', type: 'integer'}
                ]
            },
            {
                name: 'order_items',
                columns: [
                    {name: 'id', type: 'text primary key'},
                    {name: 'item_id', type: 'text'},
                    {name: 'order_id', type: 'integer'},
                    {name: 'name', type: 'text'},
                    {name: 'image', type: 'text'},
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
                    {name: 'name', type: 'textw'},
                    {name: 'use_flag', type: 'integer'}
                ]
            }
        ]
    });