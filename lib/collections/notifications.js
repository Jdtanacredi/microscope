Notifications = new Mongo.Collection('notifications');

Notifications.allow({
  update: function(userId,notification, fieldNames) {
    return ownsDocument(userId,notification) && fieldNames.length == 1 && fieldNames[0] === 'read';
  }
});

createCommentNotification = function(comment) {
  var post = Posts.findOne(comment.postId);

  if (comment.postId !== post.userId) {
    // insert notification
    Notifications.insert({
      userId: post.userId,
      postId: post._id,
      commentId: comment._id,
      commenterName: comment.author,
      read: false
    });
  }
};
