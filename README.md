# Project
## Proposal Tobias Maätita (10730109)


### Problem Statement
Up until this day, access to education has never been equal. In some countries, even today, a large percentage of the population is still illiterate, whereas in other countries children can attend school free of charge. 
For my final project, I will illustrate the worldwide access to education. I hope to show developments over a period of time, for example the last two centuries, but I need to find sufficient data to reach this goal.
Aspects that I would like to show are, for example, the percentage of people who can read or write; the mean time a child will spend in school (in years) and the 


### Solution
I will show the worldwide development of access to education over a certain period of time *(needed: specific period)*


#### Layout

##### Webpage
The visualisations will be presented on a webpage. This website will hold both text and visualisations like world maps and graphs, probably line graphs showing a development throughout a certain time period. Visual sketches can be found in the `doc` folder. 


##### Map 1 (MVP)
The initial view will be a map of the world, showing the percentage of (il)literacy using colors; shifting from red for high illiteracy towards blue when illitarcy is low. 


##### Graph 1
A graph visualizing the data from Map 1; on the y axis the literacy percentage of the world population (i.e. 0-100) and on the x axis time. Hopefully, I can illustrate that over the course of the last century (maybe even further back in time), illiteracy has declined sharply.


##### Map 2 (MVP)
Another map of the world, this time showing how many years on average a kid will be schooled in a country. Maybe using different colors than the red-blue spectre used in Map 1.


##### Graph 2 
This graph will highlight a few countries which show problematic developments. OR: This graph will show the data of a selected country. The data will probably shown in a line graph, as we are dealing with development over a certain period of time. 


##### More features
More features still to come. Interesting aspects to investigate are, for example: the types of education per country, 


#### Interactivity

##### Map 1  (MVP)
Hovering over a country will show the percentage of its inhabitants that are able to read and write. 
The aspect of time could possibly also be included, as to show the rise or decline of literacy throughout the years. 
At this moment, I do not have a timeframe yet, as I still need to explore the scope of the available data. 

##### Map 2 (MVP)
Hopefully, I can implement the same interactive features as used in Map 1. 

##### Graph 2 
If indeed different countries: hovering over one line will push the other lines to the background (lighter color).


### Data sources
http://data.uis.unesco.org/index.aspx?queryid=166&lang=en (literacy rate).  


### External components  
D3 is needed for the graphs, and I will probably work with databases, so SQLite might be a useful tool for that purpose. 


### Similar visualisations
https://ourworldindata.org/edu-quality-key-facts  
Here, education quality is measured and plotted against several factors, such as GDP and mimum/maximum achievement. Some of the visualisations are accompanied by a bar the user can use to see the same data from different years; they can even press a play button to see the entire development between 1970 and 2015. I hope to implement a similar feature. However, at the moment, I do not yet have the know-how to do so; I will have to dive deeper into this. 

### Hardest parts
The hardest part for me will be to implement the interactivity; I want the user to be able to both select a country and see developments over time. To do so, I will need to use information from different datasets and make sure the correct data is selected and that the interactive features do not interfere with each other. 












