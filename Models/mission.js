function Mission(leader){
  this.leader = leader;
  this.firstTeam = true;
  this.votes = [];
  this.setNewLeader = function(newLeader){
    this.leader = newLeader;
    this.firstTeam = false;
    this.lastAgents = this.agents;
    this.lastVotes = this.votes;
    this.agents = [];
    this.votes = [];
  }
  this.countVotes = function(){
    var count = 0;
    for (var i = 0; i<this.votes.length; i++){
      if (this.votes[i].vote){
        count++;
      }
    }
    return count;
  }
  this.getPlayerVote = function(player){
    for (var i = 0; i<this.votes.length; i++){
      if (this.votes[i].player.id == player.id){
        return this.votes[i].vote;
      }
    }
    //THROW EXCEPTION
  }
  this.playerHasVoted = function(player){
    for (var i = 0; i<this.votes.length; i++){
      if (this.votes[i].player.id == player.id){
        return true;
      }
    }
    return false;
  }
}

exports.create = function(leader) {
  return new Mission(leader);
}
