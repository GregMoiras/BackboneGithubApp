BackboneGithubApp
=================

Description
===========
The BackboneGithubApp uses the Github API in order to draw data from the 7Geese public repository and render them onto the index.html.

An ajax call is used to draw data regarding the name, fork count, language used and date created for the public repositories of 7geese organization. 

Backbone is used in order to process the data coming from Github. After the processing is done the data are rendered from a template onto the index.html. Boostrap is also used for some basic table styling.

How to use
==========
You can simply download the repository and run the index.html file.
If you like you can change the url variable inside the DataList View, in order to load other Github user/organization data.

url: 'https://api.github.com/users/7geese/repos'

