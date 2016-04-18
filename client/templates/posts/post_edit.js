Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPostId = this._id;

    var postProperties = {
      _id: currentPostId,
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    }

    Meteor.call('postEdit', postProperties, function(error, result) {
      if (error)
        return alert(error.reason)

      Router.go('postPage', {_id: result._id});
    });
  },
  'click .delete': function(e) {
    e.preventDefault();
    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
  //     Posts.remove(currentPostId);
  //     Router.go('postsList');

      Meteor.call('postDelete',currentPostId, function(error, result) {
        if (error)
          return alert(error.reason);

        if (result.removed)
          Router.go('postsList');

      });

    }
  }
});
