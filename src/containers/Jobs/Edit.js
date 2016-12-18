import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {initialize} from 'redux-form';
import {SurveyForm} from 'components';
import { asyncConnect } from 'redux-async-connect';
import { push } from 'react-router-redux';
import {create} from 'redux/modules/data';
import {isJobLoaded, get as getJob} from 'redux/modules/data';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isJobLoaded(getState())) {
      return dispatch(getJob('wee'));
    }
  }
}])
@connect(
  (state) => ({
    job: state.data.job,
    created: state.data.created
  }),
  {initialize, create, pushState: push})
export default class EditJob extends Component {
  static propTypes = {
    initialize: PropTypes.func.isRequired,
    job: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    created: PropTypes.bool,
    pushState: PropTypes.func.isRequired
  }

  state = {
    content: ''
  }

  componentDidMount() {
    const {job} = this.props;
    // console.log('componentDidMount:params', params);
    // console.log('componentDidMount:job', job);
    if (job) {
      this.props.initialize('survey', job);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {params, job} = this.props;
    console.log('componentWillReceiveProps:params', params);
    if (this.props.job !== nextProps.job) {
      this.props.initialize('survey', job);
    }
  }

  handleSubmit = (data) => {
    const handleOnSuccess = () => {
      setTimeout(() => {
        this.props.initialize('survey', {});
        this.props.pushState('/');
      }, 3000);
    };
    data.description = this.state.content;
    console.log('Data submitted! ' + JSON.stringify(data));
    this.props.create(data)
    .then(response => {
      handleOnSuccess();
      console.log(response);
    })
    .catch((error) => {
      console.log('ok then error', error);
    });
  }

  handleEditorChange = (content) => {
    if (content) {
      this.setState({
        content
      });
    }
  }

  render() {
    const {created, job} = this.props;
    return (
      <div className="container">
        <p>
          Here you can edit your listing
        </p>
        <h1>{`Edit Job: ${job.title}`}</h1>
        <Helmet title={`Edit Job: ${job.title}`}/>
        <hr/>
        {created ? <div style={{textAlign: 'center', margin: 15}}><h2 className="text-success">Job saved successfully!</h2></div> :
        <SurveyForm onSubmit={this.handleSubmit} onEditorChange={this.handleEditorChange}/>}
      </div>
    );
  }
}
