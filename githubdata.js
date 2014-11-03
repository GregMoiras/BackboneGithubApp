var Assignment = {};

Assignment.url = 'https://api.github.com/users/7geese/repos';

// Returns a callable function
Assignment.template = _.template($('#github-details').html());

Assignment.RepoModel = Backbone.Model.extend();

Assignment.RepoCollection = Backbone.Collection.extend({
    model: Assignment.RepoModel,
    url: Assignment.url,

    initialize: function() {
        this.fetch();
    },

    fetch: function(options) {
        options = options ? _.clone(options) : { };

        var success = options.success;
        options.success = function (collection, response, options) {
            collection.trigger('fetched_and_notified', collection);
            if (success)
                success(collection, response, options);
        };
        Backbone.Collection.prototype.fetch.call(this, options);
    },

    replaceCharacters: function(word) {
        return word.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },

    parse: function (res) {
        // loop through each repository's string/name
        for (var i = 0; i < res.length; i++) {
            //replace dashes with spaces
            var replacing = res[i].name.replace(/\-/g, ' ');

            //split string(name) into words and place them into an array
            var repoName = replacing.split(' ');

            var processedWords = [];
            //loop through the split words of each repo. capitalize first letter of words except if words are 'on' or 'as'
            for (var j = 0; j < repoName.length; j++) {
                if ((repoName[j] == 'on') || (repoName[j] == 'as')) {
                    processedWords.push(repoName[j]);
                }
                else {
                    processedWords.push(this.replaceCharacters(repoName[j]));
                }
            }
            //replace the repo's name with the processed name
            res[i].name = processedWords.join().replace(/,/g, ' ');
        }

        // Sort processed response by forks_count descending.
        return _.sortBy(res, 'forks_count').reverse();
    }
});

// Define the view
Assignment.RepoListView = Backbone.View.extend({
    el: '.wrapper',

    initialize: function() {
        if (repoCollection.models.length > 0) {
            this.initView();
        }
        //when view is initialized it listens for changes in repoCollection and calls initView
        this.listenTo(repoCollection, 'fetched_and_notified', this.initView);
    },
    //listens to repoCollection for changes 
    initView: function() {
        this.listenTo(repoCollection, 'add remove', this.render);
        this.render();
    },

    //renders the view by calling jsonp api.s
    render: function () {
        this.$el.html(Assignment.template({ data: repoCollection }));
    }
});

Assignment.Router = Backbone.Router.extend({
    routes: {
        '': 'home'
    }
});


/**
 * Defining global variables
 */

// Instantiate the collection
var repoCollection = new Assignment.RepoCollection();

// Defining an empty repoListView
var repoListView;

var router = new Assignment.Router();

// Setting the default route of the application
router.on('route:home', function () {
    if (typeof(repoListView) === "undefined") {
        repoListView = new Assignment.RepoListView();
    }
});

Backbone.history.start();