//Set data to global scope to avoid repetitive AJAX calls when resorting assets
let data;

document.addEventListener("DOMContentLoaded", (event) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "data.json");
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      data = JSON.parse(xhr.responseText);
      layoutAssets();
    }
  }
  xhr.send();
});

//Will remove any children inside before loading in the assets
function layoutAssets(toggle) {
  removeAssetsFromDom();
  const sortedData = sortData(toggle);
  const parentDiv = document.getElementById('wbd-displayBottom-assetList');
  sortedData.forEach((element) => {
    if (element.is_published) {
      const childDiv = createAssetDiv(element);
      parentDiv.appendChild(childDiv);
    }
  });
}

function removeAssetsFromDom() {
  const parentDiv = document.getElementById('wbd-displayBottom-assetList');
  while (parentDiv.firstChild) {
    parentDiv.removeChild(parentDiv.firstChild);
  }
}

function createAssetDiv(assetData) {
  const assetDiv = document.createElement('div');
  assetDiv.className = 'wbd-displayBottom-asset';
  const title = capitalizeFirstLetter(assetData.title);
  const template = [
    '<img class="wbd-displayBottom-asset-image" src="./images/' + assetData.image_name + '">',
    '<div class="wbd-displayBottom-asset-infoContainer">',
      '<div class="wbd-displayBottom-asset-title">' + title + '</div>',
      '<div class="wbd-displayBottom-asset-imageFile">' + assetData.image_name + '</div>',
      '<div class="wbd-displayBottom-asset-border"></div>',
      '<div class="wbd-displayBottom-asset-description">' + assetData.description + '</div>',
      '<i class="material-icons">favorite</i>',
      '<i class="material-icons">grade</i>',
    '</div>'
  ];
  assetDiv.innerHTML = template.join('\n');
  return assetDiv;
}

function capitalizeFirstLetter(str) {
  return str.split(' ').map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

var sortDesc = true;
function sortData(toggle) {
  if (toggle !== undefined && toggle) {
    sortDesc = !sortDesc;
  }
  data.sort((a, b) => {
    if (a.title.toUpperCase() < b.title.toUpperCase()) {
      return sortDesc ? 1 : -1;
    }
    if (a.title.toUpperCase() > b.title.toUpperCase()) {
      return sortDesc ? -1 : 1;
    }
    return 0;
  })
  return data;
}

