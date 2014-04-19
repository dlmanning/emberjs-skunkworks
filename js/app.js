var stubData = reorganizeData({"$id":"1","CaseId":1,"CaseStatusTypeId":3,"PatientId":1,"PrimaryPhysicianId":1,"LastModified":"2014-04-15T15:45:55.19","LastModifiedBy":"Test Data Only","Patient":{"$id":"2","PatientId":1,"PatientKey":"4c010e85-92bb-e311-be97-c8f733e43f85","ExternalPatientKey":null,"FirstName":"Amy","MiddleName":null,"LastName":"Poeller","LastModified":"2014-04-18T21:55:37.193","LastModifiedBy":"david","Case":[{"$ref":"1"}],"FullName":"Poeller, Amy"},"MedicalPersonnel":null,"Procedure":[{"$id":"3","ProcedureId":1,"ProcedureTypeId":1,"CaseId":1,"Sequence":1.5000,"Notes":"some test procedure","LastModified":"2014-04-15T23:36:28.083","LastModifiedBy":"david","HotSpot":"left anterior descending - mid","ParentProcedureId":null,"Group":null,"Case":{"$ref":"1"},"ProcedureAccessSite":{"$id":"4","ProcedureId":1,"AccessDeviceId":0,"AccessDeviceName":"test device 1","AccessTechnique":"PERCT","AccessUltrasoundGuidance":false,"AccessVesselPatency":true,"AccessRealTimeNeedle":true,"AccessPermanentlyRecordedImage":false,"IsClosed":false,"CloseDeviceId":0,"CloseDeviceName":"test device 1","CloseDirectPressure":false,"ClosePressureDevice":false,"CloseLeaveSheathInPlace":false,"CloseMultiLayeredSutured":false,"Procedure":{"$ref":"3"}},"ProcedureAngioplasty":null,"ProcedureImage":null,"ProcedureStent":null,"ProcedureThrombectomy":null,"ProcedureTypeName":"Access Point","FindingIdsBeingTreated":[]},{"$id":"5","ProcedureId":4,"ProcedureTypeId":4,"CaseId":1,"Sequence":1.5000,"Notes":"some test procedure","LastModified":"2014-04-15T23:37:04.133","LastModifiedBy":"david","HotSpot":"left anterior descending - mid","ParentProcedureId":1,"Group":null,"Case":{"$ref":"1"},"ProcedureAccessSite":null,"ProcedureAngioplasty":null,"ProcedureImage":null,"ProcedureStent":{"$id":"6","ProcedureId":4,"StentType":"DRGEL","StentId":null,"StentName":"stent 1","Diameter":2.0000,"Length":2.0000,"EPDId":null,"EPDName":null,"CTOId":null,"CTOName":null,"Procedure":{"$ref":"5"}},"ProcedureThrombectomy":null,"ProcedureTypeName":"Stent","FindingIdsBeingTreated":[]}],"StartDateFormatted":"4/15/2014","CaseStatusTypeName":null});
import 'zoompan-svg';


App = Ember.Application.create();

App.medicalCaseData = Ember.Object.extend({});
var link = App.medicalCaseData.create();
link.set('url', 'http://localhost:8000/data.json');

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

// SVG HANDLING

Snap.load('/BodyMapMain.svg', function(fragment) {
  
  var procedureEntrySVG = makeProcedureSVG(fragment);
  var findingsEntrySVG = makeFindingsSVG(fragment);

  $('#procedure-entry-svg').append(procedureEntrySVG.container);
  $('#findings-entry-svg').append(findingsEntrySVG.container);
});


function makeFindingsSVG(fragment) {
  var vp = new ZoomPanContainer();

  fragment = Snap.fragment(fragment.node.cloneNode(true));

  vp.bindZoomAction(document.getElementById('svg-image-placeholder'));
  vp.bindPanAction(document.getElementById('svg-image-placeholder'));


  var outlines = fragment.selectAll('[id^="Outlines"]');
  var coronaryHotspot = fragment.select('#Hotspots_-_Heart_Coronaries');

  coronaryHotspot.selectAll('path')
    .attr({
      'stroke': '#000',
      'stroke-width': 0.5,
      'fill': '#FFF',
      'opacity': 0,
      'data-bind': 'event: {mouseover: glowWithPower,' +
        'mouseleave: unglowWithPower,' +
        'click: addNewFinding}'
    });


  outlines.forEach(function (el) {
    if (/Aort/.test(el.node.id)) {
      vp.append(el, { maxZoomLevel: 4 });
    } else if (el.node.id === 'Outlines_-_Heart_Coronaries') {
      vp.append(el, { minZoomLevel: 4 });
    } else {
      vp.append(el);
    }
  });

  // vp.append(coronaryOutline, { minZoomLevel: 2 });
  vp.append(coronaryHotspot, { minZoomLevel: 4 });
  //vp.append(renalHotspot, {minZoomLevel: 4});
  // vp.append(thoracicAortaOutline, { maxZoomLevel: 2 });
  // vp.append(aorticArch, { maxZoomLevel: 2 });

  return vp;

}

function makeProcedureSVG(fragment) {
  var vp = new ZoomPanContainer();

  fragment = Snap.fragment(fragment.node.cloneNode(true));

  vp.bindZoomAction(document.getElementById('svg-image-placeholder'));
  vp.bindPanAction(document.getElementById('svg-image-placeholder'));

  var outlines = fragment.selectAll('[id^="Outline"]');
  var coronaryHotspot = fragment.select('#Hotspots_-_Heart_Coronaries');

  coronaryHotspot.selectAll('path')
    .attr({
      'stroke': '#000',
      'stroke-width': 0.5,
      'fill': '#FFF',
      'opacity': 0,
      'data-bind': 'event: {mouseover: glowWithPower,' +
        'mouseleave: unglowWithPower,' +
        'click: addNewProcedure}'
    });


  outlines.forEach(function (el) {
    if (/Aort/.test(el.node.id)) {
      vp.append(el, { maxZoomLevel: 4 });
    } else if (el.node.id === 'Outlines_-_Heart_Coronaries') {
      vp.append(el, { minZoomLevel: 4 });
    } else {
      vp.append(el);
    }
  });

  // vp.append(coronaryOutline, { minZoomLevel: 2 });
  vp.append(coronaryHotspot, { minZoomLevel: 4 });
  //vp.append(renalHotspot, {minZoomLevel: 4});
  // vp.append(thoracicAortaOutline, { maxZoomLevel: 2 });
  // vp.append(aorticArch, { maxZoomLevel: 2 });

  return vp;
}
