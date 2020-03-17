
  // ////////////////////////////////////////////// A C C U E I L
module.exports.Index = function(request, response){
    var sess = request.session;
    console.log(sess.connecter);
    if (sess.connecter != null){
        response.title = "Bienvenue sur le site de WROOM (IUT du Limousin).";
        response.render('home', response);
    }else {
        response.redirect('/');
    }

};
module.exports.NotFound = function(request, response){
    response.title = "Bienvenue sur le site de SIXVOIX (IUT du Limousin).";
    response.render('notFound', response);
};
