"use strict";

var request = require('request'),
  fs = require('fs'),
  open = require('open'),
  marked = require('marked'),
  htmlEncode = require('htmlencode').htmlEncode,
  config = require('./config.js');

(function() {
  var projectId = config.projectId;

  if(projectId !== undefined) {
    var project_id = parseInt(projectId);
    request.get('https://agilezen.com/api/v1/projects/' + projectId + '/stories?with=details,tags,tasks', config.API.requestOptions, function(error, response, body) {
      if(error) {console.log(error);}

      var bodyAsJSON = JSON.parse(body);
      var cleanStories = [];

      var markedOptions = {
        sanitize : true,
        gfm: true
      };

      bodyAsJSON.items.forEach(function(story) {
        cleanStories.push({
          id: story.id,
          text: htmlEncode(story.text),
          details: marked(story.details, markedOptions),
          size: story.size,
          priority: story.priority,
          project: htmlEncode(story.project.name)
        });
      });

      var cleanStoriesAsString = JSON.stringify(cleanStories);

      fs.readFile('./static/index.html',  {encoding: 'utf8'} , function (err,data) {
        if (err) {
          return console.log(err);
        }

        var result = data.replace(/{{dataArray}}/g, cleanStoriesAsString);
        var tempDirectoryName = './tmp/';

        fs.open(tempDirectoryName, 'r', function(err, fd) {

          if(err) {
            fs.mkdirSync(tempDirectoryName);
          }

          var outputName = tempDirectoryName + Math.floor(Date.now() / 1000) + '.html';

          fs.writeFile(outputName, result, {encoding: 'utf8'} , function (err) {
            if (err) return console.log(err);
            open(outputName, function(err) {
              if(err) throw err;
            });
          });
        });
      });
    });
   }
})();