var async = require('async');

module.exports = function(app) {
    if (process.env.CREATE_TABLES == undefined || process.env.CREATE_TABLES == "0")
        return;

    // Create tables for Acces Control built-in models except User. Principal model inheritance from User wi will used
    var lbTables = ['AccessToken', 'ACL', 'Scope', 'RoleMapping', 'Role'];

    app.dataSources.apiconnectdb.automigrate(lbTables, function(er) {
        if (er) throw er;

        console.log('Loopback tables [' - lbTables - '] created in ', app.dataSources.apiconnectdb.name);
    });

    // Create Principal Table and fill built-in models with data mocks
    app.dataSources.apiconnectdb.automigrate('Principal', function(er) {
        if (er) throw er;

        console.log('Loopback tables Principal created in ', app.dataSources.apiconnectdb.name);

        app.models.Principal.create([
            {id: 1, firstName: 'Admin', lastName: 'Training User', username: 'admin', email: 'admin@thingtrack.com', password: 'thingtrack', created: new Date()},
            {id: 2, firstName: 'Operator', lastName: 'Training User', username: 'operator', email: 'operator@thingtrack.com', password: 'thingtrack', created: new Date()}
        ], function(err, users) {
            if (err) throw err;
    
            console.log('Models Users created: \n', JSON.stringify(users));       

            //create default roles
            app.models.Role.create([
                {id: 1, name: 'admin', description: 'Admin Role'},
                {id: 2, name: 'operator', description: 'Operator Role'}
            ], function(err, roles) {
                if (err) throw err;
                
                console.log('Models Product created: \n', JSON.stringify(roles));       

                 //make admin an admin
                 roles[0].principals.create({principalType: app.models.RoleMapping.USER,
                                             principalId: 1
                }, function(err, principal) {
                    if (err) throw err;

                    console.log('Created principal:', principal);
                });
            });
        });
    });

    // Create Product Table and fill them with data mocks
    app.dataSources.apiconnectdb.automigrate('Product', function(err) {
        if (err) throw err;
  
        app.models.Product.create([{
                id: 1,
                code: 'PRD001',
                description: 'Orange',
                price: 1.5,
                active: true
            }, 
            {
                id: 2,
                code: 'PRD002',
                description: 'Melon',
                price: 5,
                active: true
            },
            {
                id: 3,
                code: 'PRD003',
                description: 'Banana',
                price: 2,
                active: true
            },
            {
                id: 4,
                code: 'PRD004',
                description: 'Apple',
                price: 3.5,
                active: true
            },
            {
                id: 5,
                code: 'PRD005',
                description: 'Apricot',
                price: 5,
                active: false
            },
            {
                id: 6,
                code: 'PRD006',
                description: 'Water Melon',
                price: 2.4,
                active: true
            },
            {
                id: 7,
                code: 'PRD007',
                description: 'Pear',
                price: 2.4,
                active: false
            },
            {
                id: 8,
                code: 'PRD008',
                description: 'Mango',
                price: 4,
                active: true
            },
            {
                id: 9,
                code: 'PRD009',
                description: 'Grape',
                price: 1.6,
                active: true
            }, 
            {
                id: 10,
                code: 'PRD010',
                description: 'Pomelo',
                price: 3.6,
                active: true
            },
            {
                id: 11,
                code: 'PRD011',
                description: 'Peach',
                price: 1.3,
                active: true
            },
            {
                id: 12,
                code: 'PRD012',
                description: 'Blueberry',
                price: 1.8,
                active: true
            }, 
            {
                id: 13,
                code: 'PRD013',
                description: 'Coconut',
                price: 3.6,
                active: false
            }, 
            {
                id: 14,
                code: 'PRD014',
                description: 'Papaya',
                price: 5.9,
                active: false
            }                                                                                               
        ], function(err, result) {
          if (err) throw err;
  
          console.log('Models Product created: \n', JSON.stringify(result));       
        });
    });
        
    // Create Stock Table and fill them with data mocks
    app.dataSources.apiconnectdb.automigrate('Stock', function(err) {
        if (err) throw err;

        app.models.Stock.create([{
                id: 1,
                productId: 1,
                quantity: 500,
                status: true
            }, 
            {
                id: 2,
                productId: 2,
                quantity: 1500,
                status: true
            },
            {
                id: 3,
                productId: 3,
                quantity: 200,
                status: true
            },
            {
                id: 4,
                productId: 5,
                quantity: 80,
                status: true
            }                                                                                             
        ], function(err, result) {
        if (err) throw err;

        console.log('Models Stock created: \n', JSON.stringify(result));       
        });        
    });

    // Create Order, OrderLine Table and fill them with data mocks
    app.dataSources.apiconnectdb.automigrate('Order', function(err) {
        if (err) throw err;
  
        app.dataSources.apiconnectdb.automigrate('OrderLine', function(err) {
            if (err) throw err;

            // create my test models
            var orders = [];

            var order1 = {id: 1,
                    code: 'ORD001',
                    shippingDate: '2018-07-10 12:00:00',
                    client: 'Acme 001',
                    status: true};
            order1.orderLines = [];
            order1.orderLines.push({
                    id: 1,
                    line: 1,
                    orderId: order1.id,
                    productId: 1,
                    quantity: 20},
                {
                    id: 2,
                    line: 2,
                    orderId: order1.id,
                    productId: 2,
                    quantity: 10});

            order2 = {id: 2,
                code: 'ORD002',
                shippingDate: '2018-07-12 14:30:00',
                client: 'Acme 002',
                status: true};
            order2.orderLines = [];
            order2.orderLines.push({
                    id: 3,
                    line: 1,
                    orderId: order2.id,
                    productId: 3,
                    quantity: 150});

            orders.push(order1);
            orders.push(order2);

            // insert my test models
            async.each(orders, function(order, callback) {
                app.models.Order.create(order, function(err, result) {
                    if (err) throw err;
      
                    console.log('Models Order created: \n', JSON.stringify(result.__data));          

                    result.orderLines.create(order.orderLines, function(err, result) {
                        console.log('Models Order Line created: \n', JSON.stringify(result));          

                        callback();
                    }), function(err) {
                        if (err) throw err;
                    };
                });
            }, function(err) {
                if (err) throw err;
            });
        });        
    });  
    
    // Create Track Table
    app.dataSources.apiconnectdb.automigrate('Track', function(err) {
        if (err) throw err;

        console.log('Models Track created: \n');          
    });
}