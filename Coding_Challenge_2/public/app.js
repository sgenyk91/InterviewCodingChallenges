//Global object for set filters
let companyFilter = {
  'q': '',
  'start': 0,
  'limit': 10,
  'laborTypes': []
}
//Initialize
document.addEventListener('DOMContentLoaded', (event) => {
  checkScreenSize();
  getCompanies();
});

window.addEventListener('scroll', () => {
  if (window.pageYOffset + window.innerHeight >= document.body.scrollHeight) {
    nextSetOfCompanies();
  }
});

window.addEventListener('resize', () => {
  checkScreenSize();
});

function getCompanies(reset=false) {
  if (reset) {
    removeCompaniesFromDOM();
    companyFilter.start = 0;
  }
  const xhr = new XMLHttpRequest();
  const queryParams = queryHandler();
  xhr.open("GET", "/api/companies" + queryParams);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      if (data.results.length > 0) {
        layoutCompanies(data.results);
      }
    }
  }
  xhr.send();
}
//Creates query parameter that will be inserted into HTTP request
function queryHandler() {
  const returnQuery = [];
  const queryQ = companyFilter.q !== '' ? returnQuery.push('q=' + companyFilter.q) : '';
  const queryStart = companyFilter.start !== 0 ? returnQuery.push('start=' + companyFilter.start) : '';
  const queryLimit = companyFilter.limit !== 10 ? returnQuery.push('limit=' + companyFilter.limit) : '';
  const queryLaborType = companyFilter.laborTypes.length ? returnQuery.push('laborTypes=' + companyFilter.laborTypes.join(',')) : '';
  if (returnQuery.length) {
    return '?' + returnQuery.join('&');
  }
  return '';
}

function layoutCompanies(companies) {
  const parentDiv = document.getElementById('bc-company-list');
  companies.forEach((element) => {
    const childDiv = createCompanyDiv(element);
    parentDiv.appendChild(childDiv);
  });
}

function createCompanyDiv(company) {
  const companyDiv = document.createElement('div');
  companyDiv.className = 'bc-company';
  companyDiv.setAttribute('onclick', 'addAdditionalInfo(this)');
  const template = [
    '<div class="bc-company-title">' + company.name + '</div>',
    '<div class="bc-company-imageContainer visible">',
      '<img class="bc-company-image" src="' + company.avatarUrl + '">',
    '</div>',
    '<a class="bc-company-closeButton hidden" href="javascript:" onclick="removeAdditionalInfo(this)">X</a>',
    '<div class="bc-company-additionalInfo hidden">',
      '<a class="bc-company-phoneNumber" href="tel:' + company.phone.replace(/\D/g, '') + '">Phone Number: ' + company.phone + '</a>',
      '<a class="bc-company-website" href="' + company.website + '" target="_blank">Website: ' + company.website + '</a>',
      '<div class="bc-company-laborType">Labor Type: ' + company.laborType.join(', ') + '</div>',
    '</div>'
  ];
  companyDiv.innerHTML = template.join('\n');
  return companyDiv;
}
//Removes onclick event on company to prevent eventPropagation when user clicks on 'X' to close additional info
function addAdditionalInfo(company) {
  company.onclick = null;
  const imageContainer = company.getElementsByClassName('bc-company-imageContainer')[0];
  const additionalInfo = company.getElementsByClassName('bc-company-additionalInfo')[0];
  const closeButton = company.getElementsByClassName('bc-company-closeButton')[0];
  if (imageContainer.classList.contains('visible')) {
    imageContainer.classList.remove('visible');
    imageContainer.classList.add('invisible');
    setTimeout(() => {
      additionalInfo.classList.remove('hidden');
      closeButton.classList.remove('hidden');
    }, 700)
  }
}

function removeAdditionalInfo(company) {
  const companyDiv = company.parentElement;
  const imageContainer = companyDiv.getElementsByClassName('bc-company-imageContainer')[0];
  const additionalInfo = companyDiv.getElementsByClassName('bc-company-additionalInfo')[0];
  const closeButton = companyDiv.getElementsByClassName('bc-company-closeButton')[0];
  additionalInfo.classList.add('hidden');
  closeButton.classList.add('hidden');
  imageContainer.classList.remove('invisible');
  imageContainer.classList.add('visible');
  //Prevents event propagation from triggering additionalInfo by adding after propagation occurred
  setTimeout(() => {
    companyDiv.setAttribute('onclick', 'addAdditionalInfo(this)');
  }, 0);
}

function removeCompaniesFromDOM() {
  let parentDiv = document.getElementById('bc-company-list');
  while (parentDiv.firstChild) {
    parentDiv.removeChild(parentDiv.firstChild);
  }
}
//timoutID is global in order to cancel the setTimout if user presses another key within one second
let timeoutID;
function keyPressHandler() {
  clearTimeout(timeoutID);
  timeoutID = setTimeout(() => {
    const inputText = document.getElementById('bc-form-filter').value;
    companyFilter.q = inputText;
    getCompanies(true);
  }, 1000);
}
//When user reaches bottom of page trigger next set of companies
function nextSetOfCompanies() {
  companyFilter.start += 10;
  getCompanies();
}

function adjustLaborTypeFilter(event, screen) {
  if (event.checked) {
    companyFilter.laborTypes.push(event.name);
  } else {
    const laborIndex = companyFilter.laborTypes.indexOf(event.name);
    companyFilter.laborTypes.splice(laborIndex, 1);
  }
  getCompanies(true);
}

function toggleFilterMenu() {
  const filterMenu = document.getElementById('bc-filter-section');
  if (filterMenu.classList.contains('hidden')) {
    filterMenu.classList.remove('hidden');
  } else {
    filterMenu.classList.add('hidden');
  }
}
//Hides filter side menu on mobile and shows on desktop
function checkScreenSize() {
  const filterMenu = document.getElementById('bc-filter-section');
  if (window.matchMedia('(min-width: 640px)').matches) {
    filterMenu.classList.remove('hidden');
  } else {
    filterMenu.classList.add('hidden');
  }
}
