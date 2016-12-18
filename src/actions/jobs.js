import Parse from 'parse';
import { push } from 'react-router-redux';
// const {AppEventsLogger} = require('react-native-fbsdk');
// const Platform = require('Platform');
// const InteractionManager = require('InteractionManager');
// const ActionSheetIOS = require('ActionSheetIOS');
// const Alert = require('Alert');
// const Share = require('react-native-share');
const Agenda = Parse.Object.extend('Agenda');
const Job = Parse.Object.extend('Job');
// const {currentInstallation, updateInstallation} = require('./installation');

import type { ThunkAction, PromiseAction, Dispatch } from './types';
import type { Session } from '../reducers/sessions';

import {authLoginUserFailure} from './auth';

function createJob(values: Object = {}): ThunkAction {
  return (dispatch: Dispatch) => {
    // if (Parse.User.current()) {
      const newJob = new Job(values);
      return newJob.save()
        .then((response) => {
            dispatch(push('/'));
        })
        .catch((error) => {
          console.error('error', error);
          if (error.response.status === 401) {
              dispatch(authLoginUserFailure(error));
              dispatch(push('/login'));
          }
        })
      // await addToJobList(newJob.get('id'));
      // Parse.User.current().relation('mySchedule').add(new Agenda({id}));
      // Parse.User.current().save();
      // currentInstallation().then((installation) => {
      //   installation.addUnique('channels', `session_${id}`);
      //   return installation.save();
      // });
    // }
    // dispatch({
    //   type: 'JOB_ADDED',
    //   id,
    // });
  };
}

function getJob(id: string): ThunkAction {
  return (dispatch) => {
    dispatch({
      type: 'JOB_LOADING'
    });
    new Job({id}).fetch({
      success: (job) => {
        dispatch({
          type: 'LOADED_JOB',
          payload:{
            job: {
              id: job.id,
              title: job.get('jobTitle'),
              description: job.get('jobDescription'),
              hasDetails: job.get('hasDetails'),
              slug: job.get('slug'),
              remote: job.get('remote'),
              salary: job.get('salary'),
              // applicants: (job.get('applicants') || []).map(fromParseSpeaker),
              onMySchedule: job.get('onMySchedule'),
              tags: job.get('tags') || [],
              startTime: job.get('startTime') && job.get('startTime').getTime(),
              endTime: job.get('endTime') && job.get('endTime').getTime(),
              location: job.get('location'),
            }
          }
        });
      },
      error: (error) => {

      }
    })
  };
}

function addToJobList(id: string): ThunkAction {
  return (dispatch: Dispatch) => {
    if (Parse.User.current()) {
      Parse.User.current().relation('mySchedule').add(new Agenda({id}));
      Parse.User.current().save();
      currentInstallation().then((installation) => {
        installation.addUnique('channels', `session_${id}`);
        return installation.save();
      });
    }
    dispatch({
      type: 'SESSION_ADDED',
      id,
    });
  };
}

function updateJob(id: string, updates: Object = {}):Promise<void> {
  //jobById(id)
  //await job.save(updates);
}

function removeFromJobList(id: string): ThunkAction {
  return (dispatch: Dispatch) => {
    if (Parse.User.current()) {
      Parse.User.current().relation('mySchedule').remove(new Agenda({id}));
      Parse.User.current().save();
      currentInstallation().then((installation) => {
        installation.remove('channels', `session_${id}`);
        return installation.save();
      });
    }
    dispatch({
      type: 'SESSION_REMOVED',
      id,
    });
  };
}

function removeFromScheduleWithPrompt(session: Session): ThunkAction {
  return (dispatch) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({
        options: ['Remove From Schedule', 'Cancel'],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      }, (buttonIndex) => {
        if (buttonIndex === 0) {
          dispatch(removeFromJobList(session.id));
        }
      });
    } else {
      Alert.alert(
        'Remove From Your Schedule',
        `Would you like to remove "${session.title}" from your schedule?`,
        [
          {text: 'Cancel'},
          {
            text: 'Remove',
            onPress: () => dispatch(removeFromJobList(session.id))
          },
        ]
      );
    }
  };
}

async function restoreSchedule(): PromiseAction {
  const list = await Parse.User.current().relation('mySchedule').query().find();
  const channels = list.map(({id}) => `session_${id}`);
  updateInstallation({channels});

  return {
    type: 'RESTORED_SCHEDULE',
    list,
  };
}

async function loadFriendsSchedules(): PromiseAction {
  const list = await Parse.Cloud.run('friends');
  await InteractionManager.runAfterInteractions();
  return {
    type: 'LOADED_FRIENDS_SCHEDULES',
    list,
  };
}

function setSharingEnabled(enabled: boolean): ThunkAction {
  return (dispatch) => {
    dispatch({
      type: 'SET_SHARING',
      enabled,
    });
    Parse.User.current().set('sharedSchedule', enabled);
    Parse.User.current().save();
  };
}

function shareJob(session: Session): ThunkAction {
  return (dispatch, getState) => {
    const {sessionURLTemplate} = getState().config;
    const url = sessionURLTemplate
      .replace('{slug}', session.slug)
      .replace('{id}', session.id);

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showShareActionSheetWithOptions({
        message: session.title,
        url,
      }, (e) => console.error(e), logShare.bind(null, session.id));
    } else {
      Share.open({
        share_text: session.title,
        share_URL: url,
        title: 'Share Link to ' + session.title,
      }, (e) => logShare(session.id, true, null));
    }
  };
}

function logShare(id, completed, activity) {
  AppEventsLogger.logEvent('Share Session', 1, {id});
  Parse.Analytics.track('share', {
    id,
    completed: completed ? 'yes' : 'no',
    activity: activity || '?'
  });
}

module.exports = {
  shareJob,
  createJob,
  getJob,
  addToJobList,
  removeFromJobList,
  restoreSchedule,
  loadFriendsSchedules,
  setSharingEnabled,
  removeFromScheduleWithPrompt,
};
