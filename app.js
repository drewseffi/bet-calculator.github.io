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
    const totalStakeDisplay = document.getElementById('totalStake');

    totalStake = unitStake * numSelections.value;
    totalStakeDisplay.textContent = "Total stake: " + totalStake;
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
}

document.querySelectorAll('.bet-type').forEach(btn => {
    btn.addEventListener('click', () => {
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
    });
});

function singleBet(i)
{
    let returns = 0;

    var r = ((topInput[i] / bottomInput[i]) * unitStake) + unitStake;
    returns = returns + r;

    return returns;
}

function calculate()
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

    var returnText = document.getElementById('totalReturns');
    var profitText = document.getElementById('totalProfit');

    returnText.textContent = "Total returns: " + total;

    console.log(totalStake);

    let profit = total - totalStake;
    profitText.textContent = "Total profit: " + profit;

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