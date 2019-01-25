function multipleLine(multLines, data, country, year, margin, height, width, transDuration) {
// Make a multiple line chart

  d5.selectAll('#noData')
    .remove();
  d5.selectAll('.indicator')
    .transition()
      .style('opacity', 0.5);
  transDuration = transDuration || 750;

  var eduKeys = ['uneducated', 'primary', 'secondary', 'tertiary'],
      dataNeeded = data[country.id];
  delete dataNeeded.fillKey;
  var yearsData = Object.keys(dataNeeded),
      years = new Array;

  // we need integers
  for (var i = 0; i < yearsData.length; i++) {
    years[i] = Number(yearsData[i]);
  };

  var dataset = getDatasetLines(dataNeeded, years),
      scales = lineScales(years, margin, width, height);
  var axes = axesLines(scales),
      lines = linesLines(multLines, scales, years);

  // draw the linegraph
  multLines.append('g')
           .attr('class', 'xAxis')
           .attr('id', 'xMult')
           .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
  multLines.append('g')
           .attr('class', 'yAxis')
           .attr('id', 'yMult')
           .attr('transform', 'translate(' + margin.left + ', 0)')

  multLines.select('#xMult')
           .transition()
             .duration(transDuration)
             .style('opacity', 1)
             .call(axes.x);
  multLines.select('#yMult')
           .transition()
             .duration(transDuration)
             .style('opacity', 1)
             .call(axes.y);

  multLines.append('line')
           .attr('class', 'indicator')
           .style('stroke', 'black')
           .style('stroke-width', '1.5px')
           .style('opacity', 0.5)
           .style('z-index', 1);

  // a line indicating which year is being shown in the bar chart. Updated in
  //  the updateLines() function
  if (CURRENT_YEAR != 0) {
    multLines.select('.indicator')
             .attr('x1', scales.x(CURRENT_YEAR))
             .attr('x2', scales.x(CURRENT_YEAR))
             .attr('y1', margin.top)
             .attr('y2', height - margin.bottom)
  };

  gridLine(multLines, scales, margin, width, transDuration);
  linesText(multLines, margin, scales, height);

  multLines.select('#lineUned')
           .datum(dataset)
           .transition()
             .duration(transDuration)
             .attr('d', lines.uned);
  multLines.select('#linePrim')
           .datum(dataset)
           .transition()
             .duration(transDuration)
             .style('stroke', 'red')
             .attr('d', lines.prim);
  multLines.select('#lineSec')
           .datum(dataset)
           .transition()
             .duration(transDuration)
             .style('stroke', 'blue')
             .attr('d', lines.sec);
  multLines.select('#lineTert')
           .datum(dataset)
           .transition()
             .duration(transDuration)
             .style('stroke', 'green')
             .attr('d', lines.tert);
  multLines.selectAll('.line')
           .on('mouseover', function(d, i) {

             // hovering the line shows the corresponding percentage of the
             //  population in the bar chart.
             var currYear = 0,
                 num = i,
                 bars = d5.select('#figureFour');

             bars.selectAll('.bar')
                 .filter(function(d, i) { return num != i; })
                 .transition()
                   .style('opacity', 0.3);

             if (CURRENT_YEAR === 0) { currYear = 1870; }
             else { currYear = CURRENT_YEAR; };
             d5.select('#level')
               .text(eduKeys[i])
               .transition()
                 .style('opacity', 1);
             d5.select('#percentage')
               .text(dataNeeded[currYear][eduKeys[i]] + '% in ' + currYear)
               .transition()
                 .style('opacity', 1);
           })
           .on('mouseout', function(d) {

             // get rid of the percentage
             var bars = d5.select('#figureFour');
             bars.selectAll('.bar')
                 .transition()
                   .style('opacity', 1);

             d5.select('#percentage')
               .transition()
                 .style('opacity', 0);
             d5.select('#level')
               .transition()
                 .style('opacity', 0);
           })

  return {x: scales.x, y: scales.y};
};


function getDatasetLines(dataNeeded, years) {
// Reformat the data to make a multiple line chart

  var dataset = new Array;

  // each datapoint contains the year and its percentages
  for (var i = 0; i < years.length; i++) {
    var info = dataNeeded[years[i]],
        datapoint = {};
    datapoint.year = years[i];
    datapoint.uneducated = info.uneducated;
    datapoint.primary = info.primary;
    datapoint.secondary = info.secondary;
    datapoint.tertiary = info.tertiary;
    dataset.push(datapoint);
  };

  return dataset;
};


function axesLines(scales) {

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


function linesLines(multLines, scales, years) {
  // Ready the lines

  var lineUned = d5.line()
                   .x(function(d, i) {
                     return scales.x(years[i]);
                   })
                   .y(function(d){
                     return scales.y(d.uneducated);
                   })
                   .curve(d5.curveMonotoneX),
      linePrim = d5.line()
                   .x(function(d, i) {
                     return scales.x(years[i]);
                   })
                   .y(function(d) {
                     return scales.y(d.primary);
                   })
                   .curve(d5.curveMonotoneX),
      lineSec = d5.line()
                  .x(function(d, i) {
                    return scales.x(years[i]);
                  })
                  .y(function(d) {
                    return scales.y(d.secondary);
                  })
                  .curve(d5.curveMonotoneX),
      lineTert = d5.line()
                   .x(function(d, i) {
                     return scales.x(years[i]);
                   })
                   .y(function(d) {
                     return scales.y(d.tertiary);
                   })
                   .curve(d5.curveMonotoneX);
  multLines.append('path')
           .attr('class', 'line')
           .attr('id', 'lineUned');
  multLines.append('path')
           .attr('class', 'line')
           .attr('id', 'linePrim');
  multLines.append('path')
           .attr('class', 'line')
           .attr('id', 'lineSec');
  multLines.append('path')
           .attr('class', 'line')
           .attr('id', 'lineTert');

  return {uned: lineUned, prim: linePrim, sec: lineSec, tert: lineTert};
};


function linesText(multLines, margin, scales, height) {
  // Provide text to the axes.

  multLines.append('text')
           .attr('class', 'figTitle')
           .attr('id', 'multTitle')
           .attr('text-anchor', 'middle')
           .attr('y', margin.axisText)
           .attr('x', scales.x((scales.x.domain()[1] - scales.x.domain()[0])/2
                                 + scales.x.domain()[0]));

  multLines.select('.figTitle')
           .transition()
             .text('Highest educational level, 1870-2010');

  multLines.append('text')
           .attr('class', 'axeTitle')
           .attr('id', 'xMult')
           .attr('text-anchor', 'middle')
           .attr('x', scales.x((scales.x.domain()[1] - scales.x.domain()[0])/2
                                  + scales.x.domain()[0]))
           .attr('y', height - margin.axisText)
           .text('Year');
  multLines.append('text')
           .attr('class', 'axeTitle')
           .attr('id', 'yMult')
           .attr('text-anchor', 'middle')
           .attr('x', -scales.y((scales.y.domain()[1])/2))
           .attr('y', margin.axisText + 5)
           .attr('transform', 'rotate(-90)')
           .text('Rate (%)');

  return;
};


function noLines(country, multLines, margin, height, width) {
/** If there is no data, don't make a chart. Rather, let the user know
    that there is no data. */

  var transDuration = 300;

  // no graph
  multLines.selectAll('path')
           .transition()
             .duration(transDuration)
             .remove()
  multLines.selectAll('.yAxis')
           .transition()
             .duration(transDuration)
             .style('opacity', 0);
  multLines.selectAll('.xAxis')
           .transition()
             .duration(transDuration)
             .style('opacity', 0);
  multLines.selectAll('.axeTitle')
           .transition()
             .duration(transDuration)
             .style('opacity', 0);
  multLines.selectAll('.grid')
           .transition()
             .duration(transDuration)
             .style('opacity', 0);
  multLines.selectAll('.indicator')
           .transition()
             .duration(transDuration)
             .style('opacity', 0);

  if (multLines.select('.figTitle').empty()) {
    multLines.append('text')
             .attr('class', 'figTitle')
             .attr('id', 'barTitle')
             .attr('text-anchor', 'middle')
             .attr('x', width/2 + margin.left/2 - margin.right/2)
             .attr('y', margin.axisText);
  };
  multLines.select('.figTitle')
           .transition()
             .text('Highest educational level, 1870-2010');

  // no data
  multLines.append('text')
           .attr('id', 'noData')
           .attr('text-anchor', 'middle')
           .attr('x', width/2 + margin.left/2 - margin.right/2)
           .attr('y', height/2);
  multLines.select('#noData')
           .transition()
             .delay(transDuration + 50)
             .text('No data available');

  return;
};


function updateLines(sliderTime, lineInfo, scales) {
/** Update the multiple line chart: the indicator line
      aligns itself with the year that is being shown in
      the bar chart. */

  // year is either 1870 or the current year
  var year = sliderTime.value();
  if (CURRENT_YEAR != 0) {
    year = CURRENT_YEAR;
  };

  var transDuration = 10,
      multLines = lineInfo.chart;

  multLines.select('.indicator')
           .attr('x1', scales.x(year))
           .attr('x2', scales.x(year))
           .attr('y1', lineInfo.margin.top)
           .attr('y2', lineInfo.height - lineInfo.margin.bottom);

  return;
};


function resetButton(width) {
// clicking on the reset button brings back all the lines

  d5.select('#resetButton').remove();
  var linegraph = d5.select('#multipleLines');
  linegraph.append('g')
           .attr('id', 'resetButton')
           .append('text')
           .attr('x', width)
           .attr('y', 60)
           .text('Reset')
           .on('click', function(d) {
             linegraph.selectAll('.line')
                      .transition()
                        .style('opacity', 1);
             d5.select('#resetButton').remove();
             SELECTED = [];
             CLICKED = false;
           });
  if (SELECTED.length === 4) {
    removeReset();
  };
};


function removeReset() {

  d5.selectAll('#resetButton').remove();
  SELECTED = [];
  CLICKED = false;
};
