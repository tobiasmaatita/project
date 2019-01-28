function d3Stuff() {
// Layout of the page.

  var wrapper = d5.select('.wrapper');
  wrapper.append('div')
         .attr('class', 'text')
         .attr('id', 'pageTitle')
         .text('Worldwide education throughout the years');
  wrapper.append('div')
         .attr('class', 'content')
         .attr('id', 'content');
  wrapper.append('div')
         .attr('class', 'tableOfContents');

  var content = d5.select('.content'),
      tableOfContents = d5.select('.tableOfContents');
  tableOfContents.append('h3')
                 .text('Contents');
  tableOfContents.append('ol')
                 .attr('id', 'contents');

  content.append('div')
         .attr('class', 'text')
         .attr('id', 'introduction');
  var introduction = d5.select('#introduction');
  introduction.append('h4')
              .attr('id', 'introductory-paragraph')
              .text('Introduction');
  d5.select('#introductory-paragraph')
    .append('a')
    .attr('class', 'deep-link')
    .attr('href', '#introductory-paragraph');
  introduction.append('p')
              .text('For both individuals and societies, education is regarded \
                     to be a fundamental right. In fact, nowadays, in most \
                     countries, education is not only a right, but also a duty: \
                     civilians are required to attain a basic level of education, \
                     whereas governments are expected to ensure access to education. \
                     However, the accessibility and quality of education is not \
                     equally distributed throughout the world.');
  introduction.append('p')
              .text('This page illustrates the worldwide inequality of education \
                     by first examining the literacy rates in different countries. \
                     Secondly, there will be an assessment of the worldwide \
                     educational attainment throughout the years. Navigate \
                     through the page using the table of contents on the right.');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'section')
                    .append('a')
                    .attr('href', '#introductory-paragraph')
                    .text('Introduction');

  content.append('div')
         .attr('class', 'text')
         .attr('id', 'literacy')
  var literacyText = d5.select('#literacy');
  literacyText.append('h4')
              .attr('id', 'literacy-paragraph')
              .text('Worldwide literacy rate');
  d5.select('#literacy-paragraph')
    .append('a')
    .attr('class', 'deep-link')
    .attr('href', '#literacy-paragraph');
  literacyText.append('p')
              .text('Written communication dates back to the fourth century BCE. \
                     However, for centuries, literacy remained a very limited \
                     technology, and to a large extent only a privilege associated \
                     with the exercise of power. It would not be until the Age of \
                     Enlightenment until Europe embraced the ambition of universal \
                     literacy, albeit a good two centuries until this actually happened.');
  literacyText.append('p')
              .text('The following visualisaiton illustrates the estimated literacy \
                     rates between 1800 and 2014. Hover over the dots to get the \
                     actual percentages.');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'section')
                    .append('a')
                    .attr('href', '#literacy-paragraph')
                    .text('Worldwide literacy rate');

  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'figureOne');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'subsection')
                    .append('a')
                    .attr('href', '#figureOne')
                    .text('Figure 1: worldwide literacy 1800-2014');

  content.append('div')
         .attr('class', 'text')
         .attr('id', 'literacyExplain')
            .append('p')
            .text('As shown in figure 1, the worldwide literacy rate started \
                   rising during the early twentieth century. However significant\
                   , the worldwide literacy rate is not nearly a hundred percent. \
                   In the map below, the literacy rate per country is depicted. \
                   Hover over the countries to get the literacy rate in the \
                   selected country. This representation shows the latest \
                   available data for each country.');

  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'figureTwo');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'subsection')
                    .append('a')
                    .attr('href', '#figureTwo')
                    .text('Figure 2: literacy rate by country');
  content.append('div')
         .attr('class', 'text')
         .attr('id', 'nameFigTwo')
         .append('text')
           .attr('class', 'figureName')
           .attr('id', 'figureTwoName')
           .text('Figure 2: Worldwide literacy rate, latest data');

  content.append('div')
         .attr('class', 'text')
         .attr('id', 'educationAttainment')
            .append('h4')
            .attr('id', 'attainment-paragraph')
            .text('Education Attainment')
                .append('a')
                .attr('class', 'deep-link')
                .attr('href', '#attainment-paragraph');
  content.select('#educationAttainment')
         .append('p')
         .text('The literacy rate in a country is largely influenced the \
               accessibility of education in a given country. In many countries \
               nowadays, a child is obliged to attend school for a number of years. \
               However, this was not always the case. Moreover, it still is not \
               universally the case these days. The map below shows the vast \
               difference in educational attainment - meaning the number of years \
               someone spends in school - between different regions in the world. \
               Select a country to further inspect the corresponding data. \
               Use the slider to scroll through time. Based on educational attainment, \
               the population can be divided into four categories: those who are \
               uneducated, those who have only attended primary school, those \
               whose highest level of education is secondary school, and, finally, \
               those who have attained tertiary education. The line chart shows \
               how these categories are distributed within a country throughout \
               the years. The bar chart shows the distribution in a selected year. \
               Clicking on a bar will select the corresponding line. Add other \
               lines by clicking other bars, or reset by pressing the reset button.');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'section')
                    .append('a')
                    .attr('href', '#attainment-paragraph')
                    .text('Education attainment');

  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'figureThree');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'subsection')
                    .append('a')
                    .attr('href', '#figureThree')
                    .text('Figure 3: Education attainment, 1870-2010');
  content.append('div')
         .attr('class', 'text')
         .attr('id', 'nameFigThree');
  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'slider')
           .append('div')
           .attr('class', 'row-align-items-center')
             .append('div')
             .attr('class', 'col-sm');
  content.select('.row-align-items-center')
         .append('div')
         .attr('class', 'col-sm')
            .append('div')
            .attr('id', 'slider-time');

  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'figureFour');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'subsection')
                    .append('a')
                    .attr('href', '#figureFour')
                    .text('Figure 4: Types of education');
  content.append('div')
         .attr('class', 'figure')
         .attr('id', 'figureFive');

  content.append('div')
         .attr('class', 'text')
         .attr('id', 'sources')
            .append('h4')
            .text('Sources');
  tableOfContents.select('#contents')
                 .append('li')
                 .attr('class', 'section')
                    .append('a')
                    .attr('href', '#sources')
                    .text('Sources');

  content.select('#sources')
         .append('ul')
         .attr('id', 'sourcesList')
           .append('li')
             .append('a')
             .attr('href', 'http://www.barrolee.com/Lee_Lee_LRdata_dn.htm')
             .attr('target', '_blank')
             .text('Dataset used by Lee and Lee (2016)');
  content.select('#sourcesList')
         .append('li')
           .append('a')
           .attr('href', 'http://data.uis.unesco.org/index.aspx?queryid=166&lang=en')
           .attr('target', '_blank')
           .text('UNESCO data on world literacy');

  content.append('div')
         .attr('class', 'footer')
           .append('p')
           .text('Tobias Maätita // 10730109 // Minor Programmeren // Final Project (Data Winter, 2019)');

  return;
};
