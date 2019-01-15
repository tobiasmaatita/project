function main(){

  d3Stuff();

  var margin = {
    top: 30,
    left: 60,
    right: 30,
    bottom: 50,
    title: 45,
    axisText: 30
  },
      widths = {
    svgOne: 600,
    svgTwo: 100,
    svgThree: 100,
    svgFour: 100
  },
      heights = {
    svgOne: 400,
    svgTwo: 100,
    svgThree: 100,
    svgFour: 100
  };
  var educationAttainment = '../data/education_attainment.json',
      literacyCountry = '../data/literacy_rate_by_country.json',
      worldLiteracyData = '../data/literate_and_illiterate_world_population.json',
      countryCodesData = '../data/country_names.json';
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
    dataAttainment = addCountryCodes(dataAttainment, countryCodes);
    console.log(dataAttainment);
    dataLiteracyCountry = addCountryCodes(dataLiteracyCountry, countryCodes);


    // literacy map
    var mapLiteracy = new Datamap({
      scope: 'world',
      element: document.getElementById('figureTwo'),
      projection: 'mercator',
      height: 600,
      data: dataLiteracyCountry,
      geographyConfig: {
        highlightBorderColor: 'yellow',
        popupTemplate: function(geography, data) {
          var literacy = data['Literacy rate (%)'],
              year = data['Year'];
          if (literacy) {
            return '<div class="hoverinfo">' + '<strong>'+ geography.properties.name + '</strong><br>' + literacy + '% in ' + year;
          } else {
            return '<div class="hoverinfo">' + '<strong>' + geography.properties.name + '</strong><br>' + 'No data';
          };
        }
      }
    });

    // literacy line
    linechart(dataLiteracyWorld, margin, widths.svgOne, heights.svgOne);

    var blues = d5.scaleOrdinal(d5.schemeBlues[9]);
    var year = slider(dataAttainment);


    // attainment map
    var mapAttainment = new Datamap({
      scope: 'world',
      element: document.getElementById('figureThree'),
      projection: 'mercator',
      height: 600,
      data: dataAttainment,
      geographyConfig: {
        highlightBorderColor: 'green',
        popupTemplate: function(geography, data) {
          var attainment = data[year]['years of education total'];
          if (attainment) {
            return '<div class="hoverinfo">' + '<strong>' + geography.properties.name + '</strong><br>' + attainment + ' years';
          } else {
            return '<div class="hoverinfo">No information available'
          };
        }
      }
    });
    d3.select('figureThree')
      .selectAll('path')
      .style('fill', function(d) {
        return colorBlue(data_dict, d.id, '1870');
      });


  // end promise
  });
// end main function
};

function linechart(data_dict, margin, width, height){

  var years = Object.keys(data_dict);
  for (var i = 0; i < years.length; i++) {
    years[i] = Number(years[i])
  };
  var lineWorld = d5.select('#figureOne')
                    .append('svg')
                    .attr('class', 'linechart')
                    .attr('id', 'worldLiteracy')
                    .attr('height', height)
                    .attr('width', width)
                    .attr('stroke', 'black');

  var xScaleLine = d5.scaleLinear()
                     .domain([d5.min(years), d5.max(years)])
                     .range([margin.left, width - margin.right]),
      yScaleLine = d5.scaleLinear()
                     .domain([0, 100])
                     .range([height - margin.bottom, margin.top]);

  var line = d5.line()
               .x(function(d, i){
                 return xScaleLine(years[i])
               })
               .y(function(d){
                 return yScaleLine(d.y)
               })
               .curve(d5.curveMonotoneX);

  var dataset = d5.range(years.length).map(function(d, i) { return {"y": data_dict[years[i]]} })

  var xAxisLine = d5.axisBottom()
                    .scale(xScaleLine)
      yAxisLine = d5.axisLeft()
                    .scale(yScaleLine);

  lineWorld.append('g')
           .attr('class', 'xAxis')
           .attr('id', 'xLine')
           .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
           .call(xAxisLine);
  lineWorld.append('g')
           .attr('class', 'yAxis')
           .attr('id', 'yLine')
           .attr('transform', 'translate(' + margin.left + ', 0)')
           .call(yAxisLine);

  lineWorld.append('text')
           .attr('class', 'figTitle')
           .attr('id', 'lineTitle')
           .attr('text-anchor', 'middle')
           .attr('y', margin.top - 10)
           .attr('x', xScaleLine((xScaleLine.domain()[1] - xScaleLine.domain()[0])/2
                                  + xScaleLine.domain()[0]))
           .text('Worldwide literacy rate, 1800-2014')

  var path = lineWorld.append('path')
                      .datum(dataset)
                      .attr('class', 'line')
                      .attr('id', 'lineWorld')
                      .attr('d', line)

  var totalLength = path.node().getTotalLength();
  path
   .attr("stroke-dasharray", totalLength + " " + totalLength)
   .attr("stroke-dashoffset", totalLength)
   .transition()
     .duration(2000)
     .attr("stroke-dashoffset", 0);


// end linechart function
};

function slider(data_dict) {

  var years = Object.keys(data_dict['AUS'])
  for (var i = 0; i < years.length; i++) {
    years[i] = Number(years[i])
  }

  // var dataTime = d5.range(years.length).map(function(d) {
  //     return new Date(years[d], 1,1);
  //   });

  var sliderTime = d5
    .sliderBottom()
    // .min(d5.min(dataTime))
    // .max(d5.max(dataTime))
    .min(d5.min(years))
    .max(d5.max(years))
    // .step(1000 * 60 * 60 * 24 * 365 * 5)
    .step(5)
    .width(800)
    .tickValues(years)
    // .tickFormat(d5.timeFormat('%Y'))
    // .tickValues(years)
    // .default(new Date(d5.min(dataTime)))
    .default(d5.min(years))
    .on('onchange', function(val) {
      //val => {
      // d5.select('p#value-time').text(d5.timeFormat('%Y')(val));
      var year = updateMap(data_dict, sliderTime)
      d5.select('p#value-time').text(val)
    });

    var gTime = d5
      .select('div#slider-time')
      .append('svg')
      .attr('width', 847)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(15,30)');

    gTime.call(sliderTime);
    d5.select('p#value-time').text((sliderTime.value()));

    return sliderTime.value();
};

function updateMap(data_dict, sliderTime) {
  var year = sliderTime.value();
  var test = d5.select('#figureThree')
               .select('path')
  console.log(test);
  d5.select('#figureThree')
    .selectAll('path')
    .style('fill', function(d) {
      return colorBlue(data_dict, d.id, year)
    })
    .popuptemplate(function(d){
      return '<div class="hoverinfo">' + '<strong>' + 'hallo' + '</strong>'
    });

  return year
};

function d3Stuff() {

  var wrapper = d5.select('.wrapper');
  wrapper.append('div')
         .attr('class', 'text')
         .attr('id', 'pageTitle')
         .text('Worldwide education throughout the years');
  wrapper.append('div')
         .attr('class', 'content');
  wrapper.append('div')
         .attr('class', 'tableOfContents')

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
                     jaren heen.')
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'section')
                    .append('a')
                    .attr('href', '#introductory-paragraph')
                    .text('Introduction')

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
                     wereld geletterd is in de afgelopen 200 jaar.')
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'section')
                    .append('a')
                    .attr('href', '#literacy-paragraph')
                    .text('Worldwide literacy rate')

  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'figureOne');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'subsection')
                    .append('a')
                    .attr('href', '#figureOne')
                    .text('Figure 1: worldwide literacy 1800-2014')

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
                    .text('Figure 3: Education attainment, 1970-2010');
  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'slider')
            .append('div')
            .attr('class', 'row-align-items-center')
                .append('div')
                .attr('class', 'col-sm-2')
                    .append('p')
                    .attr('id', 'value-time');
  content.select('.row-align-items-center')
         .append('div')
         .attr('class', 'col-sm')
            .append('div')
            .attr('id', 'slider-time');

  content.append('div')
         .attr('class', 'text')
         .attr('id', 'attainmentExplain')
            .append('p')
            .text('Uitleg over de figuren hierboven en hieronder.');

  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'figureFour')
         .text('hier komt figuur 4');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'subsection')
                    .append('a')
                    .attr('href', '#figureFour')
                    .text('Figure 4: Types of education');

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
                    .text('Sources')

  content.select('#sources')
         .append('ul')
         .attr('id', 'sourcesList')
            .append('li').text('source 1');
  content.select('#sourcesList')
         .append('li').text('source 2');

};

function addCountryCodes(data, codes) {
// add country codes to dictionary to use in data map

  var allCountries = Object.keys(codes),
      allDataKeys = Object.keys(data);
  var newDataset = new Object;

  for (var i = 0; i < allCountries.length; i++) {
    if (data[allCountries[i]]) {
      newDataset[codes[allCountries[i]]] = data[allCountries[i]]
    };
  };

  return newDataset

};

function colorBlue(data, id, year) {
  var info = data[id];
  var blues = d5.schemeBlues[9];
  if (info) {
    var attainment = data[id][year]['years of education total'];
    var attainment = Math.round(attainment / 14 * 8 + 0.5);
    return blues[attainment];
  } else {
    return 'grey';
  };
  // var blues = d5.schemeBlues[];
  // var attainment = data[id]['years of education total']
}





window.onload = function(){
  main();
};
