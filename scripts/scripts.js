var start = 0;
var stateCode = "states";
var message = "Detailed View"
var filter = "filter"
var parksArray = []
var slideIndex = {}

function previousPage() {
  if (start === 0) {
    alert("You are on the first page");
  } else {
    start = start - 50;
    getParks(start);
  }
}

function nextPage() {
  start = start + 50;
  getParks(start);
}

document.querySelector("#back").addEventListener("click", togglePage);
document.querySelector("#back").addEventListener("click", toggleBackButton);
document.querySelector("#back").addEventListener("click", togglePreviousButton);
document.querySelector("#back").addEventListener("click", toggleNextButton);



document.querySelector("#previous").addEventListener("click", previousPage);
document.querySelector("#next").addEventListener("click", nextPage);

function getParks(start = 0, state = "") {
  removeCards();
  const base = "https://developer.nps.gov/api/v1/parks";
  const key = `nUAekwW6cRBF8XK9B4BNiJBwgpURFIDKZyEYKt6O`;
  let query = "";
  
  if (state) {
    query = `&stateCode=${state}`;
  }
  
  fetch(`${base}?start=${start}&api_key=${key}${query}`)
    .then((response) => response.json())
    .then((json) => handleParks(json.data));
}

function handleParks(parks) {
  parksArray = parks;
  parks.forEach((park) => {
    const card = makeCard(park);
    document.querySelector(".park-cards").appendChild(card);
  });
}

/*
  Make Card
*/
function makeCard(park) {
  let article = document.createElement("article");
  let header = makeHeader(park.images[0]);
  let section = makeSection(park.fullName, park.description, park.states);
  
  article.appendChild(header);
  article.appendChild(section);
  
  /*
    Add event listener so that when a click occurs
    on the card, you can respond by showing the detail view.
  */
  article.dataset.id = park.id;
  
  article.addEventListener("click", handleCardClick)
  
  return article;
}

function onClick () {
  console.log(message)
}

function makeDetailedView(park) {
  removeDetails();
  let top = document.querySelector(".park-name");
  let left = document.querySelector(".left");
  let right = document.querySelector(".right");    
  let detailedHeading = makeDetailedHeading(park.fullName);
  let carousel = makeCarousel(park.images);
  let info = makeInfo(park.addresses, park.entranceFees, park.directionsInfo, park.directionsUrl, park.standardHours);
  let map = makeMap(park.latitude, park.longitude);
  let activities = makeActivities(park.activities);
  
  top.appendChild(detailedHeading);
  left.appendChild(carousel);
  left.appendChild(info);
  right.appendChild(map);
  right.appendChild(activities);
}

function makeDetailedHeading(fullName) {
  
  let h1 = document.createElement("h1");
  
  h1.innerText = fullName; 
  
  return h1;
}

function makeInfo(addresses, entranceFees, directionsInfo, directionsUrl, standardHours) {
  let infoCard = document.createElement("article");
  
  let addressesContainer = makeAddresses(addresses);
  let entranceFeesContainer = makeEntranceFees(entranceFees);
  let directionsInfoContainer = makeDirectionsInfo(directionsInfo);
  let directionsUrlContainer = makeDirectionsUrl(directionsUrl)

  infoCard.appendChild(addressesContainer);
  infoCard.appendChild(entranceFeesContainer);
  infoCard.appendChild(directionsInfoContainer);
  infoCard.appendChild(directionsUrlContainer);

  return infoCard;
}

function makeAddresses(addresses) {
let section = document.createElement("section");
addresses.forEach((address) => {
  const card = makeAddress(address);
  section.appendChild(card);
});
return section;
}

function makeAddress(address) {
  let container = document.createElement("address");
  let line1 = document.createElement("p");
  let line2 = document.createElement("p");
  let line3 = document.createElement("p");
  let cityStateZip = document.createElement("p");

  line1.innerText = address.line1;
  line2.innerText = address.line2;
  line3.innerText = address.line3;
  cityStateZip.innerText = `${address.city}, ${address.stateCode} ${address.postalCode}`

  container.appendChild(line1);
  if (line2.innerText) {
    container.appendChild(line2);
  }
  if(line3.innerText) {
    container.appendChild(line3);
  }

  container.appendChild(cityStateZip);

  return container; 
}


function makeEntranceFees(){
  let section = document.createElement("section");
  return section;
}

function makeDirectionsInfo(directionsInfo) {
  let section = document.createElement("section");
  let p = document.createElement("p");

  p.innerText = directionsInfo;

  section.appendChild(p);

  return section;
}

function makeDirectionsUrl(directionsUrl) {
  let section = document.createElement("section");
  let a = document.createElement("a");

  a.innerText = directionsUrl;
  a.href = directionsUrl;

  section.appendChild(a);

  return section;
}

function makeStandardHours() {
  let section = document.createElement("section");
  return section;
}

function makeCarousel() {
  let section = document.createElement("section");
return section;
} 

function makeActivities(activities) {
  let ul = document.createElement("ul");
  activities.forEach((activity) => {
    const li = makeActivitiesListItem(activity);
    ul.appendChild(li);
  });
  
  return ul; 
} 

function makeActivitiesListItem(activity) {
  let li = document.createElement("li");
  li.innerText = activity.name;
  
  return li; 
} 

function makeMap(latitude, longitude) {
  let div = document.createElement("div");
  console.log((parseFloat(latitude)), (parseFloat(longitude)));
  let map = new google.maps.Map(div, {
    center: {lat: parseFloat(latitude), lng: parseFloat(longitude)},
    zoom: 8,
  });

  return div; 
}


/*
  Make Header
*/
function makeHeader(image) {
  let header = document.createElement("header");
  let img = document.createElement("img");
  
  // Configure img properties
  img.src = image.url;
  img.alt = image.altText;
  
  header.appendChild(img);
  return header;
}

/*
  Make Section
*/
function makeSection(fullName, description, states) {
  let section = document.createElement("section");
  let h1 = document.createElement("h1");
  let p = document.createElement("p");
  let ul = makeStateTagList(states);
  
  // Set text content of h1 and p
  h1.innerText = fullName;
  p.innerText = description; 
  
  // Add some more properties that would make these
  // cards even better
  
  section.appendChild(h1);
  section.appendChild(p);
  section.appendChild(ul);
  
  return section;
}



/*
  Handle card click and log out index of card
*/
function handleCardClick(e) {
  let park = parksArray.find((p) => p.id === e.currentTarget.dataset.id);
  console.log(park);
  togglePage();
  makeDetailedView(park);
  toggleBackButton();
  togglePreviousButton();
  toggleNextButton();
}

function handleStateChange() {
  let state = document.querySelector("select").value;
  start = 0;
  getParks(start, state);
}

/*
  handleStateTagClick
  - update the global variable of stateCode
  - rerun getParks();
*/

function handleStateTagClick(e) {
  console.log(e.target.innerText)
  start = 0;
  getParks(start, e.target.innerText);
  e.stopPropagation();
}

function makeStateTagList(states) {
  let ul = document.createElement("ul");
  let split = states.split(",");
  split.forEach((state) => {
    const li = makeStateTagListItem(state);
    ul.appendChild(li);
  });
  
  return ul; 
}

function makeStateTagListItem(state) {
  let li = document.createElement("li");
  li.innerText = state;
  li.addEventListener("click", handleStateTagClick);
  
  return li; 
}


function removeCards() {
  let container = document.querySelector(".park-cards");
  
  while (container.firstChild) {
    container.firstChild.remove();
  }
}

function removeDetails() {
  let top = document.querySelector(".park-name");
  let left = document.querySelector(".left");
  let right = document.querySelector(".right");
  
  while (top.firstChild) {
    top.firstChild.remove();
  }

  while (left.firstChild) {
    left.firstChild.remove();

  while (right.firstChild) {
    right.firstChild.remove();
  }  
  }
}

document.querySelector("select").addEventListener("change", handleStateChange);

function togglePage() {
  let parkCards = document.querySelector(".park-cards");
  let parkPage = document.querySelector(".park-page");
  parkCards.classList.toggle("active");
  parkPage.classList.toggle("active");
}

function toggleBackButton() {
  let backButton = document.getElementById("back");
  backButton.classList.toggle("active");
}

function removePreviousButton() {
  let previousButton = document.getElementById("previous");
  while (previousButton.firstChild) {
    previousButton.firstChild.remove();
  } 
}

function togglePreviousButton() {
  let previousButton = document.getElementById("previous")
  previousButton.classList.toggle("active");
}

function toggleNextButton() {
  let nextButton = document.getElementById("next")
  nextButton.classList.toggle("active");
}

function makeCarousel(images) {
  slides = [];
  currentIndex = 0;
  minIndex = 0;
  maxIndex = images.length -1;  
let izquierda = document.createElement("button");
let derecho = document.createElement("button");
let section = document.createElement("section");
images.forEach((image) => {
  const card = makeSlide(image);
  section.appendChild(card);
  slides.push(card);
});
section.querySelector("img").className = "active";
izquierda.className = "izuierda";
derecho.className = "derecho";
section.className = "slideshow";
izquierda.innerHTML = "<";
derecho.innerHTML = ">";
derecho.addEventListener("click", incrementIndex);
izquierda.addEventListener("click", decrementIndex);
section.appendChild(izquierda);
section.appendChild(derecho);
return section;
}

function makeSlide(image) {
  let img = document.createElement("img");

  img.src = image.url;
  img.alt = image.altText;

  return img;
}

var backButton = null;
var nextButton = null;
var slides = null;
var currentIndex = 0;
var minIndex = 0;
var maxIndex = 0;


/*
  Define behavior
    - remove active class from current slide
    - add active class to new slide
    - handle edge cases like back from beginning or next from end
*/

function toggleSlide(from, to) {
  /* Remove active class from current slideIndex */
  slides[from].classList.remove("active");
  
  /* Add active class to new slideIndex */
  slides[to].classList.add("active");
}

function changeIndex(by) {
  var newIndex = currentIndex + by; // -1
  
  /* What if (next) the nexIndex is greater than maxIndex */
  if (newIndex > maxIndex) {
    
    /* The newIndex SHOULD be 0 */
    newIndex = 0;
    
    /* What if (back) the newIndex is less than 0 */
  } else if (newIndex < minIndex) {
    
    /* The newIndex SHOULD be maxIndex */
    newIndex = maxIndex;
    
  } else {
    /* The newIndex is valid */
  }
  
  toggleSlide(currentIndex, newIndex); // toggleSlide(from, to)
 
  currentIndex = newIndex;
}

function incrementIndex() {
  changeIndex(1);
}

function decrementIndex() {
  changeIndex(-1);
}

getParks(0);