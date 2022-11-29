import styled from 'styled-components';


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

export {
  StyledButtonSmall,
  StyledButtonLarge,
};
