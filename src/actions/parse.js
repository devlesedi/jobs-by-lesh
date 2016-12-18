const Parse = require('parse');

import type { ThunkAction } from './types';

const Maps = Parse.Object.extend('Maps');
const Notification = Parse.Object.extend('Notification');

function loadParseQuery(type: string, query: Parse.Query): ThunkAction {
  return (dispatch) => {
    dispatch(fetachParseRequest());
    return query.find({
      success: (list) => {
          dispatch(({type, list}: any));
      },
      error: function(err) {console.log(err); dispatch(fetachParseRequestFail())},
    });
  };
}

function expandTimelineQuery(type: string, timeline: string, query: Parse.Query): ThunkAction {
  return (dispatch, getState) => {
    const skip = getState().data.getIn([timeline]).size;
    // const lastId = getState().getIn(['data', timeline]).last();
    query.skip(skip);
    dispatch(fetachParseRequest());
    return query.limit(2).find({
      success: (list) => {
          dispatch(({type, timeline, list}: any));
      },
      error: function(err) {console.log(err); dispatch(fetachParseRequestFail())},
    });
  };
}

function fetachParseRequest() {
  return {
    type: 'FETCH_PARSE_REQUEST'
  }
}

function fetachParseRequestFail() {
  return {
    type: 'FETCH_PARSE_REQUEST_FAILED'
  }
}

module.exports = {
  loadJobs: (): ThunkAction =>
    expandTimelineQuery(
      'LOADED_JOBS',
      'home',
      new Parse.Query('Job')
        .include('applications')
        .ascending('startTime')
    ),
  expandTimeline: (type:string) : ThunkAction =>
    expandTimelineQuery(
      'TIMELINE_EXPAND_SUCCESS',
      type,
      new Parse.Query('Job')
        .include('applications')
        .ascending('startTime')
      ),
  loadMaps: (): ThunkAction =>
    loadParseQuery('LOADED_MAPS', new Parse.Query(Maps)),

  loadNotifications: (): ThunkAction =>
    loadParseQuery('LOADED_NOTIFICATIONS', new Parse.Query(Notification)),
};
