'use strict';

const displayModal = document.querySelector('.avartar-nav img');
const post = document.querySelector('.post-button');
const selectPost = document.querySelector('.select-post');
const textDraft = document.querySelector('textarea');
const fileInput = document.querySelector('.select-file');
const uploadsContainer = document.querySelector('.uploads-container');
const fileName = document.querySelector('.file-name');
const modal = document.querySelector('.modal');
const body = document.querySelector('body');
const posts = [];
let count = 0;

function createElements(tags, attributes = {}, textContent = '') {
    const element = document.createElement(tags);

    for (const key in attributes) {
        if (Array.isArray(attributes[key])) {
            element.setAttribute(key, attributes[key].join(' '));
        } else {
            element.setAttribute(key, attributes[key]);
        }
    }

    if (textContent) element.textContent = textContent;

    return element;
}

function createPost() {
    const uploads = createElements('div', {class: 'uploads'});
    const userPostInfo = createElements('div', {class: 'user-post-info flex space-between align-items'});
    const userInfo = createElements('div', {class: 'user-info flex gap-8 align-items'});
    const postImageContainer = createElements('figure', {class: 'avartar'});
    const postImage = createElements('img', {src: './assets/img/avartar.jpg'});
    const postDate = createElements('div', {class: 'post-date'});
    const usersName = createElements('p', {}, 'Ashedzi Solomon');
    const date = createElements('p', {}, new Date().toDateString());
    const uploadedContent = createElements('div', {class: 'content-uploaded'});
    const postText = createElements('p', {}, textDraft.value);
    const postedImageContainer = createElements('figure');
    const postedImage = createElements('img');

    uploads.append(userPostInfo, uploadedContent);
    userPostInfo.append(userInfo, postDate);
    userInfo.append(postImageContainer, usersName);
    postImageContainer.append(postImage);
    postDate.append(date);
    uploadedContent.append(postText, postedImageContainer);
    postedImageContainer.append(postedImage);
    setImage(postedImage);
    return uploads;
}

function validatePost() {
    if(textDraft.value.trim() === '' && fileInput.files.length === 0) {
        return false;
    }
    return true;
}

function setImage(postedImage) {
    // I had to get help from AI to get the logic to create this function
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            postedImage.src = event.target.result; 
        };
        reader.readAsDataURL(file);
    }
}

function clearPost() {
    textDraft.value = '';
    fileInput.value = '';
    fileName.textContent = '';
}

class User {
    #id;
    #name;
    #userName;
    #email;

    constructor(name, userName, email) {
        this.#id = Date.now();
        this.#name = name;
        this.#userName = userName;
        this.#email = email;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get userName() {
        return this.#userName;
    }

    get email() {
        return this.#email;
    }

    getInfo() {
        return `${this.#id}
        ${this.#name}
        ${this.#userName}
        ${this.#email}`
    }
}

class Subscriber extends User {
    #pages;
    #groups;
    #canMonetize

    constructor(name, userName, email, pages, groups, canMonetize) {
        super(name, userName, email);
        this.#pages = pages;
        this.#groups = groups;
        this.#canMonetize = canMonetize;
    }

    get pages() {
        return this.#pages;
    }

    get groups() {
        return this.#groups;
    }

    canMonetize() {
        return this.#canMonetize;
    }

    getInfo() {
        let subscriberResponse = `${super.getInfo()}
        ${this.#pages}
        ${this.#groups}
        ${this.#canMonetize}`

        return subscriberResponse;
    }
}

const subscriber = new Subscriber(
    'Ashedzi Solomon', 
    'Ashedzi', 
    'solomonashe84@gmail.com', 
    ['Tech Blog', 'Gadgets Review'],
    ['Developers Connect', 'Dev Mentors'],
    'Yes' 
)

fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
        fileName.textContent = fileInput.files[0].name;
    }
    return;
});

post.addEventListener('click', () => {
    if(!validatePost()) {
        return false;
    }
    const newPost = createPost();
    //i used "insertBefore instead of append because i wanted the elements to be added at the start of the array not the end"
    uploadsContainer.insertBefore(newPost, uploadsContainer.firstChild);
    posts.unshift(newPost);
    count++;
    clearPost();
});

displayModal.addEventListener('click', (event) => {
    modal.innerHTML = '';
    const userID = createElements('p', {}, `ID: ${subscriber.id}`);
    const usersName = createElements('p', {}, `Name: ${subscriber.name}`);
    const userName = createElements('p', {}, `Username: ${subscriber.userName}`);
    const email = createElements('p', {}, `Email: ${subscriber.email}`);
    const userPages = createElements('p', {}, `Pages: ${subscriber.pages.join(', ')}`);
    const userGroups = createElements('p', {}, `Groups: ${subscriber.groups.join(', ')}`);
    const userMonetization = createElements('p', {}, `Monetized: ${subscriber.canMonetize? 'Yes' : 'No'}`);

    modal.append(userID, usersName, userName, email, userPages, userGroups, userMonetization );
 
    //I used event.stopPropagation() because it stops the event from bubbling up to the parent elements. 
    event.stopPropagation();
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block';
    } else {
        modal.style.display = 'none';
    }
})

body.addEventListener('click', (event) => {
    if (!modal.contains(event.target) && modal.style.display === 'block') {
        modal.style.display = 'none'; 
    }
})
