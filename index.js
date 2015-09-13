var app=angular.module("app", ['leaflet-directive','angularMoment']);

app.run(function(amMoment) {
    amMoment.changeLocale('fr');
});
var icons={};
icons.pink_drakkar= {
        iconUrl: 'img/drakkar.png',
        iconSize:     [32, 21],
        iconAnchor:   [16, 21]
    };
icons.blue_drakkar= {
         iconUrl: 'img/drakkar_blue.png',
         iconSize:     [32, 21],
         iconAnchor:   [16, 21]
     };

app.controller("main",['$scope','$http', function ($scope,$http)
{


  $scope.map={};
  $scope.map.center= {
                    lat: 49.19965,
                    lng: 0.13183,
                    zoom: 8
                };


  $scope.map.defaults={
                scrollWheelZoom: false
            };


  $scope.events=[];

  $http.get('/event.json')
           .success(function (data) {
              $scope.events=data;
           })
           .error(function (resp) {
             console.log(resp);
           });

}]);

app.filter("typeToIcon", function () {
  return function (type) {
    var icon=icons.pink_drakkar.iconUrl
    if (type=='meetup') {
      icon=icons.blue_drakkar.iconUrl;
    }
    return icon;
  }
});
app.filter("eventsToMarks", function () {
    return function (events, filter) {
        var marks = [];
        angular.forEach(events, function (event) {
            var mark={};
            if (((event.type=='meetup')&&(filter.meetup)) || ((event.type=='conference')&&(filter.conference)))
            {
              mark.lat=event.lat;
              mark.lng=event.lng;
              mark.focus=false;
              mark.draggable=false;
              mark.icon=icons.pink_drakkar
              if (event.type=='meetup') {
                mark.icon=icons.blue_drakkar;
              }
              mark.message="<img src='"+event.logo+"' style='width: 80px;' ><br/>";
              mark.message+="<strong>"+event.name+"</strong><br/>";
              mark.message+=event.description+"</br>"
              mark.message+="<em>"+moment(event.startDate).format('ll')+"</em><br/>"
              mark.message+="<a href='"+event.url+"' target='_blank'>Site</a>";
              marks.push(mark);
            }
        });
        return marks;
    };
});
