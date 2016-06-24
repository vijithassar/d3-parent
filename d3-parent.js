(function(d3) {
  'use strict';
  var all_parents,
      direct_parent,
      closest_parent,
      single_parent,
      iterator,
      selector_to_nodes,
      parent;
  if (!d3) {
    console.error('d3 is not defined');
    return;
  }
  if (d3.parent) {
    console.warn('d3.parent method is already defined');
    return;
  }
  // match all parents with linear iteration
  all_parents = function(node, candidates) {
    var candidate,
        results;
    results = [];
    for (var i = 0, ilength = candidates.length; i < ilength; i++) {
      candidate = candidates[i];
      if (candidate.contains(node)) {
        results.push(candidate);
      }
    }
    return results;
  };
  // return the immediate parentNode
  direct_parent = function(node) {
    if (node.parentNode) {
      return node.parentNode;
    } else {
      return null;
    }
  };
  // match by iterating upward through the DOM. this is an
  // expensive operation and should be avoided when another
  // method will suffice.
  closest_parent = function(node, candidates) {
    var results,
        match,
        end;
    results = [];
    // iterate upward from starting node
    while (!match && !end && node.parentNode) {
      // reassign node to its own parent
      node = node.parentNode;
      end = !node.parentNode;
      // test selection for current iterator node
      match = candidates.indexOf(node) !== -1;
    }
    // if there is a match, add it to the results
    if (match) {
      results.push(node);
    }
    return results;
  };
  // find exactly one parent node, optimizing iteration when possible
  single_parent = function(node, candidates) {
    var results;
    // try linear search first
    results = all_parents(node, candidates);
    // if linear search matches multiple candidates,
    // retry hierarchically to find the single closest parent
    if (results.length && results.length > 1) {
      results = closest_parent(node, candidates);
    }
    return results;
  };
  // reformat a multidimensional array of nodes as a d3 selection
  // optionally inserting a processing function along the way
  iterator = function(array, processor) {
    var selection,
        input_group,
        output_group,
        node;
    selection = d3.select();
    // loop through groups
    for (var i = 0, ilength = array.length; i < ilength; i++) {
      input_group = array[i];
      output_group = [];
      // loop through nodes
      for (var j = 0, jlength = input_group.length; j < jlength; j++) {
        node = input_group[j];
        if (typeof processor === 'function') {
          output_group = output_group.concat(processor(node));
        }
      }
      selection.push(output_group);
    }
    // remove the empty default group
    selection.shift();
    return selection;
  };
  // fetch an array of matching nodes for a DOM selector string
  selector_to_nodes = function(selector) {
    var node_list,
        nodes;
    if (!selector) {
      console.error('missing DOM selector string');
      return;
    }
    node_list = document.querySelectorAll(selector);
    // convert to array
    nodes = Array.prototype.slice.call(node_list);
    return nodes;
  };
  // public function to select single parent matching a selector
  parent = function(selector) {
    var selection,
        candidates,
        processor,
        results;
    selection = this;
    if (!selector) {
      processor = function(node) {
        return direct_parent(node);
      };
    } else {
      candidates = selector_to_nodes(selector);
      processor = function(node) {
        return single_parent(node, candidates);
      };
    }
    results = iterator(selection, processor);
    return results;
  };
  // extend d3.selection with the new methods
  d3.selection.prototype.parent = parent;
}).call(this, d3);
