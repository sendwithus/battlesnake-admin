import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { Grid, Container, Image, Table } from 'semantic-ui-react'

import Snakes from '../components/snakes'
import Nav from '../components/nav'

import { membersProvider, teamProvider } from '../components/data'

import TeamEdit from './edit'
import AddMember from './add-member'

import axios from 'axios'
import config from '../config'

import logo from '../images/logo-bs18.png'

class Team extends Component {
  render() {
    return (
      <Grid container>
        <Grid.Column width={4}>
          <Link to="/">
            <img src={logo} className="App-logo" alt="logo" />
          </Link>
          <Nav />
        </Grid.Column>
        <Grid.Column width={12}>
          <Container>
            <Route exact path="/team" component={TeamHome} />
            <Route path="/team/edit" component={TeamEdit} />
            {/* <Route path="/team/add-member" component={AddMember} /> */}
            {/* <Route path="/team/remove/:username" component={RemoveMember} /> */}
            <Route path="/team/snakes" component={teamProvider(Snakes)} />
          </Container>
        </Grid.Column>
      </Grid>
    )
  }
}

class TeamHomeDisplay extends Component {
  removeMember = async(username) => {
    try {
      await axios(`${config.SERVER}/api/team/remove-user`, {
        method: 'post',
        withCredentials: true,
        data: {
          username: username
        }
      })
    } catch (e) {
      this.setState({ error: e.response.data.msg })
    }
    window.location.reload()
  }

  render() {
    let members = !this.props.membersMgr.loading
      ? this.props.membersMgr.members
      : []
    return (
      <div>
        <Table celled inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {members.map(member => {
              return (
                <Table.Row key={member.username}>
                  <Table.Cell>
                    <Image
                      width="50"
                      height="50"
                      floated="left"
                      rounded
                      src={`https://github.com/${member.username}.png?size=40`}
                    />
                    {member.displayName || member.username}
                  </Table.Cell>
                  <Table.Cell />
                  <Table.Cell textAlign="right">
                    <a onClick={() => this.removeMember(member.username)}>
                      <span role="img" aria-label="Remove">❎</span> Remove
                    </a>
                  </Table.Cell>
                </Table.Row>
              )
            })}
            <Table.Row>
              <Table.Cell />
              <Table.Cell />
              <Table.Cell textAlign="right">
                <Link to="/team/edit">
                  <span role="img" aria-label="Edit">✏️</span> Edit Team
                </Link>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <AddMember />
      </div>
    )
  }
}
const TeamHome = membersProvider(TeamHomeDisplay)

export default Team
