
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var port = process.env.PORT || 5000;

// Routes

app.get('/', routes.index);
app.get('/game/:id', routes.game);
app.post('/',function(req, res){
  var game_name = req.body.game;
  res.redirect('/game/'+game_name);
});

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {
  
  socket.on('choose_game',function(game_name){
    socket.join(game_name);
    socket.room = game_name;
  });

  socket.on('give_hero_dice', function (json_hero, json_dice){
 skill1=json_hero[json_dice["attribute1_phex"]];
 wurf1 = Math.round( Math.random()*20);
 res1 = skill1-wurf1;
 if (res1>0 ){
  res1 = 0;
 }

skill2=json_hero[json_dice["attribute2_phex"]];
 wurf2 =Math.round( Math.random()*20);
 res2 = skill2-wurf2;
 if (res2>0 ){
  res2 = 0;
 }

 skill3=json_hero[json_dice["attribute3_phex"]];
 wurf3 =Math.round(Math.random()*20);
 res3 = skill3-wurf3;
 if (res3>0 ){
  res3 = 0;
 }

result = res3+res2+res1+json_dice["value_phex"]-json_dice["difficulty_phex"]; 
if(result <0){
  success ="No";
}
else {
  success = "Yes";
}

json_table_dice = {"hero_name": json_hero["hero_name"] ,
        "skill_name" : json_dice["skill_phex"],
        "value_phex" : json_dice["value_phex"],
        "difficulty_phex" : json_dice["difficulty_phex"] ,
        "att1" : json_dice["attribute1_phex"] ,
        "res_att1" : res1,
        "att2" : json_dice["attribute2_phex"],
        "res_att2" : res2,
        "att3" : json_dice["attribute3_phex"],
        "res_att3" : res3,
        "erfolg" : success
         };

io.sockets.in(socket.room).emit('update_dice_table', json_table_dice);
io.sockets.in(socket.room).emit('update_hero_table',json_hero);
});

});

app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
