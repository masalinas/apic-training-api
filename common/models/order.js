'use strict';

//var LoopBackContext = require('loopback-context');

module.exports = function(Order) {
    Order.getOrdersByStatus = function(status, cb) {
        Order.find({where: {status: status}, 
                    include: {relation: 'orderLines'}, 
                    order: ["shippingDate DESC"]}, function (err, result) {
            if (err) return cb(err);

            cb(null, result);
        });
    };

    Order.closeOrder = function(code, cb) {
        // STEP01: get Order By Code if exist
        Order.findOne({where: {code: code}}, function (err, result) {
            if (err) return cb(err);

            if (result == null)
                return cb('Not exist any order with code ' + code);

            var order = result.__data;

            // set close order status
            order.status = 0;

            // STEP02: update order status
            Order.upsert(order, function (err, order) {
                if (err) return cb(err);

                cb(null, order);
            });
        });
    };

    Order.addOrderLine = function(code, productCode, quantity, cb) {
        var Product = Order.app.models.Product;
        var Stock = Order.app.models.Stock;
        var OrderLine = Order.app.models.OrderLine;

        // BONUS: set in the request context the method trigger
        //var requestContext = LoopBackContext.getCurrentContext();
        //requestContext.set("method", "Order.addOrderLine" );

       // STEP01: get order from Code
       Order.findOne({where: {code: code},
                      include: {relation: 'orderLines'}}, function (err, resultOrder) {
           if (err) return cb(err);

           if (resultOrder == null)
            return cb('Not exist any order with code ' + code);

           var order = resultOrder.__data;

           // STEP02: get the next line number
           var lineNumber = order.orderLines.length + 1;

           // STEP03: get product by code
           if (Product === undefined || Product === null) 
               return cb('Product model was not imported!');

           Product.findOne({ where: {code: productCode}}, function (err, resultProduct) {
                if (err) return cb(err);

                if (resultProduct == null)
                    return cb('Not exist any stock with product code ' + productCode);

                var product = resultProduct.__data;

                // STEP04: check if exist any stock for the product
                if (Stock === undefined || Stock === null) 
                    return cb('Stock model was not imported!');

                Stock.findOne({ where: {quantity: {gte: quantity}, productId: product.id}}, function (err, resultStock) {
                    if (err) return cb(err);

                    if (resultStock == null)
                        return cb('Not exist any stock with product code ' + productCode);
                        
                    var stock = resultStock.__data;

                    // STEP05: create a new Order Line from data
                    // we could persist the lines from model OrderLine definition. In this case
                    // we must attach the order id
                    /*OrderLine.create(orderLine, function (err, result) {                
                    var orderLine = {line: lineNumber, 
                                     orderId: order.id,
                                     productId: product.id,
                                     quantity: quantity}*/

                    //OrderLine.create(orderLine, function (err, result) {                

                    // we could persist the lines from related model instance orderLines
                    // the order id is attached automatically from relation
                    var orderLine = {line: lineNumber, 
                        productId: product.id,
                        quantity: quantity}

                    resultOrder.orderLines.create(orderLine, function (err, result) {                
                        if (err) return cb(err);

                        cb(null, result);
                    });
                });               
           });           
       });
    };

    Order.afterRemote('addOrderLine', function(ctx, output, next) {
        var Track = Order.app.models.Track;

        if (Track === undefined || Track === null) 
            return cb('Track model was not imported!');

        // create trace message for the event
        var args = JSON.stringify(ctx.args);
        var entity = JSON.stringify(ctx.result);
        var trace = "Add Order Line with attributes: " + entity + " with arguments: " + args;

        var track = {model: "OrderLine", 
                     method: ctx.methodString, 
                     trace: trace, 
                     date: new Date()};

        Track.create(track, function (err, result) { 
            if (err) console.err(err);
        
            next();
        });
    });

    Order.remoteMethod (
        'getOrdersByStatus',
        {
            description : "Get Orders by Status Flag with descending order by Shipping Code ",
            accepts: [{arg: 'status', type: 'boolean', description: 'Order Status Flag', required: true, default: true, http: {source: 'path'}}],            
            returns: {arg: 'result', type: 'object', array: true},
            http: {verb: 'get', path: '/:status/get-orders-by-status'}
        }
    );

    Order.remoteMethod (
        'closeOrder',
        {
            description : "Close Order",
            accepts: [{arg: 'code', type: 'string', description: 'Order Code', required: true, http: {source: 'path'}}],
            returns: {arg: 'result', type: 'number'},
            http: {verb: 'post', path: '/:code/close-order'}
        }
    );

    Order.remoteMethod (
        'addOrderLine',
        {
            description : "Add a new Order Line Order",
            accepts: [{arg: 'code', type: 'string', description: 'Order Code', required: true, http: {source: 'path'}},
                      {arg: 'productCode', type: 'string', description: 'Product Code', required: true, http: {source: 'path'}},
                      {arg: 'quantity', type: 'number', description: 'Quantity', required: true, http: {source: 'path'}}],
            returns: {type: 'object', root: true},
            http: {verb: 'post', path: '/:code/products/:productCode/:quantity/add-order-line'}
        }
    );
};
