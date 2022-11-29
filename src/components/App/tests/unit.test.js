import '@testing-library/jest-dom';
import { storiesReducer } from '..';
import { stories, storyOne, storyTwo } from '../../../fixtures/stories.fixture';

describe('storiesReducer', () => {

  // STORIES_FETCH_INIT
  it('inits story loading', () => {
    const action = { type: 'STORIES_FETCH_INIT' };
    const state = { isLoading: false, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = { isLoading: true, isError: false };

    expect(newState).toStrictEqual(expectedState);
  });

  // STORIES_FETCH_SUCCESS
  it('succesfully fetches stories', () => {
    const action = { type: 'STORIES_FETCH_SUCCESS', payload: stories };
    const state = { isLoading: true, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = { isLoading: false, isError: false, data: stories };

    expect(newState).toStrictEqual(expectedState);
  });

  // STORIES_FETCH_FAILURE
  it('fails to fetch stories', () => {
    const action = { type: 'STORIES_FETCH_FAILURE' };
    const state = { isLoading: true, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = { isLoading: false, isError: true };

    expect(newState).toStrictEqual(expectedState);
  });

  // REMOVE_STORY
  it('removes a story from all stories', () => {
    const action = { type: 'REMOVE_STORY', payload: storyOne };
    const state = { data: stories, isLoading: false, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });
});
