'use strict';



module.exports = function (app) {
  app.route('/api/threads/:board')
    .get()
    .post()
    .put()
    .delete();
    
  app.route('/api/replies/:board')
    .get()
    .post()
    .put()
    .delete();
};
