const $ = el => document.querySelector(el);
const $A = el => document.querySelectorAll(el);
let highestID;
const addInput = $('#add-input');
const container = $('.container');
const form = $('form');
const itemContainer = $('.item-container');
const checkedItemContainer = $('.checked-item-container');

// returns <div class="form-check">
const FormCheck = function FormCheck() {
    const div = document.createElement('div');
    div.classList.add('form-check');

    return div;
}

// returns <input class="form-check-input" type="checkbox" id="checkbox-*">
const CheckBox = function CheckBox(status, id) {
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.classList.add('form-check-input');
    input.id = `checkbox-${id}`;

    if (status === 'checked') {
        input.checked = 'true';
    }

    return input;
}

const Label = function Label(p, id) {
    const label = document.createElement('label');
    const textNode = document.createTextNode(p);

    label.classList.add('form-check-label');
    label.appendChild(textNode);
    label.id = `label-${id}`;
    label.setAttribute('for', `checkbox-${id}`);

    return label;
}

function addToContainer(el, itemID, container) {
    let children = []
    for (let i = 0; i<container.childElementCount; i++) {
        //adds the id of each existing checkbox to an array for comparing later
        /*
        <div class="form-check">
            <input type="checkbox" class="form-check-input" id="checkbox-0"> <-- this gets this ID
            <label class="form-check-label" id="label-0" for="checkbox-0">123</label>
        </div>
        */
        children.push(container.children[i].children[0].id);
    }
    //now get just the id numbers of each element into new array
    let idNums = children.map(x => x.split('-')[1]);

    //finds the element with ID one larger than element to be added
    let largerID = idNums.find(j => j > itemID);

    //if no element with larger ID, add new element to the end of container
    if (!largerID) {
        container.appendChild(el);
    }
    // else add new element before the element with the larger ID
    else {
        let higherEl = $(`#checkbox-${largerID}`).parentElement; //parentElement grabs div rather than checkbox
        container.insertBefore(el, higherEl);
    }
}

function addItem(item) {
    highestID += 1;

    const checkbox = new CheckBox(item.status, item.id);
    const label = new Label(item.value, item.id);
    const formCheck = new FormCheck();

    formCheck.appendChild(checkbox);
    formCheck.appendChild(label);

    if (item.status === 'unchecked') {
        addToContainer(formCheck, item.id, itemContainer);
    }
    else if (item.status === 'checked') {
        addToContainer(formCheck, item.id, checkedItemContainer);
    }
}

function checkItem(el) {
    itemContainer.removeChild(el);

    let id = el.children[0].id.split('-')[1];
    addToContainer(el, id, checkedItemContainer);

    const value = el.children[1].innerHTML;
    const item = localStorage.getObject(id);
    item.status = 'checked'
    localStorage.setObject(id, item);
}

function uncheckItem(el) {
    checkedItemContainer.removeChild(el);

    let id = el.children[0].id.split('-')[1];
    addToContainer(el, id, itemContainer);

    const value = el.children[1].innerHTML;
    const item = localStorage.getObject(id);
    item.status = 'unchecked'
    localStorage.setObject(id, item);
}

function retrieveLocalStorage() {
    if (localStorage.length) {
        let ids = [];
            for (let i = 0; i < localStorage.length; i++){
                const item = localStorage.getObject(localStorage.key(i));
                addItem(item);
                ids.push(item.id);
            }

        //gets highest ID from local storage
        highestID = ids.sort()[ids.length-1] + 1;
    }
    else {
        highestID = 0;
    }
}

form.addEventListener('submit', e => {
    e.preventDefault(); //stop page refreshing
    if (addInput.value) {
        const newItem = {
            value: addInput.value,
            status: 'unchecked',
            id: highestID
        }
        addItem(newItem);
        localStorage.setObject(newItem.id, newItem);
        addInput.value = ''; //clear box
    }
}, false);

document.addEventListener('click', (el) => {
    if (el.target.matches('.form-check-input') && el.target.checked) {
        checkItem(el.target.parentElement);
    }
    else if (el.target.matches('.form-check-input') && !el.target.checked) {
        uncheckItem(el.target.parentElement);
    }
}, false);

window.addEventListener('load', () => {
    retrieveLocalStorage();
}, false);

//add methods to local storage in order to be able to store and retrieve objects
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
  var value = this.getItem(key);
  return value && JSON.parse(value);
}
