(function (kendo, $) {

    var ui = kendo.ui,
    Widget = ui.Widget,
    CHANGE = "change";

    var SizeEditor = Widget.extend({

        init: function (element, options) {

            var that = this, widthEditor, heightEditor;

            Widget.fn.init.call(that, element, options);

            var wrapper = that.element
                .wrap('<div class="k-widget k-size-editor"/>')
                .parent()
                .attr("style", that.element.attr("style"))
                .append('<span class="k-textbox-container"><input type="text"/></span><span> x </span><span class="k-textbox-container"><input type="text"/></span>');

            that.element.css("display", "none");

            widthEditor = wrapper.find(".k-textbox-container").filter(":first").find("input");
            heightEditor = wrapper.find(".k-textbox-container").filter(":last").find("input");

            that.widthEditor = widthEditor.kendoNumericTextBox({
                decimals: 0,
                min: that.options.min,
                max: that.options.max,
                format: "0px",
                spinners: that.options.spinners,
                step: 1,
                change: function () {
                    var width = this.value(),
                        height = that.heightEditor.value();

                    that._change(width, height);
                }
            }).data("kendoNumericTextBox");

            that.heightEditor = heightEditor.kendoNumericTextBox({
                decimals: 0,
                min: that.options.min,
                max: that.options.max,
                format: "0px",
                spinners: that.options.spinners,
                step: 1,
                change: function () {
                    var height = this.value(),
                        width = that.widthEditor.value();

                    that._change(width, height);
                }
            }).data("kendoNumericTextBox");
        },
        options: {
            name: "SizeEditor",
            seperator: ":",
            min: 1,
            max: 2147483648,
            spinners: false,
            value: null
        },
        events: [
          CHANGE
        ],
        value: function (value) {
            var that = this;

            if (value === undefined) {
                return that._value;
            }

            that._parse(value);
        },
        _change: function (width, height) {
            var that = this;
            that.widthEditor.value(width);
            that.heightEditor.value(height);
            var value = width + that.options.seperator + height;
            if (that._value != value) {
                that._value = value;
                that.element.val(value);
                that.trigger(CHANGE);
            }
        },
        _parse: function (value) {
            var that = this, width = null, height = null;
            if (value) {
                var parts = value.split(that.options.seperator);
                if (parts.length > 0) {
                    width = parseInt(parts[0]);
                    if (width == NaN) {
                        width = null;
                    }
                }
                if (parts.length > 1) {
                    height = parseInt(parts[1]);
                    if (height == NaN) {
                        height = null;
                    }
                }
            }
            that._change(width, height);
        }
    });
    ui.plugin(SizeEditor);

})(window.kendo, window.kendo.jQuery);