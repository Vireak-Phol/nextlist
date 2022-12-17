import { Container, GlobalStyle } from "@chakra-ui/react";
import Auth from "../components/Auth";
import TodoList from "../components/TodoList";
 
export default function Home() {
  return (
    <Container maxW="7xl">
      {/* <Auth /> */}
      <TodoList />
    </Container>
  );
}
