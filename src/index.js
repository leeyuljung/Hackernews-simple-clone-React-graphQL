import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { AUTH_TOKEN } from './constants';

// 將 Apollo client 實例和 GraphQL API 做連接
const httpLink = createHttpLink({
  // GraphQL server 會運行在此 uri 上
  uri: 'http://localhost:4000'
})

// middleware, 如果有 token 的話，會回傳 headers，並提供到 context 中
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  return{
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

// 實例化 webSocketLink
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
})

/*
  split 是用來發送請求給特定的 middleware link，
  第一個參數是用來檢查這個 operation 是否為 subscription，
  是 --> 會被轉發到 wsLink
  否(query or mutation) --> 會被轉發到 authLink.concat(httpLink)
*/ 
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return (
      kind === 'OperationDefinition' && operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

// 實例化 Apollo client
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    {/* 在 App 外層用 ApolloProvider 包裹住 */}
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
)
