const $ = el => document.querySelector(el);
const $A = el => document.querySelectorAll(el);
let itemCount = 0;
const addInput = $('#add-input');
const container = $('.container');
const form = $('form');

const FormCheck = function FormCheck() {
    const div = document.createElement('div');
    div.classList.add('form-check');

    return div;
}

const CheckBox = function CheckBox() {
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.classList.add('form-check-input');
    input.id = `checkbox-${itemCount}`;

    return input;
}

const Label = function Label(p) {
    const label = document.createElement('label');
    const textNode = document.createTextNode(p);

    label.classList.add('form-check-label');
    label.appendChild(textNode);
    label.id = `label-${itemCount}`;
    label.setAttribute('for', `checkbox-${itemCount}`);

    return label;
}

function addItem(text) {
    itemCount += 1;

    const checkbox = new CheckBox();
    const label = new Label(text);
    const formCheck = new FormCheck();

    formCheck.appendChild(checkbox);
    formCheck.appendChild(label);
    container.appendChild(formCheck);
}

function moveToBottom(el) {
    container.removeChild(el);
    container.appendChild(el);
}

form.addEventListener('submit', e => {
    e.preventDefault(); //stop page refreshing
    addItem(addInput.value); //add a new check item with the value from box
    addInput.value = ''; //clear box
}, false);

document.addEventListener('click', (el) => {
    if (el.target.matches('.form-check-input')) {
        moveToBottom(el.target.parentElement);
    }
}, false);
