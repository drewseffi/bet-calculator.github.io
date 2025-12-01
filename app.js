var single = document.getElementById('single');
var double = document.getElementById('double');
var treble = document.getElementById('treble');

var numSelections = document.getElementById('numOfSelections');

let selectedBets = [];

var unitStake = 0;
var totalStake = 0;

var topInput = [];
var bottomInput = [];

function valueChange() 
{
    var container = document.getElementById('dynamic');
    var template = document.getElementById('template')

    var clone = template.content.cloneNode(true);

    document.getElementById('dynamic').appendChild(clone);
}

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

function addSelection()
{
    if (numSelections.value < 15)
    {
        numSelections.value++;
        valueChange();
    }

    updateTotalStake();
}

function removeSelection(button)
{
    if (numSelections.value > 1)
    {
        numSelections.value--;
        button.parentElement.remove();
    }

    updateTotalStake();
    updateBoxes();
}

document.querySelectorAll('.bet-type').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('red'))
        {
            btn.classList.toggle('selected');

            var id = btn.id;

            if (btn.classList.contains('selected'))
            {
                selectedBets.push(id);
            }
            else
            {
                selectedBets = selectedBets.filter(x => x !== id);
            }
        }
    });
});

function singleBet(i)
{
    let returns = 0;

    var r = ((topInput[i] / bottomInput[i]) * unitStake) + unitStake;
    returns = returns + r;

    return returns;
}

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

function accBet()
{
    let returns = 0;
    let totalOdds = 1;

    for (let i = 0; i < numSelections.value; i++)
    {
        totalOdds *= ((topInput[i] / bottomInput[i]) + 1);
    }

    returns = totalOdds * unitStake;
    return returns;
}

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
            const num = Number(numSelections.value);

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

            returnText.textContent = "Total returns: " + total;

            let profit = total - totalStake;
            profitText.textContent = "Total profit: " + profit;

            console.log(selectedBets);
        }
    }
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function getAllOdds()
{
    const rows = document.querySelectorAll('.selection-details');

    rows.forEach(row => {
        var inputs = row.querySelectorAll('input.odds');

        topInput.push(Number(inputs[0].value));
        bottomInput.push(Number(inputs[1].value));
    })
}