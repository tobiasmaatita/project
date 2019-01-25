function addCountryCodes(data, codes) {
// Add country codes to dictionary to use in datamap.

  var allCountries = Object.keys(codes),
      allDataKeys = Object.keys(data);
  var newDataset = new Object;

  for (var i = 0; i < allCountries.length; i++) {
    if (data[allCountries[i]]) {
      newDataset[codes[allCountries[i]]] = data[allCountries[i]]
    };
  };

  return newDataset;
};


function fillkeysAttainment(data) {
// Set the fillkeys for the initial attainment map.

  var countries = Object.keys(data),
      fillKeys = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR',
                  'FIVE', 'SIX'];

  for (var i = 0; i < countries.length; i++) {
    var attainment = data[countries[i]]['1870']['years of education total'];
    attainment = attainment / 2;
    attainment -= attainment % 1;
    if (attainment < 0) { attainment = 0; };
    data[countries[i]]['fillKey'] = fillKeys[attainment];
  };

  return data;
};


function fillkeysLiteracy(data) {
// Set the fillkeys for the literacy map.

  var countries = Object.keys(data),
      fillKeys = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR',
                  'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];

  for (var i = 0; i < countries.length; i++) {
    var literacy = data[countries[i]]['Literacy rate (%)'];
    literacy = (literacy - literacy % 10) / 10;
    if (literacy === 10) { literacy = 9; };
    data[countries[i]]['fillKey'] = fillKeys[literacy];
  };

  return data;
};


function colorFill(data, id, year) {
/** Helper function to the updateMap function. Sets the colors to fill the
    countries. */

  var info = data[id];
  var colors = d5.schemeRdYlGn[7];

  if (info) {
    var attainment = data[id][year]['years of education total'];
    attainment = attainment / 2;
    attainment -= attainment % 1;
    if (attainment < 0) { attainment = 0; };
    return colors[attainment];
  } else {
    return 'grey';
  };
};


function literacyMap(dataLiteracyCountry) {
/** Make a map illustrating the worldwide literacy rate throughout the years. Use
    data on literacy per country (dataLiteracyCountry). */

  var colors = d5.schemeBrBG[10];
  var mapLiteracy = new Datamap({
    scope: 'world',
    element: document.getElementById('figureTwo'),
    projection: 'mercator',
    responsive: true,
    data: dataLiteracyCountry,
    fills: {
      ZERO: colors[0],
      ONE: colors[1],
      TWO: colors[2],
      THREE: colors[3],
      FOUR: colors[4],
      FIVE: colors[5],
      SIX:  colors[6],
      SEVEN: colors[7],
      EIGHT: colors[8],
      NINE: colors[9],
      defaultFill: 'grey'
    },
    geographyConfig: {
      borderWidth: 1,
      highlightBorderColor: 'yellow',
      highlightFillColor: 'orange',
      highlightBorderWidth: 2,
      popupTemplate: function(geography, data) {
        if (!data){
          return '<div class="hoverinfo">' + '<strong>' + geography.properties.name + '</strong><br>' + 'No data';
        };
        var literacy = data['Literacy rate (%)'],
            year = data['Year'];
        if (data) {
          return '<div class="hoverinfo">' + '<strong>'+ geography.properties.name + '</strong><br>' + literacy + '% in ' + year;
        };
      }
    }
  });

  mapLiteracy.legend({
    defaultFillName: 'No data',
      labels: {
        ZERO: '<10%',
        ONE: '10-20%',
        TWO: '20-30%',
        THREE: '30-40%',
        FOUR: '40-50%',
        FIVE: '50-60%',
        SIX: '60-70%',
        SEVEN: '70-80%',
        EIGHT: '80-90%',
        NINE: '90-100%',
      }
    });

  return;
};


function attainmentMap(dataAttainment, margin, heights, widths) {
/** Make a map illustrating the education attainment throughout the years. Use
    data on attainment (dataAttainment). */

  // ready colors and slider
  var colorsAttainment = d5.schemeRdYlGn[7];
  var year = slider(dataAttainment);

  var barChart = d5.select('#figureFour')
                   .append('svg')
                   .attr('class', 'barChart')
                   .attr('id', 'attainmentChart')
                   .attr('height', 0)
                   .attr('width', 0)
                   .attr('fill', 'teal')
                   .attr('stroke', 'black');
  var multLines = d5.select('#figureFive')
                    .append('svg')
                    .attr('class', 'linechart')
                    .attr('id', 'multipleLines')
                    .attr('height', 0)
                    .attr('width', 0)
                    .attr('stroke', 'black');

  // attainment map
  var mapAttainment = new Datamap({
    scope: 'world',
    element: document.getElementById('figureThree'),
    projection: 'mercator',
    responsive: true,
    data: dataAttainment,
    fills: {
      ZERO: colorsAttainment[0],
      ONE: colorsAttainment[1],
      TWO: colorsAttainment[2],
      THREE: colorsAttainment[3],
      FOUR: colorsAttainment[4],
      FIVE: colorsAttainment[5],
      SIX: colorsAttainment[6],
      defaultFill: 'grey'
    },
    geographyConfig: {
      highlightBorderColor: 'green',
      highlightFillColor: 'blue',
      popupTemplate: function(geography, data) {
        if (!data){
          return '<div class="hoverinfo">' + '<strong>' + geography.properties.name + '</strong><br>' + 'No data';
        };
        if (CURRENT_YEAR === 0) {
          var attainment = data[year.value()]['years of education total'];
        } else {
          var attainment = data[CURRENT_YEAR]['years of education total'];
        };
        if (attainment) {
          return '<div class="hoverinfo">' + '<strong>' + geography.properties.name + '</strong><br>' + attainment + ' years';
        };
      }
    }
  });

  d5.select('#figureThree')
    .selectAll('path')
    .on('click', function(d) {

      // make charts appear
      barChart.attr('height', heights.svgFour)
              .attr('width', widths.svgFour);
      multLines.attr('height', heights.svgFour)
               .attr('width', widths.svgFive);

      // scroll to chart
      var element = document.getElementById('figureFour');
      element.scrollIntoView({behavior: 'smooth'});

      if (!dataAttainment[d.id]) {
        noBars(d, barChart, margin, heights.svgFour,
               widths.svgFour);
        noLines(d, multLines, margin, heights.svgFour,
                widths.svgFive)
      } else {

        // get info to pass on to the functions
        var barInfo = {chart: barChart, data: dataAttainment, country: d,
                       year: year, margin: margin, width: widths.svgFour,
                       height: heights.svgFour};
        var lineInfo = {chart: multLines, data: dataAttainment, country: d,
                        year: year, margin: margin, width: widths.svgFive,
                        height: heights.svgFour};

        // make sure to get the correct year
        if (CURRENT_YEAR === 0) {
          barchart(barChart, dataAttainment, d, year.value(),
                   margin, heights.svgFour, widths.svgFour);
          linescales = multipleLine(multLines, dataAttainment, d, year.value(),
                                    margin, heights.svgFour, widths.svgFive);
        } else {
          barchart(barChart, dataAttainment, d, CURRENT_YEAR,
                   margin, heights.svgFour, widths.svgFour);
          linescales = multipleLine(multLines, dataAttainment, d, CURRENT_YEAR,
                                    margin, heights.svgFour, widths.svgFive);
        };
      };

      // the slider must not get back to 1870 when a new country is selected
      slider(dataAttainment, barInfo, lineInfo, linescales);
      d5.selectAll('#sliderAttainment text')
        .style('opacity', 1);
    });

  mapAttainment.legend({
    defaultFillName: 'No data',
    labels: {
      ZERO: '<2 years',
      ONE: '2-4 years',
      TWO: '4-6 years',
      THREE: '6-8 years',
      FOUR: '8-10 years',
      FIVE: '10-12 years',
      SIX:  '>12 years',
    },
  });

  d5.select('#nameFigThree')
    .append('text')
    .attr('class', 'figureName')
    .attr('id', 'figureThreeName')
    .text('Figure 3: Education attainment in the year 1870');

  return;
};


function slider(data_dict, barInfo, lineInfo, linescales) {
// Add a slider.

  d5.select('#sliderAttainment')
    .remove();

  var years = new Array,
      ticks = new Array,
      dataYears = Object.keys(data_dict['AUS']);
  for (var i = 0; i < dataYears.length; i++) {
    if (dataYears[i] != 'fillKey') {
      years[i] = Number(dataYears[i]);
      ticks[i] = dataYears[i];
    };
  };

  // depending on the input, some things must be changed differently
  barInfo = barInfo || 0;
  lineInfo = lineInfo || 0;
  linescales = linescales || 0;

  /** the slider will begin on 1870 when the page is loaded, but after choosing a
     different country, the slider must stay on the current year */
  if (barInfo != 0){
    var year = barInfo.year.value();
  } else {
    var year = d5.min(years);
  };

  var sliderTime = d5
    .sliderBottom()
    .min(d5.min(years))
    .max(d5.max(years))
    .step(5)
    .width(800)
    .ticks(29)
    .tickFormat(function(d, i) {
      return [years[i]];
    })
    .default(CURRENT_YEAR)
    .on('onchange', function(val) {
      d5.selectAll('#sliderAttainment text')
        .style('opacity', 1); // fixes a weird bug where the selected year is not
                              //  shown under the slider
      d5.select('#figureThreeName')
        .transition()
          .text('Figure 3: Education attainment in the year ' + val);
      var current = updateMap(data_dict, sliderTime);
      CURRENT_YEAR = current.value();
      if (barInfo != 0) {

        // if the bar- and linecharts are shown, update them
        updateBar(sliderTime, barInfo);
        updateLines(sliderTime, lineInfo, linescales);
      };
    });

  var gTime = d5
    .select('div#slider-time')
    .append('svg')
    .attr('id', 'sliderAttainment')
    .attr('width', 847)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(15,30)');

  gTime.call(sliderTime);
  d5.select('#figureThreeName')
    .transition()
      .text('Figure 3: Education attainment in the year ' + sliderTime.value());
  d5.selectAll('#sliderAttainment text')
    .style('opacity', 1);

  return sliderTime;
};


function updateMap(data_dict, sliderTime) {
// Update the map using the values passed in through the slider.

  var year = sliderTime.value();
  d5.select('#figureThree')
    .selectAll('path')
    .style('fill', function(d) {
      return colorFill(data_dict, d.id, year);
    });

  return sliderTime;
};
