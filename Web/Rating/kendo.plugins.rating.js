(function (kendo, $) {

    var ui = kendo.ui,
        Widget = ui.Widget,
        CLICK = "click",
        CHANGE = "change",
        SELECT = "select",
        ACTIVATE = "activate",
        MOUSELEAVE = "mouseleave",
        MOUSEOVER = "mouseover",
        DISABLED = "k-state-disabled",
        RATING_NS = ".kendoRating";

    var Rating = Widget.extend({

        init: function (element, options) {

            var that = this;
            Widget.fn.init.call(that, element, options);

            var wrapper = that.element
                .wrap("<div class='k-rating'/>")
                .parent()
                .attr("style", that.element.attr("style"));

            that.element.css("display", "none");

            for (var i = 1; i <= that.options.maxRating; i++) {
                $('<span class="k-rating-empty" />')
                    .attr("data-value", i)
                    .addClass(that.options.itemClass)
                    .addClass(that.options.emptyClass)
                    .appendTo(wrapper);
            }
            wrapper.on(MOUSEOVER + RATING_NS, "span", $.proxy(that._mouseover, that))
                .on(MOUSELEAVE + RATING_NS, $.proxy(that._mouseleave, that))
                .on(CLICK + RATING_NS, "span", $.proxy(that._select, that));
            if (that.options.value != null) {
                that.value(that.options.value);
            }
            else {
                var elementValue = parseInt(that.element.val());
                if (!isNaN(elementValue)) {
                    that.value(elementValue);
                }
            }
            that.enabled(that.options.enabled);
        },
        options: {
            name: "Rating",
            minRating: 1,
            maxRating: 5,
            itemClass: "k-rating-item",
            selectedClass: "k-rating-star",
            emptyClass: "k-rating-empty",
            value: null,
            enabled: true
        },
        events: [
            MOUSEOVER,
            MOUSELEAVE,
            SELECT,
            CHANGE
        ],
        value: function (value) {
            var that = this;

            if (value === undefined) {
                var elementValue = parseInt(that.element.val());
                if (isNaN(elementValue)) {
                    return null;
                }
                else {
                    return elementValue;
                }
            }
            else {
                if (value !== null) {
                    if (isNaN(value)) {
                        value = parseInt(value);
                    }
                    if (value < that.options.minRating) {
                        value = that.options.minRating
                    }
                    if (value > that.options.maxRating) {
                        value = that.options.maxRating
                    }
                }
                that.element.val(value);
                that._render(value);
            }
        },
        enabled: function (enabled) {
            var that = this;

            if (enabled === undefined) {
                enabled = true;
            }

            if (enabled) {
                that.element.parent().removeClass("k-rating-disabled");
            }
            else {
                that.element.parent().addClass("k-rating-disabled");
            }

            that._enabled = enabled;
        },
        _mouseover: function (e) {
            var that = this,
                star = $(e.currentTarget),
                value = star.data('value');

            if (that._enabled) {
                that._render(value);
                that.trigger(MOUSEOVER, { value: value, item: star });
            }
        },
        _mouseleave: function () {
            var that = this;

            if (!that._readonly) {
                that._render(that.value());
                that.trigger(MOUSELEAVE);
            }
        },
        _select: function (e) {
            var that = this,
                star = $(e.currentTarget),
                value = star.data('value');

            if (!that._readonly) {
                that.value(value);
                that.trigger(SELECT, { value: value, item: star });
                that.trigger(CHANGE);
            }
        },
        _render: function (value) {
            var that = this;
            var options = that.options;
            var wrapper = that.element.parent();
            var star = wrapper.find('span[data-value="' + value + '"]');

            if (value === null || value === undefined || star.length === 0) {
                wrapper.find("span").removeClass(options.selectedClass).addClass(options.emptyClass);
            }
            else {
                star.prevAll("span").removeClass(options.emptyClass).addClass(options.selectedClass);
                star.removeClass(options.emptyClass).addClass(options.selectedClass);
                star.nextAll("span").addClass(options.emptyClass).removeClass(options.selectedClass);
            }
        },
        destroy: function () {
            var that = this;

            that.element.off(RATING_NS);

            Widget.fn.destroy.call(that);
        }
    });
    ui.plugin(Rating);

})(window.kendo, window.kendo.jQuery);
