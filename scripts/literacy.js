/** Name: Tobias Maätita
    Student No.: 10730109

    Module containing the scripts to make a linechart depicting the worldwide
    literacy rate throughout the past two centuries.
    Contains several functions:

    linechart: make the linechart. Calls all other functions in this module.
    lineScales: make the scales for the linechart.
    lineAxes: make the axes for the linechart.
    gridLine: provide the linechart with horizontal gridlines.
    lineText: provide the linechart with text at the axes and a title.
    dots: draw dots on the datapoints to be connected by the line.
*/


function linechart(dataDict, margin, width, height){
/** Make a line chart.

    Arguments:
    dataDict -- a JSON object holding the data on worldwide literacy.
    margin -- an object holding the margins.
    width -- self-explanatory.
    height -- self-explanatory.
*/
  var years = Object.keys(dataDict);
  for (var i = 0; i < years.length; i++) {
    years[i] = Number(years[i]);
  };

  var lineWorld = d5.select('#figureOne')
                    .append('svg')
                    .attr('class', 'linechart')
                    .attr('id', 'worldLiteracy')
                    .attr('height', height)
                    .attr('width', width)
                    .attr('stroke', 'black');

  var scales = lineScales(years, margin, width, height);
  var axes = lineAxes(scales);
  lineText(lineWorld, scales, margin, height);

  var line = d5.line()
               .x(function(d, i){
                 return scales.x(years[i]);
               })
               .y(function(d){
                 return scales.y(d.y);
               })
               .curve(d5.curveMonotoneX);

  var dataset = d5.range(years.length).map(function(d, i) {
    return {"y": dataDict[years[i]]};
  });

  var lineTip = d5.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d, i) {
      return "<strong>" + years[i] + "</strong> <br><span>" +
             dataDict[years[i]]+ " %" + "</span>";
    });
  lineWorld.call(lineTip);

  // draw graph
  lineWorld.append('g')
           .attr('class', 'xAxis')
           .attr('id', 'xLine')
           .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
           .call(axes.x);
  lineWorld.append('g')
           .attr('class', 'yAxis')
           .attr('id', 'yLine')
           .attr('transform', 'translate(' + margin.left + ', 0)')
           .call(axes.y);
  gridLine(lineWorld, scales, margin, width);
  dots(lineWorld, years, dataDict, lineTip, scales);

  var path = lineWorld.append('path')
                      .datum(dataset)
                      .attr('class', 'line')
                      .attr('id', 'lineWorld')
                      .attr('d', line);

  // animated drawing
  var totalLength = path.node().getTotalLength();
  path.attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .ease(d5.easeLinear)
        .duration(2000)
        .attr("stroke-dashoffset", 0);

  return;
};


function lineScales(years, margin, width, height) {
/** Make the scales for the line chart.

    Arguments:
    years -- an array containing all years of which there is data.
    margin -- an object holding the margins.
    width -- self-explanatory.
    height -- self-explanatory.

    Outputs an object holding the scales.
*/
  var xScaleLine = d5.scaleLinear()
                     .domain([d5.min(years), d5.max(years)])
                     .range([margin.left, width - margin.right]),
      yScaleLine = d5.scaleLinear()
                     .domain([0, 100])
                     .range([height - margin.bottom, margin.top]);

  return {x: xScaleLine, y: yScaleLine};
};


function lineAxes(scales) {
/** Make the axes of the linechart.

    Arguments:
    scales -- an object containing the scales of the axes.

    Outputs an object holding the axes functions.
*/
  var xAxisLine = d5.axisBottom()
                    .scale(scales.x)
                    .ticks(12)
                    .tickFormat(function(d) {
                      return d;
                    }),
      yAxisLine = d5.axisLeft()
                    .scale(scales.y);

  return {x: xAxisLine, y: yAxisLine};
};


function gridLine(svg, scales, margin, width, transDuration, barWidth) {
/** Add a horizontal grid to the figure. Also used in the multipleLine and the
    barchart function.

    Arguments:
    svg -- a selection object holding the svg where the figure is to be drawn.
    scales -- an object holding the scales of the axes.
    margin -- an object holding the margins.
    transDuration -- integer representing the duration of the transition (optional).
    barWidth -- integer representing the width of the bar (optional).
*/
  transDuration = transDuration || 0;
  barWidth = barWidth || 0;

  function makeYGgridlines() {
      return d5.axisLeft(scales.y)
          .ticks(10);
  };

  svg.append("g")
     .attr("class", "grid")
     .attr('transform', 'translate(' + margin.left + ',0)')
     .style('z-index', 1)

  // linechart
  if (barWidth === 0) {
    svg.select('.grid')
       .transition()
         .duration(transDuration)
         .style('z-index', 1)
         .style('opacity', 0.5)
         .call(makeYGgridlines()
           .tickSize(-width + margin.left + margin.right)
           .tickFormat("")
         );
    return;
  };

  svg.select('.grid')
     .transition()
       .duration(transDuration)
       .style('z-index', 1)
       .style('opacity', 0.5)
       .call(makeYGgridlines()
         .tickSize(-width + margin.left + margin.right - barWidth)
         .tickFormat("")
       );

  return;
};


function lineText(lineWorld, scales, margin, height) {
/** Provide the axes with text.

    Arguments:
    lineWorld -- a selection object holding the svg on wich the linechart is to
                 be drawn.
    scales -- an object holding the scales of the chart.
    margin -- an object holding the margins.
    height -- self-explanatory.
*/
  lineWorld.append('text')
           .attr('class', 'figTitle')
           .attr('id', 'lineTitle')
           .attr('text-anchor', 'middle')
           .attr('y', margin.top - 10)
           .attr('x', scales.x((scales.x.domain()[1] - scales.x.domain()[0])/2
                                  + scales.x.domain()[0]))
           .text('Worldwide literacy rate, 1800-2014');
  lineWorld.append('text')
           .attr('class', 'axeTitle')
           .attr('id', 'xTitle')
           .attr('text-anchor', 'middle')
           .attr('x', scales.x((scales.x.domain()[1] - scales.x.domain()[0])/2
                                  + scales.x.domain()[0]))
           .attr('y', height - margin.axisText)
           .text('Year');
  lineWorld.append('text')
           .attr('class', 'axeTitle')
           .attr('id', 'yTitle')
           .attr('text-anchor', 'middle')
           .attr('x', -scales.y((scales.y.domain()[1])/2))
           .attr('y', margin.axisText)
           .attr('transform', 'rotate(-90)')
           .text('Literate population (%)');
  d5.select('#figureOne svg')
    .append('text')
    .attr('class', 'figureName')
    .attr('id', 'figureOneName')
    .attr('x', 0)
    .attr('y', height - margin.subscript)
    .text('Figure 1: worldwide literacy throughout the past two centuries');

  return;
};


function dots(lineWorld, years, dataDict, lineTip, scales) {
/** Draw dots on the line.

    Arguments:
    lineWorld -- a selection object holding the svg on which the linechart be
                 drawn.
    years -- an array holding the years of which there is data.
    dataDict -- a JSON object holding the data on literacy.
    lineTip -- a tooltip object.
    scales -- an object holding the scales of the linechart.
*/

  // preprocess data to use for dots
  var dotsData = new Array;
  for (var i = 0; i < years.length; i++) {
    var year = years[i];
    dotsData[i] = {year: year, rate: dataDict[years[i]]};
  };

  var dots = lineWorld.selectAll("dot")
                      .data(dotsData)
                      .enter()
                      .append("circle")
                      .attr('class', 'dot')
                      .attr("r", 5)
                      .style('opacity', 0)
                      .on('mouseover', lineTip.show)
                      .on('mouseout', lineTip.hide);

  dots.attr('cx', function(d, i) {
        return scales.x(d.year);
      })
      .attr('cy', function(d) {
        return scales.y(d.rate);
      })
      .transition()
        .ease(d5.easeLinear)
        .delay(2000)
        .style('opacity', 1);

  return;
};
