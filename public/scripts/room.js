setInterval(function(){
  $.ajax({
    url: '/room/'+$('#roomId').text()+'/update',
    data: {phase: $('#phase').text()},
    ifModified: true,
    timeout: 200,
    success: function(res){
      if(res == "update"){
        location.reload();
      }
    },
  });
}, 2500)
