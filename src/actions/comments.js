import fetch from 'isomorphic-fetch';
import Parse from 'parse';
import { push } from 'react-router-redux';

import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import { COMMENT_SUBMIT_REQUEST, COMMENT_SUBMIT_SUCCESS, COMMENT_SUBMIT_FAIL } from '../constants';
import { authLoginUserFailure } from './auth';
const Job = Parse.Object.extend('Job');
const Comment = Parse.Object.extend('Comments');

export function dataSubmitCommentSuccess(data) {
    return {
        type: COMMENT_SUBMIT_SUCCESS,
        payload: {
            data
        }
    };
}

export function dataSubmitCommentRequest() {
    return {
        type: COMMENT_SUBMIT_REQUEST
    };
}

export function dataSubmitCommentFail(error) {
    return {
        type: COMMENT_SUBMIT_FAIL,
        error: error
    };
}

export function dataSubmitComment(comment, id) {
    return (dispatch, state) => {
        dispatch(dataSubmitCommentRequest());
        const newComment = new Comment(comment);
        return newComment.save()
            .then((response) => {
                newComment.relation('job').add(new Job({id}));
                newComment.save();
                dispatch(dataSubmitCommentSuccess(response));
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    dispatch(authLoginUserFailure(error));
                    dispatch(push('/login'));
                }
                dispatch(dataSubmitCommentFail(error));
            });
    };
}

export function dataFetchComments(token) {
    return (dispatch, state) => {
        dispatch(dataFetchProtectedDataRequest());
        return fetch(`${SERVER_URL}/api/v1/getdata/`, {
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                Authorization: `Token ${token}`
            }
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then((response) => {
                dispatch(dataReceiveProtectedData(response.data));
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    dispatch(authLoginUserFailure(error));
                    dispatch(push('/login'));
                }
            });
    };
}
