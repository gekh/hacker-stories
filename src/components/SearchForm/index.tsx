import React from 'react';
import { StyledButtonLarge } from '../../styles/button.styled';
import { InputWithLabel } from '../InputWithLabel';
import { StyledSearchForm } from './styles';
import { SearchFormProps } from './types';


const SearchForm = React.memo(
  ({ onSearchSubmit, onSearchInput, searchTerm }: SearchFormProps) => (
    <StyledSearchForm onSubmit={onSearchSubmit}>
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <StyledButtonLarge type="submit" disabled={!searchTerm}>
        Submit
      </StyledButtonLarge>
    </StyledSearchForm>
  )
);
SearchForm.displayName = 'SearchForm';

export { SearchForm };
