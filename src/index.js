document.addEventListener("DOMContentLoaded", () => {
  fetchToys();
  addToyButton();
  addToyForm();
});

const toyUrl = 'http://localhost:3000/toys';

const addToyButton = () => {
  let addToy = false;
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
}

const addToyForm = () => {
  const toyForm = document.querySelector('.add-toy-form');
  const inputs = document.querySelectorAll('.input-text');
  toyForm.addEventListener('submit', (event) => {
    event.preventDefault();    
    createToyObject(inputs[0].value, inputs[1].value);
    event.target.reset();
  });
}

const createToyObject = (inputName, inputImage) => {
  const parentNode = document.querySelector('#toy-collection');
  const toy = {
    id: iterator + 1,
    name : inputName,
    image : inputImage,
    likes : 0,
  }
  createNodes(parentNode, toy);
  fetchPOST(toyUrl, inputName, inputImage);
}

const fetchPOST = (url, inputName, inputImage) => {
  fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify( {
      "id": iterator,
      "name": inputName,
      "image": inputImage,
      "likes": 0
    })
  });
}

const fetchToys = () => {
  fetch(toyUrl)
  .then( (response) => response.json() )
  .then( (data) => getData(data) );
}

const getData = (data) => {
  const parentNode = document.querySelector('#toy-collection');
  data.forEach( toy => createNodes(parentNode, toy) );  
}

const createNodes = (parentNode, data) => {
  const childNode = document.createElement('div');
// Card Node
  childNode.className = 'card';
// Header Node
  const hNode = document.createElement('h2');
  hNode.innerText = data.name;
// Img Node
  const imgNode = document.createElement('img');
  imgNode.className = 'toy-avatar';
  imgNode.src = data.image;
  imgNode.width = 200;
  imgNode.height = 200;
// Likes 
  const pNode = document.createElement('p');
  pNode.innerText = `${data.likes} Likes`;
// btn Function
  const bNode = document.createElement('BUTTON');
  bNode.className = 'like-btn';
  bNode.innerText = 'Like';

  childNode.appendChild(hNode);
  childNode.appendChild(imgNode);
  childNode.appendChild(pNode);
  childNode.appendChild(bNode);

  parentNode.appendChild(childNode);
  increaseCount();
  likeToyButton(bNode, pNode, data);
}

const likeToyButton = (button, node, data) => {
  let clicked = false;
  button.addEventListener('click', () => {
    clicked = !clicked;
    if (clicked) {
      data.likes += 1;
      fetchLikesPATCH(toyUrl, data);
      node.innerText = `${data.likes} Likes`;
      button.innerText = 'Unlike';
    } else {
      data.likes -= 1;
      fetchLikesPATCH(toyUrl, data);
      node.innerText = `${data.likes} Likes`
      button.innerText = 'Like';
    }
  });
}

const fetchLikesPATCH = (url, data) => {
  fetch(`${url}/${data.id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify( {
      "likes": data.likes
    })
  });
}

let iterator = 0;
const increaseCount = () => {
  console.log(iterator);
  return iterator += 1;
}

// npm install -g json-server
// json-server --watch db.json





