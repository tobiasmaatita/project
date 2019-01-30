/** Name: Tobias Maätita
    Student No.: 10730109

    Module containing the main function. This function is called on loading the
    webpage. Contains one function:

    main: preprocess the data and call all visualisations.
*/


function main() {
/** Final preprocessing and calling the visualisations.
    Contains three global variables.

    Takes no input arguments and has no output.
*/
  d3Stuff();

  // global variables.
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

    /** post-hoc, final preprocessing of the data. The converter did not append
          the country codes and the fillkeys. */
    dataAttainment = addCountryCodes(dataAttainment, countryCodes);
    dataAttainment = fillkeysAttainment(dataAttainment, allCountriesAttainment);
    dataLiteracyCountry = addCountryCodes(dataLiteracyCountry, countryCodes);
    dataLiteracyCountry = fillkeysLiteracy(dataLiteracyCountry, allCountriesWorldLiteracy);

    // make all visualisations
    literacyMap(dataLiteracyCountry);
    linechart(dataLiteracyWorld, margin, widths.svgOne, heights.svgOne);
    attainmentMap(dataAttainment, margin, heights, widths);

    return;
  });

  return;
};

window.onload = function(){
  main();
};
