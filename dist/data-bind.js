////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// data-bind
/// Created by jameymcelveen on 1/22/16.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (!DataBind) { var DataBind = {}; }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Tools
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function ( $, _ ) {
    $.fn.defaultBindingType = function() {
        var tagName = this.prop("tagName");
        if (tagName.toLowerCase() === "input") {
            if (this.attr("type").toLowerCase() === "button") {
                return "onclick";
            }
            return "value";
        }
        else if (tagName.toLowerCase() === "img") {
            return "src";
        }
        return "html";
    };
}( jQuery, DataBind ));

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// ObserveElement
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function ( $, _ ) {

}( jQuery, DataBind ));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// ObserveObject
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function ( $, _ ) {
    _.makeObjectObservable = function(obj) {

        var keys;

        var onPropertyChanged = function(propertyName, newValue, oldValue) {
            if(this['onPropertyChanged']) {
                this.onPropertyChanged.call(this,propertyName, newValue, oldValue);
            }
        };

        obj.private = function() {
            if (!this._private) { this._private = {}; }
            return this._private;
        };

        obj.private().onPropertyChanged = function(propertyName, newValue, oldValue) {
            onPropertyChanged.call(obj, propertyName, newValue, oldValue);
        };

        keys = Object.keys(obj);
        keys.forEach(function(key) {
            if((typeof obj[key]) === "function") return;
            if(key.startsWith("_")) return;
            console.log(key);
            obj.private()[key] = obj[key];
            Object.defineProperty(obj, key, {
                get: function () { return this.private()[key]; },
                set: function (value) {
                    onPropertyChanged(key, value, this.private()[key])
                    this.private()[key] = value;
                }
            });
        });
    };
}( jQuery, DataBind ));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Main
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function ( $, _ ) {

    _.nextBindingId = 0;

    _.bindings = {};

    _.updateView = function(ctrl) {
        console.log('updateView');
        var keys = Object.keys(ctrl.bindings);
        keys.forEach(function(key){
            var binding = ctrl.bindings[key];
            binding.updateElement();
        });
    };

    _.updateModel = function(ctrl) {
        console.log('updateModel');
        var keys = Object.keys(ctrl.bindings);
        keys.forEach(function(key){
            var binding = ctrl.bindings[key];
            binding.updateProperty();
        });
    };

    _.dataBind = function(model, view) {
        var ctrl = {};
        ctrl.model = model;
        ctrl.view = view;
        ctrl.bindings = {};
        _.createBindings(ctrl);
        _.makeObjectObservable(model);

        model.controller = function() { return ctrl; };
        model.updateView = function() { _.updateView(this.controller()); };
        model.updateModel = function() { _.updateModel(this.controller()); };
        model.releaseBindings = function() { _.releaseBindings(this.controller()); };
    };

    $.fn.dataBind = function(model) {
        _.dataBind(model, this);
        return this;
    };

}( jQuery, DataBind ));