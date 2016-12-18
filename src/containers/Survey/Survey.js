import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {initialize} from 'redux-form';
import {SurveyForm} from 'components';
import { push } from 'react-router-redux';
import {create} from 'redux/modules/data';

@connect(
  (state) => ({
    created: state.data.created
  }),
  {initialize, create, pushState: push})
export default class Survey extends Component {
  static propTypes = {
    initialize: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    created: PropTypes.bool,
    pushState: PropTypes.func.isRequired
  }

  state = {
    content: ''
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

  handleInitialize = () => {
    this.props.initialize('survey', {
      title: 'Little Bobby Tables',
      companyEmail: 'bobby@gmail.com',
      companyName: 'Bobby Biggs',
      salary: 'Redux Wizard',
      allowRemote: true,
      city: 'Sex in the city',
      howToApply: 'Send a resume to thapelo@company.com'
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
    const {created} = this.props;
    return (
      <div className="container">
        <p>
          Your job listing will remain on this site for 30 days. After 30 days your job listing will expire and be removed.
        </p>
        <h1>Step 1: Create your Ad</h1>
        <Helmet title="Step 1: Create your Ad"/>
        <hr/>
        <h3>First tell us about the position</h3>
        <p>
          If you need a <code>programmer</code> please use keywords like <code>android</code>, <code>web</code>, <code>apps</code>, <code>data science</code>
        </p>

        <div style={{textAlign: 'center', margin: 15}}>
          <button className="btn btn-primary" onClick={this.handleInitialize}>
            <i className="fa fa-pencil"/> Initialize Form
          </button>
        </div>
        {created ? <div style={{textAlign: 'center', margin: 15}}><h2 className="text-success">Job saved successfully!</h2></div> :
        <SurveyForm onSubmit={this.handleSubmit} onEditorChange={this.handleEditorChange}/>}
      </div>
    );
  }
}
