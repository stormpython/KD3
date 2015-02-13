define(function (require) {
  var d3 = require("d3");
  var circles = require("circles");

  return function areaChart () {
    var margin = {top: 20, right: 20, bottom: 20, left: 50};
    var width = 760;
    var height = 120;
    var color = d3.scale.category20c();
    var interpolate = "linear";
    var offset = "zero";
    var xValue = function (d) { return d[0]; };
    var yValue = function (d) { return d[1]; };
    var dLabel = function (d) { return d[2]; };
    var xAxis = d3.svg.axis().orient("bottom").ticks(5);
    var yAxis = d3.svg.axis().orient("left");
    var areaX = function (d) { return xScale(d[0]); };
    var areaY0 = function (d) {
      if (offset === 'overlap') { return yScale(0); }
      return yScale(d.y0);
    };
    var areaY = function (d) {
      if (offset === 'overlap') { return yScale(d.y); }
      return yScale(d.y0 + d.y);
    };
    var xScale;
    var yScale;
    var xAxisTitle;
    var yAxisTitle;

    // Options
    var showXAxis = true;
    var showYAxis = true;
    var addLines = true;
    var addCircles = true;
    var areaClass = function (d, i) { return "area index " + i; };
    var areaStroke = function (d) { return color(d[2]); };
    var areaFill = function (d) { return color(d[2]); };
    var lineClass = function (d, i) { return "line index " + i; };
    var lineStroke = function (d) { return color(d[2]); };
    var circleClass = function (d, i) { return "circle index " + i; };
    var circleRadius = 5;
    var circleFill = function (d) { return color(d[2]); };
    var circleStroke = function (d) { return color(d[2]); };
    var circleStrokeWidth = 3;

    function chart(selection) {
      selection.each(function (data) {
        var area = d3.svg.area().x(areaX).y0(areaY0).y1(areaY);
        var line = d3.svg.line().x(areaX).y(areaY);
        var stack = d3.layout.stack().offset(offset).x(stackX).y(stackY);
        var layers;
        var domain;
        var svg;
        var g;

        data = data.map(function (d) {
          return d.map(function (e, i) {
            return [xValue.call(d, e, i), yValue.call(d, e, i), dLabel.call(d, e, i)];
          });
        });

        layers = stack(data);
        domain = mapDomain(data);

        if (!xScale) {
          xScale = d3.time.scale.utc()
            .domain(d3.extent(domain, function (d) { return d[0]; }))
            .range([0, width - margin.left - margin.right]);
        }

        if (!yScale) {
          yScale = d3.scale.linear()
            .domain([
              Math.min(0, getYStackExtent(layers, 'min')),
              Math.max(0, getYStackExtent(layers, 'max'))
            ])
            .range([height - margin.top - margin.bottom, 0]);
        }

        area.interpolate(interpolate);
        line.interpolate(interpolate);

        svg = d3.select(this).selectAll("svg")
          .data([layers])
          .enter().append("svg")
          .attr("width", width)
          .attr("height", height);

        g = svg.append("g")
          .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        g.selectAll("g")
          .data(data, function (d) { return d; })
          .enter().append("g")
          .append("path")
          .attr("class", areaClass)
          .attr("stroke", areaStroke)
          .attr("fill", areaFill)
          .attr("d", area);

        if (addLines) {
          g.selectAll("g")
            .data(data, function (d) { return d; })
            .enter().append("g")
            .append("path")
            .attr("class", lineClass)
            .attr("stroke", lineStroke)
            .attr("d", line);
        }

        g.append("g").attr("class", "x axis");
        g.append("g").attr("class", "y axis");

        if (showXAxis) {
          g.select(".x.axis")
            .attr("transform", "translate(0," + yScale.range()[0] + ")")
            .call(xAxis.scale(xScale));
        }

        if (xAxisTitle) {
          g.select(".x.axis")
            .append("text")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(xAxisTitle);
        }

        if (showYAxis) {
          g.select(".y.axis")
            .call(yAxis.scale(yScale));
        }

        if (yAxisTitle) {
          g.select(".y.axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(yAxisTitle);
        }

//                if (addCircles) {
//                    var points = circles()
//                        .xScale(xScale)
//                        .yScale(yScale)
//                        .cx(xValue)
//                        .cy(yValue)
//                        .color(color)
//                        .radius(circleRadius)
//                        .circleClass(circleClass)
//                        .fill(circleFill)
//                        .stroke(circleStroke)
//                        .strokeWidth(circleStrokeWidth);
//
//                    svg.call(points);
//                }
      });
    }

    function stackX(d) {
      return d[0];
    }

    function stackY(d) {
      return d[1];
    }

    function mapDomain (data) {
      return data.reduce(function (a, b) {
        return a.concat(b);
      });
    }

    function getYStackExtent(data, extent) {
      return d3[extent](data, function (d) {
        return d3[extent](d, function (e) {
          if (offset === 'overlap') { return e.y; }
          return e.y0 + e.y;
        });
      });
    }

    chart.margin = function (_) {
      if (!arguments.length) { return margin; }
      margin.top = typeof _.top !== "undefined" ? _.top : margin.top;
      margin.right = typeof _.right !== "undefined" ? _.right : margin.right;
      margin.bottom = typeof _.bottom !== "undefined" ? _.bottom : margin.bottom;
      margin.left = typeof _.left !== "undefined" ? _.left : margin.left;
      return chart;
    };

    chart.width = function (_) {
      if (!arguments.length) { return width; }
      width = _;
      return chart;
    };

    chart.height = function (_) {
      if (!arguments.length) { return height; }
      height = _;
      return chart;
    };

    chart.color = function (_) {
      if (!arguments.length) { return color; }
      color = _;
      return chart;
    };

    chart.x = function (_) {
      if (!arguments.length) { return xValue; }
      xValue = _;
      return chart;
    };

    chart.y = function (_) {
      if (!arguments.length) { return yValue; }
      yValue = _;
      return chart;
    };

    chart.dataLabel = function (_) {
      if (!arguments.length) { return dLabel; }
      dLabel = _;
      return chart;
    };

    chart.xScale = function (_) {
      if (!arguments.length) { return xScale; }
      xScale = _;
      return chart;
    };

    chart.yScale = function (_) {
      if (!arguments.length) { return yScale; }
      yScale = _;
      return chart;
    };

    chart.xAxis = function (_) {
      if (!arguments.length) { return xAxis; }
      xAxis = _;
      return chart;
    };

    chart.yAxis = function (_) {
      if (!arguments.length) { return yAxis; }
      yAxis = _;
      return chart;
    };

    chart.xAxisTitle = function (_) {
      if (!arguments.length) { return xAxisTitle; }
      xAxisTitle = _;
      return chart;
    };

    chart.yAxisTitle = function (_) {
      if (!arguments.length) { return yAxisTitle; }
      yAxisTitle = _;
      return chart;
    };

    chart.showXAxis = function (_) {
      if (!arguments.length) { return showXAxis; }
      showXAxis = _;
      return chart;
    };

    chart.showYAxis = function (_) {
      if (!arguments.length) { return showYAxis; }
      showYAxis = _;
      return chart;
    };

    chart.areaX = function (_) {
      if (!arguments.length) { return areaX; }
      areaX = _;
      return chart;
    };

    chart.areaY0 = function (_) {
      if (!arguments.length) { return areaY0; }
      areaY0 = _;
      return chart;
    };

    chart.areaY = function (_) {
      if (!arguments.length) { return areaY; }
      areaY = _;
      return chart;
    };

    chart.interpolate = function (_) {
      if (!arguments.length) { return interpolate; }
      interpolate = _;
      return chart;
    };

    chart.stack = function (_) {
      if (!arguments.length) { return stack; }
      stack = _;
      return chart;
    };

    chart.offset = function (_) {
      if (!arguments.length) { return offset; }
      offset = _;
      return chart;
    };

    chart.addLines = function (_) {
      if (!arguments.length) { return addLines; }
      addLines = _;
      return chart;
    };

    chart.lineStroke = function (_) {
      if (!arguments.length) { return lineStroke; }
      lineStroke = _;
      return chart;
    };

    chart.lineClass = function (_) {
      if (!arguments.length) { return lineClass; }
      lineClass = _;
      return chart;
    };

    chart.addCircles = function (_) {
      if (!arguments.length) { return addCircles; }
      addCircles = _;
      return chart;
    };

    chart.circleClass = function (_) {
      if (!arguments.length) { return circleClass; }
      circleClass = _;
      return chart;
    };

    chart.circleRadius = function (_) {
      if (!arguments.length) { return circleRadius; }
      circleRadius = _;
      return chart;
    };

    chart.circleFill = function (_) {
      if (!arguments.length) { return circleFill; }
      circleFill = _;
      return chart;
    };

    chart.circleStroke = function (_) {
      if (!arguments.length) { return circleStroke; }
      circleStroke = _;
      return chart;
    };

    chart.circleStrokeWidth = function (_) {
      if (!arguments.length) { return circleStrokeWidth; }
      circleStrokeWidth = _;
      return chart;
    };

    return chart;
  };
});
