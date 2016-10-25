function Vote(player, vote){
  this.player = player;
  this.vote = (vote == 'yes');
}

exports.create = function(player, vote) {
  return new Vote(player, vote);
}
