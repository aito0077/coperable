$(function(){
    var self = this;

    if (typeof iniciativa == 'undefined') {
        window.iniciativa = self.iniciativa = {};
    }

    iniciativa.Edit = Backbone.View.extend({
        events: {
            'change #name': 'set_name',
            'change #goal': 'set_goal',
            'change #description_red': 'set_description',
            'change #date': 'set_date',
            'change #duration': 'set_duration',
            'change #profile_picture': 'set_profile_picture',
            'slidechange #slider': 'set_participants_amount',
            'change #phone': 'set_phone',
            'change #email': 'set_email',
            'change #activities': 'set_activities',
            'click .ini_category': 'set_category',
            'click #submit_iniciativa': 'create_iniciativa',
            'click #submit_iniciativa_tasks': 'add_iniciativa_tasks',
            'shown #tareas_tab': 'set_current_tab'
        },

        initialize: function() {
            _.bindAll(this, 'reset', 'setup_bindings', 'setup_components', 'set_latitude', 'set_longitude', 'set_name', 'set_goal', 'set_description', 'set_date', 'set_duration', 'set_profile_picture', 'set_participants_amount', 'set_phone', 'set_email', 'create_iniciativa', 'validate', 'validate_tasks', 'add_iniciativa_tasks', 'save_iniciativa', 'set_activities', 'set_category', 'after_save', 'set_current_tab');

            console.log('inicializando...');

            this.current_tab = 'basicos_tab';
            var Iniciativa = Backbone.Model.extend({
                urlRoot : '/iniciativas',
                idAttribute: "_id"
            });
            this.model = new Iniciativa;

            this.setup_bindings();
            this.setup_components();
        }, 

        reset: function(options) {
            this.model.set(options);
            console.dir(options);
            this.user_default = new google.maps.LatLng(options.latitud, options.longitud);

            this.address.reset({
                map_canvas: '#map_canvas',
                user_position: this.user_default
            });
 
        },

        setup_bindings: function() {

            this.model.on('change:latitud', function(model, attribute) {
                $('#latitude').val(model.get('latitud')); 
            });

            this.model.on('change:longitud', function(model, attribute) {
                $('#longitude').val(model.get('longitud')); 
            });
        },

        setup_components: function() {
            var self = this;

            $('.ini_category').button();

            $("#slider").slider({
                min: 1,
                max: 50,
                step: 1,
                value: 5,
                orientation: "horizontal",
                range: "min"
            });

            $("#activities").tagsInput({
               //autocomplete_url: url_to_autocomplete_api,
               interactive:true,
               width: '200px',
               onChange : this.set_activities,
               removeWithBackspace: true,
               minChars: 3
            });
            $('.datepicker').datepicker();
            $('#description_red').redactor({
                lang: 'es',
                plugins: ['fullscreen', 'clips'],
                imageUpload: '/resources/upload_image/'
            });
            $(".btn-group a").click(function() {
                $(this).siblings().removeClass("active");
                $(this).addClass("active");
            });


            $('#iniciativa_wizard a:first').tab('show');
        
            this.address = new AddressPicker();

            this.address.on('direccion_change', function(direccion) {
                self.model.set({
                    address: direccion
                }); 
            });
            this.address.on('location_change', function(location) {
                self.model.set({
                    latitud: location.latitud,
                    longitud: location.longitud,
                    location: {
                        latitude: location.latitud,
                        longitude: location.longitud
                    }
                }); 
            });

        },

        create_iniciativa: function(e) {
            this.save_iniciativa();
        }, 

        save_iniciativa: function() {
            var self = this;
            $('#description').val(JSON.stringify($('#description_red').getCode()));
            
            if(this.validate()) {
                console.log('Es un modelo nuevo? '+this.model.isNew());
                this.model.save(null, {
                    success: function() {
                        self.after_save();
                        console.log('Exito en crear iniciativa');
                    },
                    error: function() {
                        console.log('Error en crear iniciativa');
                    }
                });
            }
        },

        after_save: function() {
            var tab_to_show = 'basicos_tab';
            switch(this.current_tab) {
                case 'basicos_tab': 
                    tab_to_show = 'tareas_tab';
                    break;
                case 'tareas_tab': 
                    tab_to_show = 'redes_tab';
                    break;
                deafult: 
                    tab_to_show = 'basicos_tab';
                    break;
            }
            console.log('Current: '+this.current_tab+' -to-  '+tab_to_show);
            $('#'+tab_to_show).tab('show');
        },

        set_current_tab: function(e) {
            this.current_tab = e.target.id;
        },

        validate: function() {
            return true;
        },

        add_iniciativa_tasks: function(e) {
            if(this.validate_tasks()) {
                this.save_iniciativa();
            }
        },

        validate_tasks: function() {
            return true;
        },

        set_latitude: function(e) {
            this.model.set({
                latitude: e.target.value
            });
        },

        set_longitude: function(e) {
            this.model.set({
                longitude: e.target.value
            });
        },

        set_name: function(e) {
            var slug = e.target.value.replace(/\s+/g, '_');
            this.model.set({
                name: e.target.value,
                slug: slug.toLowerCase()
            });
            $('#slug').val(slug);
        },

        set_goal: function(e) {
            this.model.set({
                goal: e.target.value
            });
        },

        set_description: function(e) {
            this.model.set({
                description: e.target.value
            });
        },

        set_date: function(e) {
            this.model.set({
                date: e.target.value
            });
        },

        set_duration: function(e) {
            this.model.set({
                duration: e.target.value
            });
        },

        set_profile_picture: function(e) {
            this.model.set({
                profile_picture: e.target.value
            });
        },

        set_participants_amount: function(e, ui) {
            $('#show_amount').html('('+ui.value+')');
            this.model.set({
                participants_amount: ui.value
            });
        },

        set_phone: function(e) {
            this.model.set({
                phone: e.target.value
            });
        },

        set_email: function(e) {
            this.model.set({
                emai: e.target.value
            });
        },

        set_category: function(e) {
            var value_map = this.model.get('categories') || {};
            value_map[e.target.id] = value_map[e.target.id] ? false : true;
            console.dir(value_map);
            this.model.set({
                categories: value_map
            });
        },

        set_activities: function(e) {
            this.model.set({
                activities: $('#activities').val()
            });
        }

    });


    window.AddressPicker = Backbone.View.extend({


        zoom_default: 12,

        events: {

        },

        initialize: function() {
            _.bindAll(this, 'reset', 'setup_binding', 'setup_component');

            this.model = new Backbone.Model;
        },

        reset: function(options) {
            this.map_canvas = options.map_canvas;
            this.user_position = options.user_position;
            this.setup_component();
            this.setup_binding();
        },

        setup_binding: function() {
            var self = this;
            this.addresspickerMap.on("addressChanged", function(evt, address) {
                console.log('Address Changed');
                try {

                    var direccion = address.formatted_address.replace(/Province/g, 'Provincia' );
                    self.trigger('direccion_change', direccion);
                } catch(e) {
                    console.log(e);
                }
                self.trigger('location_change', {
                    latitud: address.geometry.location.jb,
                    longitud: address.geometry.location.kb  
                });
            });
            this.addresspickerMap.on("positionChanged", function(evt, markerPosition) {
                console.log('Position Changed');
                console.dir(markerPosition);
                markerPosition.getAddress( function(address) {
                    if (address) {
                        $( "#addresspicker_map").val(address.formatted_address);
                    }
                })
            });

        },

        setup_component: function() {
            var self = this;
            this.addresspicker = $( "#addresspicker" ).addresspicker();
            this.addresspickerMap = $( "#addresspicker_map" ).addresspicker({
                regionBias: "ar",
                map:      "#map_canvas",
                typeaheaddelay: 1000,
                mapOptions: {
                    languaje: "es",
                    zoom: 16 || self.zoom_default,
                    center: self.user_position
                }
            });

        }
    });

});


