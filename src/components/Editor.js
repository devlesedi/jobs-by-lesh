import React from 'react';
import ReactQuill from 'react-quill';
require('quill/dist/quill.snow.css');

export default class Editor extends React.Component {

  static propTypes = {
    onEditorChange: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      theme: 'snow',
      enabled: true,
      readOnly: false,
      value: '',
      events: []
    };
    this.formatRange = this.formatRange.bind(this);
    this.onTextareaChange = this.onTextareaChange.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.onEditorChangeSelection = this.onEditorChangeSelection.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onToggleReadOnly = this.onToggleReadOnly.bind(this);
    this.renderToolbar = this.renderToolbar.bind(this);
    this.renderSidebar = this.renderSidebar.bind(this);
  }

  onTextareaChange(event) {
    const value = event.target.value;
    this.setState({ value: value });
  }

  onEditorChange(value) {
    this.setState({
      value: value,
      events: [
        'text-change(' + this.state.value + ' -> ' + value + ')'
      ].concat(this.state.events)
    });
    this.props.onEditorChange(value);
  }

  onEditorChangeSelection(range) {
    this.setState({
      selection: range,
      events: [
        'selection-change(' +
          this.formatRange(this.state.selection)
        + ' -> ' +
          this.formatRange(range)
        + ')'
      ].concat(this.state.events)
    });
  }

  onToggle() {
    this.setState({ enabled: !this.state.enabled });
  }

  onToggleReadOnly() {
    this.setState({ readOnly: !this.state.readOnly });
  }

  formatRange(range) {
    return range
      ? [range.start, range.end].join(',')
      : 'none';
  }

  renderToolbar() {
    const state = this.state;
    const enabled = state.enabled;
    const readOnly = state.readOnly;
    const selection = this.formatRange(state.selection);
    return (
      React.DOM.div({},
        React.DOM.button({
          onClick: this.onToggle },
          enabled ? 'Disable' : 'Enable'
        ),
        React.DOM.button({
          onClick: this.onToggleReadOnly },
          'Set ' + (readOnly ? 'read/Write' : 'read-only')
        ),
        React.DOM.button({
          disabled: true },
          'Selection: (' + selection + ')'
        )
      )
    );
  }

  renderSidebar() {
    return (
      React.DOM.div({
        style: { overflow: 'hidden', float: 'right' }},
        React.DOM.textarea({
          style: { display: 'block', width: 300, height: 300 },
          value: this.state.value,
          onChange: this.onTextareaChange
        }),
        React.DOM.textarea({
          style: { display: 'block', width: 300, height: 300 },
          value: this.state.events.join('\n')
        })
      )
    );
  }

  render() {
    return (
      <div>
        {this.state.enabled ?
        <ReactQuill
          theme={this.state.theme}
          value={this.state.value}
          readOnly={this.state.readOnly}
          onChange={this.onEditorChange}
          onChangeSelection={this.onEditorChangeSelection}
        /> : <div></div>}
      </div>
    );
  }

}

// Editor = React.createFactory(Editor);
// ReactQuill = React.createFactory(ReactQuill);
