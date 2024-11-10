import React from 'react';
import './App.scss';

function getRandomName(): string {
  const value = Date.now().toString().slice(-4);

  return `Clock-${value}`;
}

interface AppState {
  hasClock: boolean;
  clockName: string;
}

interface ClockProps {
  name: string;
}

interface ClockState {
  time: string;
}

class Clock extends React.Component<ClockProps, ClockState> {
  timerId: number | undefined;

  constructor(props: ClockProps) {
    super(props);
    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      time: new Date().toUTCString().slice(-12, -4),
    };
  }

  componentDidMount() {
    this.timerId = window.setInterval(() => {
      const currentTime = new Date().toUTCString().slice(-12, -4);

      this.setState({ time: currentTime });
      // eslint-disable-next-line no-console
      console.log(currentTime);
    }, 1000);
  }

  componentWillUnmount() {
    if (this.timerId) {
      window.clearInterval(this.timerId);
    }
  }

  render() {
    return (
      <div className="Clock">
        <strong className="Clock__name">{this.props.name}</strong>
        {' time is '}
        <span className="Clock__time">{this.state.time}</span>
      </div>
    );
  }
}

class App extends React.Component<{}, AppState> {
  timerId: number | undefined;

  clockNameTimerId: number | undefined;

  constructor(props: {}) {
    super(props);
    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      hasClock: true,
      clockName: 'Clock-0',
    };
  }

  componentDidMount() {
    this.startClockNameUpdater();

    document.addEventListener('contextmenu', this.handleContextMenu);
    document.addEventListener('click', this.handleLeftClick);
  }

  componentWillUnmount() {
    if (this.clockNameTimerId) {
      window.clearInterval(this.clockNameTimerId);
    }

    document.removeEventListener('contextmenu', this.handleContextMenu);
    document.removeEventListener('click', this.handleLeftClick);
  }

  startClockNameUpdater() {
    this.clockNameTimerId = window.setInterval(() => {
      this.updateClockName();
    }, 3300);
  }

  updateClockName() {
    this.setState(prevState => {
      const oldName = prevState.clockName;
      const newName = getRandomName();

      if (oldName !== newName) {
        // eslint-disable-next-line no-console
        console.warn(`Renamed from ${oldName} to ${newName}`);
      }

      return { clockName: newName };
    });
  }

  handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({ hasClock: false });
  };

  handleLeftClick = () => {
    this.setState({ hasClock: true });
  };

  render() {
    return (
      <div className="App">
        <h1>React clock</h1>
        {this.state.hasClock && <Clock name={this.state.clockName} />}
      </div>
    );
  }
}

export default App;
