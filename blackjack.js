// Blackjack game
// Isabella Funke

// global variables that hold the deck and the hands
cards = makeDeck();
currentDeck = shuffle(cards);
player = [currentDeck.pop(),currentDeck.pop()];
dealer = [currentDeck.pop(),currentDeck.pop()];
hold = true;
playerTotal = total(player)[0];
dealerTotal = total(dealer)[0];

// resets html every time something changes with the player's or the dealer's hand
function resetHTML() {
  var phand = document.getElementById('player_hand');
  var dhand = document.getElementById('dealer_hand');
  var presult = document.getElementById('player_result');
  var dresult = document.getElementById('dealer_result');
  var dh = dealerHand();
  var ph = playerHand();
  var pr = playerResult();
  var dr = dealerResult();
  phand.innerHTML = ph;
  dhand.innerHTML = dh;
  presult.innerHTML = pr;
  dresult.innerHTML = dr;
}

// resets the title with a message
function resetTitle(message) {
  var title = document.getElementById('title');
  title.innerHTML = message;
}

// shuffles the cards and deals them
function deal() {
  resetTitle("Welcome to Isabella's Blackjack Game");
  cards = makeDeck();
  currentDeck = shuffle(cards);
  player = [currentDeck.pop(),currentDeck.pop()];
  dealer = [currentDeck.pop(),currentDeck.pop()];
  hold = false;

  // need 2 calls to resetHTML to make sure the dealer's hand
  // is shown correctly 
  resetHTML();
  resetHTML();
    
}

// function when player hits
function hit() {
  if (!hold) {
    player.push(currentDeck.pop());

    // need 2 calls to resetHTML to make sure the dealer's hand
    // is shown correctly 
    resetHTML();
    resetHTML();
  }
}

// function when player holds
function holdFn() {
  if (!hold) {
    nums = total(player);
    hold = true;
    if (nums[0] <= 21) {
      playerTotal = nums[0];
    } else {
      playerTotal = nums[1];
    }

    dealerPlay();

    // reset title with result of game
    if (dealerTotal > 21) {
      resetTitle("You beat the dealer!");
    } else if (dealerTotal > playerTotal) {
      resetTitle("You lost to the dealer.");
    } else if (dealerTotal === playerTotal) {
      resetTitle("You tied with the dealer.");
    } else {
      resetTitle("You beat the dealer!");
    }
    resetHTML();
  }
}

// actions of dealer when the player holds 
// (assuming dealer does not hit on a soft 17)
function dealerPlay() {
  var done = false;
  var nums = total(dealer);
  while (!done) {
    if (nums[0] > 21) {
      if (nums[1] >= 17) {
        dealerTotal = nums[1];
        done = true;
      } else {
        dealer.push(currentDeck.pop());
      }
    } else {
      if (nums[0] > 17) {
        dealerTotal = nums[0];
        done = true;
      } else {
        dealer.push(currentDeck.pop());
      }
    }

    // recalculate total
    nums = total(dealer);
  }           
}

// returns string of player's hand
function playerHand() {
    return "Your Cards: " + player.toString();
}

// returns string of dealer's hand
// does not show first card if player is still playing
function dealerHand() {
  if (hold === true)
    return "Dealer's Cards: " + dealer.toString();
  else
    return "Dealer's Cards: __," + dealer[1];
}

// returns string of player's current total
function playerResult() {
  var nums = total(player);

  if (nums[0] === nums[1] || nums[0] > 21) {
    if (nums[1] === 21) {
      holdFn();
      return "You have a total of 21!";
    } else if (nums[1] > 21) {
      hold = true;
      resetTitle("You busted.");
      return "You busted with a total of " + nums[1].toString();
    } else {
      return "Your total = " + nums[1].toString();
    }
  } else {
    if (nums[0] == 21) {
      holdFn();
      return "You have a total of 21!";
    } else if (hold === true) {
      return "Your total = " + nums[0].toString();
    }
    return "Your total = " + nums[0].toString() + " or " + nums[1].toString();
  }

}

// returns string of dealer's current total
function dealerResult() {
  var nums = total(dealer);
  if (nums[0] === nums[1] || nums[0] > 21) {
    if (hold === true)
      return "Dealer total = " + nums[1].toString();
    else
      return "Hold or bust to see dealer's total";
  } else {
    if (hold === true)
      return "Dealer total = " + nums[0].toString();
    else
      return "Hold or bust to see dealer's total";
  }
}

// makes initial deck of cards (not shuffled)
function makeDeck() {
  var card = new Array();
  var suits = ["H","S","C","D"];
  for (var i = 0; i < 4; i++) {
    for (var j = 2; j < 10; j++) {
      card.push(j.toString() + suits[i]);
    }

    card.push("T" + suits[i]);
    card.push("J" + suits[i]);
    card.push("Q" + suits[i]);
    card.push("K" + suits[i]);
    card.push("A" + suits[i]);
  }
      
  return card;
}

// shuffles cards using Knuth Shuffle
// (copied from StackOverflow)
function shuffle(hand) {
  var currentIndex = hand.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = hand[currentIndex];
    hand[currentIndex] = hand[randomIndex];
    hand[randomIndex] = temporaryValue;
  }

  return hand;
}

// calculates total(s) for each hand
// the first number assumes the first ace would be counted as 11
// the second number assumes the first ace would be counted as 1
function total(hand) {
  var number = 0;
  var optional = 0;
  var aceChosen = false;

  // look through the hand
  for (var i=0; i < hand.length; i++) {

    // get the value of the card
    var num = hand[i].charAt(0);

    // add to the total depending on the card
    switch(num) {
      case "T": 
        number+=10; 
        optional+=10; 
        break;
      case "J": 
        number+=10; 
        optional+=10; 
        break;
      case "Q": 
        number+=10; 
        optional+=10; 
        break;
      case "K": 
        number+=10; 
        optional+=10; 
        break;
      case "A": 
        if (!aceChosen) {
          number+=11;
          optional+=1;
          aceChosen = true;
        } else {
          number+=1; optional+=1;
        }
        break;
      default: 
        number+=parseInt(num); 
        optional+=parseInt(num); 
        break;
    }
  }

  // return both possibilities for totals
  return [number,optional];
}
       
