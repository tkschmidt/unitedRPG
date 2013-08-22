
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'DSA' });
};
exports.game = function (req,res){
	res.render('game',{title:  req.params.id })
};