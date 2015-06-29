define(function (require) {
  var eventAPI = require("src/modules/helpers/api/events");

  return function (_, lines) {
    lines.show = typeof _.show !== "undefined" ? _.show : lines.show;
    lines.lineClass = typeof _.lineClass !== "undefined" ? _.lineClass : lines.lineClass;
    lines.interpolate = typeof _.interpolate !== "undefined" ? _.interpolate : lines.interpolate;
    lines.tension = typeof _.tension !== "undefined" ? _.tension : lines.tension;
    lines.stroke = typeof _.stroke !== "undefined" ? _.stroke : lines.stroke;
    lines.strokeWidth = typeof _.stroke !== "undefined" ? _.strokeWidth : lines.strokeWidth;
    lines.opacity = typeof _.opacity !== "undefined" ? _.opacity : lines.opacity;

    lines.events = typeof _.events !== "undefined" ? _.events : {};
    lines.events = eventAPI(_, lines.events);

    return lines;
  };
});