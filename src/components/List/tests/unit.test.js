import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { Item, List } from '..';
import { stories, storyOne } from '../../../fixtures/stories.fixture';

describe('List', () => {
  it('should display the list of 2 items', () => {
    render(<List list={stories} onRemoveItem={jest.fn()} />);
    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
    expect(screen.getByText('Dan Abramov, Andrew Clark')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    screen.getAllByRole('listitem').forEach(el => {
      expect(el).toBeInTheDocument();
    });
  });

  test('clicking the dismiss button calls the callback handler', () => {
    const handleRemoveItem = jest.fn();
    render(<List list={stories} onRemoveItem={handleRemoveItem} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  });
});

describe('Item', () => {
  it('renders all properties', () => {
    render(<Item item={storyOne} onRemoveItem={jest.fn()} />);
    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
    expect(screen.getByText('React')).toHaveAttribute(
      'href',
      'https://reactjs.org/'
    );
  });

  it('renders a clickable dismiss button', () => {
    render(<Item item={storyOne} onRemoveItem={jest.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('clicking the dismiss button calls the callback handler', () => {
    const handleRemoveItem = jest.fn();
    render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  });
});

