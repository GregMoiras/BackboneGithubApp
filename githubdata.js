var template = _.template($('#github-details').html()); //returns a callable function

var DataList = Backbone.View.extend({
  el: '.wrapper',
  render: function ()
  {
    console.log(arguments)
    var that = this;
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      url: "https://api.github.com/users/7geese/repos",
      //because upon success, an anonymous function is called we create prior to the ajax call -> var that = this
      success: function(res)
      {
        for (var i=0; i < res.data.length; i++) {
          var replacing = res.data[i].name.replace(/\-/g, " ");
          var repoName = replacing.split(" ");
          var foobar = [];
          for (var j = 0; j < repoName.length; j++) {
            if ((repoName[j] == "on") || (repoName[j] == "as")) {
              foobar.push(repoName[j]);
            }
            else { 
              foobar.push(
                repoName[j].replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
              );
            }
          }
        res.data[i].name = foobar.join().replace(/,/g, " "); 
        }
  
        var sorted = _(res.data).sortBy("forks_count");
        that.$el.html(template({ data: sorted }));  
      }
    });
  }
});

var Router = Backbone.Router.extend({
  routes: {
    '': 'home' //how to run html file on localhost
  }
});

var dataList = new DataList();

var router = new Router();

router.on('route:home', function(){
  dataList.render();
});

Backbone.history.start();