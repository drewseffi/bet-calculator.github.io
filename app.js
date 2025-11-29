var single = document.getElementById('single');
var double = document.getElementById('double');
var treble = document.getElementById('treble');

var numSelections = document.getElementById('numOfSelections');

function valueChange() 
{
    var container = document.getElementById('dynamic');
    var template = document.getElementById('template')

    var clone = template.content.cloneNode(true);

    document.getElementById('dynamic').appendChild(clone);
}

function sanitize(field) 
{
    if (parseInt(field.value) < 1 || isNaN(parseInt(field.value)) || field.value == "")
    {
        field.value = 1;
    }
}

function updateBoxes() {
    document.querySelectorAll(".bet-type").forEach(box => {

        const min = parseInt(box.dataset.min);
        const max = parseInt(box.dataset.max);

        // reset classes
        box.classList.remove("red", "grey");

        // check if current value is within the allowed range
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
}

function addSelection()
{
    if (numSelections.value < 15)
    {
        numSelections.value++;
        valueChange();
    }
}

function removeSelection(button)
{
    if (numSelections.value > 1)
    {
        numSelections.value--;
        button.parentElement.remove();
    }
}