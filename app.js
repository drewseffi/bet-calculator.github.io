var single = document.getElementById('single');
var double = document.getElementById('double');
var treble = document.getElementById('treble');

var betDetailsText = document.getElementById('bet-breakdown');

var numSelections = document.getElementById('numOfSelections');

let selectedBets = [];

var unitStake = 0;
var totalStake = 0;

var topInput = [];
var bottomInput = [];

// Adds rows to the selections group dynamically
function valueChange() 
{
    var container = document.getElementById('dynamic');
    var template = document.getElementById('template')

    var clone = template.content.cloneNode(true);

    document.getElementById('dynamic').appendChild(clone);
}

// Updates the unit stake when changed on the page
function updateStake(field)
{
    unitStake = parseInt(field.value);
    updateTotalStake();
}

function updateTotalStake()
{
    //const totalStakeDisplay = document.getElementById('totalStake');

    //totalStake = unitStake * numSelections.value;
    //totalStakeDisplay.textContent = "Total stake: " + totalStake;
}

/**
 * Makes sure all inputs in input fields are valid
 * 
 * @param {document.getElementById} field - The field the function is meant to sanitize
 * @param {number} type - What type of field the function is meant to be sanitizing
 * 
 * type 1 = field is from an odds selection, min value is 1, default value 1
 * type 2 = field is from the stake selection, min value is 0, default value 1
 */

function sanitize(field, type) 
{
    if (type == 1)
    {
        if (parseInt(field.value) < 1 || isNaN(parseInt(field.value)) || field.value == "")
        {
            field.value = 1;
        }
        if (field.value % 1 !== 0)
        {
            field.value = 1;
        }
    }
    else if (type == 2)
    {
        if (parseInt(field.value) < 0 || isNaN(parseInt(field.value)) || field.value == "")
        {
            field.value = 0;
        }
    }
}

/**
 * Updates bet boxes colour
 * 
 * Logic:
 *  - If the bet number of selections matches the min and max requirements for a bet set the colour to red
 *  - If not set the colour to grey
 *  - Also removes "selected" class from any bet that is no longer available (if you selected a double then removed selections down to one it would still be selected)
 */
function updateBoxes() {
    document.querySelectorAll(".bet-type").forEach(box => {

        const min = parseInt(box.dataset.min);
        const max = parseInt(box.dataset.max);

        box.classList.remove("red", "grey");

        if (numSelections.value >= min && numSelections.value <= max) {
            box.classList.add("red");
        } else {
            box.classList.add("grey");
            if (box.classList.contains('selected'))
            {
                box.classList.remove('selected');
                selectedBets = selectedBets.filter(x => x !== box.id);
            }
        }
    });
}

/**
 * Clears and sanitizes all inputs on load
 *  - Waits for DOM to load before running
 */
function load()
{
    var field = document.getElementById('numOfSelections');
    field.value = 1;
    updateBoxes(1);
    topInput.push(1);
    bottomInput.push(1);
    var u = document.getElementById('unitStake');
    u.value = 1;
    updateStake(u);
}

// Adds a selection to the list and updates the stake and bet details
function addSelection()
{
    if (numSelections.value < 15)
    {
        numSelections.value++;
        valueChange();
    }

    updateTotalStake();
    betDetails();
}

// Removes a selection from the list and updates the stake and bet details
function removeSelection(button)
{
    if (numSelections.value > 1)
    {
        numSelections.value--;
        button.parentElement.remove();
    }

    updateTotalStake();
    updateBoxes();
    betDetails();
}

// Writes the bet details text for single bets
function singleText()
{
    const parent = document.getElementById('bet-breakdown');

    var t = document.createElement("p");
    t.textContent = numSelections.value + "x singles, " + unitStake + " stake";
    t.style = "margin: 0";
    t.id = "singleText";
    parent.appendChild(t);
}

/**
 * Writes the bet details for double bets
 * 
 * Logic:
 *  - Calculates the number of unique pairs of selections using the formula n * (n - 1) / 2
 */
function doubleText()
{
    const parent = document.getElementById('bet-breakdown');

    var n = Number(numSelections.value);
    let pairs = n * (n - 1) / 2;

    var t = document.createElement("p");
    t.textContent = pairs + "x doubles, " + unitStake + " stake";
    t.style = "margin: 0";
    t.id = "doubleText";
    parent.appendChild(t);
}

/**
 * Writes the bet details for treble bets
 * 
 * Logic:
 *  - Calculates the number of unique 3 combinations using the formula (n * (n - 1) * (n - 2)) / 6
 */
function trebleText()
{
    const parent = document.getElementById('bet-breakdown');

    var n = Number(numSelections.value);
    let trebles = (n * (n - 1) * (n - 2)) / 6;

    var t = document.createElement("p");
    t.textContent = trebles + "x trebles, " + unitStake + " stake";
    t.style = "margin: 0";
    t.id = "trebleText";
    parent.appendChild(t);
}

/**
 * Checks what bet types are selected and what bets need displayed
 * 
 * Logic:
 *  - Clears the bet breakdown section before it is run to ensure no duplicates
 *  - Switch for each different type of bet
 *  - Some bets are just named combinations of singles, doubles, trebles and accumulators so dont need their own functions
 */
function betDetails()
{
    const parent = document.getElementById('bet-breakdown');

    parent.innerHTML = "";

    for (let i = 0; i < selectedBets.length; i++)
    {
        switch (selectedBets[i])
        {
            case 'single':
                singleText();
                break;

            case 'double':
                doubleText();
                break;

            case 'treble':
                trebleText();
                break;
        }
    }
}

/**
 * OnClick event for bet type buttons to select them
 * 
 * Logic:
 *  - Checks if a button is available to press
 *  - If it is, toggle the selected class
 *  - If selected add it to the selected bets array and update bet details
 *  - If not selected, filter the list so that it no longer contains that selection and update bet details
 */
document.querySelectorAll('.bet-type').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('red'))
        {
            btn.classList.toggle('selected');

            var id = btn.id;

            if (btn.classList.contains('selected'))
            {
                selectedBets.push(id);
                betDetails();
            }
            else
            {
                selectedBets = selectedBets.filter(x => x !== id);
                betDetails();
            }
        }
    });
});

/**
 * Calculate a single win bet
 * 
 * @param {number} i - Iteration of the loop in the calculate function
 * @returns - Total returns for the bet
 * 
 * Logic:
 *  - ((numerator / denominator) * unitStake) + unitStake
 *  - This is a basic formula for betting a single bet, this is looped for every selection in the calulate function
 */
function singleBet(i)
{
    let returns = 0;

    var r = ((topInput[i] / bottomInput[i]) * unitStake) + unitStake;
    returns = returns + r;

    return returns;
}

/**
 * Calculate any number of double bets
 * 
 * Logic:
 *  - Loops through all pairs of numerator and denominators
 *  - Calculates the total odds of each bet (selection1odds * selection2odds)
 *  - Loops through all possible doubles and calculates the returns
 * 
 * @returns - Total returns of the bets
 */
function doubleBet()
{
    let returns = 0;

    var results = [];

    for (let i = 0; i < topInput.length; i++) {
        for (let j = i + 1; j < topInput.length; j++) {

            var a = (topInput[i] / bottomInput[i]) + 1;
            var b = (topInput[j] / bottomInput[j]) + 1;

            results.push(a * b);
        }
    }

    for (let k = 0; k < results.length; k++)
    {
        returns += results[k] * unitStake;
    }

    return returns;
}

/**
 * Calculate any number of treble bets
 * 
 * Logic:
 *  - Loops through all groups of 3 numerators and denominators
 *  - Calculates the total odds of each bet (selection1odds * selection2odds * selection3odds)
 *  - Loops through all possible trebles and calculates the returns
 * 
 * @returns - Total returns of the bets
 */
function trebleBet()
{
    let returns = 0;

    var results = [];

    for (let i = 0; i < topInput.length; i++) {
        for (let j = i + 1; j < topInput.length; j++) {
            for (let k = j + 1; k < topInput.length; k++)
            {
                var a = (topInput[i] / bottomInput[i]) + 1;
                var b = (topInput[j] / bottomInput[j]) + 1;
                var c = (topInput[k] / bottomInput[k]) + 1;

                results.push(a * b * c);
            }
        }
    }

    for (let count = 0; count < results.length; count++)
    {
        returns += results[count] * unitStake;
    }

    return returns;
}

/**
 * Calculates an accumulator bet
 * 
 * Logic:
 *  - Loops through all numerators and denominators and gets their odds
 *  - Multiplies these odds together to get the total accumulator bet odds
 *  - Calculates total returns
 * 
 * @returns - Total returns of the bet
 */
function accBet()
{
    // Checks to see if all selections won
    if (numSelections.value != topInput.length)
    {
        return 0;
    }

    let returns = 0;
    let totalOdds = 1;

    for (let i = 0; i < numSelections.value; i++)
    {
        totalOdds *= ((topInput[i] / bottomInput[i]) + 1);
    }

    returns = totalOdds * unitStake;
    return returns;
}

/**
 * Calls all bet funtions required to get total returns
 * 
 * Logic:
 *  - Clears all variable and gets all odds input
 *  - Loops through each selected bet and check what bet type they are
 *  - Calls appropriate bet calculation function and adds to the total
 *  - Ouputs the total returns to the user
 */
function calculate()
{
    if (selectedBets.length > 0)
    {
        let total = 0;
        topInput = [];
        bottomInput = [];
        getAllOdds();

        if (contains(selectedBets, 'single'))
        {
            const num = Number(topInput.length);

            for (let i = 0; i < num; i++)
            {
                total += singleBet(i);
            }
        }

        if (contains(selectedBets, 'double'))
        {
            total += doubleBet()
        }

        if (contains(selectedBets, 'treble'))
        {
            total += trebleBet()
        }

        if (contains(selectedBets, 'trixie'))
        {
            total += doubleBet();
            total += trebleBet();
        }

        if (contains(selectedBets, 'patent'))
        {
            const num = Number(numSelections.value);

            for (let i = 0; i < num; i++)
            {
                total += singleBet(i);
            }

            total += doubleBet();
            total += trebleBet();
        }

        if (contains(selectedBets, 'acc'))
        {
            total += accBet();
        }

        if (selectedBets.length > 0)
        {
            var returnText = document.getElementById('totalReturns');
            var profitText = document.getElementById('totalProfit');

            if (topInput.length == 0)
            {
                total = 0;
            }

            returnText.textContent = "Total returns: " + total;
            console.log(total);

            let profit = total - totalStake;
            profitText.textContent = "Total profit: " + profit;
        }
    }
}

/**
 * Contains function for checking if an item is in an array
 * - Taken from stack overflow user brad at: https://stackoverflow.com/questions/237104/how-do-i-check-if-an-array-includes-a-value-in-javascript
 * 
 * @param {array[]} a - The array to search through
 * @param {*} obj - The item the function is looking for
 * @returns - True or false based on if the function found the item
 */
function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

/**
 * Gets all winning odds on the page and stores them in the array
 * 
 * topInput - The numerator
 * bottomInput - The denominator
 */
function getAllOdds()
{
    const rows = document.querySelectorAll('.selection-details');

    rows.forEach(row => {

        if (row.classList.contains('winner'))
        {
            var inputs = row.querySelectorAll('input.odds');

            topInput.push(Number(inputs[0].value));
            bottomInput.push(Number(inputs[1].value));
        }
    })
}

function clearOutcome(c) {
    c.classList.forEach(elem => {
        if (elem !== 'selection-details')
        {
            c.classList.remove(elem);
        }
    });
}

// Makes selection a winner and adds winner class
function makeWinner(text)
{
    var c = text.closest('.selection-details');

    clearOutcome(c);

    c.classList.add('winner');

    text.closest('.dropdown').querySelector('.dropdown-label').textContent = "Winner";
}

// Makes selection placed and adds placed class
function makePlaced(text)
{
    var c = text.closest('.selection-details');

    clearOutcome(c);

    c.classList.add('placed');

    text.closest('.dropdown').querySelector('.dropdown-label').textContent = "Placed";
}

// Makes selection a loser and adds loser class
function makeLoser(text)
{
    var c = text.closest('.selection-details');

    clearOutcome(c);

    c.classList.add('loser');

    text.closest('.dropdown').querySelector('.dropdown-label').textContent = "Lost";
}