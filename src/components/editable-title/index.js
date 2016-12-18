import Component from '../../components/component';
import cx from 'classnames';
import React, {PropTypes} from 'react';

import styles from './index.less';

export default class EditableTitle extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    sub: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.editing && nextProps.value !== this.props.value) {
      this.setState({
        editing: false
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.editing && this.state.editing) {
      const input = this.refs.input;

      if (input) {
        // input.focus && input.focus();
        input.focus();
        const len = this.state.editValue.length;
        // input.setSelectionRange && input.setSelectionRange(len, len);
        input.setSelectionRange(len, len);
      }
    }
  }

  onClick(event) {
    event.preventDefault();
    this.setState({
      editing: true,
      editValue: this.props.value
    });
  }

  onChange(event) {
    event.preventDefault();
    this.setState({
      editValue: event.target.value
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.props
      .onSubmit(this.state.editValue)
      .then(() => {
        this.setState({
          editing: false
        });
      });
  }

  getInitState() {
    return {
      editing: false
    };
  }

  cancel(event) {
    event.preventDefault();
    this.setState({
      editing: false,
      editValue: ''
    });
  }

  renderContent() {
    const {editing} = this.state;
    const {value} = this.props;
    let result;

    if (!editing) {
      result = (
        <button className={styles.editButton} onClick={this.onClick.bind(this)}>
          <div className={styles.title}>{value}</div>
          <i className="nc-icon-outline ui-1_edit-74"></i>
        </button>
      );
    } else {
      result = (
        <form onSubmit={this.onSubmit.bind(this)}>
          <input
            value={this.state.editValue}
            onChange={this.onChange.bind(this)}
            type="text"
            placeholder={value}
            className={cx(styles.title, styles.input)}
            ref="input"
          />
          <button className={cx(styles.formButton, styles.confirmButton)}>Ok</button>
          <button className={cx(styles.formButton, styles.cancelButton)} onClick={this.cancel.bind(this)}>Cancel</button>
        </form>
      );
    }

    return result;
  }

  render() {
    const {sub} = this.props;
    return (
      <div className={sub && styles.sub}>
        {this.renderContent()}
      </div>
    );
  }
}
