import { selection } from 'd3-selection';

var all_parents,
    direct_parent,
    closest_parent,
    single_parent,
    iterator,
    selector_to_nodes,
    parent;

// match all parents with linear iteration
all_parents = function(node, candidates) {
    var candidate,
        results,
        i,
        ilength;
    results = [];
    for (i = 0, ilength = candidates.length; i < ilength; i++) {
        candidate = candidates[i];
        if (candidate.contains(node)) {
            results.push(candidate);
        }
    }
    return results;
};

// return the immediate parentNode
direct_parent = function(node) {
    if (node && node.parentNode) {
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
    var results,
        result;
    // try linear search first
    results = all_parents(node, candidates);
    // if linear search matches multiple candidates,
    // retry hierarchically to find the single closest parent
    if (results.length && results.length > 1) {
        results = closest_parent(node, candidates);
    }
    // if the results are in array format, take the first
    if (results.length > 0) {
        result = results[0];
    } else {
        result = results;
    }
    return result;
};

// reformat a multidimensional array of nodes as a d3 selection
// optionally inserting a processing function along the way
iterator = function(input_selection, processor) {
    var output_selection,
        group,
        node,
        parent,
        i,
        ilength,
        j,
        jlength;
    // create a new selection and copy the existing nodes
    output_selection = selection();
    output_selection._parents = input_selection._parents;
    // loop through groups
    for (i = 0, ilength = input_selection._groups.length; i < ilength; i++) {
        group = input_selection._groups[i];
        if (typeof output_selection._groups[i] === 'undefined') {
            output_selection._groups[i] = [];
        }
        // loop through nodes
        for (j = 0, jlength = group.length; j < jlength; j++) {
            // process nodes
            node = group[j];
            if (node) {
                parent = processor(node);
                output_selection._groups[i][j] = parent;
            }
        }
    }
    return output_selection;
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
    var candidates,
        processor,
        results;
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
    results = iterator(this, processor);
    return results;
};

export default parent;