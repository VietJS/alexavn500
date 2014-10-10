(function ($) {
  var $table, sites = [];
  var sitesRef = new Firebase("https://alexavn500.firebaseio.com/sites");

  $(document).ready(function () {
    $('#last-updated').text('10/10/2014');

    $table = $('#sites-table').DataTable({
      data: sites,
      columns: [
        { title: 'Alexa range', data: 'range', width: '2.5%' },
        { title: 'Alexa global range', data: 'alexa.globalRange', width: '2.5%' },
        { title: 'Google PageRank', data: 'googlePR', width: '5%' },
        { 
          title: 'Name',
          data: 'name',
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).html('<a href="'+ rowData.url +'" target="_blank">'+ 
                          '<img src="https://getfavicon.appspot.com/'+ rowData.url +'" width="16" height="16">' +
                          '&nbsp;&nbsp;' + rowData.name +
                        '</a>');
          }
        },
        { title: 'Load speed (seconds)', data: 'alexa.loadSpeed' },
        { title: 'Daily time on site (minutes)', data: 'alexa.dailyTimeOnSite', createdCell: function (td, cellData, rowData, row, col) {
            var val = moment.duration(rowData.alexa.dailyTimeOnSite, 'ms').as('minutes');
            val = Math.round(val * 100) / 100;
            $(td).html(val);
          }
        },
        { title: 'Daily page view per visitor', data: 'alexa.dailyPageviewsPerVisitor' },
        { title: 'Bounce Rate', data: 'alexa.bounceRate' },
        { title: 'Description', data: 'description', width: 'auto', width: '30%', },
      ],
      autoWidth: true,
      processing: true,
      pageLength: 100,
      lengthMenu: [100, 200, 500, 1000]
    });

    sitesRef.once('value', function (snapshot) {
      sites = snapshot.val();
      $.each(sites, function () {
        $table.row.add(this);
      });
      $table.draw();
    });
  });
}(jQuery));