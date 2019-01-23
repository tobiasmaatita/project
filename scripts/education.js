function main() {

  d3Stuff();
  CURRENT_YEAR = 0;
  CLICKED = false;
  SELECTED = [];

  var margin = {
    top: 30,
    left: 60,
    right: 80,
    bottom: 70,
    title: 45,
    axisText: 23,
    subscript: 5,
    bar: 10
  },
      widths = {
    svgOne: 600,
    svgTwo: 600,
    svgThree: 600,
    svgFour: 400,
    svgFive: 550
  },
      heights = {
    svgOne: 450,
    svgTwo: 600,
    svgThree: 600,
    svgFour: 450
  };

  // data paths
  var educationAttainment = 'https://raw.githubusercontent.com/tobiasmaatita/project/master/Data/education_attainment.json',
      literacyCountry = 'https://raw.githubusercontent.com/tobiasmaatita/project/master/Data/literacy_rate_by_country.json',
      worldLiteracyData = 'https://raw.githubusercontent.com/tobiasmaatita/project/master/Data/literate_and_illiterate_world_population.json',
      countryCodesData = 'https://raw.githubusercontent.com/tobiasmaatita/project/master/Data/country_names.json';
  var request = [d5.json(educationAttainment), d5.json(literacyCountry),
                 d5.json(worldLiteracyData), d5.json(countryCodesData)];

  Promise.all(request).then(function(response) {
    var dataAttainment = response[0],
        dataLiteracyCountry = response[1],
        dataLiteracyWorld = response[2],
        countryCodes = response[3];
    var allCountriesAttainment = Object.keys(dataAttainment),
        allCountriesWorldLiteracy = Object.keys(dataLiteracyCountry),
        yearsLiteracyWorld = Object.keys(dataLiteracyWorld);

    // post-hoc, final preprocessing of the data. The converter did not append
    //  the country codes and the fillkeys.
    dataAttainment = addCountryCodes(dataAttainment, countryCodes);
    dataAttainment = fillkeysAttainment(dataAttainment, allCountriesAttainment);
    dataLiteracyCountry = addCountryCodes(dataLiteracyCountry, countryCodes);
    dataLiteracyCountry = fillkeysLiteracy(dataLiteracyCountry, allCountriesWorldLiteracy);

    // make all visualisation
    literacyMap(dataLiteracyCountry);
    linechart(dataLiteracyWorld, margin, widths.svgOne, heights.svgOne);
    attainmentMap(dataAttainment, margin, heights, widths);

  return;
  });

return;
};

function literacyMap(dataLiteracyCountry) {

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
      }});
};


function attainmentMap(dataAttainment, margin, heights, widths) {
// Make a map illustrating the education attainment throughout the years. Use
//  data on attainment (dataAttainment).

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

  var linescales = new Object;

  d5.select('#figureThree')
    .selectAll('path')
    .on('click', function(d) {
      barChart.attr('height', heights.svgFour)
              .attr('width', widths.svgFour);
      multLines.attr('height', heights.svgFour)
               .attr('width', widths.svgFive);

      var element = document.getElementById('figureFour');
      element.scrollIntoView({behavior: 'smooth'});

      if (!dataAttainment[d.id]) {
        noBars(d, barChart, margin, heights.svgFour,
               widths.svgFour);
        noLines(d, multLines, margin, heights.svgFour,
                widths.svgFive)
      } else {
        var barInfo = {chart: barChart, data: dataAttainment, country: d,
                       year: year, margin: margin, width: widths.svgFour,
                       height: heights.svgFour};
        var lineInfo = {chart: multLines, data: dataAttainment, country: d,
                        year: year, margin: margin, width: widths.svgFive,
                        height: heights.svgFour};

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
      THREE: '4-8 years',
      FOUR: '8-10 years',
      FIVE: '10-12 years',
      SIX:  '>12 years',
    },
  });
  d5.selectAll('#figureThree .datamaps-legend dd')
    .on('mouseover', function(d, i) {console.log(i);})

  d5.select('#nameFigThree')
    .append('text')
    .attr('class', 'figureName')
    .attr('id', 'figureThreeName')
    .text('Figure 3: Education attainment in the year 1870');

};


function linechart(data_dict, margin, width, height){

  var years = Object.keys(data_dict);
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
  d5.select('#figureOne svg')
    .append('text')
    .attr('class', 'figureName')
    .attr('id', 'figureOneName')
    .attr('x', 0)
    .attr('y', height - margin.subscript)
    .text('Figure 1: worldwide literacy throughout the past two centuries');

  var scales = lineScales(years, margin, width, height);
  var axes = lineAxes(scales)

  var line = d5.line()
               .x(function(d, i){
                 return scales.x(years[i]);
               })
               .y(function(d){
                 return scales.y(d.y);
               })
               .curve(d5.curveMonotoneX);

  var dataset = d5.range(years.length).map(function(d, i) {
    return {"y": data_dict[years[i]]};
  });

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

 // gridlines in y axis function
 function makeYGgridlines() {
     return d5.axisLeft(scales.y)
         .ticks(10);
 };

 lineWorld.append("g")
          .attr("class", "grid")
          .attr('transform', 'translate(' + margin.left + ',0)')
          .style('z-index', 1)
          .style('opacity', 0.5);

 lineWorld.select('.grid')
          .transition()
          .style('z-index', 1)
            .call(makeYGgridlines()
              .tickSize(-width + margin.left + margin.right)
              .tickFormat("")
            );

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

  var lineTip = d5.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d, i) {
      return "<strong>" + years[i] + "</strong> <br><span>" +
             data_dict[years[i]]+ " %" + "</span>";
    });
  lineWorld.call(lineTip);

  // draw line
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

  dots(lineWorld, years, data_dict, lineTip, scales);

  return;
};


function lineScales(years, margin, width, height) {

  var xScaleLine = d5.scaleLinear()
                     .domain([d5.min(years), d5.max(years)])
                     .range([margin.left, width - margin.right]),
      yScaleLine = d5.scaleLinear()
                     .domain([0, 100])
                     .range([height - margin.bottom, margin.top]);

  return {x: xScaleLine, y: yScaleLine};
};


function lineAxes(scales) {

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


function dots(lineWorld, years, data_dict, lineTip, scales) {

  // preprocess data to use for dots
  var dotsData = new Array;
  for (var i = 0; i < years.length; i++) {
    var year = years[i];
    dotsData[i] = {year: year, rate: data_dict[years[i]]};
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


function slider(data_dict, barInfo, lineInfo, linescales) {

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

  // the slider will begin on 1870 when the page is loaded, but after choosing a
  // different country, the slider must stay on the current year
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


function d3Stuff() {
// Layout of the page.

  var wrapper = d5.select('.wrapper');
  wrapper.append('div')
         .attr('class', 'text')
         .attr('id', 'pageTitle')
         .text('Worldwide education throughout the years');
  wrapper.append('div')
         .attr('class', 'content')
         .attr('id', 'content');
  wrapper.append('div')
         .attr('class', 'tableOfContents');

  var content = d5.select('.content'),
      tableOfContents = d5.select('.tableOfContents');
  tableOfContents.append('h3')
                 .text('Contents');
  tableOfContents.append('ol')
                 .attr('id', 'contents');

  content.append('div')
         .attr('class', 'text')
         .attr('id', 'introduction');
  var introduction = d5.select('#introduction');
  introduction.append('h4')
              .attr('id', 'introductory-paragraph')
              .text('Introduction');
  d5.select('#introductory-paragraph')
    .append('a')
    .attr('class', 'deep-link')
    .attr('href', '#introductory-paragraph');
  introduction.append('p')
              .text('Hier komt een inleidend stuk over de staat van het \
                     onderwijs wereldwijd. Wat duidelijk moet worden is \
                     dat op deze pagina de education attainment wordt \
                     weergegeven en de geletterdheid in de wereld door de \
                     jaren heen.');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'section')
                    .append('a')
                    .attr('href', '#introductory-paragraph')
                    .text('Introduction');

  content.append('div')
         .attr('class', 'text')
         .attr('id', 'literacy')
  var literacyText = d5.select('#literacy');
  literacyText.append('h4')
              .attr('id', 'literacy-paragraph')
              .text('Worldwide literacy rate');
  d5.select('#literacy-paragraph')
    .append('a')
    .attr('class', 'deep-link')
    .attr('href', '#literacy-paragraph');
  literacyText.append('p')
              .text('Hier komt de tekst van het eerste figuur. Het eerste figuur \
                     is een line chart die laat zien welk percentage van de \
                     wereld geletterd is in de afgelopen 200 jaar.');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'section')
                    .append('a')
                    .attr('href', '#literacy-paragraph')
                    .text('Worldwide literacy rate');

  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'figureOne');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'subsection')
                    .append('a')
                    .attr('href', '#figureOne')
                    .text('Figure 1: worldwide literacy 1800-2014');

  content.append('div')
         .attr('class', 'text')
         .attr('id', 'literacyExplain')
            .append('p')
            .text('Uitleg eerste figuur. Hier komt ook de text die bij de tweede \
                   figuur hoort. Het figuur slaat op de geletterdheid per land \
                   wereldwijd, met de laatst verkregen data. Misschien ook een \
                   aanwijzing van hoe te interacteren met de kaart (hover laat \
                   zien uit welk jaar de data komt en het percentage geletterden \
                   in dat land).');

  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'figureTwo');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'subsection')
                    .append('a')
                    .attr('href', '#figureTwo')
                    .text('Figure 2: literacy rate by country');
  content.append('div')
         .attr('class', 'text')
         .attr('id', 'nameFigTwo')
         .append('text')
           .attr('class', 'figureName')
           .attr('id', 'figureTwoName')
           .text('Figure 2: Worldwide literacy rate, latest data');

  content.append('div')
         .attr('class', 'text')
         .attr('id', 'educationAttainment')
            .append('h4')
            .attr('id', 'attainment-paragraph')
            .text('Education Attainment')
                .append('a')
                .attr('class', 'deep-link')
                .attr('href', '#attainment-paragraph');
  content.select('#educationAttainment')
         .append('p')
         .text('Hier komt een inleiding op de volgende sectie, namelijk education \
                attainment. In deze sectie wordt bekeken hoe lang iemand gemiddeld \
                naar school gaat per land. Ik wil graag interactiviteit inbouwen \
                door middel van een slider, waardoor je door de tijd heen kan gaan.');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'section')
                    .append('a')
                    .attr('href', '#attainment-paragraph')
                    .text('Education attainment');

  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'figureThree');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'subsection')
                    .append('a')
                    .attr('href', '#figureThree')
                    .text('Figure 3: Education attainment, 1870-2010');
  content.append('div')
         .attr('class', 'text')
         .attr('id', 'nameFigThree');
  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'slider')
           .append('div')
           .attr('class', 'row-align-items-center')
             .append('div')
             .attr('class', 'col-sm');
  content.select('.row-align-items-center')
         .append('div')
         .attr('class', 'col-sm')
            .append('div')
            .attr('id', 'slider-time');

  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'figureFour');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'subsection')
                    .append('a')
                    .attr('href', '#figureFour')
                    .text('Figure 4: Types of education');
  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'figureFive');

  content.append('div')
         .attr('class', 'text')
         .attr('id', 'sources')
            .append('h4')
            .text('Sources');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'section')
                    .append('a')
                    .attr('href', '#sources')
                    .text('Sources');

  content.select('#sources')
         .append('ul')
         .attr('id', 'sourcesList')
           .append('li')
             .append('a')
             .attr('href', 'http://www.barrolee.com/Lee_Lee_LRdata_dn.htm')
             .attr('target', '_blank')
             .text('Dataset used by Lee and Lee (2016)');
  content.select('#sourcesList')
         .append('li')
           .append('a')
           .attr('href', 'http://data.uis.unesco.org/index.aspx?queryid=166&lang=en')
           .attr('target', '_blank')
           .text('UNESCO data on world literacy');

  return;
};


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
    attainment = Math.round(attainment / 2 - 1);
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
    literacy = Math.round(literacy / 10 - 1);
    data[countries[i]]['fillKey'] = fillKeys[literacy];
  };

  return data;
};


function colorFill(data, id, year) {
// Helper function to the updateMap function. Sets the colors to fill the
//  countries.

  var info = data[id];
  var colors = d5.schemeRdYlGn[7];

  if (info) {
    var attainment = data[id][year]['years of education total'];
    attainment = Math.round(attainment / 2 - 1);
    if (attainment < 0) { attainment = 0; };
    return colors[attainment];
  } else {
    return 'grey';
  };
};


function barchart(barChart, data, country, year, margin, height, width, transDuration) {
// Make a barchart. When called from the updateBar function, this will have a
//  shorter transition duration (transDuration) than when called from the datamap
// to enable a smooth transition.

  d5.select('#noData')
    .remove();
  transDuration = transDuration || 750;

  // preprocess the data by selecting the right year, country, and educational
  //  level.
  var info = data[country.id][year],
      eduKeys = ['uneducated', 'primary', 'secondary', 'tertiary'],
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

  // gridlines in y axis function
  function makeYGridlines() {
      return d5.axisLeft(scales.y)
          .ticks(10);
  };

  barChart.append("g")
          .attr("class", "grid")
          .attr('transform', 'translate(' + margin.left + ',0)')
          .style('z-index', 1)
          .style('opacity', 0.5);
  barChart.append('text')
          .attr('class', 'infoLevel')
          .attr('id', 'level')
          .attr('text-anchor', 'end')
          .attr('x', width - 40)
          .attr('y', 99)
          .attr('font-size', '40px');
  barChart.append('text')
          .attr('class', 'infoLevel')
          .attr('id', 'percentage')
          .attr('text-anchor', 'end')
          .attr('x', width - 40)
          .attr('y', 120)
          .attr('font-size', '15px');

  var barWidth = 40;
  barChart.select('.grid')
          .transition()
          .style('z-index', 1)
          .style('opacity', 0.5)
            .call(makeYGridlines()
              .tickSize(-width + margin.right + margin.left - barWidth)
              .tickFormat("")
            );

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

       // the mouseover behaves differently when a bar has been clicked. If the
       //  linegraph shows only a few lines, a mouseover will show the line
       //  corresponding to the bar. If not, the mouseover will highlight the
       //  line corresponding to the bar.
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

       // the mouseout, like the mouseover, behaves differently when a bar has
       //  been clicked. When clicked === true, hovering the bar will show its
       //  corresponding line. The line will disappear thereafter. However, when
       //  clicked === false, hovering the bar will highlight the corresponding
       //  line. Upon mouseout, the other lines will have to become visible again.
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
       // show the line corresponding to the clicked bar. If a line is already
       //  visible, also show this line
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
       // keep track of which lines are being shown and make sure there is a
       //  possibility to reset
       SELECTED.push(num);
       CLICKED = true;

       resetButton(width);
     })
     .merge(bar)
     .transition(d5.easeQuad)
     .duration(transDuration)
     .attr('width', 40)
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
// Make scales. The xTickScale serves to align the bars and
//  their ticks.

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
};


function noBars(country, barChart, margin, height, width) {
// If there is no data, don't make a chart. Rather, let the user know
//  that there is no data.

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
};


function multipleLine(multLines, data, country, year, margin, height, width, transDuration) {

  d5.selectAll('#noData')
    .remove();
  d5.selectAll('.indicator')
    .transition()
      .style('opacity', 0.5);
  transDuration = transDuration || 750;

  var eduKeys = ['uneducated', 'primary', 'secondary', 'tertiary'];
  var dataNeeded = data[country.id];
  delete dataNeeded.fillKey;
  var yearsData = Object.keys(dataNeeded),
      years = new Array;

  for (var i = 0; i < yearsData.length; i++) {
    years[i] = Number(yearsData[i]);
  };

  var dataset = new Array;

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

  var xScaleLine = d5.scaleLinear()
                     .domain([d5.min(years), d5.max(years)])
                     .range([margin.left, width - margin.right]),
      yScaleLine = d5.scaleLinear()
                     .domain([0, 100])
                     .range([height - margin.bottom, margin.top]);
  var lineUned = d5.line()
                   .x(function(d, i) {
                     return xScaleLine(years[i]);
                   })
                   .y(function(d){
                     return yScaleLine(d.uneducated);
                   })
                   .curve(d5.curveMonotoneX),
      linePrim = d5.line()
                   .x(function(d, i) {
                     return xScaleLine(years[i]);
                   })
                   .y(function(d) {
                     return yScaleLine(d.primary);
                   })
                   .curve(d5.curveMonotoneX),
      lineSec = d5.line()
                  .x(function(d, i) {
                    return xScaleLine(years[i]);
                  })
                  .y(function(d) {
                    return yScaleLine(d.secondary);
                  })
                  .curve(d5.curveMonotoneX),
      lineTert = d5.line()
                   .x(function(d, i) {
                     return xScaleLine(years[i]);
                   })
                   .y(function(d) {
                     return yScaleLine(d.tertiary);
                   })
                   .curve(d5.curveMonotoneX);

  var xAxisLine = d5.axisBottom()
                    .scale(xScaleLine)
                    .ticks(12)
                    .tickFormat(function(d) {
                      return d;
                    }),
      yAxisLine = d5.axisLeft()
                    .scale(yScaleLine);

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
             .call(xAxisLine);
  multLines.select('#yMult')
           .transition()
             .duration(transDuration)
             .style('opacity', 1)
             .call(yAxisLine);

  function make_y_gridlines() {
    return d5.axisLeft(yScaleLine)
             .ticks(10)
  };

  // add the Y gridlines
  multLines.append("g")
           .attr("class", "grid")
           .attr('transform', 'translate(' + margin.left + ', 0)')
           .style('z-index', 1)
           .style('opacity', 0.5);
  multLines.append('line')
           .attr('class', 'indicator')
           .style('stroke', 'black')
           .style('stroke-width', '1.5px')
           .style('opacity', 0.5)
           .style('z-index', 1);

  if (CURRENT_YEAR != 0) {
    multLines.select('.indicator')
             .attr('x1', xScaleLine(CURRENT_YEAR))
             .attr('x2', xScaleLine(CURRENT_YEAR))
             .attr('y1', margin.top)
             .attr('y2', height - margin.bottom)
  };

  multLines.select('.grid')
           .transition()
           .style('z-index', 1)
           .style('opacity', 0.5)
             .call(make_y_gridlines()
               .tickSize(-width + margin.left + margin.right)
               .tickFormat("")
             );

  multLines.append('text')
           .attr('class', 'figTitle')
           .attr('id', 'multTitle')
           .attr('text-anchor', 'middle')
           .attr('y', margin.axisText)
           .attr('x', xScaleLine((xScaleLine.domain()[1] - xScaleLine.domain()[0])/2
                                 + xScaleLine.domain()[0]));

  multLines.select('.figTitle')
           .transition()
             .text('Highest educational level, 1870-2010');

  multLines.append('text')
           .attr('class', 'axeTitle')
           .attr('id', 'xMult')
           .attr('text-anchor', 'middle')
           .attr('x', xScaleLine((xScaleLine.domain()[1] - xScaleLine.domain()[0])/2
                                  + xScaleLine.domain()[0]))
           .attr('y', height - margin.axisText)
           .text('Year');
  multLines.append('text')
           .attr('class', 'axeTitle')
           .attr('id', 'yMult')
           .attr('text-anchor', 'middle')
           .attr('x', -yScaleLine((yScaleLine.domain()[1])/2))
           .attr('y', margin.axisText + 5)
           .attr('transform', 'rotate(-90)')
           .text('Rate (%)');

  multLines.append('path')
           .attr('class', 'line')
           .attr('id', 'lineUned')
  multLines.append('path')
           .attr('class', 'line')
           .attr('id', 'linePrim')
  multLines.append('path')
           .attr('class', 'line')
           .attr('id', 'lineSec')
  multLines.append('path')
           .attr('class', 'line')
           .attr('id', 'lineTert')

  multLines.select('#lineUned')
           .datum(dataset)
           .transition()
             .duration(transDuration)
             .attr('d', lineUned);
  multLines.select('#linePrim')
           .datum(dataset)
           .transition()
             .duration(transDuration)
             .style('stroke', 'red')
             .attr('d', linePrim);
  multLines.select('#lineSec')
           .datum(dataset)
           .transition()
             .duration(transDuration)
             .style('stroke', 'blue')
             .attr('d', lineSec);
  multLines.select('#lineTert')
           .datum(dataset)
           .transition()
             .duration(transDuration)
             .style('stroke', 'green')
             .attr('d', lineTert);
  multLines.selectAll('.line')
           .on('mouseover', function(d, i) {
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
               .text(dataNeeded[currYear][eduKeys[i]] + '%')
               .transition()
                 .style('opacity', 1);
           })
           .on('mouseout', function(d) {
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

  return {x: xScaleLine, y: yScaleLine};
};


function noLines(country, multLines, margin, height, width) {
// If there is no data, don't make a chart. Rather, let the user know
//  that there is no data.

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
           .attr('x', width/2 + margin.left/2)
           .attr('y', height/2);
  multLines.select('#noData')
           .transition()
             .delay(transDuration + 50)
             .text('No data available');
};


function updateLines(sliderTime, lineInfo, scales) {
// Update the multiple line chart: the indicator line
//  aligns itself with the year that is being shown in
//  the bar chart.

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
};


window.onload = function(){
  main();
};
