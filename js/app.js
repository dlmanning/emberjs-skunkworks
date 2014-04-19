var attr = DS.attr;

App = Ember.Application.create();

App.Router.map(function() {
  
});

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
  host: 'http://walkabout.local:5050',

  pathForType: function(type) {
    return 'case';
  }

});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('medicalCase', 1);
  }
});
