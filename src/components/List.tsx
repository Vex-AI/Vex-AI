import styled from "styled-components";

const List = styled.ul`
  z-index: 1;
  flex: 1;
  list-style: none;
  width: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  min-width: 100%;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  overflow: hidden; /* Hide scrollbars */
  list-style: none;
  overflow: auto; /* this will hide the scrollbar in mozilla based browsers */
  overflow: -moz-scrollbars-none; /* this will hide the scrollbar in internet explorers */
  scrollbar-width: none; /* this will hide the scrollbar in webkit based browsers - safari, chrome, etc */
  -ms-overflow-style: none; /* this will hide the scrollbar in IE and Edge */
`;

export default List;
