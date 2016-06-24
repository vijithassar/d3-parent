# d3-parent

An inversion of d3.select which searches up through the DOM hierarchy instead of down, like a D3 equivalent of the [.parents() method](https://api.jquery.com/parents/) from jQuery. Provides a more stable and robust API around parentNode, simplifies traversal of deeply nested hierarchical data joins, and allows inverted manipulation of data binds.

## Setup

Load this script after D3.js but before your project code.

```html
<html>
  <head>
    <script type="text/javascript" charset="utf-8" src="./d3.v3.js"></script>
    <script type="text/javascript" charset="utf-8" src="./d3-parent.js"></script>
    <script type="text/javascript" charset="utf-8" src="./project.js"></script>
  </head>
```

## Usage

Call the .parent() method on any selection to return a selection of the parent nodes for each item:

```js
  // probably returns a list node such as <ul> or <ol>
  // depending on the markup
  var list_items = d3.select('li');
  var list = list_items.parent();
```

Optionally provide a selector string to iterate upward through the DOM until a match is found:

```js
  var list_items_links = d3.selectAll('a');
  var list = list_items.parent('ul');  
```

Method calls can be chained together to traverse upward in steps:

```js
  var list_items_links = d3.selectAll('a');
  var list = list_items.parent().parent();
```

Redundant node references are allowed in the results, and will be returned if you request them:

```js
  var divs = d3.selectAll('div');
  // multiple references to the root node
  var parents = divs.parent('html');
```

To remove redundant node references, use selection.filter():

```js
  var divs = d3.selectAll('div');
  // multiple references to the root node
  var parents = divs.parent('html');
  var nodes = [];
  // single reference to the root node
  var unique = parents.filter(function(d, i) {
    if (nodes.indexOf(this) === -1) {
      nodes.push(this);
      return true;
    } else {
      return false;
    }
  });
```

## Notes

- d3-parent can be thought of as a more robust API for parentNode, which is usually necessary for traversing upward in the DOM hierarchy, but is extremely fragile since it must be precisely matched to the document structure.
- The [group index argument](https://bost.ocks.org/mike/nest/#index) is available in nested data joins to traverse upward in the bound data models, but it only moves up by one level. For deeply nested data join hierarchies, d3.parent will usually be a much simpler way to jump to a different level of data binding.
- The parent() method provides an inverted equivalent to d3.select, but there is no equivalent method for d3.selectAll() which matches multiple parent nodes, because that would break [grouping](https://bost.ocks.org/mike/nest/).
- Existing group and item indices remain intact after DOM traversal, which allows you to programmatically operate on parent nodes using data bound to child nodes.
