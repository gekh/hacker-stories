import React from 'react';
import styled from 'styled-components';
import { StyledButtonSmall } from './button.styled';
import { Stories, Story } from './stories.type';


type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
};

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

const List = React.memo(({ list, onRemoveItem }: ListProps) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
));

List.displayName = 'List';

const StyledItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

interface StyledColumnProps {
  width: string;
};

const StyledColumn = styled.span<StyledColumnProps>`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  a {
    color: inherit;
  }

  width: ${(props) => props.width};
`;

const Item = ({ item, onRemoveItem }: ItemProps) => (
  <StyledItem>
    <StyledColumn width="40%">
      <a href={item.url}>{item.title}</a>
    </StyledColumn>
    <StyledColumn width="30%">{item.author}</StyledColumn>
    <StyledColumn width="10%">{item.num_comments}</StyledColumn>
    <StyledColumn width="10%">{item.points}</StyledColumn>
    <StyledColumn width="10%">
      <StyledButtonSmall type="button" onClick={onRemoveItem.bind(null, item)}>
        Dismiss
      </StyledButtonSmall>
    </StyledColumn>
  </StyledItem>
);

export { List, Item };
