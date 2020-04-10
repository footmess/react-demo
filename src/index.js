import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// class Square extends React.Component {
// 	render() {
// 		return (
// 			<button className='square' onClick={() => this.props.custon()}>
// 				{this.props.value}
// 			</button>
// 		);
// 	}
// }

// 如果组件只包含render()函数，可以改写为函数组件
function Square(props) {
	return (
		<button className='square' onClick={props.custon}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		square: Array(9).fill(null),
	// 		xIsNext: true
	// 	};
	// }
	renderSquare(i) {
		return <Square value={this.props.square[i]} custon={() => this.props.onClick(i)} />;
	}

	render() {
		return (
			<div>
				{/* <div className='status'>{status}</div> */}
				<div className='board-row'>
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className='board-row'>
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className='board-row'>
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					square: Array(9).fill(null)
				}
			],
			xIsNext: true,
			// 当前正在查看哪一项历史记录
			stepNumber: 0,
			x: 0,
			y: 0
		};
	}

	handleClick(i) {
		// console.log(i);
		this.state.x = Number.parseInt(i / 3);
		this.state.y = i % 3;
		console.log({ x: this.state.x, y: this.state.y });
		// 历史记录
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		// 当前记录
		const current = history[history.length - 1];
		const squares = current.square.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] =
			this.state.xIsNext ? 'x' :
			'o';
		this.setState({
			history: history.concat([ { square: squares } ]),
			xIsNext: !this.state.xIsNext,
			stepNumber: history.length
		});
		// this.state.square[i] = 'x'
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0
		});
	}

	render() {
		// 历史记录
		const history = this.state.history;
		// 当前记录
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.square);

		const moves = history.map((step, move) => {
			const desc =
				move ? `move to #${move}` :
				`race start`;
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});
		let status;
		if (winner) {
			status = `Winner: ${winner}`;
		} else {
			status = `Next player: ${
				this.state.xIsNext ? 'x' :
				'o'}`;
		}
		return (
			<div className='game'>
				<div className='game-board'>
					<Board square={current.square} onClick={(i) => this.handleClick(i)} />
				</div>
				<div className='game-info'>
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}
function calculateWinner(squares) {
	const lines = [
		[ 0, 1, 2 ],
		[ 3, 4, 5 ],
		[ 6, 7, 8 ],
		[ 0, 3, 6 ],
		[ 1, 4, 7 ],
		[ 2, 5, 8 ],
		[ 0, 4, 8 ],
		[ 2, 4, 6 ]
	];
	for (let i = 0; i < lines.length; i++) {
		const [ a, b, c ] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

ReactDOM.render(<Game />, document.getElementById('root'));
