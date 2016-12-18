import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as jobActions from 'redux/modules/data';
import {initializeWithKey} from 'redux-form';
import { WidgetForm } from 'components';
// import { bindActionCreators } from 'redux';
@connect(
  state => ({
    editing: state.data.editing,
    error: state.data.error,
    loading: state.data.loading
  }),
  { initializeWithKey, ...jobActions },
)
export default class JobsWidget extends Component {
  static propTypes = {
    jobs: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    initializeWithKey: PropTypes.func.isRequired,
    editing: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    loadMe: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired
  };

  render() {
    const handleEdit = (widget) => {
      const {editStart} = this.props; // eslint-disable-line no-shadow
      return () => editStart(String(widget.id));
    };
    const {jobs, error, editing, loading, loadMe} = this.props;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const styles = require('./list.scss');
    return (
      <div className={styles.widgets + ' container'}>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <h1>
          Jobs
        </h1>
        <Helmet title="My Jobs"/>
        <p>
          Jobs added by you can be found here.
        </p>
        <p>
          You can also edit a job :)
        </p>
        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error}
        </div>}
        {jobs && jobs.length &&
        <table className="table table-striped">
          <thead>
          <tr>
            <th className={styles.idCol}>ID</th>
            <th className={styles.colorCol}>Color</th>
            <th className={styles.sprocketsCol}>Sprockets</th>
            <th className={styles.ownerCol}>Owner</th>
            <th className={styles.buttonCol}></th>
          </tr>
          </thead>
          <tbody>
          {
            jobs.map((widget) => editing[widget.id] ?
              <WidgetForm formKey={String(widget.id)} key={String(widget.id)} initialValues={widget}/> :
              <tr key={widget.id}>
                <td className={styles.idCol}>{widget.id}</td>
                <td className={styles.colorCol}>{widget.color}</td>
                <td className={styles.sprocketsCol}>{widget.sprocketCount}</td>
                <td className={styles.ownerCol}>{widget.owner}</td>
                <td className={styles.buttonCol}>
                  <button className="btn btn-primary" onClick={handleEdit(widget)}>
                    <i className="fa fa-pencil"/> Edit
                  </button>
                </td>
              </tr>)
          }
          </tbody>
        </table>}
        <button className={styles.refreshBtn + ' btn btn-success'} onClick={() => loadMe('me')}>
          <i className={refreshClassName}/> {' '} Reload Widgets
        </button>
      </div>
    );
  }
}
