import React, { Component, PropTypes } from 'react';
// import { Link } from 'react-router';
import { CounterButton } from 'components';
// import config from '../../config';
import Helmet from 'react-helmet';
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
  };

  viewJob(id) {
    this.props.dispatch(push(`/job/${id}`));
  }

  loadMore() {
    // this.props.onScrollToBottom();
  }

  render() {
    const {jobs} = this.props;
    const styles = require('./Home.scss');
    // require the logo image both from client and server
    // const logoImage = require('./logo.png');
    return (
      <div className={styles.home}>
        <Helmet title="Home"/>

        <div className="container">
          <div className={styles.counterContainer}>
            <CounterButton multireducerKey="counter1"/>
            <CounterButton multireducerKey="counter2"/>
            <CounterButton multireducerKey="counter3"/>
          </div>

          <div className="margin-top-medium">
            <div className="row">
              <div className="col-md-12">
                {jobs && jobs.map(item => {
                  return (<ul key={item.id} className="list-group partner_list">
                    <a onClick={this.viewJob.bind(this, item.id)}>
                      <li id="partner_ad_713" className="partner_ad list-group-item">
                        <i className="fa fa-external-link pull-right"></i>
                        <span className="badge">
                          <span className="job_type">Job Type</span>
                          <span className="badge_pipe"> | </span>
                          <span className="job_location">{item.remote ? 'Remote' : item.location}</span>
                        </span>
                        <h4 className="list-group-item-heading">
                          <b className="title">{item.title}</b>
                          <span className="company">{` at ${item.company}`}</span>
                        </h4>
                        <p className="subtitle list-group-item-text">subtitle</p>
                      </li>
                    </a>
                  </ul>);
                })}
              </div>
            </div>
          </div>
          <div className="margin-top-medium text-center">
              <button className="btn btn-default" onClick={this.loadMore}>Load More</button>
          </div>
        </div>
      </div>
    );
  }
}
