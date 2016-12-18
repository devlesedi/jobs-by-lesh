import BaseComponent from '../component';
import React, { PropTypes } from 'react';

import CommentForm from './comment-form/CommentForm';
// import CommentList from './Comment-list/CommentList';
import css from './comment-box.scss';

export default class CommentBox extends BaseComponent {
  static propTypes = {
    pollInterval: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { fetchComments } = this.props.actions;
    fetchComments();
    this.intervalId = setInterval(fetchComments, this.props.pollInterval);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const { actions, data } = this.props;
    const cssTransitionGroupClassNames = {
      enter: css.elementEnter,
      enterActive: css.elementEnterActive,
      leave: css.elementLeave,
      leaveActive: css.elementLeaveActive,
    };

    return (
      <div className="commentBox container">
        <h2>
          Comments {data.get('isFetching') && 'Loading...'}
        </h2>
        <p>
          <b>Text</b> supports Github Flavored Markdown.
          Comments older than 24 hours are deleted.<br />
          <b>Name</b> is preserved. <b>Text</b> is reset, between submits.
        </p>
        <CommentForm
          isSaving={data.get('isSaving')}
          saved={data.get('saved')}
          error={data.get('submitCommentError')}
          actions={actions}
          cssTransitionGroupClassNames={cssTransitionGroupClassNames}
        />
      </div>
    );
  }
}
