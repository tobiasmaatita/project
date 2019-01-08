function main(){
  d3.json('../data/education_attainment.json').then(function(educationAttainment){
    d3.json('../data/literacy_rate_by_country.json').then(function(literacyCountry) {

      // d3 stuff
      var wrapper = d3.select('.wrapper');
      wrapper.append('div')
             .attr('class', 'text')
             .attr('id', 'pageTitle')
             .text('Worldwide education throughout the years');
      wrapper.append('div')
             .attr('class', 'content');

      var content = d3.select('.content');
      content.append('div')
             .attr('class', 'text')
             .attr('id', 'introduction')
      content.append('div')
             .attr('class', 'figure')
             .attr('id', 'figureOne')

      // margins
      var margin = {
        top: 30,
        left: 60,
        right: 30,
        bottom: 80,
        title: 45,
        axisText: 30
      }
      var widths = {
        svgOne: 100,
        svgTwo: 100,
        svgThree: 100,
        svgFour: 100
      }
      var heights = {
        svgOne: 100,
        svgTwo: 100,
        svgThree: 100,
        svgFour: 100
      }

      // other global variables
      var allCountriesAttainment = Object.keys(educationAttainment);
      var allCountriesWorldLiteracy = Object.keys(literacyCountry);

    // end literacy_by_country
    });
  // end education_attainment
  });
// end main function
};

window.onload = function(){
  main();
};
