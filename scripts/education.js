function main(){

  // d3 stuff
  var wrapper = d3.select('.wrapper');
  wrapper.append('div')
         .attr('class', 'text')
         .attr('id', 'pageTitle')
         .text('Worldwide education throughout the years');
  wrapper.append('div')
         .attr('class', 'content');
  wrapper.append('div')
         .attr('class', 'tableOfContents')

  var content = d3.select('.content'),
      tableOfContents = d3.select('.tableOfContents');
  tableOfContents.append('h3')
                 .text('Contents');
  tableOfContents.append('ol')
                 .attr('id', 'contents');

  content.append('div')
         .attr('class', 'text')
         .attr('id', 'introduction');
  var introduction = d3.select('#introduction');
  introduction.append('h4')
              .attr('id', 'introductory-paragraph')
              .text('Introduction');
  d3.select('#introductory-paragraph')
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
  var literacyText = d3.select('#literacy');
  literacyText.append('h4')
              .attr('id', 'literacy-paragraph')
              .text('Worldwide literacy rate');
  d3.select('#literacy-paragraph')
    .append('a')
    .attr('class', 'deep-link')
    .attr('href', '#literacy-paragraph');
  literacyText.append('p')
              .text('Hier komt de text die bij de eerste figuur hoort. Het eerste \
                     slaat op de geletterdheid per land wereldwijd, met de laatst \
                     verkregen data. Misschien ook een aanwijzing van hoe te \
                     interacteren met de kaart (hover laat zien uit welk jaar de \
                     data komt en het percentage geletterden in dat land).')
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
                    .text('Figure 1: literacy rate by country')

  content.append('div')
         .attr('class', 'text')
         .attr('id', 'literacyExplain')
            .append('p')
            .text('Hier komt verdere uitleg van het figuur. Misschien nog iets \
                   van een aankondiging van de volgende figuur: een line chart \
                   met daarop de geletterdheid wereldwijd in de afgelopen honderd \
                   (?) jaar.');

  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'figureTwo');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'subsection')
                    .append('a')
                    .attr('href', '#figureTwo')
                    .text('Figure 2: worldwide literacy 1900-2010');

  // margins
  var margin = {
    top: 30,
    left: 60,
    right: 30,
    bottom: 80,
    title: 45,
    axisText: 30
  },
      widths = {
    svgOne: 100,
    svgTwo: 100,
    svgThree: 100,
    svgFour: 100
  },
      heights = {
    svgOne: 100,
    svgTwo: 100,
    svgThree: 100,
    svgFour: 100
  };



  var educationAttainment = '../data/education_attainment.json',
      literacyCountry = '../data/literacy_rate_by_country.json';
  var request = [d3.json(educationAttainment), d3.json(literacyCountry)];
  Promise.all(request).then(function(response) {

    var dataAttainment = response[0],
        dataLiteracyCountry = response[1];

    // other global variables
    var allCountriesAttainment = Object.keys(dataAttainment);
    var allCountriesWorldLiteracy = Object.keys(dataLiteracyCountry);

    var map = new Datamap({
      scope: 'world',
      element: document.getElementById('figureOne'),
      projection: 'mercator',
      height: 600
    });

    var lineWorld = d3.select('#figureTwo')
                      .append('svg')
                      .attr('class', 'linechart')
                      .attr('id', 'worldLiteracy')
                      .attr('height', heights.figureTwo - margins.left - margin)
                      .attr('width', widths.figureTwo)
                      .attr('stroke', 'black');

    // linechart()







    // setWorldMap(literacyCountry)
    // function setWorldMap(data) {
    //
    //   var mapOnepath = d3.geoPath(),
    //       mapOneSvg = d3.select("#figureOne")
    //                     .append("svg")
    //                     .attr("width", widths.svgOne)
    //                     .attr("height", heights.svgOne)
    //                     .append('g')
    //                     .attr('class', 'map')
    //                     .attr('id', 'mapOne'),
    //       projection = d3.geoMercator()
    //                      .scale(130)
    //                      .translate( [widths.svgOne / 2, heights.svgOne / 1.5]),
    //       path = d3.geoPath().projection(projection);
    // // end setWorldMap
    // };

  // end promise
  });
// end main function
};

window.onload = function(){
  main();
};
