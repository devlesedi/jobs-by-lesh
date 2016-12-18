import Component from 'components/component';
import React, {PropTypes} from 'react';
// import { Link } from 'react-router';
import cx from 'classnames';
// import velocity from 'velocity-animate';
// import {findDOMNode} from 'react-dom';
// import { push } from 'react-router-redux';
import ALink from 'components/a';
import ContentHeader from 'components/content-header';
import EditableTitle from 'components/editable-title';
import ContentHeaderActions from 'components/content-header-actions';
// import ContentLoading from '../../components/content-loading';
import ContentSidebar from 'components/content-sidebar';
import Employer from './Employer';
import JobList from 'components/jobs-list';

import styles from './page.less';

export default class MeView extends Component {

  static propTypes = {
    pageId: PropTypes.string.isRequired,
    jobs: PropTypes.array,
    location: PropTypes.object.isRequired,
    pathname: PropTypes.string,
    loading: PropTypes.bool,
    updateTitle: PropTypes.func.isRequired,
    updateSlug: PropTypes.func.isRequired,
    statusText: PropTypes.string,
    type: PropTypes.string,
    sidebar: PropTypes.string,
    togglePageSeeker: PropTypes.func,
    togglePageEmployer: PropTypes.func
  };

  static defaultProps = {
    page: {}
  };

  componentWillReceiveProps(nextProps) {
    const {location} = this.props;
    const oldBuild = location.query.build;
    const currentBuild = nextProps.location.query.build;

    if (this.props.pageId !== nextProps.pageId) {
      this.setState({
        build: location.query.build && true
      });
    }

    if (oldBuild !== currentBuild) {
      const config = {
        duration: 800,
        display: null,
        easing: 'easeOutExpo'
      };
      if (config) {
        // yep
      }
      if (currentBuild) {
        // velocity(this.refs.content, {top: '0px'}, config);
        // velocity(findDOMNode(this.refs.header), {translateY: '-70px'}, config);
        // velocity(findDOMNode(this.refs.cover), {opacity: 0}, Object.assign({}, config, {display: 'none'}));
      } else {
        // velocity(this.refs.content, {top: '70px'}, config);
        // velocity(findDOMNode(this.refs.header), {translateY: '0px'}, config);
        // velocity(findDOMNode(this.refs.cover), {opacity: 1}, Object.assign({}, config, {display: 'block'}));
      }
    }
  }

  getInitState() {
    const {location} = this.props;
    return {
      build: location.query.build && true
    };
  }

  closeAdminMenu() {

  }

  openAdminMenu() {

  }

  renderContent() {
    const {location, updateTitle, updateSlug, togglePageEmployer, togglePageSeeker, sidebar, jobs} = this.props;

    return (
        <div className={cx(this.state.build && styles.build)}>
          <ContentHeader smallPadding ref="header">
            <div className={styles.info}>
              <EditableTitle value={'title'} onSubmit={updateTitle} />
              <EditableTitle sub value={'page-slug'} onSubmit={updateSlug} />
            </div>
            <ContentHeaderActions>
              <button
                className={cx(styles.actionButton, sidebar === 'seeker' && styles.active)}
                onClick={togglePageSeeker}
              >
                <i className="nc-icon-outline ui-2_time"></i>
              </button>
              <button
                className={cx(styles.actionButton, sidebar === 'employer' && styles.active)}
                onClick={togglePageEmployer}
              >
                <i className="nc-icon-outline travel_info"></i>
              </button>
            </ContentHeaderActions>
          </ContentHeader>
          <div className={styles.content} ref="content">
            <JobList jobs={jobs} />
            <ALink href={location.pathname} query={{build: 1}} className={styles.cover} ref="cover">
              <div className={styles.coverContent}>
                <i className="nc-icon-outline fa fa-person design_design"></i>
                <div>Your profile</div>
              </div>
            </ALink>
            {this.renderSidebar()}
          </div>
        </div>
    );
  }

  renderSidebar() {
    const {sidebar} = this.props;
    const opened = sidebar !== null && !this.props.location.query.build;
    return (
      <ContentSidebar opened={opened}>
        {this.renderSidebarContent()}
      </ContentSidebar>
    );
  }

  renderSidebarContent() {
    const {sidebar, pathname} = this.props;
    let result;

    if (sidebar === 'employer') {
      result = (
        <Employer
          pathname={pathname}
          closeAdminMenu={this.closeAdminMenu}
          openAdminMenu={this.openAdminMenu}/>
      );
    } else if (sidebar === 'seeker') {
      result = (
        <div>Seeker</div>
      );
    }

    return result;
  }

  render() {
    const {loading} = this.props;
    let result;

    if (loading) {
      result = (
        <div>ContentLoading</div>
      );
    } else {
      result = this.renderContent();
    }

    return result;
  }
}
