var express = require('express');
var router = express.Router();

var rooms = {}

function Room(sessionid, name) {
  var players = {}
  players[sessionid] = {
    name: name,
    leader: true
  }
  return {
    players: players
  }
}

router.post('/', function(req, res, next) {
  do {
    var roomId = Math.floor((Math.random() * 100000) + 1);
  }
  while(rooms[roomId] != undefined)

  rooms[roomId] = Room(req.session.id, req.body.username)

  res.redirect('/room/' + roomId)
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
