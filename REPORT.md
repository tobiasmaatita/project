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
Within this script, both datamaps are drawn. 


#### barchart.js


#### multipleLines.js


### Challenges (including important changes)
Legenda -> zo gelaten
Interactie tussen twee, grafieken en map bij slider -> global variable gemaakt


### Decisions defense
Multiple linechart -> more interaction. Data not suited for scatterplot.
