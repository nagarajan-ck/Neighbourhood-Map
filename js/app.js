var places = [
  { name: 'Bangalore Palace',
    location: {lat : 12.998696, lng : 77.592026}
  },
  { name: 'Cubbon Park',
  location: {lat : 12.976347, lng : 77.592928}
  },
  { name: 'Lal Bagh',
  location: {lat : 12.950743, lng : 77.584777}
  },
  { name: 'Tipu Sultan Palace',
  location: {lat : 12.959342, lng : 77.573625}
  },
  { name: 'Vidhana Soudha',
  location: {lat : 12.979462, lng : 77.590909}
}];



var markers = [];
var initMap = function() {
  var map;
  map = new google.maps.Map(document.getElementById('map'),{
          center: { lat:12.97,lng:77.58},
          zoom:13
        });
  var marker;
  for (var i = 0; i< places.length; i++){
    var coordinates = places[i].location;
    var name = places[i].name;
    marker = new google.maps.Marker({
      map: map,
      position : coordinates,
      title : name,
      animation : google.maps.Animation.DROP,
      id : i
    });
    markers.push(marker);
    marker.addListener('click',function () {
      this.setAnimation(4);
      clickedPlace = this.title;
      retrieveDetails(clickedPlace);
  });
  }
}


var ViewModel = function(){
  var self = this;
  this.placesList = ko.observableArray([]);
  self.query = ko.observable('');

  places.forEach(
    function(place){
    self.placesList.push(new Model(place));
  });

  self.filteredPlaces = ko.computed(function () {
    if(self.query()==undefined){
      return self.placesList();
    }
    else{
      return self.placesList()
        .filter(placeItem => placeItem.name().toLowerCase().indexOf(self.query().toLowerCase()) > -1);
    }

  });

  this.locationTracker = function (data) {
    for(var i=0; i<markers.length; ++i){
      if(markers[i].title == data.name()){
        markers[i].setAnimation(4);
        break;
      }
    }
    clickedPlace = data.name();
    retrieveDetails(clickedPlace);
  }
}

var retrieveDetails = function (place){
    $ = jQuery;
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
        'api-key': "fda9404d908a42dc91872b8410bd6bd6",
        'q': place
    });
    $.getJSON(url, function (data) {
          articles = data['response']['docs'];
          $('#nyt').html('<h4>NYT Articles about '+place+'</h4>')
          for( var i = 0;i< articles.length; ++i){
            // console.log(articles[i]['web_url']);
              $('#nyt').append('<br><a href="'+articles[i]['web_url']+'">'+articles[i]['headline']['main']+'</a><br><br>');

          }
        }).fail(function () {
          $('#nyt').append('<br>Sorry, New York Times articles could not be loaded')
        });
}

var Model = function(place){
  this.name = ko.observable(place.name);
  this.location = ko.observable(place.location);
  //filtered goes here
}

// need to addfunction to bounce when anchor tag selected and a common function for displaying details by passing the name

ko.applyBindings(new ViewModel())
