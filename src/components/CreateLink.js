import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class CreateLink extends Component {
  state = {
    description: '',
    url: ''
  }

  render() {
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={this.state.url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button onClick={() => this._createLink()}>Submit</button>
      </div>
    )
  }

  _createLink = async () => {
    const { description, url } = this.state
    await this.props.postMutation({
      variables: {
        description,
        url
      }
    })
  }
}

// 1. create const POST_MUTATION that stores the mutation.
const POST_MUTATION = gql`
  # 2. Define the GRaphQL mutation that takes two arguments (url and description)
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`
// 3. Use the graphql container to “wrap” the CreateLink component with the POST_MUTATION.
export default graphql(POST_MUTATION, { name: 'postMutation' })(CreateLink)
