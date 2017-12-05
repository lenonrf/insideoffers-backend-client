'use strict';


/**
 * Module dependencies.
 */
var errorHandler = require('./errors'),
    request = require('request'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    StatsImpression = mongoose.model('StatsImpression'),
    StatsClicks = mongoose.model('StatsClicks'),
    Offer = mongoose.model('Offer'), 
    Affiliation = mongoose.model('Affiliation'),
    pmx = require('pmx');




exports.executeOfferStatsResume = function (req, res){


    Offer.find({status: true}).sort('-created').exec(function(err, offersList) {    
        
        console.log('');console.log('');console.log('');
        console.log('offers', offersList.length);

        _.forEach(offersList, function(offerItem, key) {

            //console.log(key, offerItem.name);
            exports.buildStatsFromOfferResume(req, res, offerItem);

        });

    }); 
}




exports.buildStatsFromOfferResume = function (req, res, offer){

    var offer = (req.offer) ? req.offer : offer;
    var dateRange = exports.getDateRange(offer, req, res);

    var queryImpressions = exports.getQueryImpressionAndClicks(
        offer._id, dateRange.dateStart, dateRange.dateEnd);

    var queryClicks = exports.getQueryImpressionAndClicks(
        offer._id, dateRange.dateStart, dateRange.dateEnd);

    var queryAcceptance = exports.getQueryClicksGroupedByTypeAndDate(
        offer._id, dateRange.dateStart, dateRange.dateEnd);

    var clicksList = [];
    var impressionList = [];
    var acceptanceList = [];


    StatsImpression.aggregate(queryImpressions, function(err, statsImpression) {
        StatsClicks.aggregate(queryClicks, function(err, statsClicks) {
            StatsClicks.aggregate(queryAcceptance, function(err, statsAcceptance) {


                /*
                    console.log('');console.log('');console.log('');
                    console.log( 'statsAcceptance', statsAcceptance);
                    console.log( 'statsClicks', statsClicks);
                    console.log( 'statsImpression', statsImpression);
                */

                if(statsImpression){

                    for(var x=0; x<statsImpression.length; x++){

                        impressionList.push({

                            created: new Date(
                                statsImpression[x]._id.year,
                                (statsImpression[x]._id.month-1),
                                statsImpression[x]._id.day),

                            count: statsImpression[x].count

                        });
                    }
                }


                /*
                    console.log('');console.log('');console.log('');
                    console.log(offer.name, 'impressionList', impressionList);
                */

                

                if(statsClicks){

                    for(var x=0; x<statsClicks.length; x++){    

                        clicksList.push({

                            created: new Date(
                                statsClicks[x]._id.year,
                                (statsClicks[x]._id.month-1),
                                statsClicks[x]._id.day),

                            count: statsClicks[x].count

                        });

                    }
                }

                /*
                    console.log('');console.log('');console.log('');
                    console.log(offer.name, 'clicksList', clicksList);
                */


                if(statsAcceptance){
                    
                    for(var x=0; x<statsAcceptance.length; x++){    

                        acceptanceList.push({

                            created: new Date(
                                statsAcceptance[x]._id.year,
                                (statsAcceptance[x]._id.month-1),
                                statsAcceptance[x]._id.day),

                            count: statsAcceptance[x].count,
                            type: statsAcceptance[x]._id.type

                        });

                    }
                }

                var acceptanceListTemp = [];
                var acceptanceItem = {};
                var findIndex = 0;


                for(var x=0; x<acceptanceList.length; x++){   


                    findIndex = _.findIndex(acceptanceListTemp, function(o) {
                        return o.created.toString() == acceptanceList[x].created.toString(); });

                    
                    if(findIndex === -1){

                        acceptanceItem = {

                            created: acceptanceList[x].created,
                            acceptanceCount: 0,
                            refusalCount: 0

                        }

                        if(acceptanceList[x].type === 'acceptance'){
                            acceptanceItem.acceptanceCount += acceptanceList[x].count;

                        }else if(acceptanceList[x].type === 'refusal'){
                            acceptanceItem.refusalCount += acceptanceList[x].count;
                        }

                        acceptanceListTemp.push(acceptanceItem);

                    }else{                

                        if(acceptanceList[x].type === 'acceptance'){
                            acceptanceListTemp[findIndex].acceptanceCount += acceptanceList[x].count;

                        }else if(acceptanceList[x].type === 'refusal'){
                            acceptanceListTemp[findIndex].refusalCount += acceptanceList[x].count;
                        }
                    }


                }

                acceptanceList = acceptanceListTemp;

                /*
                    console.log('');console.log('');console.log('');
                    console.log(offer.name, 'acceptanceList', acceptanceList);
                */
                

                //offer = _.extend(offer , req.offer);

                offer.stats = {};
                offer.stats.impressions = impressionList;
                offer.stats.clicks = clicksList;
                offer.stats.acceptance = acceptanceList;

                

                offer.save(function(err) {

                    console.log('');console.log('');console.log('');
                    console.log(offer.name, offer._id,' offer.stats', offer.stats);
                    

                    if (err) {
                        console.log('deu ruim', offer.name)
                        //return res.status(400).send({
                          //  message: errorHandler.getErrorMessage(err.message)
                        //});
                    } else {

                        //console.log('');console.log('');
                        //console.log('FIM');

                        //return res.status(200).send(offer);  
                    }
                });

                

            });
        });
    });
};

  
exports.getOfferStats = function(req, res){

    if(!exports.isExistsAllDateRangeParameters(req) ){

        if( exports.isExistsAtLeastOneDateRangeParameter(req) ){
                
            return res.status(404).send({
                statusCode: 400,
                statusMessage: 'Bad Request',
                description: 'You must provide both the date_start and date_end query parameters'
            });    
        }
    
    }else{
        
        exports.getStatsFromProvider(req, res);
    }
   
};


const util = require('util');


exports.getQueryImpressionAndClicks = function(offerId, dateStart, dateEnd){

    var dateRangeQuery = exports.getDateToQuery(dateStart, dateEnd);

    console.log('');console.log('');console.log('');
        console.log('dateRangeQuery', offerId, dateRangeQuery);
    

    
    return [
        { $match: {
            $and :[
                {created: {$gte: dateRangeQuery.dateStart, $lte: dateRangeQuery.dateEnd}},
                {offer: ObjectId(offerId)}
            ]
        }},
        { $sort : { created : -1} },
        { $group: {
            _id: {
                'year':  { '$year': '$created' },
                'month': { '$month': '$created' },
                'day':   { '$dayOfMonth': '$created' }

            },
            'count': { '$sum': 1 }
        }}];

};


exports.getQueryClicksGroupedByType = function(offerId, dateStart, dateEnd){

    var dateRangeQuery = exports.getDateToQuery(dateStart, dateEnd);
    
    return [
        { $match: {
            $and :[
                {created: {$gte: dateRangeQuery.dateStart, $lt: dateRangeQuery.dateEnd}},
                {offer: ObjectId(offerId)}
            ]
        }},
        { $sort : { created : -1} },
        { $group: {
            _id: {
                'type':  '$type'
            },
            'count': { '$sum': 1 }
        }}];

};

exports.getQueryClicksGroupedByTypeAndDate = function(offerId, dateStart, dateEnd){

    var dateRangeQuery = exports.getDateToQuery(dateStart, dateEnd);
    
    return [
        { $match: {
            $and :[
                {created: {$gte: dateRangeQuery.dateStart, $lt: dateRangeQuery.dateEnd}},
                {offer: ObjectId(offerId)}
            ]
        }},
        { $sort : { created : -1} },
        { $group: {
            _id: {
                'year':  { '$year': '$created' },
                'month': { '$month': '$created' },
                'day':   { '$dayOfMonth': '$created' },
                'type':  '$type'
            },
            'count': { '$sum': 1 }
        }}];

};



exports.getStatsFromOfferType = function(req, res){

    var offer = req.offer.toObject();
    var dateRange = exports.getDateRange(offer, req, res);

    var URL_STAT_GROUPED_BY_OFFER_TYPE = 'https://api.hasoffers.com/Apiv3/json?NetworkId=springmedia&Target=Report&Method=getStats&NetworkToken=NETqSp772nJXc04Z2ZRTmDj3PPDpf0&fields%5B%5D=Stat.count&fields%5B%5D=Stat.affiliate_info2&groups%5B%5D=Stat.affiliate_info2&filters%5BAffiliate.company%5D%5Bconditional%5D=EQUAL_TO&filters%5BAffiliate.company%5D%5Bvalues%5D=Gostei.club&filters%5BOffer.ref_id%5D%5Bconditional%5D=EQUAL_TO&filters%5B'
        +'Offer.ref_id%5D%5Bvalues%5D='+offer.codeProvider
        +'&data_start='+dateRange.dateStart+'&data_end='+dateRange.dateEnd+'&limit=0&page=0&totals=1';
        
    request.get({
        url: URL_STAT_GROUPED_BY_OFFER_TYPE,
        json: true

    }, function(error, response, offerTypeGrouped) {

        var dataReturn = [];
        var data = offerTypeGrouped.response.data.data;


        for (var x = 0; x < data.length; x++) {
            
            dataReturn.push({
                origin : data[x].Stat.affiliate_info2,
                count : data[x].Stat.count 
            });

        }

        return res.status(200).send(dataReturn);  

    });

};



exports.getStatsFromTraficSource = function(req, res){

    var offer = req.offer.toObject();
    var dateRange = exports.getDateRange(offer, req, res);
        
    var URL_STAT_GROUPED_BY_TRAFFIC_SOURCE = 'https://api.hasoffers.com/Apiv3/json?NetworkId=springmedia&Target=Report&Method=getStats&NetworkToken=NETqSp772nJXc04Z2ZRTmDj3PPDpf0&fields%5B%5D=Stat.count&fields%5B%5D=Stat.affiliate_info5&groups%5B%5D=Stat.affiliate_info5&filters%5BAffiliate.company%5D%5Bconditional%5D=EQUAL_TO&filters%5BAffiliate.company%5D%5Bvalues%5D=Gostei.club&filters%5BOffer.ref_id%5D%5Bconditional%5D=EQUAL_TO&filters%5B'
        +'Offer.ref_id%5D%5Bvalues%5D='+offer.codeProvider
        +'&data_start='+dateRange.dateStart+'&data_end='+dateRange.dateEnd+'&limit=0&page=0&totals=1';

    

    request.get({
        url: URL_STAT_GROUPED_BY_TRAFFIC_SOURCE,
        json: true

    }, function(error, response, traficSourceGrouped) {

        var dataReturn = [];
        var data = traficSourceGrouped.response.data.data;


        for (var x = 0; x < data.length; x++) {
            
            dataReturn.push({
                origin : data[x].Stat.affiliate_info5,
                count : data[x].Stat.count 
            });

        }

        return res.status(200).send(dataReturn);  

    });
};







exports.getStatsFromProvider = function(req, res){

    var offer = req.offer.toObject();
   
    if(!offer.codeProvider){
        return res.status(200).send(offer);
    }
    
    var query = exports.getQueryImpressionAndClicks(
        offer._id, req.param('dateStart'), req.param('dateEnd'));

    var queryClicksGroupedByType = exports.getQueryClicksGroupedByType(
                offer._id, req.param('dateStart'), req.param('dateEnd'));


    var dateRange = exports.getDateRange(offer, req, res);


    var URL_STAT_GROUPED_BY_DATE = 'https://api.hasoffers.com/Apiv3/json?NetworkId=springmedia&Target=Report&Method=getStats&NetworkToken=NETqSp772nJXc04Z2ZRTmDj3PPDpf0&fields%5B%5D=Affiliate.company&fields%5B%5D=Offer.name&fields%5B%5D=Stat.clicks&fields%5B%5D=Stat.conversions&fields%5B%5D=Stat.cpa&fields%5B%5D=Stat.revenue&fields%5B%5D=Stat.cpc&fields%5B%5D=Stat.rpc&fields%5B%5D=Stat.profit&groups%5B%5D=Stat.date&filters%5BAffiliate.company%5D%5Bconditional%5D=EQUAL_TO&filters%5BAffiliate.company%5D%5Bvalues%5D=Gostei.club&filters%5BOffer.ref_id%5D%5Bconditional%5D=EQUAL_TO&filters%5B'
        +'Offer.ref_id%5D%5Bvalues%5D='+offer.codeProvider
        +'&data_start='+dateRange.dateStart+'&data_end='+dateRange.dateEnd+'&limit=0&page=0&totals=1';
 

    StatsImpression.aggregate(query, function(err, statsImpression) {
        StatsClicks.aggregate(query, function(err, statsClicks) {
            StatsClicks.aggregate(queryClicksGroupedByType).exec(function(err, statsClicksGrouped) {
                
                var totalImpressions = 0;
                var totalClicks = 0;
                var totalRefusal = 0;
                var totalAcceptance = 0;

                for(var x=0; x<statsClicksGrouped.length; x++){

                    if(statsClicksGrouped[x]._id.type === 'refusal'){
                        totalRefusal += statsClicksGrouped[x].count;

                    }else if(statsClicksGrouped[x]._id.type === 'acceptance'){
                        totalAcceptance += statsClicksGrouped[x].count;
                    }
                }

      
 
                for(var x=0; x<statsClicks.length; x++){
                    
                    totalClicks += statsClicks[x].count;

                    var year = statsClicks[x]._id.year;
                    var month = (statsClicks[x]._id.month < 10) ? ("0" + statsClicks[x]._id.month) : statsClicks[x]._id.month;
                    var day = (statsClicks[x]._id.day < 10) ? ("0" + statsClicks[x]._id.day) : statsClicks[x]._id.day;
                    statsClicks[x].date = year+'-'+month+'-'+day;

                }


                for(var x=0; x<statsImpression.length; x++){
                    
                    totalImpressions += statsImpression[x].count;

                    var year = statsImpression[x]._id.year;
                    var month = (statsImpression[x]._id.month < 10) ? ("0" + statsImpression[x]._id.month) : statsImpression[x]._id.month;
                    var day = (statsImpression[x]._id.day < 10) ? ("0" + statsImpression[x]._id.day) : statsImpression[x]._id.day;
                    statsImpression[x].date = year+'-'+month+'-'+day;

                }

                
                    request.get({
                            url: URL_STAT_GROUPED_BY_DATE,
                            json: true

                        }, function(error, response, bodyGrouped) {
                            
                            var provider = {};

                            if(bodyGrouped.response.data.data[0]){
                                provider = bodyGrouped.response.data;
                            }else{
                                return res.status(200).send(offer);
                            }

                            

                            offer.stats.clicks = totalClicks;
                            offer.stats.refusal =  Math.round((totalRefusal/totalClicks)*100);
                            offer.stats.acceptance =  Math.round((totalAcceptance/totalClicks)*100);
                            offer.stats.impressions = totalImpressions;
                            offer.stats.cpc = provider.totals.Stat.cpc;
                            offer.stats.revenue = provider.totals.Stat.revenue;
                            offer.stats.conversions = provider.totals.Stat.conversions;
                            
                            offer.stats.ecpm = offer.stats.revenue/offer.stats.clicks;

                            offer.stats.dateFilter = 
                                exports.getReportDataByDate({
                                    clicks : statsClicks,
                                    impressions : statsImpression,
                                    provider : provider.data
                            }, res);


                            return res.status(200).send(offer);


                        });

                });
           
        });
    });
 
};

exports.getReportDataByDate = function (stats, res){

    // stats.clicks
    // stats.impressions
    // stats.provider[x].Stat.cpc
    // stats.provider[x].Stat.revenue
    // ecpm

    var reportData = [];
    var index = 0;

    for(var x=0; x<stats.clicks.length; x++){

        reportData.push({
            date : stats.clicks[x].date,
            clicks : stats.clicks[x].count
        });
 
    }

    for(var x=0; x<stats.impressions.length; x++){


        index = _.findIndex(reportData, function(o) { 
            return o.date == stats.impressions[x].date; 
        });

        if(index > -1){

            reportData[index].impressions =  stats.impressions[x].count;

        }else{

            reportData.push({
                date : stats.impressions[x].date,
                impressions : stats.impressions[x].count
            });
        }
    }



    for(var x=0; x<stats.provider.length; x++){

        index = _.findIndex(reportData, function(o) { 
            return o.date == stats.provider[x].Stat.date; 
        });

        if(index > -1){

            reportData[index].cpc =  stats.provider[x].Stat.cpc;
            reportData[index].revenue =  stats.provider[x].Stat.revenue;
            reportData[index].conversions =  stats.provider[x].Stat.conversions;
            reportData[index].profit =  stats.provider[x].Stat.profit;

        }else{

            reportData.push({
                date : stats.provider[x].Stat.date,
                cpc : stats.provider[x].Stat.cpc,
                revenue : stats.provider[x].Stat.revenue,
                conversions : stats.provider[x].Stat.conversions,
                profit : stats.provider[x].Stat.profit
            });
        }
    }

    

    // ECPM
    for(var x=0; x<reportData.length; x++){

        if(reportData[x].revenue && reportData[x].clicks){
            reportData[x].ecpm = reportData[x].revenue/reportData[x].clicks;    
        }       
    }

    return _.sortBy(reportData, 'date');

};






exports.getDateToQuery = function (dateStart, dateEnd){

    // FORMAT: MM/DD/YYYY
    var dateStartSplited = dateStart.split('/');
    var dateEndSplited = dateEnd.split('/');

    var dateStart = new Date(dateStartSplited[2], (dateStartSplited[0]-1), dateStartSplited[1]);
        dateStart.setHours(0, 0, 0, 0);

    var dateEnd = new Date(dateEndSplited[2], (dateEndSplited[0]-1), dateEndSplited[1])
        dateEnd.setHours(24, 0, 0, 0);
        
    return {
        dateStart : dateStart,
        dateEnd : dateEnd
    }

};



exports.getDateRange = function(offer, req, res){


    if((!req.param('dateStart')) && (!req.param('dateEnd'))){
        return exports.getDefaultDates(offer.created);
    }

    if((req.param('dateStart')) && (req.param('dateEnd'))){
        
        return {
            dateStart : req.param('dateStart'),
            dateEnd : req.param('dateEnd')
        }
    }

    return false;

};




exports.getDefaultDates = function(offerCreated){

    var dateStart =  new Date(offerCreated);
    var dateEnd =  new Date();

    return {
        dateStart : exports.formatDateToProvider(dateStart),
        dateEnd : exports.formatDateToProvider(dateEnd)
    }


};




exports.formatDateToProvider = function(date){

    return (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
};


exports.isExistsAtLeastOneDateRangeParameter = function(req){

    return !( (!req.param('dateStart')) && (!req.param('dateEnd')) );
};


exports.isExistsAllDateRangeParameters = function(req){

    return ((req.param('dateStart')) && (req.param('dateEnd')));
};




exports.addStatsImpression = function(req, res) {

    var offer = req.offer;

    if(req.param('affcode')){

        Affiliation.findOne({code:req.param('affcode')}).exec(function(err, affiliation) {

            if(affiliation){
                
                StatsImpression.create({
                    offer : offer._id,
                    affiliation: affiliation._id
                }, function (err, statsImpression) {
                    res.status(200).send(statsImpression);
                });
            
            }else{
                return res.jsonp({message : 'There is no affiliation for this code'});
            }            

        });
        
    }else{
        
        StatsImpression.create({
            offer : offer._id
        }, function (err, statsImpression) {
            res.status(200).send(statsImpression);
        });

    }


    

};



exports.addStatsClick = function(req, res) {


    var offer = req.offer;


    if(req.param('affcode')){

        Affiliation.findOne({code:req.param('affcode')}).exec(function(err, affiliation) {

            if(affiliation){
                
                StatsClicks.create({
                    offer : offer._id,
                    type: req.param('type'),
                    user: req.param('userId'),
                    affiliation: affiliation._id

                }, function (err, statsClicks) {
                    res.status(200).send(statsClicks);
                });
            
            }else{
                return res.jsonp({message : 'There is no affiliation for this code'});
            }            

        });
        
    }else{
        
        StatsClicks.create({
            offer : offer._id,
            type: req.param('type'),
            user: req.param('userId')
        }, function (err, statsClicks) {
            res.status(200).send(statsClicks);
        });

    }

    

};



exports.getStatsImpressionByOffer = function(req, res) {

    var offer = req.offer;

    StatsImpression.find({offer: offer._id}).exec(function(err, statsImpression) {
        res.status(200).send(statsImpression);
    });

};


exports.getStatsClicksByOffer = function(req, res) {

    var offer = req.offer;


    StatsClicks.find({offer: offer._id}).exec(function(err, statsClicks) {
        res.status(200).send(statsClicks);
    });

};









