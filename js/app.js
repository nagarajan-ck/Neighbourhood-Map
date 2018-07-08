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



var initMap = function() {
  var map;
  map = new google.maps.Map(document.getElementById('map'),{
          center: { lat:12.97,lng:77.58},
          zoom:13
        });
  var marker;
  var markers = [];
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
    //add marker click funtion here
  }
}


var ViewModel = function(){
  var self = this;
  this.placesList = ko.observableArray([]);
  self.query = ko.observable('');
  self.detail = ko.observable('Click on a place to get more details about it.');

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
    clickedPlace = data.name();
    self.detail('Loading more details about '+ data.name()+'...');
  }
}

var Model = function(place){
  this.name = ko.observable(place.name);
  this.location = ko.observable(place.location);
  //filtered goes here
}



ko.applyBindings(new ViewModel())
