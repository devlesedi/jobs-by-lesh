import React, {Component} from 'react';
import Helmet from 'react-helmet';

export default class About extends Component {

  state = {
    showKitten: false
  }

  handleToggleKitten = () => this.setState({showKitten: !this.state.showKitten});

  render() {
    const {showKitten} = this.state;
    const kitten = require('./kitten.jpg');
    return (
      <div className="container">
        <h1>About Us</h1>
        <Helmet title="About Us"/>
        <ul>
          <li>
            <del>Isomorphic</del>
            {' '}
            <a href="https://medium.com/@mjackson/universal-javascript-4761051b7ae9">Universal</a> rendering
          </li>
          <li>Both client and server make calls to load data from separate API server</li>
          <li><a href="https://github.com/facebook/react" target="_blank">React</a></li>
          <li><a href="https://github.com/rackt/react-router" target="_blank">React Router</a></li>
          <li><a href="http://expressjs.com" target="_blank">Express</a></li>
          <li><a href="http://babeljs.io" target="_blank">Babel</a> for ES6 and ES7 magic</li>
          <li><a href="http://webpack.github.io" target="_blank">Webpack</a> for bundling</li>
          <li><a href="http://webpack.github.io/docs/webpack-dev-middleware.html" target="_blank">Webpack Dev Middleware</a>
          </li>
          <li><a href="https://github.com/glenjamin/webpack-hot-middleware" target="_blank">Webpack Hot Middleware</a></li>
          <li><a href="https://github.com/rackt/redux" target="_blank">Redux</a>'s futuristic <a
            href="https://facebook.github.io/react/blog/2014/05/06/flux.html" target="_blank">Flux</a> implementation
          </li>
          <li><a href="https://github.com/gaearon/redux-devtools" target="_blank">Redux Dev Tools</a> for next
            generation DX (developer experience).
            Watch <a href="https://www.youtube.com/watch?v=xsSnOQynTHs" target="_blank">Dan Abramov's talk</a>.
          </li>
          <li><a href="https://github.com/rackt/redux-router" target="_blank">Redux Router</a> Keep
            your router state in your Redux store
          </li>
          <li><a href="http://eslint.org" target="_blank">ESLint</a> to maintain a consistent code style</li>
          <li><a href="https://github.com/erikras/redux-form" target="_blank">redux-form</a> to manage form state
            in Redux
          </li>
          <li><a href="https://github.com/erikras/multireducer" target="_blank">multireducer</a> combine several
            identical reducer states into one key-based reducer</li>
          <li><a href="https://github.com/webpack/style-loader" target="_blank">style-loader</a> and <a
            href="https://github.com/jtangelder/sass-loader" target="_blank">sass-loader</a> to allow import of
            stylesheets
          </li>
          <li><a href="https://github.com/shakacode/bootstrap-sass-loader" target="_blank">bootstrap-sass-loader</a> and <a
            href="https://github.com/gowravshekar/font-awesome-webpack" target="_blank">font-awesome-webpack</a> to customize Bootstrap and FontAwesome
          </li>
          <li><a href="http://socket.io/">socket.io</a> for real-time communication</li>
        </ul>

        <h3>Images</h3>

        <p>
          Psst! Would you like to see a kitten?

          <button className={'btn btn-' + (showKitten ? 'danger' : 'success')}
                  style={{marginLeft: 50}}
                  onClick={this.handleToggleKitten}>
            {showKitten ? 'No! Take it away!' : 'Yes! Please!'}</button>
        </p>

        {showKitten && <div><img src={kitten}/></div>}
      </div>
    );
  }
}
