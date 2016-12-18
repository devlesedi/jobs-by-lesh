/* global React */
/* global ReactQuill */
// 'use strict';

import React from 'react';
import ReactQuill from 'react-quill';

class Editor extends React.Component {

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

	formatRange(range) {
		return range
			? [range.start, range.end].join(',')
			: 'none';
	};

	onTextareaChange(event) {
		var value = event.target.value;
		this.setState({ value:value });
	}

	onEditorChange(value, delta, source) {
		this.setState({
			value: value,
			events: [
				'text-change('+this.state.value+' -> '+value+')'
			].concat(this.state.events)
		});
	}

	onEditorChangeSelection(range, source) {
		this.setState({
			selection: range,
			events: [
				'selection-change('+
					this.formatRange(this.state.selection)
				+' -> '+
					this.formatRange(range)
				+')'
			].concat(this.state.events)
		});
	}

	onToggle() {
		this.setState({ enabled: !this.state.enabled });
	}

	onToggleReadOnly() {
		this.setState({ readOnly: !this.state.readOnly });
	}

	render() {
		return (
			<div>
			{this.renderToolbar()}
			<hr/>
			{this.renderSidebar()}
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

	renderToolbar() {
		var state = this.state;
		var enabled = state.enabled;
		var readOnly = state.readOnly;
		var selection = this.formatRange(state.selection);
		return (
			React.DOM.div({},
				React.DOM.button({
					onClick: this.onToggle },
					enabled? 'Disable' : 'Enable'
				),
				React.DOM.button({
					onClick: this.onToggleReadOnly },
					'Set ' + (readOnly? 'read/Write' : 'read-only')
				),
				React.DOM.button({
					disabled: true },
					'Selection: ('+selection+')'
				)
			)
		);
	}

	renderSidebar() {
		return (
			React.DOM.div({
				style: { overflow:'hidden', float:'right' }},
				React.DOM.textarea({
					style: { display:'block', width:300, height:300 },
					value: this.state.value,
					onChange: this.onTextareaChange
				}),
				React.DOM.textarea({
					style: { display:'block', width:300, height:300 },
					value: this.state.events.join('\n')
				})
			)
		);
	}

}

// Editor = React.createFactory(Editor);
// ReactQuill = React.createFactory(ReactQuill);

module.exports = Editor;