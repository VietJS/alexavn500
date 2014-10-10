var request = require('request')
var cheerio = require('cheerio')
var _ = require('underscore')
var async = require('async')
var Firebase = require("firebase")
var moment = require('moment')
var config = require('./config')

var sitesRef = new Firebase(config.firebase.siteRef);

var queue = async.queue(function (task, done) {
  var key = task.key;
  var site = task.site;
  console.log('Updating ', site.name);
  request.get('http://www.gmodules.com/ig/proxy?url=' + site.alexaUrl, function (err, res, body) {
    if (!err) {
      var siteUpdate = {};
      var $ = cheerio.load(body);
      siteUpdate.url = $('.compare-site a').attr('href');
      siteUpdate.alexa = {
        globalRange: $('.globleRank .metrics-data').text(),
        dailyUniqueVisitors: $('#traffic-certify-content .span3').eq(0).find('.metrics-data').text(),
        dailyPageviews: $('#traffic-certify-content .span3').eq(1).find('.metrics-data').text(),
        monthlyUniqueVisitors: $('#traffic-certify-content .span3').eq(1).find('.metrics-data').text(),
        monthlyPageviews: $('#traffic-certify-content .span3').eq(1).find('.metrics-data').text(),
        bounceRate: $('span[data-cat="bounce_percent"] .metrics-data').text(),
        dailyPageviewsPerVisitor: $('span[data-cat="pageviews_per_visitor"] .metrics-data').text(),
        dailyTimeOnSite: $('span[data-cat="time_on_site"] .metrics-data').text(),
        loadSpeed: $('.panel-loadspeed .panel-content').text().trim(),
      }
      siteUpdate.loadSpeed = siteUpdate.loadSpeed ? siteUpdate.loadSpeed.match(/([0-9\.]+[0-9]) Seconds/)[1] : null;
      siteUpdate.description = $('.panel-contact .span8 .color-s3').text().trim();
      var dailyTimeOnSiteSplit = siteUpdate.alexa.dailyTimeOnSite.split(':');
      var duration = {};
      var duration_map = ['seconds', 'minutes', 'hours'];
      _.each(dailyTimeOnSiteSplit.reverse(), function (value, index) {
        duration[duration_map[index]] = value;
      });
      
      siteUpdate.alexa.dailyTimeOnSite = moment.duration(duration).as('milliseconds');

      _.each(siteUpdate.alexa, function (val, prop) {
        if (prop != 'bounceRate') {
          if (_.isString(val)) {
            val = val.trim().replace(/[^0-9\.]/g, '');
            val = val.replace(/[^0-9]$/, '');
          }
          siteUpdate.alexa[prop] = val;
        }
      });

      site = _.extend(site, siteUpdate);

      sitesRef.child(key).set(site, function (err) {
        done(err);
      });
    } else {
      done(err);
    }
  });
}, 10);

queue.drain = function () {
  console.log('All done!')
}

sitesRef.once('value', function (snapshot) {
  var sites = snapshot.val();
  _.each(sites, function (site, key) {
    queue.push({ site: site, key: key });
  });
});