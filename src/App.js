import React from "react";

const STORIES_FETCH_INIT = 'STORIES_FETCH_INIT';
const STORIES_FETCH_SUCCESS = 'STORIES_FETCH_SUCCESS';
const STORIES_FETCH_FAILURE = 'STORIES_FETCH_FAILURE';
const REMOVE_STORY = 'REMOVE_STORY';

const storiesReducer = (state, action) => {
  switch (action.type) {
    case STORIES_FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case STORIES_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case STORIES_FETCH_FAILURE:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case REMOVE_STORY:
      return {
        ...state,
        data: state.filter(
          (story) => action.payload.objectID !== story.objectID),
      };
    default:
      throw new Error();
  }
};

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 1,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 2,
  }
];

const getAsyncStories = () =>
  // new Promise((reject, resolve) => setTimeout(reject, 2000));
new Promise((resolve) => setTimeout(
  () => resolve({ data: { stories: initialStories } }),
  200
));

const useSemipersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(localStorage.getItem('search') || initialState);

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

const App = () => {

  const [searchTerm, setSearchTerm] = useSemipersistentState('search', 'React');
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  React.useEffect(() => {
    dispatchStories({ type: STORIES_FETCH_INIT });

    getAsyncStories()
      .then(result =>
        dispatchStories({
          type: STORIES_FETCH_SUCCESS,
          payload: result.data.stories,
        })
      )
      .catch(() =>
        dispatchStories({
          type: STORIES_FETCH_FAILURE,
        }));
  }, []);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: REMOVE_STORY,
      payload: item,
    });
  };

  const handleChange = event => {
    setSearchTerm(event.target.value);
  }

  const searchedStories = stories.data.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel id="search" onChange={handleChange} value={searchTerm} isFocused>
        Search:
      </InputWithLabel>

      you're searching for: {searchTerm}

      <hr />

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p> Is loading...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}

    </div>
  );
};

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map(item =>
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    )}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    {' '}—{' '}
    <span>{item.author}</span>
    {' '}—{' '}
    <span>{item.num_comments}</span>
    {' '}—{' '}
    <span>{item.points}</span>
    {' '}—{' '}
    <span>
      <button type="button" onClick={onRemoveItem.bind(null, item)}>
        Dismiss
      </button>
    </span>
  </li>
);

const InputWithLabel = ({ id, type = 'text', value, onChange, isFocused, children }) => {

  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input id={id} type={type} value={value} onChange={onChange} ref={inputRef} />
    </>
  );
}

export default App;
