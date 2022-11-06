import React from "react";

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  }
];

const getAsyncStories = () =>
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
  const [stories, setStories] = React.useState([]);

  React.useEffect(() => {
    getAsyncStories().then(result => {
      setStories(result.data.stories);
    });
  }, []);

  const handleRemoveStory = (item) => {
    const filteredStories = stories.filter((story) => item.objectID !== story.objectID);
    setStories(filteredStories);
  };

  const handleChange = event => {
    setSearchTerm(event.target.value);
  }

  const searchedStories = stories.filter(story =>
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

      <List list={searchedStories} onRemoveItem={handleRemoveStory} />

    </div>
  );
};

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map(item =>
      <Item item={item} onRemoveItem={onRemoveItem} />
    )}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (
  <li key={item.objectID}>
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
