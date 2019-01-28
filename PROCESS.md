# Process Book Tobias Maätita

## Day 2 (Tue)
Decided on a final deisgn document. To be seen [here](https://github.com/tobiasmaatita/project/tree/master/DESIGN.md).

## Day 3 (Wed)
Decided to change the sequence of the figures: first a line chart of the worldwide literacy
throughout the years, then the datamap.

## Day 4 (Thu)
No big decisions, worked on the prototype. Problem: how to show this prototype
without a local host.

## Day 5 (Fri)
The problem of day 4 turned out to be that GitHub does not allow to move to the parent folder.
I will have to solve this by creating a path using sys. Furthermore, the data map uses country
IDs, which I do not have in my data. Therefore, I will have to alter the data a bit
to get the right IDs in the right places. This will take some work, but hopefully I
can achieve this in my converter program.

## Day 6 (Mon)
Added the country codes to the data within my education.js script. The map does not
seem to know countries such as Ivory Coast and Taiwan. Very strange! I think it has
to do with the different names used by the map and the data. I will have to fix this issue. Decided to add interactivity with a tooltip to the first line chart.

## Day 7 (Tue)
Added tooltip to the line chart. First problem: interactivity between the slider and the datamap.
The coloring works, but the information passed on to the popupTemplate does not change accordingly.

## Day 8 (Wed)
Fixed the interactivity between the slider and the second datamap. Considering adding a scatterplot to
the mix, showing a relation between a country's expenditures on education and resulting developments, either over
time or compared to the other countries. Also not sure whether a bar chart is the right visualisation tool
to display the types of education in a country; maybe a pie chart would serve this end better. Or a stacked
bar chart and the possibility to compare several countries or years in the same country?
  Chose to include a bar chart which is also updated while scrolling the slider.

## Day 9 (Thu)
Working towards an alpha version. Thinking about including separate text files with all text needed on the site.
However, I still need to fix the sys path issue. Therefore, not sure whether this is the right way to go. Hopefully,
I will have fixed this by the end of the day. Decided to hold off on adding any other plots until the graphs and maps all
have titles, labels, coloring, etc. Right now, both my data maps use the color blue to illustrate a point. Maybe change one
of those maps' color? I also have to add legends. Also, the figures do not adjust to the size of the screen. Fixed the problem with the sys paths by collecting the data from my github's raw files. I will have to put the datamaps in separate functions.

## Day 10 (Fri)
Trying to fix legends. Used the legend plugin from the datamap, but I did not like the resulting legends. Therefore, I am now trying to make a legend using D3.

## Day 11 (Mon)
Today, I strive to get a legend on at least one map. Added a line graph instead of a scatterplot. The line graph
shows four levels of education and which share of the population has achieved a certain level. This is plotted throughout the years. **still to be fixed:** the words 'no data' are not always centered in the line graph div. (Fixed on day 13)

## Day 12 (Tue)
Added a basic legend, but it is not yet exactly what i wanted. Added interactivity between the multiple line chart and the bar chart. This interactivity currently only works in one way: actions on the bar chart influence the line graph. I want to have a little bit of interactivity the other way around. Tomorrow, I will have to fix the final bugs such as text alignment and the transition of the titles in the line chart. Also, the colors of the highlight in the second datamap need to be changed: at the moment, this color is the same color as a color used in the map to indicate a certain degree of educational attainment (fixed on day 13).

## Day 13 (Wed)
Keeping the legend as they are. The fillkeys functions do not seem to work properly, will have to look at them. Fixed the fillKey problem.
Implemented interactivity between the line graph and the bar chart.

## Day 14 (Thu)
Hackathon.

## Day 15 (Fri)
Adding text to the webpage. The site and visualisations are finished now. **To do:** Get the visualisations in different files. Keep in mind that some functions are shared by all visualisations, such as for instance the gridLine() function. If this function goes well when in a separate file, maybe one of the the lineScales() and scalesLines() functions could be removed. Also, comments in the datamaps (Both Fixed on day 16).

## Day 16 (Mon)
Visualisations are now in different files. Datamaps are commented. The site is pretty much finalised; now working on the repository and other requirements such as the final report and a new README.md. Fixed a few bugs.
