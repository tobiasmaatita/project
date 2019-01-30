/** Name: Tobias Maätita
    Student No.: 10730109

    Module containing the scripts for building a multiple linechart.
    Contains several functions:

    multipleLine: make a multiple linechart.
    getDatasetLines: reformat the data to use for the multiple linechart.
    axesLines: make axes for the multiple linechart.
    linesLines: set the lines for the multiple linechart.
    linesText: provide text to the axes and a title.
    noLines: if there is no data, do not show any lines.
    updateLines: update the indicator line when scrolling the slider.
    resetButton: set a reset button when selecting lines to show all lines again.
    removeReset: remove the reset button after clicking.
*/


function multipleLine(multLines, data, country, year, margin, height, width,
                      transDuration) {
/** Make a multiple line chart.

    Arguments:
    multlines -- a selection object holding the svg where the chart be drawn.
    data -- a JSON object holding the data on educational attainment.
    year -- integer representing the current year.
    margin -- an object holding the margins.
    height -- self-explanatory.
    width -- self-explanatory.
    transDuration -- integer representing the duration of a transition (optional).

    Outputs the scales of the linechart's axes.
*/
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

             /** hovering the line shows the corresponding percentage of the
                 population in the bar chart. */
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
/** Reformat the data to make a multiple linechart. Each datapoint should be an
    object holding the year and the percentage of each type, i.e. for each line.

    Arguments:
    dataNeeded -- an object holding the data for all years.
    years -- an array holding the years on which there is data.

    Outputs the new dataset.
*/
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
/** Make the axes for the multiple linechart.

    Arguments:
    scales -- an object holding the scales functions for the multiple linechart.

    Outputs an object holding the scales functions for the multiple linecharts.
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


function linesLines(multLines, scales, years) {
/** Set the lines for the multiple linechart.

    Arguments:
    multLines -- a selection object holding the svg where the multiple linechart
                 be drawn.
    scales -- an object holding the scales functions for the multiple linechart.
    years -- an array holding the years of which there is data.

    Outputs an object holding the line functions of the multiple linecharts.
*/
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
/** Provide text to the axes.

    Arguments:
    multLines -- a selection object holding the svg where the multiple linechart
                 be drawn.
    margin -- an object holding the margins.
    scales -- an object holding the scales.
    height -- self-explanatory.
*/
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
    that there is no data.

    Arguments:
    country -- the selected country.
    multLines -- a selection object holding the svg where the multiple line chart
                 be drawn.
    height -- self-explanatory.
    width -- self-explanatory.
*/
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
  multLines.selectAll('#resetButton')
           .transition()
             .duration(transDuration)
             .style('opacity', 0);
  SELECTED = [];
  CLICKED = false;

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
/** Update the multiple line chart: the indicator line aligns itself with the
    year that is being shown in the bar chart.

    Arguments:
    sliderTime -- an object holding the slider's information, to be used to get
                  the current year.
    lineInfo -- an object holding all information to draw the multiple linechart.
    scales -- an object holding the scales functions for the multiple linechart.
*/

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
/** Clicking on the reset button brings back all the lines.

    Arguments:
    width -- self-explanatory.
*/
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
  linegraph.select('#resetButton')
           .transition()
             .style('opacity', 1);

  // no reset needed when all lines are shown
  if (SELECTED.length === 4) {
    removeReset();
  };

  return;
};


function removeReset() {
/** Remove the reset button.

    Takes no input arguments and outputs nothing.
*/
  d5.selectAll('#resetButton').remove();
  SELECTED = [];
  CLICKED = false;

  return;
};
