const welcome = {
  greting: 'Hey',
  // title: 'React',
};

function getTitle(title) {
  return title;
}

function App() {
  return (
    <div>
      <h1>{welcome.greting} {getTitle('Reactio')}</h1>

      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
