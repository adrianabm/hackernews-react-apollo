import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Link from './Link'

class LinkList extends Component {
  render() {
    if (this.props.feedQuery && this.props.feedQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.feedQuery && this.props.feedQuery.error) {
      return <div>Error</div>
    }

    const linksToRender = this.props.feedQuery.feed.links

    return (
      <div>
        {linksToRender.map((link, index) => (
          <Link key={link.id} index={index} link={link} />
        ))}
      </div>
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
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

// 3. Use the graphql container to “wrap” the LinkList component with the FEED_QUERY.
export default graphql(FEED_QUERY, { name: 'feedQuery' })(LinkList)
