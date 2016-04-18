Posts = new Mongo.Collection('posts');

Posts.allow({
  // update: function(userId, post) { return ownsDocument(userId, post); },
  // remove: function(userId, post) { return ownsDocument(userId, post); }
});

Posts.deny({
  // update: function(userId, post, fieldNames) {
    //can only edit the following two fields
    // return (_.without(fieldNames, 'url','title').length > 0);
  // }
});

Meteor.methods({
  postInsert: function(postAttributes) {
    check(this.userId, String);
    check(postAttributes, {
      title: String,
      url: String
    });

    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var postId = Posts.insert(post);

    return {
      _id: postId
    };
  },
  postDelete: function(currentPostId) {
    check(currentPostId, String);
    var remove = Posts.remove(currentPostId);
    return {
      removed: remove
    };
  },
  postEdit: function(postProperties) {
    check(postProperties, {
      _id: String,
      title: String,
      url: String
    });
    Posts.update(postProperties._id, {$set: postProperties});
    return {
      _id: postProperties._id
    };
  }
});
