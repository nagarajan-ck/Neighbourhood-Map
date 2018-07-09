var places = [
  { name: 'Bangalore Palace',
    location: {lat : 12.998696, lng : 77.592026}
  },
  { name: 'Cubbon Park',
  location: {lat : 12.976347, lng : 77.592928}
  },
  { name: 'Lal Bagh Botanical Gardens',
  location: {lat : 12.950743, lng : 77.584777}
  },
  { name: "Tipu Sultan's Summer Palace",
  location: {lat : 12.959342, lng : 77.573625}
  },
  { name: 'Vidhana Soudha',
  location: {lat : 12.979462, lng : 77.590909}
}];



var markers = [];
var map;
var initMap = function() {
  map = new google.maps.Map(document.getElementById('map'),{
          center: { lat:12.97,lng:77.58},
          zoom:13
        });
  ko.applyBindings(new ViewModel());
  }



var ViewModel = function(){
  var self = this;
  self.placesList = ko.observableArray([]);
  self.query = ko.observable('');
  self.wikiDetail = ko.observable('');
  self.nytDetail = ko.observable('');


  places.forEach(
    function(place){
    self.placesList.push(new Model(place));
  });

  self.filteredPlaces = ko.computed(function () {
    if(self.query()==undefined){
      return self.placesList();
    }
    else{
      arr =  self.placesList()
        .filter(placeItem => placeItem.name().toLowerCase().indexOf(self.query().toLowerCase()) > -1);

      var marker;
      for (var i = 0; i < markers.length; i++) {
         markers[i].setMap(null);
       }
       markers=[]
      for (var i = 0; i< arr.length; i++){
        var coordinates = arr[i].location();
        var name = arr[i].name();
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
          self.retrieveDetails(clickedPlace);
      });
      }


      return arr;
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
    self.retrieveDetails(clickedPlace);
  }

this.retrieveDetails = function (place){
    var nyturl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nyturl += '?' + $.param({
        'api-key': "fda9404d908a42dc91872b8410bd6bd6",
        'q': place
    });
    self.nytDetail('New York Times Articles about '+place)
    $.getJSON(nyturl, function (data) {
          articles = data['response']['docs'];
          for( var i = 0;i< articles.length; ++i){
              self.nytDetail('<br><a href="'+articles[i]['web_url']+'">'+articles[i]['headline']['main']+'</a><br><br>');
          }
        }).fail(function () {
          self.nytDetail('Sorry, New York Times articles could not be loaded.')
        });
    //calls to nyt api ends here
    //calls to wiki api starts here

    var wikiurl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=wikiCallback&search='+place;
    self.wikiDetail('Wikipedia articles about '+place)
    var wikiRequestTimeout = setTimeout(function () {
      self.wikiDetail('Sorry, Wikipedia articles could not be loaded.')
    }, 5000);
    $.ajax(wikiurl, {
      dataType: "jsonp",
      success : function (response) {
        self.wikiDetail('<a href="'+response[3][0]+'">'+response[0]+'</a><br><p>'+response[2][0]+'</p><br>')
    clearTimeout(wikiRequestTimeout);
  }
    });

}
}

var Model = function(place){
  this.name = ko.observable(place.name);
  this.location = ko.observable(place.location);
}
