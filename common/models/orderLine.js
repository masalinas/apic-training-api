'use strict';

var LoopBackContext = require('loopback-context')

module.exports = function(OrderLine) {
    /*OrderLine.observe('before save', function(ctx, next) {
        var Track = OrderLine.app.models.Track;

        // BONUS: get the method from request context
        var requestContext = LoopBackContext.getCurrentContext();
        var method = requestContext && requestContext.get('method')

        if (Track === undefined || Track === null) 
            return cb('Track model was not imported!');

        var entity = "";
        if (ctx.instance)
            entity = JSON.stringify(ctx.instance.__data);        

        var trace;
        if (ctx.isNewInstance)
            trace = "CREATE or UPDATE operation with attributes: " + entity;

        var track = {model: "OrderLine", 
                     method: method, 
                     trace: trace, 
                     date: new Date()};

        Track.create(track, function (err, result) { 
            if (err) console.err(err);
        
            next();
        });
    });*/
};