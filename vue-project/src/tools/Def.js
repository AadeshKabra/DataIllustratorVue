const properties = {
    // "Peers": {
    //     "Count": {"id": "sibling-count", "group": "Peers", "type": "numeric-range", "range": [1, 100],
    //         "class": ["line-sibling-count-prop", "circle-sibling-count-prop", "rect-sibling-count-prop", "path-sibling-count-prop", "text-sibling-count-prop", "repeat-grid-sibling-count-prop", "partition-sibling-count-prop", "group-sibling-count-prop"]},
    //     "Ordered By": {
    //         "id": "peers-ordered-by", "group": "Peers", "type": "categorical",
    //         "class": ["line-peers-ordered-by-prop", "circle-peers-ordered-by-prop", "rect-peers-ordered-by-prop",
    //             "path-peers-ordered-by-prop", "text-peers-ordered-by-prop", "repeat-grid-peers-ordered-by-prop",
    //             "partition-peers-ordered-by-prop"],
    //         "options": [{display:"Data Source Order", value: "data-source-order"}]
    //     }
    // },

    "Shape Position": {
        //need to add path-position-prop so that we can have "scatterplots of paths"
        "X": {"id": "x", channel: "x", "group": "Shape Position", "type": "numeric", "encodable": true, "class": ["line-prop", "circle-prop", "rect-prop", "pointText-prop", "path-prop", "polygon-prop", "image-prop", "group-prop", "area-prop"], accessor: ["x"]},
        "Y": {"id": "y", channel: "y", "group": "Shape Position", "type": "numeric", "encodable": true, "class": ["line-prop", "circle-prop", "rect-prop", "pointText-prop", "path-prop", "polygon-prop", "image-prop", "group-prop", "area-prop"], accessor: ["y"]},
        "Baseline": {"id": "baseline", "group": "Shape Position", "type": "categorical", "encodable": false, "class": ["area-prop"], accessor: ["baseline"],
            options: [{display:"top", value:'top'},
            {display:"middle", value:'middle'},
            {display:"bottom", value:'bottom'},
            {display:"left", value:'left'},
            {display:"center", value:'center'},
            {display:"right", value:'right'}]
        }
    },

    "Segment Position": {
        "X": {"id": "segmentX", channel: "x", "group": "Segment Position", "type": "numeric", "encodable": true, "class": ["segment-prop"], accessor: ["x"]},
        "Y": {"id": "segmentY", channel: "y", "group": "Segment Position", "type": "numeric", "encodable": true, "class": ["segment-prop"], accessor: ["y"]}
    },

    "Vertex Position": {
        "X": {"id": "vxX", channel: "x", "group": "Vertex Position", "type": "numeric", "encodable": true, "class": ["vertex-prop"], accessor: ["x"]},
        "Y": {"id": "vxY", channel: "y", "group": "Vertex Position", "type": "numeric", "encodable": true, "class": ["vertex-prop"], accessor: ["y"]}
    },

    "Size": {
        "Width": {"id": "width", channel: "width",  "group": "Size", "type": "numeric", "encodable": true, "class": ["rect-prop", "path-prop", "image-prop", "area-prop"], accessor: ["bounds","width"]},
        "Height": {"id": "height", channel: "height",  "group": "Size", "type": "numeric", "encodable": true, "class": ["rect-prop", "path-prop", "image-prop", "area-prop"], accessor: ["bounds","height"]},
        "Radius": {"id": "radius", channel: "radius", "group": "Size", "type": "numeric", "encodable": true, "class": ["circle-prop"], accessor: ["radius"]},
        "Inner Radius": {"id": "innerRadius", channel: "innerRadius", "group": "Size", "type": "numeric", "encodable": true, "class": ["arc-prop", "pie-prop", "ring-prop"], accessor: ["innerRadius"]},
        "Outer Radius": {"id": "outerRadius", channel: "outerRadius", "group": "Size", "type": "numeric", "encodable": true, "class": ["arc-prop", "pie-prop", "ring-prop"], accessor: ["outerRadius"]},
        "Angle": {"id": "angle", channel: "angle", "group": "Size", "type": "numeric", "encodable": true, "class": ["arc-prop", "pie-prop"], accessor: ["angle"]},
        "Thickness": {"id": "thickness", channel: "thickness",  "group": "Size", "type": "numeric", "encodable": true, "class": ["arc-prop", "pie-prop", "ring-prop"], accessor: ["thickness"]},
        "Area": {"id": "area", channel: "area",  "group": "Size", "type": "numeric", "encodable": true, "class": ["rect-prop", "circle-prop"], accessor: ["area"]}
    },

    "Text": {
        "Content": {"id": "content", channel: "text",  "group": "Text", "type": "string", "encodable": true, "class": ["pointText-prop"], accessor:["text"]},
        "Font": {"id": "fontFamily", channel: "fontFamily", "group": "Text", "type": "categorical", "encodable": false, "class": ["pointText-prop"], accessor:["fontFamily"],
            "options": [
                {display:"Arial", value:"Arial, sans-serif"},
                {display:"Alegreya Sans", value:"'Alegreya Sans', sans-serif"},
                {display:"Alegreya", value:"'Alegreya', serif"},
                {display:"Calibri", value:"Calibri, sans-serif"},
                {display:"Cambria", value:"Cambria, sans-serif"},
                {display:"Chivo", value:"'Chivo', sans-serif"},
                {display:"Comic Sans MS", value:"'Comic Sans MS', sans-serif"},
                {display:"Consolas", value:"Consolas, monospace"},
                {display:"Cormorant", value:"'Cormorant', serif"},
                {display:"Courier New", value:"'Courier New', Courier, monospace"},
                {display:"Eczar", value:"'Eczar', serif"},
                {display:"Fira Sans", value:"'Fira Sans', sans-serif"},
                {display:"Futura", value:"Futura, sans-serif"},
                {display:"Georgia", value:"Georgia, serif"},
                {display:"Helvetica Neue", value:"'HelveticaNeue', 'Helvetica Neue', 'HelveticaNeueRoman', 'HelveticaNeue-Roman', 'Helvetica Neue Roman', sans-serif"},
                {display:"Impact", value:"Impact, Charcoal, sans-serif"},
                {display:"Palatino", value:"Palatino, serif"},
                {display:"Libre Franklin", value:"'Libre Franklin', sans-serif"},
                {display:"Playfair Display", value:"'Playfair Display', serif"},
                {display:"Playfair Display SC", value:"'Playfair Display SC', serif"},
                {display:"Rubik", value:"'Rubik', sans-serif"},
                {display:"Space Mono", value:"'Space Mono', monospace"},
                {display:"Times New Roman", value:"'Times New Roman', TimesNewRoman, serif"},
                {display:"Trebuchet MS", value:"'Trebuchet MS', sans-serif"},
                {display:"Verdana", value:"Verdana, Geneva, sans-serif"},
                {display:"Work Sans", value:"'Work Sans', sans-serif"}
            ]},
        "Color": {"id": "textColor", channel: "fillColor", "group": "Text", "type": "color", "encodable": true, "class": ["pointText-prop"], accessor:["fillColor"]},
        "Weight": {"id": "fontWeight", channel: "fontWeight",  "group": "Text", "type": "categorical", "encodable": false, "class": ["pointText-prop"], accessor:["fontWeight"], "options": [
            {display: "normal", value: "normal"},
            {display: "bold", value: "bold"}
        ]},
        "Size (px)": {"id": "fontSize", channel: "fontSize",  "group": "Text", "type": "numeric", "encodable": true, "class": ["pointText-prop"], accessor:["fontSize"]},
        "Horz Anchor": {"id": "horzAnchor", channel: "horzAnchor",  "group": "Text", "type": "categorical", "encodable": false, "class": ["pointText-prop"], accessor:["horzAnchor"], "options": [
            {display: "left", value: "left"},
            {display: "center", value: "center"},
            {display: "right", value: "right"}
        ]},
        "Vert Anchor": {"id": "vertAnchor", channel: "vertAnchor",  "group": "Text", "type": "categorical", "encodable": false, "class": ["pointText-prop"], accessor:["vertAnchor"], "options": [
            {display: "top", value: "top"},
            {display: "middle", value: "middle"},
            {display: "bottom", value: "bottom"}
        ]},
    },

    "Vertex Style": {
        "Shape": {"id": "vxShape", channel: "shape",  "group": "Vertex Style", "type": "categorical", "encodable": false, "class": ["vertex-prop"], accessor:["shape"], "options": [
            {display: "none", value: undefined},
            {display: "rectangle", value: "rect"},
            {display: "circle", value: "circle"}
        ]},
        "Width": {"id": "vxWidth", "channel": "width", "group": "Vertex Style", "type": "numeric", "encodable": true, "class": ["vertex-prop"], accessor: ["width"]},
        "Height": {"id": "vxHeight", "channel": "height", "group": "Vertex Style", "type": "numeric", "encodable": true, "class": ["vertex-prop"], accessor: ["height"]},
        "Radius": {"id": "vxRadius", "channel": "radius", "group": "Vertex Style", "type": "numeric", "encodable": true, "class": ["vertex-prop"], accessor: ["radius"]},
        "Fill Color": {"id": "vxFillColor", "channel": "fillColor", "group": "Vertex Style", "type": "color", "encodable": true, "class": ["vertex-prop"], accessor: ["fillColor"]},
        "Stroke Color": {"id": "vxStrokeColor", "channel": "strokeColor", "group": "Vertex Style", "type": "color", "encodable": true, "class": ["vertex-prop"], accessor: ["strokeColor"]},
        "Stroke Width": {"id": "vxStrokeWidth", "channel": "strokeWidth", "group": "Vertex Style", "type": "numeric", "encodable": true, "class": ["vertex-prop"], accessor: ["strokeWidth"]},
        "Opacity": {"id": "vxOpacity", "channel": "opacity", "group": "Vertex Style", "type": "numeric-range", "encodable": false, "class": ["vertex-prop"], "range": [0, 1], accessor: ["opacity"]},
    },

    "Style": {
        // "Descriptor": {"id": "collection-descriptor", "group": "Style", "type": "categorical", "class": ["collection-prop", "partition-prop"], "options": [
        //     {display:"Show", value:'Show'},{display:"Hide", value:'Hide'}
        // ]},
        "Curve Mode": {"id": "curveMode", "channel": "curveMode", "group": "Style", "type": "categorical", "encodable": false, "class": ["path-prop", "area-prop"], accessor: ["curveMode"],
            "options": [
                {"display": "Natural", value: "natural", parameters: []},
                {"display": "Basis", value: "basis", parameters: []},
                {"display": "BumpX", value: "bumpX", parameters: []},
                {"display": "BumpY", value: "bumpY", parameters: []},
                {"display": "Linear", value: "linear", parameters: []},
                {"display": "Step", value: "step", parameters: []},
                {"display": "CatmullRom", value: "CatmullRom", parameters: []},
                {"display": "Cardinal", value: "cardinal", parameters: []}
            ]
        },
        "Fill Color": {"id": "fillColor", "channel": "fillColor", "group": "Style", "type": "color", "encodable": true, "class": ["circle-prop", "rect-prop", "path-prop", "polygon-prop", "arc-prop", "pie-prop", "text-prop", "area-prop", "ring-prop"], accessor: ["fillColor"]},
        "Stroke Color": {"id": "strokeColor", "channel": "strokeColor", "group": "Style", "type": "color", "encodable": true, "class": ["line-prop", "circle-prop", "rect-prop", "path-prop", "polygon-prop", "arc-prop", "pie-prop", "text-prop", "area-prop", "ring-prop"], accessor: ["strokeColor"]},
        "Stroke Width": {"id": "strokeWidth", "channel": "strokeWidth", "group": "Style", "type": "numeric", "encodable": true, "class": ["line-prop", "circle-prop", "rect-prop", "path-prop", "polygon-prop", "arc-prop", "pie-prop", "text-prop", "area-prop", "ring-prop"], accessor: ["strokeWidth"]},
        "Opacity": {"id": "opacity", "channel": "opacity", "group": "Style", "type": "numeric-range", "encodable": false, "class": ["line-prop", "circle-prop", "rect-prop", "path-prop", "polygon-prop", "arc-prop", "pie-prop", "text-prop", "area-prop", "ring-prop"], "range": [0, 1], accessor: ["opacity"]}

    },

    "Canvas": {
        "Background": {"id": "canvasFillColor", "group": "canvas", "type": "color", "encodable": false, "class": ["canvas-prop"], "accessor": ["fillColor"]}
    },

    "Collection Properties": {
        "X": {"id": "collectionX", channel: "x", "group": "collection", "type": "numeric", "encodable": true, "class": ["collection-prop"], accessor: ["x"]},
        "Y": {"id": "collectionY", channel: "y", "group": "collection", "type": "numeric", "encodable": true, "class": ["collection-prop"], accessor: ["y"]},
        "Children Order": {"id": "childrenOrder", "group": "collection", "type": "categorical", "encodable": false, "class": ["collection-prop"], accessor: ["childrenOrder", "field"],
            "options": [{display:"Default", value:'default', parameters: []}]
        }        
    },

    "Glyph Position": {
        "X": {"id": "glyphX", channel: "x", "group": "Glyph Position", "type": "numeric", "encodable": true, "class": ["glyph-prop"], accessor: ["x"]},
        "Y": {"id": "glyphY", channel: "y", "group": "Glyph Position", "type": "numeric", "encodable": true, "class": ["glyph-prop"], accessor: ["y"]}
    },

    "Layout": {
        "Type": {"id": "layoutType", "group": "Layout", "type": "categorical", "encodable": false, "class": ["collection-prop", "grid-prop", "stack-prop", "none-prop"],
            "options": [{display:"Grid", value:'grid', parameters: ['Num Rows', 'Num Columns', 'Row Gap', 'Column Gap', 'Horz Gravity', 'Vert Gravity', 'Direction']},
                        {display:"Stack", value:'stack', parameters: ['Orientation', 'Horz Gravity', 'Vert Gravity']},
                        {display:"Pack", value:'packing', parameters: []},
                        {display:"Treemap", value:'treemap', parameters: []},
                        {display:"None", value:'none', parameters: []}
                        ]
        },
        "Num Rows": {"id": "numRows", "group": "Layout", "type": "numeric-integer", "encodable": false, "class": ["grid-prop", "layout-prop"], accessor: ["numRows"]},
        "Num Columns": {"id": "numCols", "group": "Layout", "type": "numeric-integer", "encodable": false, "class": ["grid-prop", "layout-prop"], accessor: ["numCols"]},
        "Row Gap": {"id": "rowGap", "group": "Layout", "type": "numeric", "encodable": false, "class": ["grid-prop", "layout-prop"], accessor: ["rowGap"]},
        "Column Gap": {"id": "colGap", "group": "Layout", "type": "numeric", "encodable": false, "class": ["grid-prop", "layout-prop"], accessor: ["colGap"]},
        "Orientation": {"id": "orientation", "group": "Layout", "type": "categorical", "encodable": false, "class": ["stack-prop", "layout-prop"], accessor: ["orientation"], 
            "options": [{"display": "Horizontal", value: "horizontal", parameters: []}, {"display": "Vertical", value: "vertical", parameters: []}]
        },
        "Horz Gravity": {"id": "horzGravity", "group": "Layout", "type": "categorical", "encodable": false, "class": ["grid-prop", "stack-prop", "layout-prop"], accessor: ["horzCellAlignment"], 
            "options": [{"display": "Left", value: "left", parameters: []}, {"display": "Center", value: "center", parameters: []}, {"display": "Right", value: "right", parameters: []}]
        },
        "Vert Gravity": {"id": "vertGravity", "group": "Layout", "type": "categorical", "encodable": false, "class": ["grid-prop", "stack-prop", "layout-prop"], accessor: ["vertCellAlignment"], 
            "options": [{"display": "Top", value: "top", parameters: []}, {"display": "Middle", value: "middle", parameters: []}, {"display": "Bottom", value: "bottom", parameters: []}]
        },
        "Direction": {"id": "direction", "group": "Layout", "type": "categorical", "encodable": false, "class": ["grid-prop", "layout-prop"], accessor: ["direction"], 
            "options": [{"display": "Left to Right, Bottom to Top", value: 'l2r_b2t', parameters: []}, 
                        {"display": "Left to Right, Top to Bottom", value: 'l2r_t2b', parameters: []}, 
                        {"display": "Right to Left, Bottom to Top", value: 'r2l_b2t', parameters: []},
                        {"display": "Right to Left, Top to Bottom", value: 'r2l_t2b', parameters: []}, 
                        {"display": "Bottom to Top, Left to Right", value: 'b2t_l2r', parameters: []}, 
                        {"display": "Top to Bottom, Left to Right", value: 't2b_l2r', parameters: []}, 
                        {"display": "Bottom to Top, Right to Left", value: 'b2t_r2l', parameters: []},
                        {"display": "Top to Bottom, Right to Left", value: 't2b_r2l', parameters: []}
                    ]
        } 
        //"Gap": {"id": "gap", "group": "Layout", "type": "numeric", "class": ["partition-prop"]},
    },

    "Axis": {
        "Include 0": {id: "includeZero", "group": "axis", "type": "boolean", "encodable": false, "class": ["axis-prop"], "accessor": ["includeZero"]},
        "Show Path": {id: "showPath", "group": "axis", "type": "boolean", "encodable": false, "class": ["axis-prop"], "accessor": ["pathVisible"]},
        "Show Ticks": {id: "showTicks", "group": "axis", "type": "boolean", "encodable": false, "class": ["axis-prop"], "accessor": ["tickVisible"]},
        "Orientation": {"id": "axisOrientation", "group": "axis", "type": "categorical", "encodable": false, "class": ["axis-prop"], "accessor": ["orientation"],
            "options": [{display:"top", value:'top'},
                        {display:"bottom", value:'bottom'},
                        {display:"left", value:'left'},
                        {display:"right", value:'right'}]
        },
        "Stroke Color": {"id": "axisStrokeColor", "group": "axis", "type": "color", "encodable": false, "class": ["axis-prop"], "accessor": ["strokeColor"]},
        "Text Color": {"id": "axisTextColor", "group": "axis", "type": "color", "encodable": false, "class": ["axis-prop"], "accessor": ["textColor"]},
        "Path Position": {"id": "pathPos", "group": "axis", "type": "numeric", "encodable": false, "class": ["axis-prop"], "accessor": ["pathPosition"]},
        "Tick Offset": {"id": "tickOffset", "group": "axis", "type": "numeric", "encodable": false, "class": ["axis-prop"], "accessor": ["tickOffset"]},
        "Tick Size": {"id": "tickSize", "group": "axis", "type": "numeric", "encodable": false, "class": ["axis-prop"], "accessor": ["tickSize"]},
        "Label Offset": {"id": "labelOffset", "group": "axis", "type": "numeric", "encodable": false, "class": ["axis-prop"], "accessor": ["labelOffset"]},
        "Label Format": {"id": "labelFormat", "group": "axis", "type": "string", "encodable": false, "class": ["axis-prop"], "accessor": ["labelFormat"]},
        "Label Rotation": {"id": "labelRotation", "group": "axis", "type": "numeric", "encodable": false, "class": ["axis-prop"], "accessor": ["labelRotation"]},
        "Show Title": {id: "showTitle", "group": "axis", "type": "boolean", "encodable": false, "class": ["axis-prop"], "accessor": ["showTitle"]},
    },

    "Legend": {
        // "X": {"id": "legendX", channel: "x", "group": "legend", "type": "numeric", "encodable": false, "class": ["legend-prop"], accessor: ["x"]},
        // "Y": {"id": "legendY", channel: "y", "group": "legend", "type": "numeric", "encodable": false, "class": ["legend-prop"], accessor: ["y"]},
        "Text Color": {"id": "legendTextColor", "group": "legend", "type": "color", "encodable": false, "class": ["legend-prop"], "accessor": ["textColor"]},
        "Orientation": {"id": "legendOrientation", "group": "legend", "type": "categorical", "encodable": false, "class": ["legend-prop"], "accessor": ["orientation"],
                        "options": [{display:"Horizontal", value:'horizontal'}, {display:"Vertical", value:'vertical'}]}
    },

    "Gridlines": {
        "Stroke Color": {"id": "gridlineStrokeColor", "group": "Gridlines", "type": "color", "encodable": false, "class": ["gridlines-prop"], accessor: ["strokeColor"]},
        "Stroke Width": {"id": "gridlineStrokeWidth", "group": "Gridlines", "type": "numeric", "encodable": false, "class": ["gridlines-prop"], accessor: ["strokeWidth"]}
    }

    // "Alignment in Cell": {
    //     "Horizontal": {"id": "x-constraint", "group": "Float", "type": "categorical", "encodable": false,
    //         "class": ["line-constraint-prop", "circle-constraint-prop", "rect-constraint-prop", "text-constraint-prop","repeat-grid-constraint-prop", "partition-constraint-prop"],
    //         "options": [{display:"Off", value:'off'}, {display:"Left", value:'left'},{display:"Center", value:'center'},{display:"Right", value:'right'}]},
    //     "Vertical": {"id": "y-constraint", "group": "Float", "type": "categorical", "encodable": false,
    //         "class": ["line-constraint-prop", "circle-constraint-prop", "rect-constraint-prop", "text-constraint-prop","repeat-grid-constraint-prop", "partition-constraint-prop"],
    //         "options": [{display:"Off", value:'off'}, {display:"Top", value:'top'},{display:"Middle", value:'middle'},{display:"Bottom", value:'bottom'}]}
    // }
};

const divergingColorSchemes = {
    "interpolateBrBG": "BrownBlueGreen",
    "interpolatePRGn": "PurpleGreen",
    "interpolatePiYG": "PinkYellowGreen",
    "interpolatePuOr": "PurpleOrange",
    "interpolateRdBu": "RedBlue",
    "interpolateRdGy": "RedGrey",
    "interpolateRdYlBu": "RedYellowBlue",
    "interpolateRdYlGn": "RedYellowGreen",
    "interpolateSpectral": "Spectral"
};

const sequentialColorSchemes = {
    "interpolateTurbo": "Turbo",
    "interpolateViridis": "Viridis",
    "interpolateInferno": "Inferno",
    "interpolateMagma": "Magma",
    "interpolatePlasma": "Plasma",
    "interpolateCividis": "Cividis",
    "interpolateWarm": "Warm",
    "interpolateCool": "Cool",
    "interpolateCubehelixDefault": "CubehelixDefault",
    "interpolateBuGn": "Blue-Green",
    "interpolateBuPu": "Blue-Purple",
    "interpolateGnBu": "Green-Blue",
    "interpolateOrRd": "Orange-Red",
    "interpolatePuBuGn": "Purple-Blue-Green",
    "interpolatePuBu": "Purple-Blue",
    "interpolatePuRd": "Purple-Red",
    "interpolateRdPu": "Red-Purple",
    "interpolateYlGnBu": "Yellow-Green-Blue",
    "interpolateYlGn": "Yellow-Green",
    "interpolateYlOrBr": "Yellow-Orange-Brown",
    "interpolateYlOrRd": "Yellow-Orange-Red" 
};

export { properties, divergingColorSchemes, sequentialColorSchemes }