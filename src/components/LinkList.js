import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Link from './Link'

class LinkList extends Component {
  render() {
    const linksToRender = [
      {
        id: '1',
        description: 'Prisma turns your database into a GraphQL API 😎 😎',
        url: 'https://www.prismagraphql.com'
      },
      {
        id: '2',
        description: 'The best GraphQL client',
        url: 'https://www.apollographql.com/docs/react/'
      }
    ]

    return (
      <div>{linksToRender.map(link => <Link key={link.id} link={link} />)}</div>
    )
  }
}

// 1. create const FEED_QUERY that stores the query.
// The gql function is used to parse the plain string that contains the GraphQL code.
const FEED_QUERY = gql`
  # 2. Define the GraphQL query. FeedQuery is the operation name.
  query FeedQuery {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`

// 3. Use the graphql container to “wrap” the LinkList component with the FEED_QUERY.
export default graphql(FEED_QUERY, { name: 'feedQuery' })(LinkList)
