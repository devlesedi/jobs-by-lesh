var Parse = require('parse/node');

const Job = Parse.Object.extend('Job');

export default function create(req) {
  return new Promise((resolve, reject) => {

    //write to database
    const body = req.body;
    //validations
    // if (job.city === 'wysiwyg') {
    //   reject('We do not accept jobs from wysiwyg xD');
    // }
    const newJob = new Job(body);
      return newJob.save()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error('error', error);
          if (error.response.status === 401) {
            // handle unauthorized
          }
          reject(error);
        })
  });
}
