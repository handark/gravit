(function (_) {

    /**
     * Rectangle properties panel
     * @class GRectangleProperties
     * @extends GProperties
     * @constructor
     */
    function GRectangleProperties() {
        this._rectangles = [];
    };
    IFObject.inherit(GRectangleProperties, GProperties);

    /**
     * @type {JQuery}
     * @private
     */
    GRectangleProperties.prototype._panel = null;

    /**
     * @type {GDocument}
     * @private
     */
    GRectangleProperties.prototype._document = null;

    /**
     * @type {Array<IFRectangle>}
     * @private
     */
    GRectangleProperties.prototype._rectangles = null;

    /** @override */
    GRectangleProperties.prototype.getCategory = function () {
        // TODO : I18N
        return 'Rectangle';
    };

    /** @override */
    GRectangleProperties.prototype.init = function (panel, controls) {
        this._panel = panel;

        var _createInput = function (property) {
            var self = this;
            if (property === 'uf') {
                return $('<div></div>')
                    .css('width', '12em')
                    .addClass('g-switch')
                    .append($('<label></label>')
                        .append($('<input>')
                            .attr('type', 'checkbox')
                            .attr('data-property', property)
                            .on('change', function () {
                                self._assignProperty('uf', $(this).is(':checked'));
                                self._updateCornerProperties();
                            }))
                        .append($('<span></span>')
                            .addClass('switch')
                            .attr({
                                // TODO : I18N
                                'data-on': 'Uniform Corners',
                                'data-off': 'Separate Corners'
                            })));
            }
            else if (property === 'tl_sx' || property === 'tl_sy' || property === 'tr_sx' || property === 'tr_sy' ||
                property === 'bl_sx' || property === 'bl_sy' || property === 'br_sx' || property === 'br_sy') {
                return $('<input>')
                    .attr('type', 'text')
                    .attr('data-property', property)
                    .css('width', '4em')
                    .on('change', function () {
                        var value = self._document.getScene().stringToPoint($(this).val());
                        if (value !== null && typeof value === 'number' && value >= 0) {
                            self._assignProperty(property, value);
                        } else {
                            self._updateCornerProperties();
                        }
                    });
            } else if (property === 'tl_ct' || property === 'tr_ct' || property === 'bl_ct' || property === 'br_ct') {
                return $('<select></select>')
                    .attr('data-property', property)
                    .css('width', '2em')
                    .gCornerType()
                    .on('change', function () {
                        self._assignProperty(property, $(this).val());
                    });
            } else if (property === 'tl_uf' || property === 'tr_uf' || property === 'bl_uf' || property === 'br_uf') {
                return $('<button></button>')
                    .attr('data-property', property)
                    .addClass('fa fa-lock fa-fw')
                    .on('click', function () {
                        self._assignProperty(property, !$(this).hasClass('g-active'));
                        self._updateCornerProperties();
                    });
            } else {
                throw new Error('Unknown input property: ' + property);
            }
        }.bind(this);

        // TODO : I18N
        var titleUniform = 'Uniform Corner-Smoothness';
        var titleSmoothX = 'Horizontal Corner-Smoothness';
        var titleSmoothY = 'Vertical Corner-Smoothness';
        var titleCornerType = 'Corner-Type';

        $('<table></table>')
            .addClass('g-form')
            .css('margin', '0px auto')
            .append($('<tr></tr>')
                .append($('<td></td>')
                    .attr('colspan', '2')
                    .append(_createInput('uf'))))
            .append($('<tr></tr>')
                .append($('<td></td>')
                    .append(_createInput('tl_uf')
                        .attr('title', titleUniform))
                    .append(_createInput('tl_sx')
                        .attr('title', titleSmoothX)))
                .append($('<td></td>')
                    .append(_createInput('tr_sx')
                        .attr('title', titleSmoothX))
                    .append(_createInput('tr_uf')
                        .attr('title', titleUniform))))
            .append($('<tr></tr>')
                .append($('<td></td>')
                    .append(_createInput('tl_sy')
                        .attr('title', titleSmoothY))
                    .append(_createInput('tl_ct')
                        .attr('title', titleCornerType)))
                .append($('<td></td>')
                    .append(_createInput('tr_ct')
                        .attr('title', titleCornerType))
                    .append(_createInput('tr_sy')
                        .attr('title', titleSmoothY))))
            .append($('<tr></tr>')
                .append($('<td></td>')
                    .append(_createInput('bl_sy')
                        .attr('title', titleSmoothY))
                    .append(_createInput('bl_ct')
                        .attr('title', titleCornerType)))
                .append($('<td></td>')
                    .append(_createInput('br_ct')
                        .attr('title', titleCornerType))
                    .append(_createInput('br_sy')
                        .attr('title', titleSmoothY))))
            .append($('<tr></tr>')
                .append($('<td></td>')
                    .append(_createInput('bl_uf')
                        .attr('title', titleUniform))
                    .append(_createInput('bl_sx')
                        .attr('title', titleSmoothX)))
                .append($('<td></td>')
                    .append(_createInput('br_sx')
                        .attr('title', titleSmoothX))
                    .append(_createInput('br_uf')
                        .attr('title', titleUniform))))
            .appendTo(panel);
    };

    /** @override */
    GRectangleProperties.prototype.update = function (document, elements) {
        if (this._document) {
            this._document.getScene().removeEventListener(IFNode.AfterPropertiesChangeEvent, this._afterPropertiesChange);
            this._document = null;
        }

        // Collect all rectangle elements
        this._rectangles = [];
        for (var i = 0; i < elements.length; ++i) {
            if (elements[i] instanceof IFRectangle) {
                this._rectangles.push(elements[i]);
            }
        }

        if (this._rectangles.length === elements.length) {
            this._document = document;
            this._document.getScene().addEventListener(IFNode.AfterPropertiesChangeEvent, this._afterPropertiesChange, this);
            this._updateProperties();
            return true;
        } else {
            return false;
        }
    };

    /**
     * @param {IFNode.AfterPropertiesChangeEvent} event
     * @private
     */
    GRectangleProperties.prototype._afterPropertiesChange = function (event) {
        // If properties of first ellipse has changed then update ourself
        if (this._rectangles.length > 0 && this._rectangles[0] === event.node) {
            this._updateProperties();
        }
    };

    /**
     * @private
     */
    GRectangleProperties.prototype._updateProperties = function () {
        this._updateCornerProperties();
    };

    /**
     * @private
     */
    GRectangleProperties.prototype._updateCornerProperties = function () {
        // We'll always read properties of first ellipse
        var rectangle = this._rectangles[0];
        var allUniform = rectangle.getProperty('uf');

        var _updateCorners = function (corners) {
            for (var i = 0; i < corners.length; ++i) {
                var corner = corners[i];

                var uf = this._panel.find('button[data-property="' + corner + '_uf"]');
                var sx = this._panel.find('input[data-property="' + corner + '_sx"]');
                var sy = this._panel.find('input[data-property="' + corner + '_sy"]');
                var ct = this._panel.find('select[data-property="' + corner + '_ct"]');

                var hidden = allUniform && corner !== 'tl';
                uf.css('visibility', hidden ? 'hidden' : 'visible');
                sx.css('visibility', hidden ? 'hidden' : 'visible');
                sy.css('visibility', hidden ? 'hidden' : 'visible');
                ct.css('visibility', hidden ? 'hidden' : 'visible');

                if (!hidden) {
                    sx.val(this._document.getScene().pointToString(rectangle.getProperty(corner + '_sx')));
                    sy.val(this._document.getScene().pointToString(rectangle.getProperty(corner + '_sy')));
                    if (rectangle.getProperty(corner + '_uf')) {
                        uf.addClass('g-active');
                        sy.prop('disabled', true);
                    } else {
                        uf.removeClass('g-active');
                        sy.prop('disabled', false);
                    }

                    uf.prop('disabled', allUniform);
                }
            }
        }.bind(this);

        this._panel.find('input[data-property="uf"]').prop('checked', allUniform);
        _updateCorners(['tl', 'tr', 'bl', 'br']);
    };

    /**
     * @param {String} property
     * @param {*} value
     * @private
     */
    GRectangleProperties.prototype._assignProperty = function (property, value) {
        this._assignProperties([property], [value]);
    };

    /**
     * @param {Array<String>} properties
     * @param {Array<*>} values
     * @private
     */
    GRectangleProperties.prototype._assignProperties = function (properties, values) {
        var editor = this._document.getEditor();
        editor.beginTransaction();
        try {
            for (var i = 0; i < this._rectangles.length; ++i) {
                this._rectangles[i].setProperties(properties, values);
            }
        } finally {
            // TODO : I18N
            editor.commitTransaction('Modify Rectangle Properties');
        }
    };

    /** @override */
    GRectangleProperties.prototype.toString = function () {
        return "[Object GRectangleProperties]";
    };

    _.GRectangleProperties = GRectangleProperties;
})(this);