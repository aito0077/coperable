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

script type="text/javascript">
            var initialLocation;
            var buenos_aires = new google.maps.LatLng(-34.615692,-58.432846);
            var browserSupportFlag =  new Boolean();
            var user_default;
            {{#geo}}
            user_default = new google.maps.LatLng({{geo.latitud}},{{geo.longitud}});
            {{/geo}}

            var user_geo = typeof(user_default) != 'undefined';

            function initialize() {

                console.log(user_geo);
                if(!user_geo) {
                    if(navigator.geolocation) {
                        browserSupportFlag = true;
                        try {
                            navigator.geolocation.getCurrentPosition(function(position) {
                                initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                                console.log('Latitud: '+initialLocation.lat()+' - Longitud: '+initialLocation.lng());
                                map.setCenter(initialLocation);

                                $.get(  
                                    '/user/geolocalization/'+initialLocation.lat()+'/'+initialLocation.lng(),
                                    {},  
                                    function(responseText) {  
                                        console.log(responseText);  
                                    });  
                            }, function() {
                                handleNoGeolocation(browserSupportFlag);
                            });
                        } catch(positionError) {
                            console.dir(positionError);
                        }
                    }
                }

            }

        </
