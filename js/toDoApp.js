;
(function(exports) {
    "use strict";

    Parse.TodoRouter = Parse.Router.extend({

        initialize: function() {
            console.log("initialized");
            this.collection = new Parse.TodoActualList();
            this.view = new Parse.TodoView({
                collection: this.collection
            });
            this.collection.fetch();
            Parse.history.start();
        },
        routes: {
            "login": "login",
            "*default": "home"
        },
        home: function() {
            this.view.render();
        }
    })

    Parse.TodoView = Parse.TemplateView.extend({
        el: ".container",
        view: "todoList",
        events: {
            "submit .addItemForm": "addItem",
            "click .taskdone": "showAsDone",
            "click .data": "showAsUrgent"
        },
        addItem: function(event) {
            event.preventDefault();
            var x = {
                title: this.el.querySelector("input[name = 'John']").value
            };
            this.collection.create(x);
            console.log("Yay!");
            // debugger;
        },
        selectModelForEvent: function(event) {
            var li = event.target.parentElement,
                id = li.getAttribute('id'),
                model = this.collection.get(id);
            return model;
        },
        showAsDone: function(event) {
            // select item
            // event.preventDefault();
            var model = this.selectModelForEvent(event);
            if (model) {
                model.set('taskdone', !model.get('taskdone'));
                if (model.get('taskdone')) {
                    model.set('urgent', false);
                }
                // this.collection.sort();
                this.render();
            }
        },
        showAsUrgent: function(event) {
            var model = this.selectModelForEvent(event);
            if (model) {
                model.set('urgent', !model.get('urgent'));
                // if(model.get('urgent')) {model.set('taskdone', false);}
                // this.collection.sort();
                this.render();
            }
        }
    })

    Parse.TodoModel = Parse.Object.extend({
        className: "TodoModel",
        defaults: {
            checked: false,
            title: "No title given.",
            taskdone: false,
            urgent: false
        },
        validate: function(data) {
            // debugger;
            var x = data.title.length > 0;

            // debugger;
            if (!x) {
                return "Title Required.";
            }
        },
        initialize: function() {
            this.on("change", function() {
                this.save();
            });
        }
    })

    Parse.TodoActualList = Parse.Collection.extend({
        model: Parse.TodoModel
            // ,comparator function for sorting
    })

})(typeof module === "object" ? module.exports : window)
