var request = require('request')
var cheerio = require('cheerio')
var _ = require('underscore')
var async = require('async')
var Firebase = require("firebase")
var config = require('./config')

var sitesRef = new Firebase(config.firebase.siteRef);

var sites = [];
var queue = async.queue(function (url, done) {
  request({
    url: url,
    method: 'GET'
  }, function (err, res, body) {
    if (err) {
      throw new Error(err);
    } else {
      var $ = cheerio.load(body);
      $('ul li.site-listing').each(function () {
        var $this = $(this);
        $this.find('.description .truncate').remove();
        $this.find('.description .remainder').remove();
        var site = {
          name: $this.find('.desc-paragraph').text().trim(),
          alexaUrl: 'http://www.alexa.com' + $this.find('.desc-paragraph a').attr('href'),
          description: $this.find('.description').text().trim(),
          range: parseInt($(this).find('.count').text().trim())
        }
        sites.push(site);
      });
    }
    done(err);
  });
}, 10);

queue.drain = function () {
  console.log('Crawling done!')
  sitesRef.once('value', function (snapshot) {
    var sitesDb = snapshot.val();
    var sitesDbName = _.pluck(sitesDb, 'name');
    sites = _.reject(sites, function (site) {
      return _.contains(sitesDbName, site.name);
    });
    if (_.size(sites) > 0) {
      console.log('Found '+ _.size(sites) +' new size. Saving ...');
      _.each(sites, function (site) {
        sitesRef.push(site);
      });
    } else {
      console.log('Found 0 new size. Exit.');
    }
  });
}

for (var i=0; i<=20; i++) {
  queue.push('http://www.alexa.com/topsites/countries;'+ i +'/VN');
}