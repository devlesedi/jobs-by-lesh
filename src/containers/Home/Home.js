import React, { Component, PropTypes } from 'react';
// import { Link } from 'react-router';
// import config from '../../config';
import Helmet from 'react-helmet';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Button from 'react-bootstrap/lib/Button';
import { push } from 'react-router-redux';
import {connect} from 'react-redux';
import {isFrontLoaded, load as loadJobs} from 'redux/modules/data';
import * as jobActions from 'redux/modules/data';
import {initializeWithKey} from 'redux-form';
import { asyncConnect } from 'redux-async-connect';
import { bindActionCreators } from 'redux';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isFrontLoaded(getState())) {
      return dispatch(loadJobs('home'));
    }
  }
}])
@connect(
  state => ({
    jobs: state.data.home,
    loading: state.data.loading
  }),
  (dispatch) => bindActionCreators({initializeWithKey, ...jobActions }, dispatch),
)
export default class Home extends Component {
  static propTypes = {
    jobs: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    dispatch: PropTypes.func,
    initializeWithKey: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    loadMore: PropTypes.func.isRequired,
  };

  viewJob(id) {
    this.props.dispatch(push(`/job/${id}`));
  }

  goToAboutPage() {
    this.props.dispatch(push('/about'));
  }

  render() {
    const {jobs, loadMore} = this.props;
    const styles = require('./Home.scss');
    // require the logo image both from client and server
    // const logoImage = require('./logo.png');
    return (
      <div className={styles.home}>
        <Helmet title="Home"/>

        <div className="container">
          <Jumbotron>
            <h1>Hello, world!</h1>
            <p>This is a simple job posting web app built using React, Redux, Webpack, and a Parse backend</p>
            <p><Button bsStyle="primary" onClick={this.goToAboutPage.bind(this)}>Learn more</Button></p>
          </Jumbotron>
          <div className="margin-top-medium">
            <div className="row">
              <div className="col-md-12">
                {jobs && jobs.map(item => {
                  return (<ul key={item.id} className="list-group partner_list">
                    <a onClick={this.viewJob.bind(this, item.id)}>
                      <li id="partner_ad_713" className="partner_ad list-group-item">
                        <i className="fa fa-external-link pull-right"></i>
                        <span className="badge">
                          <span className="job_type">{item.type}</span>
                          <span className="badge_pipe"> | </span>
                          <span className="job_location">{item.remote ? 'Remote' : item.location}</span>
                        </span>
                        <h4 className="list-group-item-heading">
                          <b className="title">{item.title}</b>
                        </h4>
                        <p className="subtitle list-group-item-text">{` at ${item.company}`} {item.salary ? ` | ${item.salary}` : '' } {item.created_at ? ` | ${item.created_at}` : '' }</p>
                      </li>
                    </a>
                  </ul>);
                })}
              </div>
            </div>
          </div>
          <div className="margin-top-medium text-center">
              <button className="btn btn-default" onClick={loadMore}>Load More</button>
          </div>
        </div>
      </div>
    );
  }
}
