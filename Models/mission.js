function Mission(leader){
  this.leader = leader;
  this.firstTeam = true;
  this.agents = [];
  this.votes = {};

  this.setNewLeader = function(newLeader){
    this.leader = newLeader;
    this.firstTeam = false;
    this.lastAgents = this.agents;
    this.lastVotes = this.votes;
    this.agents = [];
    this.votes = {};
  }

  this.countApprovals = function(){
    var count = 0;
    for (var vote in this.votes){
      if (this.votes[vote] == 'yes'){
        count++;
      }
    }
    return count;
  }

  this.getPlayerVote = function(player){
    return this.votes[player.id];
    //THROW EXCEPTION
  }

  this.playerHasVoted = function(player){
    return this.votes.hasOwnProperty(player.id);
  }

  this.playerIsOnMission = function(player){
    for(var i=0; i<this.agents.length; i++){
      if (this.agents[i].id == player.id){
        return true;
      }
    }
    return false;
  };

}

exports.create = function(leader) {
  return new Mission(leader);
}
