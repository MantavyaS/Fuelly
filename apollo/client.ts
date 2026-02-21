import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const link = new HttpLink({
  uri: "https://reverable-unlaureled-deloras.ngrok-free.dev/graphql",
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
