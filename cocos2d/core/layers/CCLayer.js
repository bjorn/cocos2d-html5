/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/** cc.Layer is a subclass of cc.Node that implements the TouchEventsDelegate protocol.<br/>
 * All features from cc.Node are valid, plus the bake feature: Baked layer can cache a static layer to improve performance
 * @class
 * @extends cc.Node
 */
cc.Layer = cc.Node.extend(/** @lends cc.Layer# */{
    _className: "Layer",

    /**
     * <p>Constructor of cc.Layer, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.</p>
     */
    ctor: function () {
        var nodep = cc.Node.prototype;
        nodep.ctor.call(this);
        this._ignoreAnchorPointForPosition = true;
        nodep.setAnchorPoint.call(this, 0.5, 0.5);
        nodep.setContentSize.call(this, cc.winSize);
    },

    /**
     * Initialization of the layer, please do not call this function by yourself, you should pass the parameters to constructor to initialize a layer
     */
    init: function(){
        var _t = this;
        _t._ignoreAnchorPointForPosition = true;
        _t.setAnchorPoint(0.5, 0.5);
        _t.setContentSize(cc.winSize);
        _t.cascadeOpacity = false;
        _t.cascadeColor = false;
        return true;
    },

    /**
     * Sets the layer to cache all of children to a bake sprite, and draw itself by bake sprite. recommend using it in UI.<br/>
     * This is useful only in html5 engine
     * @function
     * @see cc.Layer#unbake
     */
    bake: function(){
        this._renderCmd.bake();
    },

    /**
     * Cancel the layer to cache all of children to a bake sprite.<br/>
     * This is useful only in html5 engine
     * @function
     * @see cc.Layer#bake
     */
    unbake: function(){
        this._renderCmd.unbake();
    },

    /**
     * Determines if the layer is baked.
     * @function
     * @returns {boolean}
     * @see cc.Layer#bake and cc.Layer#unbake
     */
    isBaked: function(){
        return this._isBaked;
    },

    /**
     * @function
     */
    visit: function(){
        this._renderCmd.visit();
    },

    addChild: function(child, localZOrder, tag){
        cc.Node.prototype.addChild.call(this, child, localZOrder, tag);
        this._renderCmd._bakeForAddChild(child);
    },

    _createRenderCmd: function(){
        if (cc._renderType === cc._RENDER_TYPE_CANVAS)
            return new cc.Layer.CanvasRenderCmd(this);
        else
            return new cc.Layer.WebGLRenderCmd(this);
    }
});

/**
 * Creates a layer
 * @deprecated since v3.0, please use the new construction instead
 * @see cc.Layer
 * @return {cc.Layer|Null}
 */
cc.Layer.create = function () {
    return new cc.Layer();
};

/**
 * <p>
 * CCLayerColor is a subclass of CCLayer that implements the CCRGBAProtocol protocol.       <br/>
 *  All features from CCLayer are valid, plus the following new features:                   <br/>
 * - opacity                                                                     <br/>
 * - RGB colors                                                                  </p>
 * @class
 * @extends cc.Layer
 *
 * @param {cc.Color} [color=] The color of the layer
 * @param {Number} [width=] The width of the layer
 * @param {Number} [height=] The height of the layer
 *
 * @example
 * // Example
 * //Create a yellow color layer as background
 * var yellowBackground = new cc.LayerColor(cc.color(255,255,0,255));
 * //If you didn't pass in width and height, it defaults to the same size as the canvas
 *
 * //create a yellow box, 200 by 200 in size
 * var yellowBox = new cc.LayerColor(cc.color(255,255,0,255), 200, 200);
 */
cc.LayerColor = cc.Layer.extend(/** @lends cc.LayerColor# */{
    _blendFunc: null,
    _className: "LayerColor",

    /**
     * Returns the blend function
     * @return {cc.BlendFunc}
     */
    getBlendFunc: function () {
        return this._blendFunc;
    },

    /**
     * Changes width and height
     * @deprecated since v3.0 please use setContentSize instead
     * @see cc.Node#setContentSize
     * @param {Number} w width
     * @param {Number} h height
     */
    changeWidthAndHeight: function (w, h) {
        this.width = w;
        this.height = h;
    },

    /**
     * Changes width in Points
     * @deprecated since v3.0 please use setContentSize instead
     * @see cc.Node#setContentSize
     * @param {Number} w width
     */
    changeWidth: function (w) {
        this.width = w;
    },

    /**
     * change height in Points
     * @deprecated since v3.0 please use setContentSize instead
     * @see cc.Node#setContentSize
     * @param {Number} h height
     */
    changeHeight: function (h) {
        this.height = h;
    },

    setOpacityModifyRGB: function (value) {
    },

    isOpacityModifyRGB: function () {
        return false;
    },

    setColor: function (color) {
        cc.Layer.prototype.setColor.call(this, color);
        this._updateColor();
        this.setDirtyFlag(cc.Node._dirtyFlags.colorDirty);
    },

    setOpacity: function (opacity) {
        cc.Layer.prototype.setOpacity.call(this, opacity);
        this._updateColor();
        this.setDirtyFlag(cc.Node._dirtyFlags.opacityDirty);
    },

    _blendFuncStr: "source-over",

    /**
     * Constructor of cc.LayerColor
     * @function
     * @param {cc.Color} [color=]
     * @param {Number} [width=]
     * @param {Number} [height=]
     */
    ctor: function(color, width, height){
        cc.Layer.prototype.ctor.call(this);
        this._blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        cc.LayerColor.prototype.init.call(this, color, width, height);
    },

    /**
     * Initialization of the layer, please do not call this function by yourself, you should pass the parameters to constructor to initialize a layer
     * @param {cc.Color} [color=]
     * @param {Number} [width=]
     * @param {Number} [height=]
     * @return {Boolean}
     */
    init: function (color, width, height) {
        if (cc._renderType !== cc._RENDER_TYPE_CANVAS)
            this.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_COLOR);

        var winSize = cc.director.getWinSize();
        color = color || cc.color(0, 0, 0, 255);
        width = width === undefined ? winSize.width : width;
        height = height === undefined ? winSize.height : height;

        var locRealColor = this._realColor;
        locRealColor.r = color.r;
        locRealColor.g = color.g;
        locRealColor.b = color.b;

        this._realOpacity = color.a;

        var proto = cc.LayerColor.prototype;
        proto.setContentSize.call(this, width, height);
        proto._updateColor.call(this);
        return true;
    },

    /**
     * Sets the blend func, you can pass either a cc.BlendFunc object or source and destination value separately
     * @param {Number|cc.BlendFunc} src
     * @param {Number} [dst]
     */
    setBlendFunc: function (src, dst) {
        var _t = this, locBlendFunc = this._blendFunc;
        if (dst === undefined) {
            locBlendFunc.src = src.src;
            locBlendFunc.dst = src.dst;
        } else {
            locBlendFunc.src = src;
            locBlendFunc.dst = dst;
        }
        if (cc._renderType === cc._RENDER_TYPE_CANVAS)
            _t._blendFuncStr = cc.Node.CanvasRenderCmd._getCompositeOperationByBlendFunc(locBlendFunc);
    },

    _setWidth: function(width){
        this._renderCmd._updateSquareVerticesWidth(width);
        cc.Node.prototype._setWidth.call(this, width);
    },

    _setHeight: function(height){
        this._renderCmd._updateSquareVerticesHeight(height);
        cc.Node.prototype._setHeight.call(this, height);
    },

    _updateColor: function(){
        var renderCmd = this._renderCmd,
            relColor = this._realColor,
            disColor = renderCmd._displayedColor;
        disColor.r = relColor.r;
        disColor.g = relColor.g;
        disColor.b = relColor.b;
        disColor.a = relColor.a;
        renderCmd._updateColor();
    },

    updateDisplayedColor: function (parentColor) {
        cc.Layer.prototype.updateDisplayedColor.call(this, parentColor);
        this._renderCmd._updateColor();
    },

    updateDisplayedOpacity: function (parentOpacity) {
        cc.Layer.prototype.updateDisplayedOpacity.call(this, parentOpacity);
        this._renderCmd._updateColor();
    },

    _createRenderCmd: function(){
        if (cc._renderType === cc._RENDER_TYPE_CANVAS)
            return new cc.LayerColor.CanvasRenderCmd(this);
        else
            return new cc.LayerColor.WebGLRenderCmd(this);
    },

    draw: function(){
        this._renderCmd.draw();
    },

    setContentSize: function(size, height){
        this._renderCmd._updataSquareVertices();
        cc.Layer.prototype.setContentSize.call(this, size, height);
    }
});

/**
 * Creates a cc.Layer with color, width and height in Points
 * @deprecated since v3.0 please use the new construction instead
 * @see cc.LayerColor
 * @param {cc.Color} color
 * @param {Number|Null} [width=]
 * @param {Number|Null} [height=]
 * @return {cc.LayerColor}
 */
cc.LayerColor.create = function (color, width, height) {
    return new cc.LayerColor(color, width, height);
};

//LayerColor - Getter Setter
(function(){
    var proto = cc.LayerColor.prototype;
    cc.defineGetterSetter(proto, "width", proto._getWidth, proto._setWidth);
    cc.defineGetterSetter(proto, "height", proto._getHeight, proto._setHeight);
})();

/**
 * <p>
 * CCLayerGradient is a subclass of cc.LayerColor that draws gradients across the background.<br/>
 *<br/>
 * All features from cc.LayerColor are valid, plus the following new features:<br/>
 * <ul><li>direction</li>
 * <li>final color</li>
 * <li>interpolation mode</li></ul>
 * <br/>
 * Color is interpolated between the startColor and endColor along the given<br/>
 * vector (starting at the origin, ending at the terminus).  If no vector is<br/>
 * supplied, it defaults to (0, -1) -- a fade from top to bottom.<br/>
 * <br/>
 * If 'compressedInterpolation' is disabled, you will not see either the start or end color for<br/>
 * non-cardinal vectors; a smooth gradient implying both end points will be still<br/>
 * be drawn, however.<br/>
 *<br/>
 * If 'compressedInterpolation' is enabled (default mode) you will see both the start and end colors of the gradient.
 * </p>
 * @class
 * @extends cc.LayerColor
 *
 * @param {cc.Color} start Starting color
 * @param {cc.Color} end Ending color
 * @param {cc.Point} [v=cc.p(0, -1)] A vector defines the gradient direction, default direction is from top to bottom
 *
 * @property {cc.Color} startColor              - Start color of the color gradient
 * @property {cc.Color} endColor                - End color of the color gradient
 * @property {Number}   startOpacity            - Start opacity of the color gradient
 * @property {Number}   endOpacity              - End opacity of the color gradient
 * @property {Number}   vector                  - Direction vector of the color gradient
 * @property {Number}   compresseInterpolation  - Indicate whether or not the interpolation will be compressed
 */
cc.LayerGradient = cc.LayerColor.extend(/** @lends cc.LayerGradient# */{
    _endColor: null,
    _startOpacity: 255,
    _endOpacity: 255,
    _alongVector: null,
    _compressedInterpolation: false,
    _className: "LayerGradient",

    /**
     * Constructor of cc.LayerGradient
     * @param {cc.Color} start
     * @param {cc.Color} end
     * @param {cc.Point} [v=cc.p(0, -1)]
     */
    ctor: function (start, end, v) {
        var _t = this;
        cc.LayerColor.prototype.ctor.call(_t);

        _t._endColor = cc.color(0, 0, 0, 255);
        _t._alongVector = cc.p(0, -1);
        _t._startOpacity = 255;
        _t._endOpacity = 255;
        cc.LayerGradient.prototype.init.call(_t, start, end, v);
    },

    /**
     * Initialization of the layer, please do not call this function by yourself, you should pass the parameters to constructor to initialize a layer
     * @param {cc.Color} start starting color
     * @param {cc.Color} end
     * @param {cc.Point|Null} v
     * @return {Boolean}
     */
    init: function (start, end, v) {
        start = start || cc.color(0, 0, 0, 255);
        end = end || cc.color(0, 0, 0, 255);
        v = v || cc.p(0, -1);
        var _t = this;

        // Initializes the CCLayer with a gradient between start and end in the direction of v.
        var locEndColor = _t._endColor;
        _t._startOpacity = start.a;

        locEndColor.r = end.r;
        locEndColor.g = end.g;
        locEndColor.b = end.b;
        _t._endOpacity = end.a;

        _t._alongVector = v;
        _t._compressedInterpolation = true;

        cc.LayerColor.prototype.init.call(_t, cc.color(start.r, start.g, start.b, 255));
        cc.LayerGradient.prototype._updateColor.call(_t);
        return true;
    },

    /**
     * Sets the untransformed size of the LayerGradient.
     * @param {cc.Size|Number} size The untransformed size of the LayerGradient or The untransformed size's width of the LayerGradient.
     * @param {Number} [height] The untransformed size's height of the LayerGradient.
     */
    setContentSize: function (size, height) {
        cc.LayerColor.prototype.setContentSize.call(this, size, height);
        this._updateColor();
    },

    _setWidth: function (width) {
        cc.LayerColor.prototype._setWidth.call(this, width);
        this._updateColor();
    },
    _setHeight: function (height) {
        cc.LayerColor.prototype._setHeight.call(this, height);
        this._updateColor();
    },

    /**
     * Returns the starting color
     * @return {cc.Color}
     */
    getStartColor: function () {
        return this._realColor;
    },

    /**
     * Sets the starting color
     * @param {cc.Color} color
     * @example
     * // Example
     * myGradientLayer.setStartColor(cc.color(255,0,0));
     * //set the starting gradient to red
     */
    setStartColor: function (color) {
        this.color = color;
    },

    /**
     * Sets the end gradient color
     * @param {cc.Color} color
     * @example
     * // Example
     * myGradientLayer.setEndColor(cc.color(255,0,0));
     * //set the ending gradient to red
     */
    setEndColor: function (color) {
        this._endColor = color;
        this._updateColor();
    },

    /**
     * Returns the end color
     * @return {cc.Color}
     */
    getEndColor: function () {
        return this._endColor;
    },

    /**
     * Sets starting gradient opacity
     * @param {Number} o from 0 to 255, 0 is transparent
     */
    setStartOpacity: function (o) {
        this._startOpacity = o;
        this._updateColor();
    },

    /**
     * Returns the starting gradient opacity
     * @return {Number}
     */
    getStartOpacity: function () {
        return this._startOpacity;
    },

    /**
     * Sets the end gradient opacity
     * @param {Number} o
     */
    setEndOpacity: function (o) {
        this._endOpacity = o;
        this._updateColor();
    },

    /**
     * Returns the end gradient opacity
     * @return {Number}
     */
    getEndOpacity: function () {
        return this._endOpacity;
    },

    /**
     * Sets the direction vector of the gradient
     * @param {cc.Point} Var
     */
    setVector: function (Var) {
        this._alongVector.x = Var.x;
        this._alongVector.y = Var.y;
        this._updateColor();
    },

    /**
     * Returns the direction vector of the gradient
     * @return {cc.Point}
     */
    getVector: function () {
        return cc.p(this._alongVector.x, this._alongVector.y);
    },

    /**
     * Returns whether compressed interpolation is enabled
     * @return {Boolean}
     */
    isCompressedInterpolation: function () {
        return this._compressedInterpolation;
    },

    /**
     * Sets whether compressed interpolation is enabled
     * @param {Boolean} compress
     */
    setCompressedInterpolation: function (compress) {
        this._compressedInterpolation = compress;
        this._updateColor();
    },

    _createRenderCmd: function(){
        if (cc._renderType === cc._RENDER_TYPE_CANVAS)
            return new cc.LayerGradient.CanvasRenderCmd(this);
        else
            return new cc.LayerGradient.WebGLRenderCmd(this);
    },

    _draw: function(){
        cc.LayerColor.prototype.draw.call(this);
    },

    _updateColor: function(){
        this._renderCmd._updateColor();
    }
});

/**
 * Creates a gradient layer
 * @deprecated since v3.0, please use the new construction instead
 * @see cc.layerGradient
 * @param {cc.Color} start starting color
 * @param {cc.Color} end ending color
 * @param {cc.Point|Null} v
 * @return {cc.LayerGradient}
 */
cc.LayerGradient.create = function (start, end, v) {
    return new cc.LayerGradient(start, end, v);
};
//LayerGradient - Getter Setter
(function(){
    var proto = cc.LayerGradient.prototype;
    // Extended properties
    /** @expose */
    proto.startColor;
    cc.defineGetterSetter(proto, "startColor", proto.getStartColor, proto.setStartColor);
    /** @expose */
    proto.endColor;
    cc.defineGetterSetter(proto, "endColor", proto.getEndColor, proto.setEndColor);
    /** @expose */
    proto.startOpacity;
    cc.defineGetterSetter(proto, "startOpacity", proto.getStartOpacity, proto.setStartOpacity);
    /** @expose */
    proto.endOpacity;
    cc.defineGetterSetter(proto, "endOpacity", proto.getEndOpacity, proto.setEndOpacity);
    /** @expose */
    proto.vector;
    cc.defineGetterSetter(proto, "vector", proto.getVector, proto.setVector);
})();

/**
 * CCMultipleLayer is a CCLayer with the ability to multiplex it's children.<br/>
 * Features:<br/>
 *  <ul><li>- It supports one or more children</li>
 *  <li>- Only one children will be active a time</li></ul>
 * @class
 * @extends cc.Layer
 * @param {Array} layers an array of cc.Layer
 * @example
 * // Example
 * var multiLayer = new cc.LayerMultiple(layer1, layer2, layer3);//any number of layers
 */
cc.LayerMultiplex = cc.Layer.extend(/** @lends cc.LayerMultiplex# */{
    _enabledLayer: 0,
    _layers: null,
    _className: "LayerMultiplex",

    /**
     * Constructor of cc.LayerMultiplex
     * @param {Array} layers an array of cc.Layer
     */
    ctor: function (layers) {
        cc.Layer.prototype.ctor.call(this);
        if (layers instanceof Array)
            cc.LayerMultiplex.prototype.initWithLayers.call(this, layers);
        else
            cc.LayerMultiplex.prototype.initWithLayers.call(this, Array.prototype.slice.call(arguments));
    },

    /**
     * Initialization of the layer multiplex, please do not call this function by yourself, you should pass the parameters to constructor to initialize a layer multiplex
     * @param {Array} layers an array of cc.Layer
     * @return {Boolean}
     */
    initWithLayers: function (layers) {
        if ((layers.length > 0) && (layers[layers.length - 1] == null))
            cc.log(cc._LogInfos.LayerMultiplex_initWithLayers);

        this._layers = layers;
        this._enabledLayer = 0;
        this.addChild(this._layers[this._enabledLayer]);
        return true;
    },

    /**
     * Switches to a certain layer indexed by n.<br/>
     * The current (old) layer will be removed from it's parent with 'cleanup:YES'.
     * @param {Number} n the layer index to switch to
     */
    switchTo: function (n) {
        if (n >= this._layers.length) {
            cc.log(cc._LogInfos.LayerMultiplex_switchTo);
            return;
        }

        this.removeChild(this._layers[this._enabledLayer], true);
        this._enabledLayer = n;
        this.addChild(this._layers[n]);
    },

    /**
     * Release the current layer and switches to another layer indexed by n.<br/>
     * The current (old) layer will be removed from it's parent with 'cleanup:YES'.
     * @param {Number} n the layer index to switch to
     */
    switchToAndReleaseMe: function (n) {
        if (n >= this._layers.length) {
            cc.log(cc._LogInfos.LayerMultiplex_switchToAndReleaseMe);
            return;
        }

        this.removeChild(this._layers[this._enabledLayer], true);

        //[layers replaceObjectAtIndex:_enabledLayer withObject:[NSNull null]];
        this._layers[this._enabledLayer] = null;
        this._enabledLayer = n;
        this.addChild(this._layers[n]);
    },

    /**
     * Add a layer to the multiplex layers list
     * @param {cc.Layer} layer
     */
    addLayer: function (layer) {
        if (!layer) {
            cc.log(cc._LogInfos.LayerMultiplex_addLayer);
            return;
        }
        this._layers.push(layer);
    }
});

/**
 * Creates a cc.LayerMultiplex with one or more layers using a variable argument list.
 * @deprecated since v3.0, please use new construction instead
 * @see cc.LayerMultiplex
 * @return {cc.LayerMultiplex|Null}
 */
cc.LayerMultiplex.create = function (/*Multiple Arguments*/) {
    return new cc.LayerMultiplex(Array.prototype.slice.call(arguments));
};