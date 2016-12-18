export default function get(req) {
  return new Promise((resolve, reject) => {
    let job = {
      "id": "4dfg99sd",
      "allowRemote": true,
      "city":"Sex in the city",
      "companyEmail":"bobby@gmail.com",
      "companyName":"Bobby Biggs",
      "description":"<div>jkjkj</div>",
      "howToApply":"Send a resume to thapelo@company.com",
      "salary":"Redux Wizard",
      "title":"Little Bobby Tables"
    };
    // TODO: This matches evevrything :(
    var idMatch = req.url.match(/\/jobs\/get\/([0-9a-z]{2})/g)
    var id = RegExp.$1
    if (idMatch) {
      console.log('params', id);
      resolve(job);
    } else {
      reject("Nope!");
    }
  });
}
