import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

// 將 Apollo client 實例和 GraphQL API 做連接
const httpLink = createHttpLink({
  // GraphQL server 會運行在此 uri 上
  uri: 'http://localhost:4000'
})

// 實例化 Apollo client
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

ReactDOM.render(
  // 在 App 最外層用 ApolloProvider 包裹住
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
