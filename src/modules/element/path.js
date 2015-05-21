define(function (require) {
  var d3 = require("d3");

  return function path() {
    var pathGenerator = null;
    var color = d3.scale.category10();
    var accessor = function (d) { return d; };

    // Options
    var pathClass = "path";
    var transform = "translate(0,0)";
    var fill = "none";
    var stroke = function (d, i) { return color(i); };
    var strokeWidth = 1;

    function element(selection) {
      selection.each(function (data, i) {
        d3.select(this).selectAll("path")
          .data(accessor)
          .enter().append("path")
          .attr("transform", transform)
          .attr("class", pathClass)
          .attr("fill", fill)
          .attr("stroke", stroke)
          .attr("stroke-width", strokeWidth)
          .attr("d", pathGenerator);
      });
    }

    element.pathGenerator = function (_) {
      if (!arguments.length) { return pathGenerator; }
      pathGenerator = _;
      return element;
    };

    element.accessor = function (_) {
      if (!arguments.length) { return accessor; }
      accessor = _;
      return element;
    };

    element.color = function (_) {
      if (!arguments.length) { return color; }
      color = _;
      return element;
    };

    element.pathClass = function (_) {
      if (!arguments.length) { return pathClass; }
      pathClass = _;
      return element;
    };

    element.transform = function (_) {
      if (!arguments.length) { return transform; }
      transform = _;
      return element;
    };

    element.fill = function (_) {
      if (!arguments.length) { return fill; }
      fill = _;
      return element;
    };

    element.stroke = function (_) {
      if (!arguments.length) { return stroke; }
      stroke = _;
      return element;
    };

    element.strokeWidth = function (_) {
      if (!arguments.length) { return strokeWidth; }
      strokeWidth = _;
      return element;
    };

    return element;
  };
});
