function Player(id, name){
  this.id = id;
  this.name = name;
  this.isLoyal = true;
}

exports.create = function(id, name) {
  return new Player(id, name);
}
