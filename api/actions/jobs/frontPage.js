var Parse = require('parse/node');
var moment = require('moment');

const initialWidgets = [
  {id: 1, title: 'Mobile Application Developer', remote: false, company: 'Benny Tech', type: 'Full Time', salary: '$140,000 - $140,000', created_at: '3 days ago'}
];

function fromParseJobs(session) {
  return {
    id: session.id,
    title: session.get('title'),
    remote: session.get('allowRemote'),
    company: session.get('companyName'),
    description: session.get('description'),
    location: session.get('city'),
    salary: session.get('salary'),
    tags: session.get('tags') || [],
    created_at: session.get('createdAt') && moment(session.get('createdAt').getTime()).fromNow()
  };
}

export function getJobs(req) {
  let widgets = req.session.widgets;
  if (!widgets) {
    widgets = initialWidgets;
    req.session.widgets = widgets;
  }

  var query = new Parse.Query("Job");

  if (req.query.skip) {
    query.skip(parseInt(req.query.skip));
  }
  query.limit(4);
  return query.find().then(
  function(list) {
      return list.map(fromParseJobs);
  },function(err) {
      try{
          console.log(3);
          console.log("parse error: ", err);
          // reject(err);
      } catch(error){
          console.log(4);
          console.log(error);
      }
  });
}

export default function frontPage(req) {
  return new Promise((resolve, reject) => {
    resolve(getJobs(req));
  });
}
