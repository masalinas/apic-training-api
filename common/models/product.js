'use strict';

module.exports = function(Product) {
    Product.getProductsByActive = function(active, cb) {
        Product.find({where: {active: active}, 
                    order: ["description ASC"]}, function (err, result) {
            if (err) return cb(err);

            cb(null, result);
        });
    };

    Product.remoteMethod (
        'getProductsByActive',
        {
            description : "Get Products by Active Flag with ascending order by Description",
            accepts: [{arg: 'active', type: 'boolean', description: 'Product Active Flag', required: true, default: true, http: {source: 'path'}}],            
            returns: {arg: 'result', type: 'object', array: true},
            http: {verb: 'get', path: '/:active/get-products-by-active'}
        }
    );
};