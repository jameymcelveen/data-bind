/**
 * Created by jameymcelveen on 1/22/16.
 */
var model = {
    firstName: "Jamey",
    lastName: "McElveen",
    avatarUrl: "https://www.gravatar.com/avatar/539fef7a0aa086c2299fc06ae5e3e5f3/?default=&s=64",
    title: "Programmer",
    readButton: function() {
        console.log('readButton Clicked');
        console.log(JSON.stringify(this));
        this.updateView();
    },
    writeButton: function() {
        model.updateModel();
        console.log(JSON.stringify(model));
    },
    elementChanged: function(key, value) {
        console.log(key + ' ' + value);
    },
    onPropertyChanged: function(propertyName, newValue, oldValue) {
        console.log(propertyName + ' ' + newValue +  ' ' + oldValue);
    }
};

$("#bind-me").dataBind(model);
