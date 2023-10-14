import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 400px;
  min-height: 100vh;
  margin: auto;
  z-index: 1;
  background: var(--bg-color);

  @media (max-width: 400px) {
    width: 100%;
  }
`;

export default Container;
