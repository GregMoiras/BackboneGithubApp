var template = _.template($('#github-details').html()); //returns a callable function


var GithubDataList = Backbone.View.extend({
  el: '.wrapper',
  //renders the view by calling jsonp api.
  render: function (){ 
    console.log(arguments)
    //variable that is defined, to be able to pass "this" scope to the anonymous function following success.
    var that = this; 
    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: 'https://api.github.com/users/7geese/repos', //define url before 
      
      success: function(res){
        // loop through each repository's string/name
        for (var i=0; i < res.data.length; i++) { 
          //replace dashes with spaces
          var replacing = res.data[i].name.replace(/\-/g, ' '); 
          //split string(name) into words and place them into an array
          var repoName = replacing.split(' '); 
          var foobar = [];
          //loop through the split words of each repo. capitalize first letter of words except if words are 'on' or 'as'
          for (var j = 0; j < repoName.length; j++) {
            if ((repoName[j] == 'on') || (repoName[j] == 'as')) {
              foobar.push(repoName[j]);
            }
            else { 
              foobar.push(
                repoName[j].replace(/\w\S*/g, function(txt){
                  return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                })
              );
            }
          }
        //replace the repo's name with the processed name   
        res.data[i].name = foobar.join().replace(/,/g, ' '); 
        }
  
        var sorted = _(res.data).sortBy('forks_count').reverse();
        that.$el.html(template({ data: sorted }));  
      }
    });
  }
});

var Router = Backbone.Router.extend({
  routes: {
    '': 'home'
  }
});

var dataList = new GithubDataList();

var router = new Router();

router.on('route:home', function(){
  dataList.render();
});

Backbone.history.start();