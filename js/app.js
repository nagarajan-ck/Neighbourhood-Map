/*
This javascript file loads the map asyncronously and
sets the markers. It also uses knockout to render content
dynamically when they change on the page
*/

// places is used to store the places and their locations
var places = [
  { name: 'Bangalore Palace',
    location: {lat : 12.998696, lng : 77.592026}
  },
  { name: 'Cubbon Park',
  location: {lat : 12.976347, lng : 77.592928}
  },
  { name: 'Indian Institute of Science',
  location: {lat : 13.021860, lng : 77.567142}
  },
  { name: "Tipu Sultan's Summer Palace",
  location: {lat : 12.959342, lng : 77.573625}
  },
  { name: 'Vidhana Soudha',
  location: {lat : 12.979462, lng : 77.590909}
}];


// markers is a list of all the marker objects of the places
// maps variable stores the map object
var markers = [];
var map;
var initMap = function() {
  map = new google.maps.Map(document.getElementById('map'),{
          center: { lat:12.997,lng:77.58},
          zoom:11.8
        });
  ko.applyBindings(new ViewModel());
  }


// init map applies bindings on the ViewModel once the map has been loaded
var ViewModel = function(){
  var self = this;
  self.placesList = ko.observableArray([]);
  self.query = ko.observable('');
  self.wikiDetail = ko.observable('Wikipedia Articles');
  self.wikiurl = ko.observable('');
  self.details = ko.observable('');
  self.extras = ko.observable('');


// creates an observableArray containing which contains the places model objects
  places.forEach(
    function(place){
    self.placesList.push(new Model(place));
  });


// filtered places contains the list of places models filtered according to user input
  self.filteredPlaces = ko.computed(function () {
    if(self.query()==undefined) {  // returns the placesList itself if no input
      return self.placesList();
    }
    else{
      arr =  self.placesList()
        .filter(placeItem => placeItem.name().toLowerCase().indexOf(self.query().toLowerCase()) > -1);
      // filtering code source: stackoverflow. The places list is filtered upon the condition that
      // updates the items such that only places that are superset of the input is returned

      // removes the initial markers from the map and nullifies markers list
      for (var i = 0; i < markers.length; i++) {
         markers[i].setMap(null);
      }
      markers=[]


      var marker;
      // creates new markers according to the filtered list
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

        // once the markers are clicked, it is bounced and the wikipedia details are fetched
        marker.addListener('click',function () {
          this.setAnimation(4);
          clickedPlace = this.title;
          self.retrieveDetails(clickedPlace);
      });
      }
      return arr;
    }
  });


  // function sets animation and gets wiki details when a list item is clicked
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


// function asyncronously gets wikipedia details about a place and renders it in DOM
this.retrieveDetails = function (place){

    var wikiurl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=wikiCallback&search='+place;
    self.wikiDetail('Wikipedia articles about '+place)
    var wikiRequestTimeout = setTimeout(function () {
      self.wikiDetail('Sorry, Wikipedia articles could not be loaded.')
    }, 5000);
    $.ajax(wikiurl, {
      dataType: "jsonp",
      success : function (response) {
        self.wikiurl(response[3][0]);
        self.details(response[0]);
        self.extras(response[2][0])
    clearTimeout(wikiRequestTimeout); // timeout created to display error is cleared
  }
    });

}
}

// Model creates the name and location of a place as observable arrays
var Model = function(place){
  this.name = ko.observable(place.name);
  this.location = ko.observable(place.location);
}
