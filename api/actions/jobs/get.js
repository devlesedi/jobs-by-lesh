var Parse = require('parse/node');
var moment = require('moment');

function getJob(id) {

  var query = new Parse.Query("Job");

  return query.get(id, {
    success: function(object) {
      return object;
    },

    error: function(object, error) {
      return;
    }
  });
}

export default function get(req) {
  return new Promise((resolve, reject) => {
    var idMatch = req.url.match(/\/jobs\/get\/([0-9A-Za-z]{10}$)/i)
    if (idMatch) {
      var id = idMatch[1];
      resolve(getJob(id));
    } else {
      reject("Nope!");
    }
  });
}
