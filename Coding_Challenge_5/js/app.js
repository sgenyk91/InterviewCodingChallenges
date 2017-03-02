document.addEventListener("DOMContentLoaded", (event) => {
  getJSON();

  $('#tm-productList').on('mouseover', '.tm-product-imageContainer', (event) => {
    $(event.currentTarget).find('.tm-product-descriptionContainer').fadeIn(200);
  })

  $('#tm-productList').on('mouseleave', '.tm-product-imageContainer', (event) => {
    $(event.currentTarget).find('.tm-product-descriptionContainer').fadeOut(200);
  })
});

const productData = [];

function getJSON() {
  $('#tm-loadSpinner').show();
  $.getJSON('./data.json', (res) => {
    res.sales.forEach((element) => {
      const product = new ProductObj(element);
      productData.push(product);
      loadProduct(product);
    });
  }).done(() => {
    $('#tm-loadSpinner').hide();
    $('#tm-productList').show();
  })
}

function loadProduct(product) {
  $.get('product-template.html', (template) => {
    const updatedTemplate = template.replace('{image}', product.photo)
                                  .replace('{description}', product.description)
                                  .replace('{title}', product.title)
                                  .replace('{tagline}', product.tagline)
                                  .replace('{url}', product.url)
                                  .replace('{custom_class}', product.custom_class);
    $('#tm-productList').append(updatedTemplate);
  });
}

// Event Handlers
function removeProduct(event) {
  const $product = $(event).closest('.tm-product-container');
  $product.fadeOut('slow', () => { $product.remove(); });
}

class ProductObj {
  constructor(product) {
    this.photo        = product.photos.medium_half;
    this.description  = product.description;
    this.title        = product.name;
    this.tagline      = product.tagline;
    this.url          = product.url;
  }
}