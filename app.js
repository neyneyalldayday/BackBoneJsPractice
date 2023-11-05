// Define a Task model
var Task = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

// Create a collection to hold tasks
var TaskList = Backbone.Collection.extend({
    model: Task
});



// Task view to render individual tasks
var TaskView = Backbone.View.extend({
    tagName: 'li',
    template: _.template('<%= title %>'),

    initialize: function () {
        this.listenTo(this.model, 'change:completed', this.updateCompletion);
    },

    updateCompletion: function (){
        if(this.model.get('completed')) {
         this.$el.addClass('completed')
        } else {
         this.$el.removeClass('completed');
        }
     },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.updateCompletion();
        return this;
    }

 
});

// TaskList view to render the entire task list
var TaskListView = Backbone.View.extend({
    el: '#app',

    initialize: function () {
        this.collection = new TaskList();
        this.listenTo(this.collection, 'add', this.renderTask);
        this.render();
    },

    events: {
        'click #add-task': 'addTask',
        'click li': 'toggleCompletion'
    },
 


    toggleCompletion: function (event) {
        console.log("hey")
        var $taskItem = $(event.target);
        console.log($taskItem[0].outerHTML)
        var taskModel = this.collection.get($taskItem.data('cid'));
        console.log('TaskModel',taskModel)

        if(taskModel) {
            taskModel.set('completed', !taskModel.get('completed'))
            console.log('toggleCompletion fired:', taskModel.get('completed'));
        }
    },



    render: function () {
        this.$el.find('#task-list').append('<button id="add-task" class="btn">Add Task</button>');
        return this;
    },

    renderTask: function (task) {
        var taskView = new TaskView({ model: task });
        var renderedTask = taskView.render().el

        renderedTask.setAttribute('data-cid', task.cid);
        
        this.$el.find('#task-list').append(taskView.render().el);
    },

    addTask: function () {
        var taskTitle = this.$el.find('#new-task').val();
        if (taskTitle) {
            this.collection.add(new Task({ title: taskTitle }));
            this.$el.find('#new-task').val('');
        }
    }
});

// Instantiate the TaskListView
var taskListView = new TaskListView();

