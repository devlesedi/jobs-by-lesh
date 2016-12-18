// import {

// } from 'constants';

// export function isLoaded(globalState) {
//   return globalState.widgets && globalState.widgets.loaded;
// }

export function togglePageSeeker() {
  return {
    type: 'me/TOGGE_PAGE_SEEKER'
  };
}

export function togglePageEmployer() {
  return {
    type: 'me/TOGGE_PAGE_EMPLOYER'
  };
}

export function updatePageTitle(title) {
  return {
    type: 'me/UPDATE_TITLE',
    title
  };
}

export function updatePageSlug(slug) {
  return {
    type: 'me/UPDATE_SLUG',
    slug
  };
}
