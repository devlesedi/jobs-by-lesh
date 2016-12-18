import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import surveyValidation from './surveyValidation';
import * as surveyActions from 'redux/modules/survey';
import Editor from 'components/Editor';

function asyncValidate(data, dispatch, {isValidEmail}) {
  if (!data.email) {
    return Promise.resolve({});
  }
  return isValidEmail(data);
}
@connect((state) => ({
  createError: state.data.createError
}),
  dispatch => bindActionCreators(surveyActions, dispatch)
)
@reduxForm({
  form: 'survey',
  fields: ['title', 'city', 'salary', 'allowRemote', 'howToApply', 'companyName', 'companyUrl', 'companyEmail'],
  validate: surveyValidation,
  asyncValidate,
  asyncBlurFields: ['email']
})
export default
class SurveyForm extends Component {
  static propTypes = {
    active: PropTypes.string,
    asyncValidating: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    createError: PropTypes.string,
    onEditorChange: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired
  }

  render() {
    const {
      createError,
      asyncValidating,
      // dirty,
      fields: {title, city, salary, allowRemote, howToApply, companyName, companyUrl, companyEmail},
      // active,
      handleSubmit,
      // invalid,
      resetForm,
      // pristine,
      // valid
      } = this.props;
    const styles = require('./SurveyForm.scss');
    const renderInput = (field, label, showAsyncValidating) =>
      <div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <label htmlFor={field.name} className="col-sm-2">{label}</label>
        <div className={'col-sm-8 ' + styles.inputGroup}>
          {showAsyncValidating && asyncValidating && <i className={'fa fa-cog fa-spin ' + styles.cog}/>}
          <input type="text" className="form-control" id={field.name} {...field}/>
          {field.error && field.touched && <div className="text-danger">{field.error}</div>}
          <div className={styles.flags}>
            {field.dirty && <span className={styles.dirty} title="Dirty">D</span>}
            {field.active && <span className={styles.active} title="Active">A</span>}
            {field.visited && <span className={styles.visited} title="Visited">V</span>}
            {field.touched && <span className={styles.touched} title="Touched">T</span>}
          </div>
        </div>
      </div>;

    return (
      <div>
        {createError && <div className="text-danger">{createError}</div>}
        <form className="form-horizontal" onSubmit={handleSubmit}>
          {renderInput(title, 'Job Title')}
          {renderInput(city, 'City/Town', true)}
          {renderInput(salary, 'Salary (optional)')}
          <div className="form-group">
            <label htmlFor="allowRemote" className="col-sm-2">Allow telecommuting?</label>
            <div className="col-sm-8">
              <input type="checkbox" id="allowRemote" {...allowRemote}/>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-10">
              <label className="">Job Description</label>
              <Editor onEditorChange={this.props.onEditorChange}/>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-10">
              <label className="">How do people apply for this job?</label>
              <span className="help-block">Example: Send a resume to thapelo@company.com</span>
              <textarea className="form-control" id="howToApply" {...howToApply}></textarea>
            </div>
          </div>
          <hr/>
          <h3>Tell us about your company</h3>
          {renderInput(companyName, 'Company Name', true)}
          {renderInput(companyUrl, 'URL', true)}
          {renderInput(companyEmail, 'Email', true)}

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-success" onClick={handleSubmit}>
                <i className="fa fa-paper-plane"/> Submit
              </button>
              <button className="btn btn-warning" onClick={resetForm} style={{marginLeft: 15}}>
                <i className="fa fa-undo"/> Reset
              </button>
            </div>
          </div>
        </form>

        { /* <h4>Props from redux-form</h4>

        <table className="table table-striped">
          <tbody>
          <tr>
            <th>Active Field</th>
            <td>{active}</td>
          </tr>
          <tr>
            <th>Dirty</th>
            <td className={dirty ? 'success' : 'danger'}>{dirty ? 'true' : 'false'}</td>
          </tr>
          <tr>
            <th>Pristine</th>
            <td className={pristine ? 'success' : 'danger'}>{pristine ? 'true' : 'false'}</td>
          </tr>
          <tr>
            <th>Valid</th>
            <td className={valid ? 'success' : 'danger'}>{valid ? 'true' : 'false'}</td>
          </tr>
          <tr>
            <th>Invalid</th>
            <td className={invalid ? 'success' : 'danger'}>{invalid ? 'true' : 'false'}</td>
          </tr>
          </tbody>
        </table> */ }
      </div>
    );
  }
}
