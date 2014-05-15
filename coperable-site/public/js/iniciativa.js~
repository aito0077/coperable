$(function(){
  var self = this;

  if (typeof iniciativa == 'undefined') {
    window.iniciativa = self.iniciativa = {};
  }

  iniciativa.Model = Backbone.Model.extend({
    urlRoot : '/api/iniciativas',
    idAttribute: "_id"
  });

/*
    name:  String,
    slug:  String,
    code:  String,
    goal:  String,
    duration:  String,
    description:   String,
    address:   String,
    profile_picture:   String,
    pariticipants_amount:   String,
    phone:   String,
    email:   String,
    categories: {
        medio_ambiente: {type: Boolean, default: false},
        educacion: {type: Boolean, default: false},
        desarrollo: {type: Boolean, default: false},
        arte_cultura: {type: Boolean, default: false},
    },
    owner: {
        user: String,
        name: String
    },
    members: [{
        user: String,
        role: String,
        since_date: { type: Date, default: Date.now }
    }],
    tasks: [{
        tag: String,
        description: String
    }],
    public: { type: Boolean, default: false},
    stages: [{
        stage: String,
        description: String,
        start_date: { type: Date, default: Date.now },
        finish_date: { type: Date, default: Date.now }
    }],
    current_stage: String,
    version: Number,
    location: {
        latitude: {type: Number, default: 0},
        longitude: {type: Number, default: 0}
    },
    networks: {
        facebook: {
            text: String
        },
        twitter: {
            text: String
        },
        vimeo: {
            text: String
        },
        youtube: {
            text: String
        },
        flickr: {
            text: String
        }
    },
*/
 

  iniciativa.Collection = Backbone.Collection.extend({
    model: iniciativa.Model,
    url: '/api/iniciativas',
    idAttribute: "_id"
  });


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
      'shown #tareas_tab': 'set_current_tab',
      'click #checkbox_participantes': 'set_participantes_ilimitados',
      'click #button_gmap': 'show_gmap'
    },

    initialize: function() {
      _.bindAll(this);

      console.log('inicializando...');

      this.current_tab = 'basicos_tab';
      this.model = new iniciativa.Model;

      this.setup_bindings();
      this.setup_components();
    },

    reset: function(options) {
      this.model.set(options);
      console.dir(options);
      this.user_default = new google.maps.LatLng(options.latitud, options.longitud);

      // this.address.reset({
      //   map_canvas: '#map_canvas',
      //   user_position: this.user_default
      // });

    },

    setup_bindings: function() {

      this.model.on('change:latitud', function(model, attribute) {
        $('#latitude').val(model.get('latitud'));
      });

      this.model.on('change:longitud', function(model, attribute) {
        $('#longitude').val(model.get('longitud'));
      });
    },
     
    show_gmap: function(){
      $('#modalGMap').modal('show');
    },

    setup_components: function() {
      var self = this;

      $('.ini_category').button();
      $('#button_gmap').button();

        $('#datetimepicker_from').datetimepicker({
            language: 'es-AR'
        });
        $('#datetimepicker_to').datetimepicker({
            language: 'es-AR'
        });
     
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
      // $('.datepicker').datepicker();
      // $('#description_red').redactor({
      //   lang: 'es',
      //   plugins: ['fullscreen', 'clips'],
      //   imageUpload: '/resources/upload_image/'
      // });
      $(".btn-group a").click(function() {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
      });


      $('#iniciativa_wizard').tab('show');


      $('[name="address"]').on('change', function(){
        self.model.set({
          address: $('[name="address"]').val()
        });
      })

      this.$map = $("#address_map")
      this.$map.goMap({
        markers: [{
          latitude: -34.615853,
          longitude: -58.433298,
          draggable: true,
          id: 'addressMarker'
        }],
        zoom: 13,
        disableDoubleClickZoom: true
      });
      // this.address = new AddressPicker();

      // this.address.on('direccion_change', function(direccion) {
      //   self.model.set({
      //     address: direccion
      //   });
      // });
      // this.address.on('location_change', function(location) {
      //   self.model.set({
      //     latitud: location.latitud,
      //     longitud: location.longitud,
      //     location: {
      //       latitude: location.latitud,
      //       longitude: location.longitud
      //     }
      //   });
      // });

    },
  
    set_participantes_ilimitados: function(){
	var checkeado = $('#checkbox_participantes').is(':checked');
	
	$('#slider').css('display',(checkeado?'none':'inline'));
	$('#show_amount').css('display',(checkeado?'none':'inline'));
	
    },

    create_iniciativa: function(e) {
      this.save_iniciativa();
    },

    save_iniciativa: function() {
      var self = this;
      //$('#description').val(JSON.stringify($('#description_red').getCode()));
      $('#description').val(JSON.stringify($('#description_red').val()));

      var location = this.$map.data()['addressMarker'].position
      self.model.set({
        latitud: location.lat(),
        longitud: location.lng(),
        location: {
          latitude: location.lat(),
          longitude: location.lng()
        }
      });

      if(this.validate()) {
        console.log('Es un modelo nuevo? '+this.model.isNew());
        this.model.save(null, {
          success: function() {
            self.after_save();
            console.log('Exito en crear iniciativa');
            window.location = '/iniciativas'
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



  iniciativa.MapBrowser = Backbone.View.extend({

    el: $('#map_browser'),
    zoom_default: 12,

    ARTE_CULTURA: 'arte_cultura',
    DESARROLLO: 'desarrollo',
    EDUCACION: 'educacion',
    MEDIO_AMBIENTE: 'medio_ambiente',

    markers: new Array(),

    events: {
      'click #browser_all': 'browse_iniciativas',
      'click #browser_me': 'browse_iniciativas',
      'click #browser_ac': 'browse_iniciativas',
      'click #browser_ed': 'browse_iniciativas',
      'click #browser_ds': 'browse_iniciativas'
    },

    initialize: function() {
      _.bindAll(this);

      this.model = new iniciativa.Model;
      this.iniciativas = new iniciativa.Collection;
      this.buenos_aires = new google.maps.LatLng(-34.615692,-58.432846);
      this.user_default = this.buenos_aires;
      this.browserSupportGeolocation =  navigator.geolocation ? true : false;

      this.setup_component();
      this.setup_binding();
    },

    reset: function(options) {
      if(options.user_location) {
        this.user_default = new google.maps.LatLng(options.user_location.latitud, options.user_location.longitud);
        this.has_location = true;
        this.user_location = options.user_user_location;
      }
      this.initialLocation = this.user_default;

      this.render_map();
    },

    setup_binding: function() {
      var self = this;
    },

    setup_component: function() {
      this.markerTemplate = _.template([
        '<div class="media">',
          '<a class="pull-left" href="#">',
          '</a>',
          '<div class="media-body">',
            '<h3><a class="iniciativa" data-id="<%= _id %>" href="/iniciativas/<%= _id %>"><%= name %></a></h3>',
            '<div class="media">',
              '<p class="descSmall"><%= goal %></p>',
            '</div>',
          '</div>',
        '</div>'].join(''));

      this.itemTemplate = _.template([
      '<li data-category="<%= main_category %>" class="initiative">',
        '<div data-label="<%= main_category %>" class="pic">',
          '<a href="/iniciativas/<%= _id %>" rel="address:/iniciativa">',
            '<img src="/static/img/iniciativas/initiativepic-5-mq.jpg" />',
          '</a>',
        '</div>',
        '<div class="wrapper">',
          '<a href="/iniciativas/<%= _id %>" rel="address:/iniciativa">',
            '<h4><%= name %></h4>',
          '</a>',
          '<div class="place" data-icon=""><%= address %></div>',
          '<div class="schedule" data-icon=""></div>',
        '</div>',
        '<div class="bottom">',
          '<div class="wrapper">',
            '<ul class="status">',
              '<li class="actual"><%= stages[0].stage %> <div class="icon"></div></li>',
              '<li>Activando<div class="icon"></div></li>',
              '<li>Finalizada<div class="icon"></div></li>',
            '</ul>',
          '</div>',
          '<div class="actions wrapper">',
            '<a href="/iniciativas/<%= _id %>" rel="address:/iniciativa" class="button green">Participá</a>',
            '<div class="text"><%= members.lenght %></div>',
          '</div>',
        '</div>',
      '</li>'
        ].join(''));



      var myOptions = {
        zoom: 12,
        center:  this.user_default,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    },

    traer_iniciativas: function(category) {
      var self = this;
      this.iniciativas.fetch({
        data: $.param({
          category: category
        }),
        success: function(iniciativas, response, options) {
          self.marcar_iniciativas();
        }
      });
    },

    clear_markers: function() {
      _.each(this.markers, function(marker) {
        marker.setMap(null);
      });
      this.markers = new Array();
      $('#iniciativas_list').html('');
    },

    marcar_iniciativas: function() {
      var self = this;
      this.clear_markers();

      _.each(this.iniciativas.models, function(model) {
        console.dir(model.attributes);
        var location = model.get('location');
        var marker = new google.maps.Marker({
          title: model.get('name'),
          position: new google.maps.LatLng(location.latitude,location.longitude),
          map: self.map
        });

        console.log(self.markerTemplate(model.toJSON()));
        marker.info = new google.maps.InfoWindow({
          content:self.markerTemplate(model.toJSON())
        })
        google.maps.event.addListener(marker, 'click', function(){
          marker.info.open(self.map, marker);
        });
        self.markers.push(marker);

        $('#iniciativas_list').append(self.itemTemplate(model.toJSON()));
      });
    },

    render_map: function() {
      this.map.setCenter(this.initialLocation);
      this.traer_iniciativas();
    },

    detect_geolocation: function() {
      if(this.browserSupportGeolocation) {
        try {
          navigator.geolocation.getCurrentPosition(function(position) {
            var initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            console.log('Latitud: '+initialLocation.lat()+' - Longitud: '+initialLocation.lng());
            $.get(
              '/user/geolocalization/'+initialLocation.lat()+'/'+initialLocation.lng(),
            {},
            function(responseText) {
              console.log(responseText);
            });
          },
          function() {
            handleNoGeolocation(browserSupportFlag);
          });
        } catch(positionError) {
          console.dir(positionError);
        }
      }
    },

    browse_iniciativas: function(e) {
      var category = null;
      console.log('Target id: '+e.target.id);
      switch(e.target.id) {
        case 'browser_all':
          category = null;
          break;
        case 'browser_me':
          category = this.MEDIO_AMBIENTE;
          break;
        case 'browser_ac':
          category = this.ARTE_CULTURA;
          break;
        case 'browser_ed':
          category = this.EDUCACION;
          break;
        case 'browser_ds':
          category = this.DESARROLLO;
          break;
        default:
          break;
      }
      console.log('Filtrar usando: '+category);

      this.traer_iniciativas(category);

    }
  });



});




