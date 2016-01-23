
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