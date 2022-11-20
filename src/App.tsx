import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {ReactComponent as Check} from './check.svg';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const STORIES_FETCH_INIT = 'STORIES_FETCH_INIT';
const STORIES_FETCH_SUCCESS = 'STORIES_FETCH_SUCCESS';
const STORIES_FETCH_FAILURE = 'STORIES_FETCH_FAILURE';
const REMOVE_STORY = 'REMOVE_STORY';

type Story = {
	objectID: string;
	url: string;
	title: string;
	author: string;
	num_comments: number;
	points: number;
};

type Stories = Story[];

type ItemProps = {
	item: Story;
	onRemoveItem: (item: Story) => void;
};

type ListProps = {
	list: Stories;
	onRemoveItem: (item: Story) => void;
};

type StoriesState = {
	data: Stories;
	isLoading: boolean;
	isError: boolean;
};

type StoriesFetchInitAction = {
	type: 'STORIES_FETCH_INIT';
};

type StoriesFetchSuccessAction = {
	type: 'STORIES_FETCH_SUCCESS';
	payload: Stories;
};

type StoriesFetchFailurAction = {
	type: 'STORIES_FETCH_FAILURE';
};

type StoriesRemoveAction = {
	type: 'REMOVE_STORY';
	payload: Story;
};

type StoriesAction =
  StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailurAction
  | StoriesRemoveAction;

type SearchFormProps = {
	searchTerm: string;
	onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

type InputWithLabelProps = {
	id: string;
	value: string;
	type?: string;
	onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	isFocused?: boolean;
	children: React.ReactNode;
};

const storiesReducer = (state: StoriesState, action: StoriesAction) => {
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
				data: state.data.filter(story => action.payload.objectID !== story.objectID),
			};

		default:
			throw new Error();
	}
};

const useSemipersistentState = (
	key: string,
	initialState: string,
): [string, (newValue: string) => void] => {
	const [value, setValue] = React.useState(localStorage.getItem('search') || initialState);

	React.useEffect(() => {
		localStorage.setItem(key, value);
	}, [key, value]);

	return [value, setValue];
};

const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;

  background: #83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);

  color: #171212;
`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;

const getSumComments = (stories: {data: Story[]}) => stories.data.reduce(
	(result: number, value: Story) => result + value.num_comments,
	0,
);

const App = () => {
	const [searchTerm, setSearchTerm] = useSemipersistentState('search', 'React');

	const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

	const [stories, dispatchStories] = React.useReducer(storiesReducer, {
		data: [],
		isLoading: false,
		isError: false,
	});

	const handleFetchStories = React.useCallback(async () => {
		dispatchStories({type: STORIES_FETCH_INIT});

		try {
			const result = await axios.get(url);

			dispatchStories({
				type: STORIES_FETCH_SUCCESS,
				payload: result.data.hits,
			});
		} catch {
			dispatchStories({
				type: STORIES_FETCH_FAILURE,
			});
		}
	}, [url]);

	React.useEffect(() => {
		handleFetchStories();
	}, [handleFetchStories]);

	const handleRemoveStory = React.useCallback((item: Story) => {
		dispatchStories({
			type: REMOVE_STORY,
			payload: item,
		});
	}, []);

	const handleSearchInput = React.useCallback((
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setSearchTerm(event.target.value);
	}, [setSearchTerm]);

	const handleSearchSubmit = React.useCallback((
		event: React.FormEvent<HTMLInputElement>,
	) => {
		setUrl(`${API_ENDPOINT}${searchTerm}`);

		event.preventDefault();
	}, [searchTerm]);

	const sumComments = React.useMemo(() => getSumComments(stories), [stories]);

	// What's going on?
	//! wow easy maaan
	// TODO update the funciton
	return (
		<StyledContainer>
			<StyledHeadlinePrimary>My Hacker Stories with {sumComments} comments</StyledHeadlinePrimary>

			<SearchForm
				onSearchSubmit={handleSearchSubmit}
				onSearchInput={handleSearchInput}
				searchTerm={searchTerm}
			></SearchForm>

			{stories.isError && <p>Something went wrong...</p>}

			{stories.isLoading
				? (
					<p> Is loading...</p>
				)
				: (
					<List list={stories.data} onRemoveItem={handleRemoveStory} />
				)}
		</StyledContainer>
	);
};

const List = React.memo(({list, onRemoveItem}: ListProps) => (
	<ul>
		{list.map(item =>
			<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />,
		)}
	</ul>
));

const StyledItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

const StyledColumn = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  a {
    color: inherit;
  }

  width: ${props => props.width};
`;

const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;
  margin: 0 5px;

  transition: all 0.1s ease-in;

  &:hover {
    background: #171212;
    color: #ffffff;
    fill: #ffffff;
    stroke: #ffffff;
  }
`;

const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;

const Item = ({item, onRemoveItem}: ItemProps) => (
	<StyledItem>
		<StyledColumn width='40%'>
			<a href={item.url}>{item.title}</a>
		</StyledColumn>
		<StyledColumn width='30%'>{item.author}</StyledColumn>
		<StyledColumn width='10%'>{item.num_comments}</StyledColumn>
		<StyledColumn width='10%'>{item.points}</StyledColumn>
		<StyledColumn width='10%'>
			<StyledButtonSmall
				type='button'
				onClick={onRemoveItem.bind(null, item)}
			>
				<Check height='18px' width='18px' />
			</StyledButtonSmall>
		</StyledColumn>
	</StyledItem>
);

const StyledLabel = styled.label`
  border-top: 1px solid #171212;
  border-left: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;

const StyledInput = styled.input`
  border: none;
  border-bottom: 1px solid #171212;
  background-color: transparent;

  margin: 0 5px;
  
  font-size: 24px;
`;

const InputWithLabel = ({
	id,
	type = 'text',
	value,
	onInputChange,
	isFocused,
	children,
}: InputWithLabelProps) => {
	const inputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (isFocused && (inputRef.current != null)) {
			inputRef.current.focus();
		}
	}, [isFocused]);

	return (
		<>
			<StyledLabel htmlFor={id}>{children}</StyledLabel>
      &nbsp;
			<StyledInput
				id={id}
				type={type}
				value={value}
				onChange={onInputChange}
				ref={inputRef}
			/>
		</>
	);
};

const StyledSearchForm = styled.form`
  padding:  10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

const SearchForm = React.memo(({
	onSearchSubmit,
	onSearchInput,
	searchTerm,
}: SearchFormProps) => console.log('SearchForm') || (
	<StyledSearchForm onSubmit={handleSearchSubmit}>
		<InputWithLabel
			id='search'
			value={searchTerm}
			isFocused
			onInputChange={handleSearchInput}
		>
      Search:
		</InputWithLabel>

		<StyledButtonLarge
			type='submit'
			disabled={!searchTerm}
		>
      Submit
		</StyledButtonLarge>
	</StyledSearchForm>
));

export default App;
