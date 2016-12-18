import React from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
// import { push } from 'react-router-redux';
import tomb from 'tcomb-form';
import Editor from 'components/Editor';
// import { asyncConnect } from 'redux-async-connect';

// import * as actionCreators from 'actions/auth';
// import {createJob} from 'actions/jobs';


const Form = tomb.form.Form;

const Job = tomb.struct({
  jobTitle: tomb.String,
  location: tomb.String,
  remote: tomb.Boolean,
  salary: tomb.String,
  tags: tomb.list(tomb.String)
});

const LoginFormOptions = {
  help: <i>First, tell us about the position</i>,
  fields: {
    jobTitle: {
      label: 'Job Title',
      help: '\"Technical Writer\" or \"Java Programmer\"'
    },
    location: {
      label: 'City/Town',
      help: '\"Gaborone\", \"Phakalane\"'
    },
    remote: {
      label: 'Remote',
      help: 'Allow telecommutin?'
    },
    salary: {
      help: 'Optional. P100,000-110,000'
    },
    tags: {
      help: '\"Data Science\", \"JavaScript\", \"Front-end\"'
    }
  }
};

// @asyncConnect([{
  // deferred: true,
  // promise: ({store: {dispatch, getState}}) => {
    // if (!isLoaded(getState())) {
      // return dispatch(loadWidgets());
    // }
  // }
// }])
@connect(
  state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isAuthenticating: state.auth.isAuthenticating,
    statusText: state.auth.statusText
  }),
  {
    // ...actionCreators
  })
export default class SubmitJobView extends React.Component {

  static propTypes = {
    isAuthenticated: React.PropTypes.bool.isRequired,
    isAuthenticating: React.PropTypes.bool.isRequired,
    statusText: React.PropTypes.string,
    actions: React.PropTypes.shape({
      authLoginUser: React.PropTypes.func.isRequired,
    }).isRequired,
    location: React.PropTypes.shape({
      query: React.PropTypes.object.isRequired
    })
  };

  constructor(props) {
    super(props);

    const redirectRoute = this.props.location ? this.props.location.query.next || '/' : '/';
    this.state = {
      formValues: {
        title: '',
        location: ''
      },
      content: '',
      redirectTo: redirectRoute
    };
  }

  componentWillMount() {
    // check if logged in
    // if (!this.props.isAuthenticated) {
    //     this.props.dispatch(push('/login'));
    // }
  }

  onFormChange = (value) => {
    this.setState({ formValues: value });
  };

  onEditorChange = (value) => {
    this.setState({
      content: value
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const value = this.submitForm.getValue();
    if (value) {
      // const post = Object.assign({}, value, {jobDescription: this.state.content});
      // this.props.actions.authLoginUser(value.email, value.password, this.state.redirectTo);
      // this.props.dispatch(createJob(post));
    }
  };

  render() {
    let statusText = null;
    if (this.props.statusText) {
      const statusTextClassNames = classNames({
        'alert': true,
        'alert-danger': this.props.statusText.indexOf('Authentication Error') === 0,
        'alert-success': this.props.statusText.indexOf('Authentication Error') !== 0
      });

      statusText = (
        <div className="row">
            <div className="col-sm-12">
              <div className={statusTextClassNames}>
                {this.props.statusText}
              </div>
            </div>
        </div>
      );
    }

    return (
      <div>
        <div className="preview">
          <div className="login">
            <h2 className="text-center">Step 1: Create your Ad</h2>
            <div className="login-container margin-top-medium">
                {statusText}
                <form onSubmit={this.onSubmit}>
                  <Form ref={(ref) => { this.submitForm = ref; }}
                    type={Job}
                    options={LoginFormOptions}
                    value={this.state.formValues}
                    onChange={this.onFormChange}
                  />
                  <button disabled={this.props.isAuthenticating}
                    type="submit"
                    className="btn btn-default btn-block">
                    Submit
                  </button>
                </form>
              </div>
          </div>
        </div>
        <div className="editor">
          <Editor onEditorChange={this.onEditorChange} />
        </div>
      </div>
    );
  }
}
