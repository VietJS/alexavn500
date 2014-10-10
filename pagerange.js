var exec = require('child_process').exec;
var Firebase = require('firebase');
var async = require('async')
var path = require('path')
var _ = require('underscore')
var config = require('./config')

var sitesRef = new Firebase(config.firebase.siteRef);

var queue = async.queue(function (task, done) {
  var url = task.site.name;
  exec('php ' + path.join(__dirname, 'vendor/prchecker/pr.php') + ' ' + url, function (err, stdout, stderr) {
    if (!err) {
      console.log(url, stdout.trim());
      sitesRef.child(task.key).update({
        googlePR: stdout.trim() ? parseInt(stdout.trim()) : 0
      }, function (err) {
        done(err);
      });
    } else {
      done(err, stdout);
    }
  });
}, 10);

queue.drain = function () {
  console.log('All done');
}

// queue.push('google.com');
sitesRef.once('value', function (snapshot) {
  var sites = snapshot.val();
  _.each(sites, function (site, key) {
    queue.push({site: site, key: key});
  });
});