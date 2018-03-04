import React, {Component} from 'react';
import logo from './logo.svg';
import './css/App.css';
import loader from './images/loader.svg';
import Gif from './Gif';
import closeIcon from './images/close-icon.svg';

const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {hasResults ? (
      <button onClick={clearSearch}>
        <img className="" src={closeIcon} />
      </button>
    ) : (
      <h1 className="title" onClick={clearSearch}>
        Silvia's Wiffy
      </h1>
    )}
  </div>
);

const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    {/*test ? true:false*/}
    {loading ? <img className="block mx-auto" src={loader} /> : hintText}
  </div>
);

const randomChoice = arr => {
  const arrIndex = Math.floor(Math.random() * arr.length);
  return arr[arrIndex];
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      hintText: '',
      gifs: [],
      loading: false
    };
  }

  //reset state
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: [],
      loading: false
    }));
    this.textInput.focus();
  };

  //we want a function that searches the giphy api
  searchGiphy = async searchTerm => {
    //try our fetch
    this.setState({
      loading: true
    });
    try {
      //await is a way for us to wait for our response to come back
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=I53RN1b1KPot3FpPLgCbhFidcvpXhI51&q=${searchTerm}&limit=25&offset=0&rating=PG-13&lang=en`
      );

      //wait for it to be converted to json
      const {data} = await response.json();
      // check if results are empty -> show error

      if (!data.length) {
        throw `Nothing found for ${searchTerm}`;
      }

      const randomGif = randomChoice(data);

      this.setState((prevState, props) => ({
        ...prevState,
        //concat array
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit enter see more ${searchTerm}`
      }));

      console.log(data);
    } catch (error) {
      console.log(error);
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }));
    }
  };

  handleChange = event => {
    const {value} = event.target;

    //this is how we create a controlled input
    this.setState((prevState, props) => ({
      //we take our old props and spread here then overwrite the one we want after
      ...prevState,
      searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }));
  };

  //when we have 2 or more characters and we have pressed enter we will run a search

  handleKeyPress = event => {
    const {value} = event.target;
    const {key} = event;

    if (value.length > 2 && key === 'Enter') {
      //passing our search term
      this.searchGiphy(value);
    }

    console.log('key pressed' + key);
  };

  render() {
    const {searchTerm, gif} = this.state;
    const hasResults = this.state.gifs.length;
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        <div className="search grid">
          {/* {here we loop over our array of gifs} */}
          {this.state.gifs.map(gif => <Gif {...gif} />)}

          <input
            className="input grid-item"
            placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={input => {
              this.textInput = input;
            }}
          />
        </div>
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
