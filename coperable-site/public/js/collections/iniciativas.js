app.Iniciativas = Backbone.Collection.extend({
	model: app.Iniciativa,
	url: '/api/iniciativas',
  idAttribute: '_id'
})