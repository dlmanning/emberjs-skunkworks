define([
  "DS",
  "views/ApplicationView",
  "controllers/ApplicationController"
], function(DS,
  ApplicationView,
  ApplicationController
) {
	/*Module Pattern*/
  var attr = DS.attr;

  var App = {
		ApplicationView: ApplicationView,
		ApplicationController: ApplicationController
	};

  // App.Router.map(function() {
    
  // });

  App.MedicalCase = DS.Model.extend({
    CaseId: attr(),
    CaseStatusTypeId: attr(),
    PatientId: attr()
  });

  App.MedicalCaseSerializer = DS.RESTSerializer.extend({
    primaryKey: '$id',

    extractSingle: function (store, type, payload, id, requestType) {    
      var x = {medicalCase: payload};

      return this._super(store, type, x, id, requestType);
    },

    normalize: function (type, hash, prop) {
      return this._super(type, hash, prop);
    }

  });

  App.MedicalCaseAdapter = DS.RESTAdapter.extend({
    namespace: 'api',
    host: 'http://10.0.2.15:5050',

    pathForType: function(type) {
      return 'case';
    }

  });

  App.IndexRoute = Ember.Route.extend({
    model: function() {
      return this.store.find('medicalCase', 1);
    }
  });

	return App;
});
