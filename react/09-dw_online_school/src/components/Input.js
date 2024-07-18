import styled from "styled-components";

const SIZES = {
  large: 24,
  medium: 20,
  small: 16,
};

const input = styled.input`
  font-size: 16px;
  border: none;
  border-bottom: 2px solid ${({ $error }) => ($error ? "#f44336" : "#eeeeee")};
  padding: 16px;
  outline: none;
  display: block;
  width: 100%;

  &:focus {
    border-color: ${({ $error }) => ($error ? "#f44336" : "#7760b4")};
  }
`;

export default input;
