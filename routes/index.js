var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');

var baseUrl = 'http://swapi.co/api/';

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/character/:name', function(req, res) {

  request(baseUrl + 'people/' + '?search=' + req.params.name, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body).results[0];

      res.render('character', {
          title: 'Character Profile',
          name: data.name,
          born: data.birth_year,
          eyes: data.eye_color,
          gender: data.gender,
          hair: data.hair_color,
          height: data.height,
          mass: data.mass,
          skin: data.skin_color,
          home: data.homeworld,
          films: data.films,
          species: data.species,
          starships: data.starships,
          vehicles: data.vehicles,
          url: data.url,
          created: data.created,
          edited: data.edited
      });
    }
    else {
      res.send(error)
    }
  })

});

router.get('/characters', function(req, res) {

    var sortParameter = req.query.sort;

    async.parallel({
        page1: callback => _makeRequest((err, result) => callback(err, result), baseUrl + 'people/', 1, null),
        page2: callback => _makeRequest((err, result) => callback(err, result), baseUrl + 'people/', 2, null),
        page3: callback => _makeRequest((err, result) => callback(err, result), baseUrl + 'people/', 3, null),
        page4: callback => _makeRequest((err, result) => callback(err, result), baseUrl + 'people/', 4, null),
        page5: callback => _makeRequest((err, result) => callback(err, result), baseUrl + 'people/', 5, null)

    }, function(err, results) {
        if (err) {
            res.json(err);
        }
        else {
            var characters = results.page1.results.concat(results.page2.results, results.page3.results, results.page4.results, results.page5.results);
            var data = {};

            if (sortParameter) {
                characters.sort(function (a, b) {
                  switch(sortParameter) {
                    case 'name':
                      if(a.name < b.name) return -1;
                      if(a.name > b.name) return 1;
                      return 0;
                      break;

                      case 'mass':
                        if (a.mass == "unknown" && b.mass == 'unknown')
                            return 0;
                        else if (a.mass == "unknown")
                            return -1;
                        else if (b.mass == 'unknown')
                            return 1;
                        else if (parseInt(a.mass.replace(/\,/g, '')) < parseInt(b.mass.replace(/\,/g, '')))
                            return -1;
                        else if (parseInt(a.mass.replace(/\,/g, '')) > parseInt(b.mass.replace(/\,/g, '')))
                            return 1;
                        else
                            return 0;
                      break;

                    case 'height':
                        if (a.height == "unknown" && b.height == 'unknown')
                            return 0;
                        else if (a.height == "unknown")
                            return -1;
                        else if (b.height == 'unknown')
                            return 1;
                        else if (parseInt(a.height.replace(/\,/g, '')) < parseInt(b.height.replace(/\,/g, '')))
                            return -1;
                        else if (parseInt(a.height.replace(/\,/g, '')) > parseInt(b.height.replace(/\,/g, '')))
                            return 1;
                        else
                            return 0;
                        break;

                    default:
                      break;

                  }
                });
            }

            data.characters = characters;

            // Return raw JSON, don't do view
            res.json(data);
        }
    });

});

router.get('/planetresidents', function(req, res, next) {

  var dict = {};

    async.parallel({
        page1: callback => _makeRequest((err, result) => callback(err, result), baseUrl + 'planets/', 1, null),
        page2: callback => _makeRequest((err, result) => callback(err, result), baseUrl + 'planets/', 2, null),
        page3: callback => _makeRequest((err, result) => callback(err, result), baseUrl + 'planets/', 3, null),
        page4: callback => _makeRequest((err, result) => callback(err, result), baseUrl + 'planets/', 4, null),
        page5: callback => _makeRequest((err, result) => callback(err, result), baseUrl + 'planets/', 5, null),
        page6: callback => _makeRequest((err, result) => callback(err, result), baseUrl + 'planets/', 6, null),
        page7: callback => _makeRequest((err, result) => callback(err, result), baseUrl + 'planets/', 7, null)

    }, function(err, results) {
        if (err) {
            res.json(err);
        }
        else {
            var planets = results.page1.results.concat(results.page2.results, results.page3.results, results.page4.results, results.page5.results, results.page6.results, results.page7.results);
            //var people =  results.people1.results
            var data = {};
            for(var i=0;i<planets.length;i++) {
                //var people = [];
                //for (var j=0;j<planets[i].residents.length;j++) {
                //    //console.log("here");
                //    //var person = _makeRequest((err, result) => callback(err, result), planets[i].residents[j], null, null);
                //    //console.log(person);
                //    //people.push(person.name);
                //    request(planets[i].residents[j], function (error, response, body) {
                //        if (!error && response.statusCode == 200) {
                //            people.push(JSON.parse(body).results);
                //
                //        }
                //        else {
                //            res.send(error)
                //        }
                //    })
                //}
                dict[planets[i].name] = planets[i].residents;
            }

            res.json(dict);
        }
    });

});

function _makeRequest(callback, uri, page, sort) {

    var endpoint = uri;

    if (page || sort)
        endpoint = endpoint + "?";

    endpoint = page? endpoint + "page=" + page : endpoint;
    endpoint = sort? endpoint + "sort=" + sort : endpoint;

    let reqOptions = {
        method: 'GET',
        uri: endpoint
    };
    require('request')(reqOptions, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            if (body.length > 0) {
                callback(null, JSON.parse(body));
            }
            else {
                let error = {};
                error.statusCode = 404;
                error.message = "Page not found at url: " + endpoint;
                callback(error, null);
            }
        }
        else {
            let error = {};
            error.statusCode = response ? response.statusCode : 500;
            error.message = body || 'unknown error from API';
            callback(error, null);
        }
    });
}

module.exports = router;
