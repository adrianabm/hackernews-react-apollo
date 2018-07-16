import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Link from './Link'

class LinkList extends Component {
  componentDidMount() {
    this._subscribeToNewLinks()
    this._subscribeToNewVotes()
  }

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
          <Link
            key={link.id}
            updateStoreAfterVote={this._updateCacheAfterVote}
            index={index}
            link={link}
          />
        ))}
      </div>
    )
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    // 1. Read current state of the cached data for FEED_QUERY
    const data = store.readQuery({ query: FEED_QUERY })

    // 2. Retrieve link that the user just voted for from that list +
    // manipulate that  link by resetting its votes to the votes that were just returned from the server.
    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes

    // 3. Take the modified data and write it back to the store.
    store.writeQuery({ query: FEED_QUERY, data })
  }

  _subscribeToNewLinks = () => {
    this.props.feedQuery.subscribeToMore({
      document: gql`
        subscription {
          newLink {
            node {
              id
              url
              description
              createdAt
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
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const newAllLinks = [
          subscriptionData.data.newLink.node,
          ...previous.feed.links
        ]
        const result = {
          ...previous,
          feed: {
            links: newAllLinks
          }
        }
        return result
      }
    })
  }

  _subscribeToNewVotes = () => {
    this.props.feedQuery.subscribeToMore({
      document: gql`
        subscription {
          newVote {
            node {
              id
              link {
                id
                url
                description
                createdAt
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
              user {
                id
              }
            }
          }
        }
      `
    })
  }
}

// 1. create const FEED_QUERY that stores the query.
// The gql function is used to parse the plain string that contains the GraphQL code.
export const FEED_QUERY = gql`
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
