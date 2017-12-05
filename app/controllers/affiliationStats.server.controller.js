
var request = require('request');
var _ = require('lodash');


exports.getConversions = function(req, res){

    var affiliation = req.affiliation;
    var dateRange = exports.getDateRange(null, req, res);

    var URL_TRAFFIC_SOURCE = 'http://localhost:3009/dashboard/users/trafficsource?dateStart='+dateRange.query.dateStart+'&dateEnd='+dateRange.query.dateEnd;

    var URL_PROVIDER = 'https://springmedia.api.hasoffers.com/Apiv3/json?NetworkToken=NETqSp772nJXc04Z2ZRTmDj3PPDpf0&Target=Report&Method=getStats&fields[]=Stat.payout&fields[]=Stat.revenue&fields[]=Stat.conversions&fields[]=Stat.count&groups[]=Stat.affiliate_info5&filters[Affiliate.ref_id][conditional]=EQUAL_TO'
        +'&filters[Affiliate.ref_id][values]='+affiliation.codeProvider
        +'&data_start='+dateRange.provider.dateStart+'&data_end='+dateRange.provider.dateEnd;

    request({headers: { 'x-language-origin': 'pt-BR' }, uri: URL_TRAFFIC_SOURCE, method: 'GET'}, 
        function (error, response, bodyUsers) {
            if (error && response.statusCode !== 200) {
                res.json({message: 'Error yBrain TrafficSource', code: response.statusCode});}

            var dataTrafficSource = JSON.parse(bodyUsers);

            request({ uri: URL_PROVIDER, method: 'GET'}, 
                function (error, response, bodyProvider) {
                if (error && response.statusCode !== 200) {
                    res.json({message: 'Error Provider', code: response.statusCode});}

                    var dataProvider = JSON.parse(bodyProvider);
                    dataProvider = dataProvider.response.data.data;

                    var dataResult = [];

                    _.forEach(dataTrafficSource, function(trafficSourceItem, key) {
                        _.forEach(dataProvider, function(dataProviderItem, key) {

                            if(trafficSourceItem.trafficOrigin === dataProviderItem.Stat.affiliate_info5){
                                
                                dataResult.push({
                                    trafficOrigin: trafficSourceItem.trafficOrigin,
                                    conversionPublisher: Number(trafficSourceItem.count),
                                    conversionProvider: Number(dataProviderItem.Stat.conversions),
                                    payout: Number(dataProviderItem.Stat.payout),
                                    revenue: Number(dataProviderItem.Stat.revenue)
                                });
                            }
                        });
                    });

                    res.json({dataResult:dataResult, dataProvider:dataProvider, dataTrafficSource:dataTrafficSource});

                });


        });

};     




exports.getDateRange = function(offer, req, res){


    if((!req.param('dateStart')) && (!req.param('dateEnd'))){
        return exports.getDefaultDates(offer.created);
    }

    if((req.param('dateStart')) && (req.param('dateEnd'))){
        
        return {
            provider:{
                dateStart : req.param('dateStart'),
                dateEnd : req.param('dateEnd')
            },
            query:{
                dateStart : exports.getDateStartToQuery(req.param('dateStart')),
                dateEnd : exports.getDateEndToQuery(req.param('dateEnd'))
            }
            
        }
    }

    return false;

};


exports.getDateStartToQuery = function (dateStart, dateEnd){

    // FORMAT: YYYY-MM-DD
    var dateSplited = dateStart.split('-');

    var date = new Date(dateSplited[0], (dateSplited[1]-1), dateSplited[2]);
    date.setHours(0, 0, 0, 0);

    return date.toISOString();
};


exports.getDateEndToQuery = function (dateStart, dateEnd){

    // FORMAT: YYYY-MM-DD
    var dateSplited = dateStart.split('-');

    var date = new Date(dateSplited[0], (dateSplited[1]-1), dateSplited[2]);
    date.setHours(24, 0, 0, 0);

    return date.toISOString();
};






