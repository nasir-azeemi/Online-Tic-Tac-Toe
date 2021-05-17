import React from 'react';
import ReactDOM from 'react-dom';
import './Game.css';
import Button from '@material-ui/core/Button';
import Confetti from 'react-confetti'
// import useWindowSize from 'react-use-window-size'
import socketClient  from "socket.io-client";
import AccountProfile from './account_profile';


function Square(props) {
  var color1= "orange";
  if (props.value === 'X')
  {
    color1="blue";
  }
  return (
      <button className="square" onClick={props.onClick} style={{color:color1}}>
        {props.value}
      </button>
    );
  }

  function viewProfile(){
    return(
      <Button
        type="submit"
          fullWidth
          variant="contained"
          color="primary"
          href={"/profile"}
          // disabled={!status}
        >
          View Profile
        </Button>
    );
  }


  class Board extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        squares: Array(9).fill(null),
        xIsNext: true,
        winner: false,
        socket: this.props.socket,
        symbol: 'X',
        myTurn: null,
        started: false,
      };
    }
    
    handleClick(i) {
      if (!this.state.myTurn) {
        return;
      }
      
      let squares = this.state.squares.slice();


      var m_sym = null;
      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      this.state.socket.emit("make.move", { // Valid move (on client side) -> emit to server
        symbol: this.state.symbol,
        position: i
        });


      this.setState({
        squares: squares,
        // xIsNext: !this.state.xIsNext,
      })

    }
    
    
    renderSquare(i) {
      return (<Square 
        value={this.state.squares[i]} 
        onClick={()=> this.handleClick(i)}
        />);
      }
      
      
      componentDidMount() {
        const socket = this.state.socket;
        
        socket.on("game.begin", (data) => {
          
          this.setState({
            symbol: data.symbol, // The server is assigning the symbol
            myTurn: data.symbol === "X", // 'X' starts first
            started: true,
        })
      })
      
      //Bind event on players move
      socket.on("move.made", (data) => {
        let squares = this.state.squares.slice();
        squares[data.position] = (data.symbol); // Render move
        
        // If the symbol of the last move was the same as the current player
        // means that now is opponent's turn
        this.setState({
          myTurn: data.symbol !== this.state.symbol,
          squares: squares,
        })
        if (calculateWinner(this.state.squares)===this.state.symbol) {
          this.props.setWinner();
        }
        
      })
      
    }
    
    
    componentWillUnmount() {
      const socket = this.state.socket;
      socket.off("game.begin");
      socket.off("move.made");
      
    }
    
    
    render() {
      const winner = calculateWinner(this.state.squares);
      let status, draw;
      if (winner) {
        status = 'Winner: ' + winner;
        if(winner !== this.state.symbol)
        status += '\t:((((((((((((((((';
      }
      
      else if(checkDraw(this.state.squares))
      {
        status = 'Draw';
        draw= true;
      } 
      else {
        status = 'Player: ' + (this.state.symbol);
      }
    

      let status_class = winner? "status_winner":draw?"status_draw":"status";
      let waiting_msg = this.state.started ? null : "Waiting for opponent...";
      return ( 
        <div>
          <div className={status_class}>
            {status}
          </div>
          <div className="row border-b">
            <div className="col border-r">
              {this.renderSquare(0)}
            </div>
            <div className="col border-r">
              {this.renderSquare(1)}
            </div>
            <div className="col">
              {this.renderSquare(2)}
            </div>
          </div>

          <div className="row border-b">
            <div className="col border-r">
              {this.renderSquare(3)}
            </div>
            <div className="col border-r">
              {this.renderSquare(4)}
            </div>
            <div className="col">
              {this.renderSquare(5)}
            </div>
          </div>

          <div className="row">
            <div className="col border-r">
              {this.renderSquare(6)}
            </div>
            <div className="col border-r">
              {this.renderSquare(7)}
            </div>
            <div className="col">
              {this.renderSquare(8)}
            </div>
          </div>
        
        <div>
          <br/>
          {waiting_msg}
        </div>

        </div>
      );
    }
  }
  
  class GameOnline extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
      apiResponse: "", 
      gameWinner: false,
      socket: socketClient("http://localhost:9000"),
      token: this.props.m_token,
    };
 
  }
  
  callAPI() {
      fetch("http://localhost:9000/game/clear")
          .then(res => res.text())
          .then(res => this.setState({ apiResponse: "Board Reset!" }));
  }

  renderConfetti(){
      if (this.state.gameWinner){
        return (<Confetti/>)
      }
  }

  componentDidMount() {
      // this.callAPI();
      
  }

    boardSetWinner=()=>{
      this.setState({gameWinner:true});
    }
    render() {
      let player1Profile = "";
      let profileButton = "";
      // if(this.state.started){
        player1Profile = <AccountProfile m_token={this.state.token} />
        profileButton = viewProfile();
      // }
      // console.log(this.state.token);
      return (
        <div>
          {this.renderConfetti()}
          <Button variant="contained" color="default" size='large' href="/">Abandon</Button>

          <div className="game">
            <Board setWinner={this.boardSetWinner} socket ={this.state.socket}/>
          </div>
          <div className = "profile" align="left"> 
            {player1Profile}
            {profileButton}
          </div>
          

          {/* <div className="game">

            <p className="App-intro">"Test: " + {this.state.apiResponse}</p>
            <ol>{/* TODO </ol></div> */}
          
        </div>
      );
    }
  }
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function checkDraw(squares) {
    for (let i = 0; i < squares.length; i++) {
      if(squares[i] == null){
        return false;
      }
    }
    return true; 
  }


export default GameOnline;