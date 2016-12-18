import Component from 'components/component';
import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import * as meActions from 'redux/modules/me';
import {isLoaded, loadMe as loadMyJobs} from 'redux/modules/data';
import Page from './page';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadMyJobs('me'));
    }
  }
}])
@connect(
  state => ({
    // pageId: state.router.params.id || 'me',
    pageId: 'me',
    userName: state.auth.userName,
    jobs: state.data.myJobs,
    statusText: state.auth.statusText,
    sidebar: 'employer',
    loading: false, // TODO,
    pathname: state.routing.locationBeforeTransitions.pathname
  }),
  {...meActions}
)
export default class MeView extends Component {

  static propTypes = {
    pageId: PropTypes.string.isRequired,
    location: PropTypes.object,
    loading: PropTypes.bool,
    jobs: PropTypes.array,
    updatePageTitle: PropTypes.func.isRequired,
    updatePageSlug: PropTypes.func.isRequired,
    statusText: PropTypes.string,
    page: PropTypes.object
  };

  static defaultProps = {
    page: {}
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.pageId !== nextProps.pageId) {
      this.setState({
        sidebar: null
      });
    }

    const oldBuild = this.props.location.query.build;
    const currentBuild = nextProps.location.query.build;
    if (oldBuild !== currentBuild || this.props.pageId !== nextProps.pageId) {
      this.processTab(nextProps);
    }
  }

  getInitState() {
    this.processTab(this.props);
    return {
      sidebar: null
    };
  }

  processTab(props) {
    const currentBuild = props.location.query.build;
    if (currentBuild) {
      // this.props.addTab('page', props.pageId);
    }
  }

  // @bind
  updateTitle(title) {
    // const {page} = this.props;
    return this.props.updatePageTitle(title);
  }

  // @bind
  updateSlug(slug) {
    // const {page} = this.props;
    return this.props.updatePageSlug(slug);
  }

  // @bind
  togglePageSeeker() {
    const {sidebar} = this.state;
    this.setState({
      sidebar: sidebar === 'seeker' ? null : 'seeker'
    });
  }

  // @bind
  togglePageEmployer() {
    const {sidebar} = this.state;
    this.setState({
      sidebar: sidebar === 'employer' ? null : 'employer'
    });
  }

  render() {
    const {page, location, loading, pageId, jobs} = this.props;
    return (<Page
      {...this.state}
      jobs={jobs}
      page={page}
      pageId={pageId}
      location={location}
      loading={loading}
      updateTitle={this.updateTitle}
      updateSlug={this.updateSlug}
      togglePageSeeker={this.togglePageSeeker}
      togglePageEmployer={this.togglePageEmployer}
    />
    );
  }
}
