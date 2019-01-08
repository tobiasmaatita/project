# Design document
This document states the design of my final project.


## Data
The data I will be using can be found inside the [data](https://github.com/tobiasmaatita/project/tree/master/Data) folder. For now, I will only be using the information on [worldwide education attainment](https://github.com/tobiasmaatita/project/blob/master/Data/education_attainment.csv), on [the worldwide literacy rate](https://github.com/tobiasmaatita/project/blob/master/Data/literate_and_illiterate_world_population.csv) and on [the literacy rate by country](https://github.com/tobiasmaatita/project/blob/master/Data/literacy_rate_by_country.csv). The data in these two datasets is clean to use it, I will convert the .csv-files to .json-files using the converter.py, which can be found in the [scripts](https://github.com/tobiasmaatita/project/tree/master/scripts) folder.

The resulting .json-file looks like such:
```
"Australia": {
  "1870": {
    "uneducated": 50.9, "primary": 49.0, "secondary": 0.1, "tertiary": 0.0, "years of education total": 1.72, "years education primary": 1.72, "years education secondary": 0.0, "years education tertiary": 0.0, "population in thousands": 932, "region": "Advanced Economies"
    },
  "1875": {
    "uneducated": 46.3, "primary": 53.6, "secondary": 0.1, "tertiary": 0.0, "years of education total": 1.86, "years education primary": 1.86, "years education secondary": 0.0, "years education tertiary": 0.0, "population in thousands": 1075, "region": "Advanced Economies"
  }
```


## Overview technical components
The webpage will contain the following figures:
* literacy rate (interactive) on a world map. Interactivity comes from hovering
over a certain country: this will show the percentage of literate population in
the country. Needed: world map and [literacy rate data](ttps://github.com/tobiasmaatita/project/blob/master/Data/literacy_rate_by_country.csv);
* literacy rate worldwide throughout the years (static) in a line chart. Needed:
[worldwide literacy rate data](https://github.com/tobiasmaatita/project/blob/master/Data/literate_and_illiterate_world_population.csv);
* education attainment (interactive): total years of education throughout the years
shown on a world map. The interactivity comes from a slider which allows the user
to scroll through the years. Also, hovering might maybe show the total years
of education. Needed: world map and data on [worldwide education attainment](https://github.com/tobiasmaatita/project/blob/master/Data/education_attainment.csv);
* completed education: primary, secondary or tertiary per country, shown after
clicking on a country from the education attainment map. Needed: [worldwide education attainment](https://github.com/tobiasmaatita/project/blob/master/Data/education_attainment.csv).


## Functionality
The following D3 (v5) plugins are needed:
* tooltip
* worldmap
