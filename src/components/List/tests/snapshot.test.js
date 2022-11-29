import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { List, Item } from '..';
import { storyOne, stories } from '../../../fixtures/stories.fixture';


describe('List', () => {
  it('renders a snapshot', () => {
    const { container } = render(<List list={stories} onRemoveItem={jest.fn()} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('Item', () => {
  it('renders a snapshot', () => {
    const { container } = render(<Item item={storyOne} onRemoveItem={jest.fn()} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
