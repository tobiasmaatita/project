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
to do with the different names used by the map and the data. I will have to fix this issue.
  Decided to add interactivity with a tooltip to the first line chart.

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
of those maps' color? I also have to add legends. Also, the figures do not adjust to the size of the screen.
