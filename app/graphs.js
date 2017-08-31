/// graphs.js uses d3 to display cool graphs

///cool idea, but let's just get this done..

var line_graph = function(id, data, x_label, y_label) {

    console.log("Creating graph in svg id "+id);

    ///basic setup
    var svg = d3.select("#"+id);
    var svgh = document.getElementById(id);
    var canvas_width = 750;//svgh.getBBox().width;
    var canvas_height = 500;//svgh.getBBox().height;
    var padding = 10;    ///allow space for labels, etc

    console.log("Got "+svgh+" with dimensions "+canvas_width+"x"+canvas_height);
    console.log("Analyzing..");
    console.log(data);

    ///find the graph range
    var xmin = 999999999999999, ymin = 99999999999999; ///a big number
    var xmax = 0, ymax = 0;
    data.forEach(function(p) {
        if(p.x < xmin)
            xmin = p.x;
        if(p.x > xmax)
            xmax = p.x;
        if(p.y < ymin)
            ymin = p.y;
        if(p.y > ymax)
            ymax = p.y;
    });

    console.log("Min x: "+xmin+" max: "+xmax+" Min y: "+ymin+" max "+ymax);

    ///create the axis data
    axis = [{ x: padding, y: padding, key: 0 }, {x: padding, y: canvas_height-padding, key: 1 },
            { x: canvas_width-padding, y: canvas_height-padding, key: 2 } ];

    axis_line_func = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("linear");

    svg.append("path")
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('fill', 'none')
        .attr('class', 'axis')
        .attr("d", axis_line_func(axis));

    svg.append("text")
        .attr('x', 0)
        .attr('y', padding*1.5)
        //.attr('text-anchor', 'center')
        .text(xmax)
        .attr('fill', 'black');

    svg.append("text")
        .attr('x', 0)
        .attr('y', canvas_height-padding)
        .attr('fill', 'black')
        .text(xmin);

};