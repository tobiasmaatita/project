# Process Book Tobias Maätita

## Day 2
Decided on a final deisgn document. To be seen [here](https://github.com/tobiasmaatita/project/tree/master/DESIGN.md).

## Day 3
Decided to change the sequence of the figures: first a line chart of the worldwide literacy
throughout the years, then the datamap.

## Day 4
No big decisions, worked on the prototype. Problem: how to show this prototype
without a local host.

## Day 5
The problem of day 4 turned out to be that GitHub does not allow to move to the parent folder.
I will have to solve this by creating a path using sys. Furthermore, the data map uses country
IDs, which I do not have in my data. Therefore, I will have to alter the data a bit
to get the right IDs in the right places. This will take some work, but hopefully I
can achieve this in my converter program.

## Day 6
Added the country codes to the data within my education.js script. The map does not
seem to know countries such as Ivory Coast and Taiwan. Very strange! I think it has
to do with the different names used by the map and the data. I will have to fix this issue.
  Decided to add interactivity with a tooltip to the first line chart.

## Day 7
Added tooltip to the line chart. First problem: interactivity between the slider and the datamap.
The coloring works, but the information passed on to the popupTemplate does not change accordingly. 
