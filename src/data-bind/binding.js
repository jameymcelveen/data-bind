
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Binding
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function ( $, _ ) {

    _.createBinding = function(ctrl, element, key, type, bindingId) {
        var binding = {
            model: ctrl.model,
            ctrl: ctrl,
            element: element,
            key: key,
            bindingId: bindingId
        };

        if (type === "value") {
            element.on('input propertychange paste', function() {
                if(model['elementChanged']) {
                    var      cancel = model.elementChanged.call(model, key, element.val());
                    if(!cancel) {
                        model[key] = element.val();
                        var keys = Object.keys(ctrl.bindings);
                        keys.forEach(function(key){
                            var b2 = ctrl.bindings[key];
                            if(b2.bindingId != bindingId) {
                                b2.updateElement();
                            }
                        });
                    }
                }
            });
            Object.defineProperty(binding, "elementValue", {
                get: function () { return this.element.val() },
                set: function (value) { this.element.val(value) }
            });
        } else if (type === "html") {
            Object.defineProperty(binding, "elementValue", {
                get: function () { return this.element.html() },
                set: function (value) { this.element.html(value) }
            });
        } else if (type === "src") {
            Object.defineProperty(binding, "elementValue", {
                get: function () { return this.element.attr("src") },
                set: function (value) { this.element.attr("src", value) }
            });
        } else if (type === "onclick") {
            binding.elementValue = "";
            binding.propertyValue = "";
            element.click(function() {
                model[key].call(model);
            });
        }

        if (type != "onclick") {
            Object.defineProperty(binding, "propertyValue", {
                get: function () {
                    return this.ctrl.model[this.key]
                },
                set: function (value) {
                    this.ctrl.model[this.key] = value
                }
            });
        }

        binding.updateElement = function() {
            this.elementValue = this.propertyValue;
        };

        binding.updateProperty = function() {
            this.propertyValue = this.elementValue;
        };

        return binding;
    };

    _.addBinding = function(ctrl, element) {
        var key, binding, bindingId, type;

        bindingId = _.nextBindingId++;

        element.attr('data-binding-id', bindingId);

        key = element.attr("data-bind");
        type = element.defaultBindingType();
        binding = _.createBinding(ctrl, element, key, type, bindingId);

        ctrl.bindings[bindingId] = binding;
        _.bindings[bindingId] = binding;
    };

    _.createBindings = function(ctrl) {
        $(ctrl.view).find('[data-bind]').each(function(){
            _.addBinding(ctrl, $(this));
        });
    };

    _.releaseBindings = function(ctrl) {
    };

}( jQuery, DataBind ));