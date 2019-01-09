const $ = el => document.querySelector(el);
const $A = el => document.querySelectorAll(el);
const addInput = $('#add-input');
const container = $('.container');
const form = $('form');
const itemContainer = $('.item-container');
const checkedItemContainer = $('.checked-item-container');
const divider = $('.divider');
const removeTickedBtn = $('.remove-ticked');
const noItems = $('.no-items');
let highestID;

// returns <div class="form-check">
const FormCheck = function FormCheck() {
    const div = document.createElement('div');
    div.classList.add('form-check', 'list-group-item');

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

//returns <label class="form-check-label" id="label-*" for="checkbox-*">
const Label = function Label(p, id) {
    const label = document.createElement('label');
    const textNode = document.createTextNode(p);

    label.classList.add('form-check-label');
    label.appendChild(textNode);
    label.id = `label-${id}`;
    label.setAttribute('for', `checkbox-${id}`);

    return label;
}

//returns a deletebutton
const DeleteButton = function DeleteButton() {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-danger', 'delete-button');
    button.innerHTML = 'X';

    return button;
}

function addToContainer(el, itemID, container) {
    let children = []
    for (let i = 0; i < container.childElementCount; i++) {
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

//generates a new list item based on the inputted text
function addItem(item) {
    highestID += 1;

    const checkbox = new CheckBox(item.status, item.id);
    const label = new Label(item.value, item.id);
    const deleteButton = new DeleteButton();
    const formCheck = new FormCheck();

    formCheck.appendChild(checkbox);
    formCheck.appendChild(label);
    formCheck.appendChild(deleteButton);

    if (item.status === 'unchecked') {
        addToContainer(formCheck, item.id, itemContainer);
    } else if (item.status === 'checked') {
        formCheck.classList.add('disabled');
        addToContainer(formCheck, item.id, checkedItemContainer);
    }

    showHideSplash();
}

//shows divider only if both sections have content
function showHideDivider() {
    if (checkedItemContainer.childElementCount) {
        divider.style.display = 'block';
    } else {
        divider.style.display = 'none';
    }
}

//checks if there is content and if so, hides the splash elements
function showHideSplash() {
    if (!checkedItemContainer.childElementCount &&
        !itemContainer.childElementCount) {
        noItems.style.display = 'block';
    } else {
        noItems.style.display = 'none';
    }
}

//ticks the seleced element
function checkItem(el) {
    itemContainer.removeChild(el);

    el.classList.add('disabled');

    //grabs ID of element to be checked
    //it is of form "checkbox-X" so split[1] grabs just the X part
    let id = el.children[0].id.split('-')[1];
    addToContainer(el, id, checkedItemContainer);

    const item = localStorage.getObject(id);
    item.status = 'checked'
    localStorage.setObject(id, item);

    showHideDivider();
    showHideSplash();
}

//unticks selected element
function uncheckItem(el) {
    checkedItemContainer.removeChild(el);

    el.classList.remove('disabled');

    let id = el.children[0].id.split('-')[1];
    addToContainer(el, id, itemContainer);

    const item = localStorage.getObject(id);
    item.status = 'unchecked'
    localStorage.setObject(id, item);

    showHideDivider();
    showHideSplash();
}

function deleteItem(el) {
    el.parentElement.removeChild(el);

    //grabs the ID of the element to be removed from localStorage
    //it is of form "checkbox-X" so split[1] grabs just the X part
    localStorage.removeItem(el.children[0].id.split('-')[1]);

    showHideDivider();
    showHideSplash();
}

function removeTickedItems() {
    while (checkedItemContainer.childElementCount) {
        deleteItem(checkedItemContainer.children[0]);
    }
    showHideDivider();
    showHideSplash();
}

//loops through localStorage items and adds them to appropriate container
function retrieveLocalStorage() {
    if (localStorage.length) {
        let ids = [];
        for (let i = 0; i < localStorage.length; i++) {
            const item = localStorage.getObject(localStorage.key(i));
            addItem(item);
            ids.push(item.id);
        }

        //gets highest ID from local storage
        highestID = ids.sort()[ids.length - 1] + 1;
    } else {
        highestID = 0;
    }
    showHideDivider();
    showHideSplash();
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


const isMobileDevice = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);

document.addEventListener('click', e => {
    const el = x => e.target.matches(x);

    if (el('.form-check-input')) {
        if (e.target.checked) {
            checkItem(e.target.parentElement);
        } else {
            uncheckItem(e.target.parentElement);
        }
    } else if (el('.delete-button')) {
        deleteItem(e.target.parentElement);
    } else if (el('.remove-ticked')) {
        removeTickedItems();
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
