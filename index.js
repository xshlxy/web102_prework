/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for(let i = 0;i<games.length;i++){
        // create a new div element, which will become the game card
        let div = document.createElement('div');
        // add the class game-card to the list
        div.classList.add("game-card");
         // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        div.innerHTML = `<img src="${games[i].img}" class="game-img" /> 
        <h3>${games[i].name}</h3> 
        <p>${games[i].description}</p>
        <p> Backers: ${games[i].backers}</p>
        `;
        // append the game to the games-container
        document.getElementById('games-container').appendChild(div);
    }

}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

// Search function
function filterGamesBySearch() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const filteredGames = GAMES_JSON.filter(game => {
        return game.name.toLowerCase().split(' ').some(word => word.startsWith(searchValue));
    });
    deleteChildElements(gamesContainer); // Clear current game cards
    addGamesToPage(filteredGames); // Display filtered games
}

// Sorting functions
function sortGamesByPledged() {
    const sortedGames = GAMES_JSON.slice().sort((a, b) => b.pledged - a.pledged);
    deleteChildElements(gamesContainer);
    addGamesToPage(sortedGames);
}

function sortGamesByBackers() {
    const sortedGames = GAMES_JSON.slice().sort((a, b) => b.backers - a.backers);
    deleteChildElements(gamesContainer);
    addGamesToPage(sortedGames);
}

// Event listeners for search input and sorting buttons
document.getElementById('search-input').addEventListener('input', filterGamesBySearch);
document.getElementById('sort-by-pledged-btn').addEventListener('click', sortGamesByPledged);
document.getElementById('sort-by-backers-btn').addEventListener('click', sortGamesByBackers);
/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers

const totalContributions = GAMES_JSON.reduce((total, games) => {
    return total + games.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `<p>${totalContributions.toLocaleString()}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalAmount = GAMES_JSON.reduce((total, games) => {
    return total + games.pledged;
}, 0);
// set inner HTML using template literal
raisedCard.innerHTML = `<p>${totalAmount.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML=`<p>${GAMES_JSON.length}</p>`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    
    let listOfUnfunded = GAMES_JSON.filter(games => {return games.pledged < games.goal;});

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(listOfUnfunded);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let listOfFunded = GAMES_JSON.filter(games => {return games.pledged >= games.goal;});

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(listOfFunded);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);
/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGamesCount = GAMES_JSON.reduce((count, games) => {
    return games.pledged < games.goal ? count + 1 : count;
}, 0);
const totalAmountRaised = GAMES_JSON.reduce((total, games) => total + games.pledged, 0);
const totalGamesCount = GAMES_JSON.length;
// create a string that explains the number of unfunded games using the ternary operator
const summaryMessage = `
    A total of $${totalAmountRaised.toLocaleString()} has been raised for ${totalGamesCount} game${totalGamesCount !== 1 ? 's' : ''}. 
    Currently, ${unfundedGamesCount} game${unfundedGamesCount !== 1 ? 's' : ''} remain unfunded.
    We need your help to fund these amazing games!
`;
// Create a new paragraph element
const summaryParagraph = document.createElement('p');

// Set the innerHTML of the paragraph element to the template string
summaryParagraph.innerHTML = summaryMessage;
// create a new DOM element containing the template string and append it to the description container
if (descriptionContainer) {
    descriptionContainer.appendChild(summaryParagraph);
}
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [topGame, secondTopGame, ...restOfGames] = sortedGames;
// create a new element to hold the name of the top pledge game, then append it to the correct element
const topGameElement = document.createElement("div");
topGameElement.innerHTML = `
    <h2>${topGame.name}</h2>`;
    if (firstGameContainer) {
        firstGameContainer.appendChild(topGameElement);
    }
    
// do the same for the runner up item
const secondTopGameElement = document.createElement("div");
secondTopGameElement.innerHTML = `
    <h2>${secondTopGame.name}</h2>`;
    if (secondGameContainer) {
        secondGameContainer.appendChild(secondTopGameElement);
    }
    