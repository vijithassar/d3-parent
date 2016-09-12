var tape = require('tape'),
    jsdom = require('jsdom').jsdom,
    d3 = require('../');

tape('d3.parent() returns an instance of d3.selection', function(test) {
    var html;
    html = '<div class="a"><div class="b"><div class="c"></div></div></div>';
    jsdom.env(html, function(error, window) {
        var item;
        document = global.document = window.document;
        item = d3.select(document)
            .select('div.b')
            .parent();
        test.ok(item instanceof d3.selection);
        test.end();
    });
});

tape('d3.parent() moves up one level in the DOM', function(test) {
    var html;
    html = '<div class="a"><div class="b"><div class="c"></div></div></div>';    jsdom.env(html, function(error, window) {
        var selected,
            parent;
        document = global.document = window.document;
        selected = d3.select(document).select('div.a');
        parent = d3.select(document).select('div.b').parent();
        test.ok(selected.node() === parent.node());
        test.end();
    });
});

tape('d3.parent() collects the expected number of nodes', function(test) {
    var html;
    html = '<div class="a"><div class="b"><div class="c"></div><div class="c"></div></div></div>';
    jsdom.env(html, function(error, window) {
        var b;
        document = global.document = window.document;
        b = d3.select(document).selectAll('div.c').parent();
        test.ok(b.size() === 2);
        test.end();
    });
});

tape('d3.parent() takes a DOM selector string', function(test) {
    var html;
    html = '<div class="a"><div class="b"><div class="c"></div></div></div>';
    jsdom.env(html, function(error, window) {
        var selected,
            parent;
        document = global.document = window.document;
        selected = d3.select(document).select('div.a');
        parent = d3.select(document).select('div.c').parent('div.a');
        test.ok(selected.node() === parent.node());
        test.end();
    });
});

tape('d3.parent() retains selection structure', function(test) {
    var html,
        selected,
        parent;
    html = '<div class="a"><div class="b"></div></div><div class="a"><div class="b"></div></div>';
    jsdom.env(html, function(error, window) {
        selected = d3.select(document).selectAll('div.a');
        parent = d3.select(document).select('div.c').parent('div.a');
        test.ok(selected._groups.length === parent._groups.length);
        test.ok(selected._parents.length === parent._parents.length);
        test.end();
    });
});