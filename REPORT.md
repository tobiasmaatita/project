# Final report

### Description
This website visualises the global trends in literacy and educational attainment. To do so, firstly the worldwide literacy rate is examined. Thereafter, the developments in educational attainment, expressed in the highest educational level achieved by a certain rate of the population, are illustrated. The educational attainment can be examined per country, per five years, and per educational level. The following screenshot gives an impression of this closer examination.

![Close examination of educational attainment](doc/descriptionImage.png)

### Technical design
The webpage consists of five figures: two datamaps, one single-linechart and one multiple line chart, and one bar chart. The four different types of visualisations are each represented in separate scripts: barchart.js, literacy.js (the single-linechart), maps.js, and multipleLines.js.  

#### layout.js
The layout of the page is represented in the layout.js script, which only consists of d3 methods to append the divs that hold separate sections of the webpage.

#### main.js
The main.js script loads when the webpage is loaded. It uses the `Promise.all()` function to load in the needed data. Then, using the `addCountryCodes()`, the `fillkeysLiteracy()`, and `fillkeysAttainment()` functions from the `maps.js` script are used to do some final preprocessing of the datasets that are needed for the datamaps. Thereafter, it calls the needed visualisations, thus setting into motion the loading of the entire webpage.

#### literacy.js
The literacy.js script holds the code for the first visualisation, being the linechart on the worldwide literacy rate throughout the years. The main function in this script is the `linechart()` function, which takes the needed data, the given margins and the svg's width and height and finally produces a linechart. This function calls, in order, the `lineScales()` function to make the scales functions conform the entered data, the `lineAxes()` function to make the axes functions given the newly generated scales, the `lineText()` function to provide the axes with text, the `gridLine()` function to draw horizontal gridlines on the graph, and the `dots()` function, which draws dots on each datapoint. Furthermore, the graph has a tooltip which allows the user to get the exact numbers on each datapoint.

#### maps.js
Within this script, both datamaps are drawn. This script contains several functions, which will be described separately.  
The `literacyMap()` function takes the data on worldwide literacy and draws a datamap. It does not call any other functions from this module.  
The `attainmentMap()` function takes the data on worldwide educational attainment throughout the years and draws a datamap. Before drawing, the `slider()` function is called to draw a slider using the years of which there is data. Then it draws the map. When setting the actions to perform when a country is clicked, this function calls a lot of functions from other modules.  
The `slider()` function draws a slider on the webpage. On change, the slider activates the `updateMap()` function. Also, when the barchart and the multiple linechart are active, the slider calls the `updateBar()` and the `updateLines()` functions from the other modules.  
The `updateMap()` takes the data and the selected year and updates the colors of the country in the map. To do so, it calls the `colorFill()` function.  
The `colorFill()` function calculates the range in which the data lies and assigns a color to the country in the attainment map.  
The `fillkeysLiteracy()` and the `fillkeysAttainment()` functions both calculate the range in which the data lies and assigns a color to the country in the literacy, respectively the attainment data. In the case of the attainment map, these fillkeys only set the default colours. The `colorFill()` function changes these later on. These functions are called from the `main.js` module.  
Finally, the `addCountryCodes()` function pairs the countries from the entered dataset to their corresponding country codes. This function is called from the `main.js` module.


#### barchart.js
Within this script, the barchart is drawn upon clicking a country in the educational attainment datamap. This script contains several functions, which will be described separately.  
The `barchart()` function is the main function of this module. This function is called from the `maps.js` module: both the `slider()` function as well as the `attainmentMap()` function call this function. In turn, this function calls a lot of functions from this module. The function draws a barchart from the entered data. Like the linechart, this function calls functions to make scales (`barScales()`), axes (`barAxes()`), gridlines (`gridLine()` from the `literacy.js` module) and text (`axesText()`). This function uses several global variables. First, the `CLICKED` variable, which is a boolean indicating whether a line has been singled out by clicking a bar in the barchart. Second, the `SELECTED` variable keeps track of the lines that have been singled out.  
The `updateBar()` function is called from the `slider()` function and the `attainmentMap()` function from the `maps.js` module. This function, in turn, calls the `barchart()` function to make a newly updated barchart with the new data. This can be data from another year or another country. To update the bar, a year is needed. For this purpose, this function uses the global `CURRENT_YEAR` variable.  
Finally, the `noBars()` function is called from the `attainmentMap()` function from the `maps.js` module. This map shows that there is no data for a chosen country.

#### multipleLines.js



### Challenges (including important changes)
Legenda -> zo gelaten
Interactie tussen twee, grafieken en map bij slider -> global variable gemaakt


### Decisions defense
Multiple linechart -> more interaction. Data not suited for scatterplot.
Mercator projections
