(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdNewSubjectsMap", {
      template: "<div id='map'></div>",
      controller: NewSubjectsMapController,
      bindings: {
        zoom: "@"
      }
    });

  NewSubjectsMapController.$inject = ["$scope", "$element",
                                          "spa-demo.geoloc.Map",
                                          "spa-demo.subjects.currentSubjects",
                                          "spa-demo.config.APP_CONFIG"];
  function NewSubjectsMapController($scope, $element, Map, currentSubjects, APP_CONFIG) {
    var vm = this;

    vm.$onInit = function() {};

    vm.$postLink = function() {
      var element = $element.find('div')[0];

      initializeMap(element, APP_CONFIG.default_position);

      $scope.$watchGroup(
        [
          function() { return currentSubjects.getCurrentThing(); },
          function() { return currentSubjects.getImages(); }
        ],
        function(newValues, oldValues) {
          vm.thing = newValues[0];

          if (vm.thing) {
            vm.images = newValues[1].filter(ti => ti.thing_id === vm.thing.thing_id);
            displaySubjects();
          }
        });
    }

    return;
    //////////////

    function initializeMap(element, position) {
      vm.map = new Map(element, {
        center: position,
        zoom: vm.zoom || 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      displaySubjects();
    }

    function displaySubjects(){
      if (!vm.map) { return; }
      vm.map.clearMarkers();

      angular.forEach(vm.images, function(ti){
        displaySubject(ti);
      });
    }

    function displaySubject(ti) {
      var markerOptions = {
        position: {
          lng: ti.position.lng,
          lat: ti.position.lat
        },
        thing_id: ti.thing_id,
        image_id: ti.image_id
      };
      if (ti.thing_id && ti.priority===0) {
        markerOptions.title = ti.thing_name;
        markerOptions.icon = APP_CONFIG.thing_marker;
        markerOptions.content = vm.thingInfoWindow(ti);
      } else if (ti.thing_id) {
        markerOptions.title = ti.thing_name;
        markerOptions.icon = APP_CONFIG.secondary_marker;
        markerOptions.content = vm.thingInfoWindow(ti);
      } else {
        markerOptions.title = ti.image_caption;
        markerOptions.icon = APP_CONFIG.orphan_marker;
        markerOptions.content = vm.imageInfoWindow(ti);
      }
      vm.map.displayMarker(markerOptions);
    }
  }

  NewSubjectsMapController.prototype.thingInfoWindow = function(ti) {
    console.log("thingInfo", ti);
    var html ="<div class='thing-marker-info'><div>";
      html += "<span class='id ti_id'>"+ ti.id+"</span>";
      html += "<span class='id thing_id'>"+ ti.thing_id+"</span>";
      html += "<span class='id image_id'>"+ ti.image_id+"</span>";
      html += "<span class='thing-name'>"+ ti.thing_name + "</span>";
      if (ti.image_caption) {
        html += "<span class='image-caption'> ("+ ti.image_caption + ")</span>";
      }
      if (ti.distance) {
        html += "<span class='distance'> ("+ Number(ti.distance).toFixed(1) +" mi)</span>";
      }
      html += "</div><img src='"+ ti.image_content_url+"?width=200'>";
      html += "</div>";
    return html;
  }

  NewSubjectsMapController.prototype.imageInfoWindow = function(ti) {
    console.log("imageInfo", ti);
    var html ="<div class='image-marker-info'><div>";
      html += "<span class='id image_id'>"+ ti.image_id+"</span>";
      if (ti.image_caption) {
        html += "<span class='image-caption'>"+ ti.image_caption + "</span>";
      }
      if (ti.distance) {
        html += "<span class='distance'> ("+ Number(ti.distance).toFixed(1) +" mi)</span>";
      }
      html += "</div><img src='"+ ti.image_content_url+"?width=200'>";
      html += "</div>";
    return html;
  }


})();
