import React from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import {get as getJob} from 'redux/modules/data';
import moment from 'moment';
// import CommentsContainer from './components/CommentsContainer';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch}, params}) => {
    return dispatch(getJob(params.id));
  }
}])
@connect(
  state => ({
    job: state.data.job,
    loading: state.data.loading
  })
)
export default class JobView extends React.Component {

	static propTypes = {
        statusText: React.PropTypes.string,
        job: React.PropTypes.object,
        loading: React.PropTypes.bool
    };

    renderJob() {
    	let {job} = this.props;
    	if (job) {
	    	return (
	    		<div>
	    			<h1>{job.title}</h1>
                    <p><i className="fa fa-clock-o"></i>&nbsp;<span><b>Posted:</b> {moment(job.createdAt).fromNow()}</span></p>
                    <p><i className="fa fa-map-marker"></i>&nbsp;<span><b>Location:</b> {job.city}</span></p>
                    <p><i className="fa fa-user"></i>&nbsp;<span><b>Posted By:</b> {job.companyName}</span></p>
                    {job.salary ? <p><i className="fa fa-money"></i>&nbsp;<span><b>Salary:</b> {job.salary}</span></p> : ''}
	    			<div className="content"
	    				dangerouslySetInnerHTML={{__html: job.description}}
	    			 />
                    <h3>How to Apply</h3>
                    <p>{job.howToApply}</p>
                    { /* <CommentsContainer job={job} /> */ }
	    		</div>
	    	);
    	}
    };

    render() {
        return (
            <div className="container">
                <div>
                	{this.props.loading ? <div>loading...</div> :
                    this.renderJob()}
                </div>
            </div>
        );
    }
}
