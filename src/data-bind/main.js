
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