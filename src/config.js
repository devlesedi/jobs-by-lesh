require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: 'Jobs 4 Geeks',
    description: 'A Sample Heroku Application',
    head: {
      titleTemplate: 'Jobs 4 Geeks: %s',
      meta: [
        {name: 'description', content: 'A Sample Heroku Application'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'Jobs 4 Geeks'},
        {property: 'og:image', content: 'https://avatars2.githubusercontent.com/u/7551308?v=3&s=460'},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: 'Jobs 4 Geeks'},
        {property: 'og:description', content: 'A Sample Heroku Application.'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@devlesedi'},
        {property: 'og:creator', content: '@devlesedi'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },

}, environment);
