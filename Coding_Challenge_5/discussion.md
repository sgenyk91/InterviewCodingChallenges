Major Changes
- SetTimeout was only allowing a range of products to be uploaded into the page. This is dangerous when dealing with scenarios where the number of products return may vary. Instead, I implemented a callback while iterating through the returned JSON data.
- I changed the product constructor to a proper format and left out the html builder to allow product DOM elements to be created while iterating through the returned JSON. Overall no real purpose of product constructor (yet), but left it in to allow an easy way to add in new methods that will be ubiquitous across all products (i.e. filters, custom modifications, etc.).

Minor Changes
- I changed the nomenclature of all the IDs and classes to prevent any CSS collisions on past or future implementations.
- Columns and rows would be a hassle to deal with when dealing with removing products on click. Instead, I took a responsive approach to solving this problem. Each product aligns to the right of another product until there is no more space in the parent container on the current "row". A product will simply occupy the space blow the other products. When removing a product, space opens up and the next product simply occupies the space. This approach allows the products to easily adjust when the user shrinks or enlarges the browser width.
- I minimized the number of files into one JS file and one CSS file to prevent excessive HTTP requests and to allow simple caching
- I minified JS and CSS files to reduce the overall space for each file (ES6 was compiled to ES5 then minified).

Improvements
- I would implement a caching system on all the static files in order to improve load speed.
- I did not focus too much on the styling of the page so the UI has room for improvement.
- I would definitely add in Less into this mix, especially since it works very well with Bootstrap. With less, we can create variables, allow CSS nesting, and implement media queries with ease.
- I would add in a filter section and search bar for easier access to desired products
- The media queries assigned by Bootstrap are not my favorite so I would adjust the breakpoints and certain values (i.e. container width)
- If we want to prevent the user from seeing the images load, then we can delay the products from being shown by one or two seconds (using setTimeout). 