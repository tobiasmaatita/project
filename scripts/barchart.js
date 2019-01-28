function barchart(barChart, data, country, year, margin, height, width, transDuration) {
/** Make a barchart. When called from the updateBar function, this will have a
      shorter transition duration (transDuration) than when called from the datamap
      to enable a smooth transition. */

  transDuration = transDuration || 750;
  d5.select('#noData')
    .remove();
  d5.selectAll('.grid')
    .transition()
      .duration(transDuration)
      .style('opacity', 0.5);

  /** preprocess the data by selecting the right year, country, and educational
        level */
  var info = data[country.id][year],
      eduKeys = ['uneducated', 'primary', 'secondary', 'tertiary'],
      barWidth = 40,
      dict = new Object,
      values = new Array;
  for (var i = 0; i < eduKeys.length; i++) {
    dict[eduKeys[i]] = info[eduKeys[i]];
    values[i] = info[eduKeys[i]];
  };

  // make scales and axes
  var scales = barScales(values, margin, height, width);
  var axes = barAxes(eduKeys, scales);
  axesText(barChart, scales, margin, height, width, country, year);

  // draw bar chart
  barChart.append('g')
          .attr('class', 'xAxis')
          .attr('id', 'xBar')
          .attr('transform', 'translate(0, ' + (height - margin.bottom) + ')');
  barChart.append('g')
          .attr('class', 'yAxis')
          .attr('id', 'yBar')
          .attr('transform', 'translate(' + margin.left + ', 0)');

  barChart.select('#xBar')
          .transition()
            .style('opacity', 1)
            .call(axes.x);
  barChart.select('#yBar')
          .transition()
            .style('opacity', 1)
            .call(axes.y);

  gridLine(barChart, scales, margin, width, transDuration, barWidth);

  barChart.append("g")
          .attr("class", "grid")
          .attr('transform', 'translate(' + margin.left + ',0)')
          .style('z-index', 1)
          .style('opacity', 0.5);
  barChart.append('text')
          .attr('class', 'infoLevel')
          .attr('id', 'level')
          .attr('text-anchor', 'end')
          .attr('x', width - barWidth)
          .attr('y', 99)
          .attr('font-size', '40px');
  barChart.append('text')
          .attr('class', 'infoLevel')
          .attr('id', 'percentage')
          .attr('text-anchor', 'end')
          .attr('x', width - barWidth)
          .attr('y', 120)
          .attr('font-size', '15px');

  var bar = barChart.selectAll('rect')
                    .data(values);

  bar.enter()
     .append('rect')
     .attr('class', 'bar')
     .attr('id', function(d, i) {
       return eduKeys[i];
     })
     .attr('x', function(d, i) {
       return scales.x(i);
     })
     .attr('y', height - margin.bottom)
     .on('mouseover', function(d, i) {
       var num = i;
       var linegraph = d5.select('#figureFive');

       /** the mouseover behaves differently when a bar has been clicked. If the
           linegraph shows only a few lines, a mouseover will show the line
           corresponding to the bar. If not, the mouseover will highlight the
           line corresponding to the bar. */
       if (CLICKED === false) {
         linegraph.selectAll('.line')
                  .filter(function(d, i) { return num != i; })
                  .transition()
                    .duration(300)
                    .style('opacity', 0.3);
       } else if (SELECTED.indexOf(i) < 0) {
         linegraph.selectAll('.line')
                  .filter(function(d, i) { return num === i; })
                  .transition()
                    .style('opacity', 0.3);
       };
     })
     .on('mouseout', function(d, i) {
       var num = i;

       /** the mouseout, like the mouseover, behaves differently when a bar has
           been clicked. When clicked === true, hovering the bar will show its
           corresponding line. The line will disappear thereafter. However, when
           clicked === false, hovering the bar will highlight the corresponding
           line. Upon mouseout, the other lines will have to become visible again. */
       if (CLICKED === false) {
         d5.selectAll('#figureFive .line')
           .transition()
             .duration(300)
             .style('opacity', 1);
       } else if (SELECTED.indexOf(i) < 0){
         d5.selectAll('#figureFive .line')
           .filter(function(d, i) { return num === i })
           .transition()
             .style('opacity', 0);
       }
     })
     .on('click', function(d, i) {
       /** show the line corresponding to the clicked bar. If a line is already
           visible, also show this line */
       var num = i,
           linegraph = d5.select('#figureFive');
       if (CLICKED === false) {
         linegraph.selectAll('.line')
                  .filter(function(d, i) { return num != i; })
                  .transition()
                    .style('opacity', 0);
       } else {
         linegraph.selectAll('.line')
                  .filter(function(d, i) { return num === i; })
                  .transition()
                    .style('opacity', 1);
       };
       /** keep track of which lines are being shown and make sure there is a
           possibility to reset */
       if (SELECTED.indexOf(num) < 0) {
         SELECTED.push(num);
       };
       CLICKED = true;

       resetButton(width);
     })
     .merge(bar)
     .transition(d5.easeQuad)
     .duration(transDuration)
     .attr('width', barWidth)
     .attr('y', function(d) {
       return scales.y(d);
     })
     .attr('height', function(d) {
       return height - scales.y(d) - margin.bottom;
     })
     .style('z-index', 1000);

  return;
};


function updateBar(sliderTime, barInfo) {
// Update the barchart to the selected year.

  var year = CURRENT_YEAR,
      transDuration = 10;
  barchart(barInfo.chart, barInfo.data, barInfo.country, year, barInfo.margin,
           barInfo.height, barInfo.width, transDuration);

  return;
};


function barScales(values, margin, height, width) {
/** Make scales. The xTickScale serves to align the bars and
      their ticks. */

  var xScaleBar = d5.scaleLinear()
                    .domain([0, values.length - 1])
                    .range([margin.left + margin.bar, width - margin.right]);
  var yScaleBar = d5.scaleLinear()
                    .domain([0, 100])
                    .range([height - margin.bottom, margin.top]);
  var barWidth = 40;
  var xTickScaleBar = d5.scaleLinear()
                        .domain([0, values.length - 1])
                        .range([margin.left + margin.bar + barWidth/2, width - margin.right + barWidth/2]);

  return {x: xScaleBar, y: yScaleBar, ticks: xTickScaleBar};
};


function barAxes(keys, scales) {
// Make axes.

  var xAxisBar = d5.axisBottom()
                   .ticks(keys.length)
                   .tickFormat(function(d) {
                     return keys[d];
                   })
                   .scale(scales.ticks);
  var yAxisBar = d5.axisLeft()
                   .scale(scales.y);

  return {x: xAxisBar, y: yAxisBar};
};


function axesText(barChart, scales, margin, height, width, country, year) {
// provide text to the axes

  barChart.append('text')
          .attr('class', 'figTitle')
          .attr('id', 'barTitle')
          .attr('text-anchor', 'middle')
          .attr('x', scales.x(scales.x.domain()[1]/2) + margin.left / 2)
          .attr('y', margin.axisText);
  barChart.append('text')
          .attr('class', 'axeTitle')
          .attr('id', 'xTitle')
          .attr('text-anchor', 'middle')
          .attr('x', scales.x(scales.x.domain()[1]/2) + margin.left / 2)
          .attr('y', height - margin.axisText);
  barChart.append('text')
          .attr('class', 'axeTitle')
          .attr('id', 'yTitle')
          .attr('text-anchor', 'middle')
          .attr('x', -scales.y(scales.y.domain()[1]/2))
          .attr('y', margin.axisText)
          .attr('transform', 'rotate(-90)');
  barChart.append('text')
          .attr('class', 'figureName')
          .attr('id', 'figureFourName')
          .attr('x', 0)
          .attr('y', height - margin.subscript);

  barChart.select('#barTitle')
          .transition()
            .text(country.properties.name + ', ' + year);
  barChart.select('#xTitle')
          .transition()
            .text('Educational level');
  barChart.select('#yTitle')
          .transition()
            .text('Percentage');
  barChart.select('#figureFourName')
          .transition()
            .text('Figure 4: Maximum level of education in a country in any given year');

  return;
};


function noBars(country, barChart, margin, height, width) {
/** If there is no data, don't make a chart. Rather, let the user know
      that there is no data. */

  var transDuration = 300;

  // no graph
  barChart.selectAll('rect')
          .transition()
            .duration(transDuration)
            .attr('height', 0)
            .attr('y', height - margin.bottom);
  barChart.selectAll('.yAxis')
          .transition()
            .duration(transDuration)
            .style('opacity', 0);
  barChart.selectAll('.xAxis')
          .transition()
            .duration(transDuration)
            .style('opacity', 0);
  barChart.selectAll('.axeTitle')
          .transition()
            .duration(transDuration)
            .style('opacity', 0);
  barChart.selectAll('.grid')
          .transition()
            .duration(transDuration)
            .style('opacity', 0);

  if (barChart.select('.figTitle').empty()) {
    barChart.append('text')
            .attr('class', 'figTitle')
            .attr('id', 'barTitle')
            .attr('text-anchor', 'middle')
            .attr('x', width/2 + margin.left/2)
            .attr('y', margin.axisText);
  };
  barChart.select('.figTitle')
          .transition()
            .text(country.properties.name);

  // no data
  barChart.append('text')
          .attr('id', 'noData')
          .attr('text-anchor', 'middle')
          .attr('x', width/2 + margin.left/2)
          .attr('y', height/2);
  barChart.select('#noData')
          .transition()
            .delay(transDuration + 50)
            .text('No data available');

  return;
};
