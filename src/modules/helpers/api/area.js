define(function (require) {
  var eventAPI = require("src/modules/helpers/api/events");

  return function (_, area) {
    area.show = typeof _.show !== "undefined" ? _.show : area.show;
    area.areaClass = typeof _.areaClass !== "undefined" ? _.areaClass : area.areaClass;
    area.interpolate = typeof _.interpolate !== "undefined" ? _.interpolate : area.interpolate;
    area.tension = typeof _.tension !== "undefined" ? _.tension : area.tension;
    area.stroke = typeof _.stroke !== "undefined" ? _.stroke : area.stroke;
    area.strokeWidth = typeof _.stroke !== "undefined" ? _.strokeWidth : area.strokeWidth;
    area.fill = typeof _.fill !== "undefined" ? _.fill : area.fill;
    area.opacity = typeof _.opacity !== "undefined" ? _.opacity : area.opacity;

    area.events = typeof _.events !== "undefined" ? _.events : {};
    area.events = eventAPI(_, area.events);

    return area;
  };
});