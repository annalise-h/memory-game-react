import React from "react";
import "./App.css";
import MemoryCard from "./components/MemoryCard";

function generateDeck() {
  const symbols = ["∆", "ß", "£", "§", "•", "$", "+", "ø"];
  const deck = [];

  for (let i = 0; i < 16; i++) {
    deck.push({
      isFlipped: false,
      symbol: symbols[i % 8],
    });
  }

  shuffle(deck);
  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      deck: generateDeck(),
      pickedCards: [],
    };
  }

  pickCard(cardIndex) {
    const card = this.state.deck[cardIndex];

    // if the picked card is already flipped, do nothing
    if (card.isFlipped) return;

    // create a copy of the picked card and set isFlipped state to true
    const cardToFlip = { ...card };
    cardToFlip.isFlipped = true;

    // add the flipped card to our pickedCards array
    let newPickedCards = this.state.pickedCards.concat(cardIndex);

    // create a new copy of the deck where the state of cards that are flipped is updated
    const newDeck = this.state.deck.map((card, index) => {
      if (cardIndex === index) {
        return cardToFlip;
      }

      return card;
    });
    // when we have two picked cards, check if they don't match
    // if they don't match, unflip our cards and update to deck to reflect that
    if (newPickedCards.length === 2) {
      const [card1Index, card2Index] = newPickedCards;

      if (newDeck[card1Index].symbol != newDeck[card2Index].symbol) {
        setTimeout(this.unflipCards.bind(this, card1Index, card2Index), 1000);
      }

      newPickedCards = [];
    }

    this.setState({
      deck: newDeck,
      pickedCards: newPickedCards,
    });
  }

  unflipCards(card1Index, card2Index) {
    const card1 = { ...this.state.deck[card1Index] };
    const card2 = { ...this.state.deck[card2Index] };
    card1.isFlipped = false;
    card2.isFlipped = false;

    const newDeck = this.state.deck.map((card, index) => {
      if (index === card1Index) return card1;
      if (index === card2Index) return card2;
      return card;
    });

    this.setState({ deck: newDeck });
  }

  render() {
    const cardsJSX = this.state.deck.map((card, index) => {
      return (
        <MemoryCard
          symbol={card.symbol}
          isFlipped={card.isFlipped}
          pickCard={this.pickCard.bind(this, index)}
          key={index}
        />
      );
    });

    return (
      <div className="App">
        <header className="App-header">
          <h1>Memory Game</h1>
          <h3 id="subtitle">Match cards to win</h3>
        </header>
        <div id="card-row-1">
          {cardsJSX.slice(0, 4)}
          <div id="card-row-2">{cardsJSX.slice(4, 8)}</div>
          <div id="card-row-3">{cardsJSX.slice(8, 12)}</div>
          <div id="card-row-4">{cardsJSX.slice(12, 16)}</div>
        </div>
      </div>
    );
  }
}

// export default App;

export default App;
