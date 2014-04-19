"use strict";
var Matrix = require('gl-matrix');
// var Snap = require('snap');

var mat2d = Matrix.mat2d;
var vec2  = Matrix.vec2;
var newMat2d = mat2d.create;

var minZoomLevel = 0.5;
var maxZoomLevel = 15;

function ZoomPanContainer () {
  if (!(this instanceof ZoomPanContainer))
    return new ZoomPanContainer(element);

  this.CTM = newMat2d();

  this.container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  this.el = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  this.container.appendChild(this.el);

  this.transformProp = getTransformProp();
  this.zoomLevel = 1;
  this.elementsMeta = [];

  this.render();
}

ZoomPanContainer.prototype.append = function (el, opts) {

  opts = opts || {};
  opts.minZoomLevel = opts.minZoomLevel || minZoomLevel;
  opts.maxZoomLevel = opts.maxZoomLevel || maxZoomLevel;
  opts.isVisible = opts.isVisible || true;

  opts.element = el;
  this.elementsMeta.push(opts);

  this.el.appendChild(el.node);
};

ZoomPanContainer.prototype.bindPanAction = function (target, events) {
  var self = this
  , state = ''
  , stateOrigin;

  events = events || {};
  events.unsetPanMode = events.unsetPanMode || 'mouseup';
  events.setPanMode   = events.setPanMode   || 'mousedown';
  events.doPan        = events.doPan        || 'mousemove';

  target.addEventListener(events.doPan, handlePan);
  target.addEventListener(events.setPanMode, handleSetPanMode);
  target.addEventListener(events.unsetPanMode, handleUnsetPanMode);

  function handlePan (e) {
    if (e.preventDefault) e.preventDefault();

    if (state === 'pan') {
      var p = newMat2d();
      p[0] = 0; p[3] = 0; p[4] = e.clientX; p[5] = e.clientY;
      // unapply current transform to get coordinates
      // relative to svg image's actual size
      mat2d.multiply(p, p, mat2d.invert(newMat2d(), self.CTM));

      // calculate new position relative to the point
      // at which we started panning
      p[0] = 1; p[3] = 1; p[4] -= stateOrigin[4]; p[5] -= stateOrigin[5];

      // reapply the current transform to the new coordinates
      mat2d.multiply(self.CTM, p, self.CTM);

      self.render();
    }
  }

  function handleSetPanMode (e) {
    //if (e.preventDefault) e.preventDefault();

    state = 'pan';

    var p = newMat2d();
    p[0] = 0; p[3] = 0; p[4] = e.clientX; p[5] = e.clientY;

    // set the pan origin relative to the untransformed image
    // coordinates by unapplying the current transform
    stateOrigin = mat2d.multiply(newMat2d(),
                                 p,
                                 mat2d.invert(newMat2d(), self.CTM));
  }

  function handleUnsetPanMode (e) {
    if (e.preventDefault) e.preventDefault();

    state = '';
  }

};

ZoomPanContainer.prototype.bindZoomAction = function (target, eventType) {
  var self = this;
  var zoomScale = 0.2;

  eventType = 'mousewheel';

  target.addEventListener(eventType, zoom);

  function zoom (e) {
    if (e.preventDefault)
      e.preventDefault();

    var delta = e.wheelDelta ? e.wheelDelta / 360 : e.detail / -9;
    var z = Math.pow(1 + zoomScale, delta);

    // do something in case maybe not a mouse event?
    // unscale and unshift mouse position vector from CTM

    var p = newMat2d();
    p[0] = 0; p[3] = 0; p[4] = e.offsetX; p[5] = e.offsetY;
    mat2d.multiply(p, mat2d.invert(newMat2d(), self.CTM), p);

    p[0] = 1; p[3] = 1;
    var k = mat2d.clone(p);

    if (z * self.zoomLevel < maxZoomLevel && z * self.zoomLevel > minZoomLevel) {
      k[0] *= z; k[3] *= z;
      self.zoomLevel *= z;
    }

    p[4] *= -1; p[5] *= -1;
    mat2d.multiply(k, p, k);

    mat2d.multiply(self.CTM, self.CTM, k);

    self.render();
  }

  function getMouseWheelHandler () {
    if (navigator.userAgent.toLowerCase().indexOf('webkit') >= 0) {
      return 'mousewheel';
    } else {
      return 'DOMMouseScroll';
    }
  }

};

ZoomPanContainer.prototype.render = function() {

  clearTimeout(this.afterRenderTimeoutID);

  var self = this;

  var transformStr = 'matrix(' + this.CTM[0] + ',' + this.CTM[1] + ',' + this.CTM[2] + 
      ',' + this.CTM[3] + ',' + this.CTM[4] + ',' + this.CTM[5] + ')';

  this.el.setAttribute('transform', transformStr);

  this.afterRenderTimeoutID = setTimeout(function () {
    self.elementsMeta.forEach(function (item) {
      if (item.isVisible && self.zoomLevel < item.minZoomLevel) {
        item.element.animate({opacity: 0}, 200);
        item.isVisible = false;
      } else if (!item.isVisible && item.minZoomLevel < self.zoomLevel && self.zoomLevel < item.maxZoomLevel) {
        item.element.animate({opacity: 1}, 200);
        item.isVisible = true;
      } else if (item.isVisible && self.zoomLevel > item.maxZoomLevel) {
        item.element.animate({opacity: 0.1}, 200);
        item.isVisible = false;
      }
    });
  }, 50);

};

function getTransformProp () {
  var style = document.documentElement.style;
  var props = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];

  for (var i = 0; i < props.length; i++) {
    if (props[i] in style) return props[i];
  }

  return false;
}

module.exports = ZoomPanContainer;