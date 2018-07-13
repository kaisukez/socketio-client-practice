import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import config from '../config.json';
import { initializeSocket } from '../actions';

import Board from '../components/Board';

class BoardContainer extends Component {
  constructor(props) {
    super(props)
    const boardState = Array(8).fill('').map(a => Array(8).fill(false))
    this.state = { boardState }
  }

  componentWillMount() {
    console.log('board container', this.props.socket)
    if (Object.keys(this.props.socket).length === 0) {
      const socket = io.connect(`${ config.server }`);
      this.props.initializeSocket(socket);
    }
  }

  squareClicked = position => {
    const x = position.x
    const y = position.y
    const newBoardState = this.state.boardState.slice()
    newBoardState[y][x] = !newBoardState[y][x]
    this.setState({ boardState: newBoardState })
  }

  render() {
    const boardProps = {
      boardState: this.state.boardState,
      squareClicked: this.squareClicked,
      goToLobby: () => this.props.goTo('lobby'),
    }

    return <Board { ...boardProps } />
  }
}

const mapStateToProps = state => ({
  socket: state.socket
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ initializeSocket }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);