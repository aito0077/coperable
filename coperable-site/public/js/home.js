$(function(){

    var MainView = Backbone.View.extend({
        BUENOS_AIRES: new google.maps.LatLng(-34.615692,-58.432846),

        initial_location: this.BUENOS_AIRES,

        browserSupportFlag: (navigator.geolocation? true : false),

        map_options: {
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        },

        initialize: function () {
            _.bindAll(this, 'render', 'init', 'init_map', 'set_geo_cookie', 'obtain_current_location', 'set_default_location');


        },

        render: function() {

        },

        init: function(options) {
            if(options && options.geo) {
                this.model.set({
                    user_default: new google.maps.LatLng(options.geo.latitud, options.geo.longitud)
                });
            }
        },

        init_map: function(options) {
            var map_values = _.extend(this.map_options, {
                center:  this.initial_location
            });
            var map = new google.maps.Map(document.getElementById("map_canvas"), map_values);
        },

        set_geo_cookie: function(geo_location) {
            $.get(  
                '/user/geolocalization/'+geo_location.latitude+'/'+geo_location.longitude,
                {},  
                function(responseText) {  
                }
            );  
        },

        obtain_current_location: function() {
            var self = this;
            try {
                navigator.geolocation.getCurrentPosition(function(position) {
                    self.initial_location = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                }, function() {
                    set_default_location();
                });
            } catch(positionError) {
                console.dir(positionError);
            }
        },

        set_default_location: function() {

        }
    });

});



