'use strict';
var parseString = require('xml2js').parseString;

module.exports = function(Weather) {
    Weather.getWeatherForecastData = function(latitude, longitude, product, startTime, endTime, unit, weatherParameters, cb) {
        weatherParameters = [];
        weatherParameters['maxt'] = 'maxt';
        weatherParameters['mint'] = 'mint';

        Weather.NDFDgen({latitude: latitude || 39,  
                         longitude: longitude || -77.00,            
                         product: product || 'time-series',
                         startTime: startTime || '2004-01-01T00:00:00',
                         endTime: endTime || '2022-08-22T00:00:00',
                         unit: unit || 'e',
                         weatherParameters: weatherParameters || []}, function (err, response) {
                            if (err) return cb(err);

            parseString(response.dwmlOut.$value, function (err, result) {
                if (err) return cb(err);

                var measures = [];

                if (result.dwml.data && result.dwml.data[0])
                    if (err) return cb('Not exist parameters');
                
                if (result.dwml.data[0] && result.dwml.data[0].parameters[0])
                    if (err) return cb('Not exist parameters');

                var parameters = result.dwml.data[0].parameters[0];

                // get temeprature measures
                parameters["temperature"].forEach(function(parameter) {
                    parameter.value.forEach(function(val) {
                        measures.push({name: parameter.name[0], value: val});
                    });            
                });
              
                // get precipitation measures
                parameters["precipitation"].forEach(function(parameter) {
                    parameter.value.forEach(function(val) {
                        measures.push({name: parameter.name[0], value: val});
                    });   
                });
                
                // get wind-speed measures
                parameters["wind-speed"].forEach(function(parameter) {
                    parameter.value.forEach(function(val) {
                        measures.push({name: parameter.name[0], value: val});
                    });   
                });

                // get direction measures
                parameters["direction"].forEach(function(parameter) {
                    parameter.value.forEach(function(val) {
                        measures.push({name: parameter.name[0], value: val});
                    });   
                });

                // get cloud-amount measures
                parameters["cloud-amount"].forEach(function(parameter) {
                    parameter.value.forEach(function(val) {
                        measures.push({name: parameter.name[0], value: val});
                    });   
                });

                // get probability measures
                parameters["probability-of-precipitation"].forEach(function(parameter) {
                    parameter.value.forEach(function(val) {
                        measures.push({name: parameter.name[0], value: val});
                    });   
                });

                // get fire-weather measures
                parameters["fire-weather"].forEach(function(parameter) {
                    parameter.value.forEach(function(val) {
                        measures.push({name: parameter.name[0], value: val});
                    });   
                });

                // get climate-anomaly measures
                parameters["climate-anomaly"].forEach(function(parameter) {
                    if (parameter["weekly"] !== undefined) {
                        parameter["weekly"].forEach(function(parameter) {
                            parameter.value.forEach(function(val) {
                                measures.push({name: parameter.name[0], value: val});
                            });
                        });            
                    }

                    if (parameter["monthly"] !== undefined) {
                        parameter["monthly"].forEach(function(parameter) {
                            parameter.value.forEach(function(val) {
                                measures.push({name: parameter.name[0], value: val});
                            });
                        });            
                    }
                });

                // get humidity measures
                parameters["humidity"].forEach(function(parameter) {
                    parameter.value.forEach(function(val) {
                        measures.push({name: parameter.name[0], value: val});
                    });   
                });

                // get weather measures
                parameters["weather"].forEach(function(parameter) {
                    parameter["weather-conditions"].forEach(function(val) {
                        measures.push({name: parameter.name[0], value: val});
                    });   
                });

                // get conditions-icon measures
                parameters["conditions-icon"].forEach(function(parameter) {
                    parameter["icon-link"].forEach(function(val) {
                        measures.push({name: parameter.name[0], value: val});
                    });   
                });

                // get hazards measures
                parameters["hazards"].forEach(function(parameter) {
                    parameter["hazard-conditions"].forEach(function(val) {
                        measures.push({name: parameter.name[0], value: val});
                    });   
                });

                // get water-state measures
                parameters["water-state"].forEach(function(parameter) {
                    parameter["waves"].forEach(function(parameter) {
                        parameter.value.forEach(function(val) {
                            measures.push({name: parameter.name[0], value: val});
                        });
                    });   
                });

                cb(err, measures);
            });
      });
    };

    Weather.remoteMethod ('getWeatherForecastData',
        {
            description : "Returns National Weather Service digital weather forecast data",
            accepts: [{arg: 'latitude', type: 'number',  description: 'Latitude', required: false, http: {source: 'query'}},
                      {arg: 'longitude', type: 'number',  description: 'Longitude', required: false, http: {source: 'query'}},
                      {arg: 'product', type: 'string',  description: 'Product', required: false, http: {source: 'query'}},
                      {arg: 'startTime', type: 'date',  description: 'Start time', required: false, http: {source: 'query'}},
                      {arg: 'endTime', type: 'date',  description: 'End time', required: false, http: {source: 'query'}},
                      {arg: 'unit', type: 'string',  description: 'Unit', required: false, http: {source: 'query'}},
                      {arg: 'weatherParameters', type: 'array',  description: 'Weather Parameters', required: false}],
            returns: {type: 'array', root: true},
            http: {verb: 'get', path: '/getWeatherForecastData'}
        }
    );
};