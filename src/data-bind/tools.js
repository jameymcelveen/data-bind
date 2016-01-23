
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