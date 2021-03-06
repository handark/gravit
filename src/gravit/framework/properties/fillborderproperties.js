(function (_) {

    /**
     * Shape properties panel
     * @class GFillBorderProperties
     * @extends GProperties
     * @constructor
     */
    function GFillBorderProperties() {
        this._elements = [];
    };
    IFObject.inherit(GFillBorderProperties, GProperties);

    /**
     * @type {JQuery}
     * @private
     */
    GFillBorderProperties.prototype._panel = null;

    /**
     * @type {GDocument}
     * @private
     */
    GFillBorderProperties.prototype._document = null;

    /**
     * @type {Array<IFStylable>}
     * @private
     */
    GFillBorderProperties.prototype._elements = null;

    /** @override */
    GFillBorderProperties.prototype.init = function (panel) {
        this._panel = panel;

        var _createInput = function (property) {
            var self = this;
            if (property === '_fpt' || property === '_bpt') {
                return $('<div></div>')
                    .attr('data-property', property)
                    .gColorButton({
                        allowClear: true
                    })
                    .on('colorchange', function (evt, color) {
                        self._assignProperty(property, color);
                    });
            } else if (property === 'fill-type') {
                return $('<select></select>')
                    .attr('data-property', property)
                    .gPatternTypes()
                    .on('patternchange', function (evt, patternClass) {
                        self._assignProperty('_fpt', patternClass ? new patternClass() : null);
                    });
            } else if (property === '_fop') {
                return $('<input>')
                    .attr('type', 'text')
                    .attr('data-property', property)
                    .on('change', function () {
                        var opacity = IFLength.parseEquationValue($(this).val());
                        if (opacity !== null && opacity >= 0.0 && opacity <= 100) {
                            self._assignProperty(property, opacity / 100);
                        } else {
                            self._updateProperties();
                        }
                    });
            } else if (property === '_bw' || property === '_bml') {
                return $('<input>')
                    .attr('type', 'text')
                    .attr('data-property', property)
                    .on('change', function () {
                        var value = IFLength.parseEquationValue($(this).val());
                        if (value !== null && value >= 0.0) {
                            self._assignProperty(property, value);
                        } else {
                            self._updateProperties();
                        }
                    });
            } else if (property.indexOf('_ba-') === 0) {
                var icon = '';
                var align = property.substr('_ba-'.length);
                switch (align) {
                    case IFStylable.BorderAlignment.Inside:
                        icon = 'gicon-stroke-inside';
                        break;
                    case IFStylable.BorderAlignment.Center:
                        icon = 'gicon-stroke-center';
                        break;
                    case IFStylable.BorderAlignment.Outside:
                        icon = 'gicon-stroke-outside';
                        break;
                    default:
                        break;
                }

                return $('<button></button>')
                    .attr('data-property', property)
                    .on('click', function () {
                        self._assignProperty('_ba', align);
                    })
                    .append($('<span></span>')
                        .addClass(icon));
            } else if (property.indexOf('_blc-') === 0) {
                var icon = '';
                var cap = property.substr('_blc-'.length);
                switch (cap) {
                    case IFPaintCanvas.LineCap.Butt:
                        icon = 'gicon-line-cap-butt';
                        break;
                    case IFPaintCanvas.LineCap.Round:
                        icon = 'gicon-line-cap-round';
                        break;
                    case IFPaintCanvas.LineCap.Square:
                        icon = 'gicon-line-cap-square';
                        break;
                    default:
                        break;
                }

                return $('<button></button>')
                    .attr('data-property', property)
                    .on('click', function () {
                        self._assignProperty('_blc', cap);
                    })
                    .append($('<span></span>')
                        .addClass(icon));
            } else if (property.indexOf('_blj-') === 0) {
                var icon = '';
                var join = property.substr('_blj-'.length);
                switch (join) {
                    case IFPaintCanvas.LineJoin.Bevel:
                        icon = 'gicon-line-join-bevel';
                        break;
                    case IFPaintCanvas.LineJoin.Round:
                        icon = 'gicon-line-join-round';
                        break;
                    case IFPaintCanvas.LineJoin.Miter:
                        icon = 'gicon-line-join-miter';
                        break;
                    default:
                        break;
                }

                return $('<button></button>')
                    .attr('data-property', property)
                    .on('click', function () {
                        self._assignProperty('_blj', join);
                    })
                    .append($('<span></span>')
                        .addClass(icon));
            } else {
                throw new Error('Unknown input property: ' + property);
            }
        }.bind(this);

        panel
            .css('width', '170px')
            // -- Fill
            .append($('<label></label>')
                .css({
                    'position': 'absolute',
                    'top': '5px',
                    'left': '5px'
                })
                .append($('<span></span>')
                    .addClass('gicon-fill')
                    .css({
                        'width': '16px',
                        'text-align': 'center'
                    }))
                .append(_createInput('_fpt')
                    .css({
                        'margin-left': '5px',
                        'width': '20px'
                    })))
            .append($('<label></label>')
                .css({
                    'position': 'absolute',
                    'top': '5px',
                    'left': '50px'
                })
                .append(_createInput('fill-type')
                    .css({
                        'width': '80px'
                    })))
            .append($('<label></label>')
                .css({
                    'position': 'absolute',
                    'top': '5px',
                    'left': '134px'
                })
                .append(_createInput('_fop')
                    .css({
                        'width': '30px'
                    })))
            // -- Stroke
            .append($('<label></label>')
                .css({
                    'position': 'absolute',
                    'top': '30px',
                    'left': '5px'
                })
                .append($('<span></span>')
                    .addClass('gicon-stroke')
                    .css({
                        'width': '16px',
                        'text-align': 'center'
                    }))
                .append(_createInput('_bpt')
                    .css({
                        'margin-left': '5px',
                        'width': '20px'
                    })))
            .append($('<label></label>')
                .css({
                    'position': 'absolute',
                    'top': '30px',
                    'left': '50px'
                })
                .append(_createInput('_bw')
                    .css({
                        'width': '30px'
                    })))
            .append($('<div></div>')
                .css({
                    'position': 'absolute',
                    'top': '30px',
                    'left': '86px'
                })
                .append(_createInput('_ba-' + IFStylable.BorderAlignment.Inside)
                    // TODO : I18N
                    .attr('title', 'Border Inside'))
                .append(_createInput('_ba-' + IFStylable.BorderAlignment.Center)
                    // TODO : I18N
                    .attr('title', 'Border Centered'))
                .append(_createInput('_ba-' + IFStylable.BorderAlignment.Outside)
                    // TODO : I18N
                    .attr('title', 'Border Outside')))
            .append($('<hr>')
                .css({
                    'position': 'absolute',
                    'left': '0px',
                    'right': '0px',
                    'top': '50px'
                }))
            .append($('<label></label>')
                .css({
                    'position': 'absolute',
                    'top': '65px',
                    'left': '5px'
                })
                // TODO : I18N
                .text('Ending:'))
            .append($('<div></div>')
                .css({
                    'position': 'absolute',
                    'top': '65px',
                    'left': '50px'
                })
                .append(_createInput('_blc-' + IFPaintCanvas.LineCap.Butt)
                    // TODO : I18N
                    .attr('title', 'Butt'))
                .append(_createInput('_blc-' + IFPaintCanvas.LineCap.Round)
                    // TODO : I18N
                    .attr('title', 'Round'))
                .append(_createInput('_blc-' + IFPaintCanvas.LineCap.Square)
                    // TODO : I18N
                    .attr('title', 'Square')))
            .append($('<label></label>')
                .css({
                    'position': 'absolute',
                    'top': '89px',
                    'left': '5px'
                })
                // TODO : I18N
                .text('Join:'))
            .append($('<div></div>')
                .css({
                    'position': 'absolute',
                    'top': '89px',
                    'left': '50px'
                })
                .append(_createInput('_blj-' + IFPaintCanvas.LineJoin.Bevel)
                    // TODO : I18N
                    .attr('title', 'Bevel'))
                .append(_createInput('_blj-' + IFPaintCanvas.LineJoin.Round)
                    // TODO : I18N
                    .attr('title', 'Round'))
                .append(_createInput('_blj-' + IFPaintCanvas.LineJoin.Miter)
                    // TODO : I18N
                    .attr('title', 'Miter'))
                .append(_createInput('_bml')
                    // TODO : I18N
                    .attr('title', 'Miter-Limit')
                    .css('width', '30px')));
    };

    /** @override */
    GFillBorderProperties.prototype.update = function (document, elements) {
        if (this._document) {
            this._document.getScene().removeEventListener(IFNode.AfterPropertiesChangeEvent, this._afterPropertiesChange);
            this._document = null;
        }

        this._elements = [];
        for (var i = 0; i < elements.length; ++i) {
            if (elements[i].hasMixin(IFStylable) && elements[i].getStylePropertySets().indexOf(IFStylable.PropertySet.Fill) >= 0) {
                this._elements.push(elements[i]);
            }
        }

        if (this._elements.length === elements.length) {
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
    GFillBorderProperties.prototype._afterPropertiesChange = function (event) {
        if (event.node === this._elements[0]) {
            this._updateProperties();
        }
    };

    /**
     * @private
     */
    GFillBorderProperties.prototype._updateProperties = function () {
        var scene = this._document.getScene();
        var stylable = this._elements[0];

        var fillPattern = stylable.getProperty('_fpt');

        this._panel.find('[data-property="_fpt"]')
            .gColorButton('value', fillPattern)
            .gColorButton('scene', scene);

        this._panel.find('[data-property="fill-type"]').gPatternTypes('value', !fillPattern ? null : fillPattern.constructor);

        this._panel.find('[data-property="_fop"]').val(ifUtil.formatNumber(stylable.getProperty('_fop') * 100, 0));

        this._panel.find('[data-property="_bpt"]')
            .gColorButton('value', stylable.getProperty('_bpt'))
            .gColorButton('scene', scene);

        this._panel.find('[data-property="_bw"]').val(ifUtil.formatNumber(stylable.getProperty('_bw')));

        this._panel.find('[data-property^="_ba"]').each(function (index, element) {
            var $element = $(element);
            var value = $element.attr('data-property').substr('_ba-'.length);
            $element.toggleClass('g-active', stylable.getProperty('_ba') === value);
        });

        this._panel.find('[data-property^="_blc"]').each(function (index, element) {
            var $element = $(element);
            var value = $element.attr('data-property').substr('_blc-'.length);
            $element.toggleClass('g-active', stylable.getProperty('_blc') === value);
        });

        this._panel.find('[data-property^="_blj"]').each(function (index, element) {
            var $element = $(element);
            var value = $element.attr('data-property').substr('_blj-'.length);
            $element.toggleClass('g-active', stylable.getProperty('_blj') === value);
        });

        this._panel.find('[data-property="_bml"]')
            .css('display', stylable.getProperty('_blj') === IFPaintCanvas.LineJoin.Miter ? '' : ' none')
            .val(ifUtil.formatNumber(stylable.getProperty('_bml')));
    };

    /**
     * @param {String} property
     * @param {*} value
     * @private
     */
    GFillBorderProperties.prototype._assignProperty = function (property, value) {
        this._assignProperties([property], [value]);
    };

    /**
     * @param {Array<String>} properties
     * @param {Array<*>} values
     * @private
     */
    GFillBorderProperties.prototype._assignProperties = function (properties, values) {
        var editor = this._document.getEditor();
        editor.beginTransaction();
        try {
            for (var i = 0; i < this._elements.length; ++i) {
                this._elements[i].setProperties(properties, values);
            }
        } finally {
            // TODO : I18N
            editor.commitTransaction('Modify Fill/Border Properties');
        }
    };

    /** @override */
    GFillBorderProperties.prototype.toString = function () {
        return "[Object GFillBorderProperties]";
    };

    _.GFillBorderProperties = GFillBorderProperties;
})(this);