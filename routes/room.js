var express = require('express');
var router = express.Router();

var room = {
  '1': {
    name: 'ola'
  }
}

router.post('/:roomId', function(req, res, next) {
  room[req.params.roomId] = {
    username: req.body.username
  }
  res.redirect('/room/' + req.params.roomId)
})

router.get('/:roomId', function(req, res, next) {
  if (!(req.params.roomId in room)) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err)
  }

  res.render('room', { room: room[req.params.roomId]});
});

module.exports = router;
