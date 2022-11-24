// import { render, screen } from '@testing-library/react';
// import * as axios from "axios";
import App, { storiesReducer, SearchForm, InputWithLabel, List, Item } from './App';


const storyOne = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo];

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

describe('App component', () => {
  test('removes an item when clicking the Dismiss button', () => {

  });

  test('requests some initial stories from an API', () => {

  });
});


describe('something truthy and falsy', () => {
  test('true to be true', () => {
    expect(true).toBeTruthy;
  });

  test('false to be false', () => {
    expect(false).toBeFalsy;
  });
});

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
