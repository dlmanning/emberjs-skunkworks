App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
});

App.medicalCaseData = Ember.Object.extend({});
var link = App.medicalCaseData.create();
link.set('url', 'http://localhost:8000/data.json');

var stubData;
console.log(link.get('url'));
$.getJSON(link.get('url'), function(response) {
  stubData = reorganizeData(response);
  console.log(stubData);
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return stubData;
  }
});

function reorganizeData(data) {
  var procedures = data.Procedure || [];

  var accessSites = procedures.filter(function (proc) {
    return (proc.ProcedureTypeId === 1);
  });

  procedures.forEach(function (proc) {
    if (proc.ParentProcedureId) {
      accessSites.forEach(function (accessSite) {
        accessSite.procedures = accessSite.procedures || [];
        if (proc.ParentProcedureId === accessSite.ProcedureId) {
          accessSite.procedures.push(proc);
        }
      });
    }
  });

  data.accessSites = accessSites;

  return data;
}
