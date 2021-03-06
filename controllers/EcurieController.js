let async = require('async');
let model = require('../models/ecurie.js');
// ////////////////////// L I S T E R     E C U R I E S
module.exports.ListerEcuries = function(request, response){

    var sess = request.session;

    if (sess.connecter != null) {
        response.title = 'Liste des ecuries';
        model.getListeEcurie( function (err, result) {
            if (err) {
                // gestion de l'erreur
                console.log(err);
                return;
            }
            response.listeEcuries = result;
            console.log(result);
            response.render('ecurie/listerEcurie', response);
        });
    } else {
        response.redirect('/');
    }
};


module.exports.AjouterEcurie = function(request, response) {

    var sess = request.session;
    if (sess.connecter != null) {
        response.title = "Ajouter un écurie";
        async.parallel([
                function (callback) {
                    model.getListePays(function (err, result) { callback(null, result)});
                },
            ],
            function (err, resultat) {
                if (err) {
                    console.log(err);
                    return;
                }
                response.listePays = resultat[0];
                response.render('ecurie/ajouterEcurie', response);
            }
        )
    } else {
        response.redirect('/');
    }
}

module.exports.EssaiAjouterEcurie = function(request, response) {
    var sess = request.session;
    console.log(sess.connecter);
    if (sess.connecter != null) {
        model.ajouterEcurie(request, function (err, result) {
            if (err) {
                // gestion de l'erreur
                console.log(err);
                return;
            }

            response.redirect('/ecuries')
        });
    } else {
        response.redirect('/');
    }
}

module.exports.ModifierEcurie = function(request, response) {
    var sess = request.session;
    if (sess.connecter != null) {
        let ecunum = request.params.num;
        response.title = "Modifier un écurie";
        async.parallel([
                function (callback) {
                    model.getListePays(function (err, result) { callback(null, result)});
                },
                function (callback) {
                    model.getDetailEcurie(ecunum, function (err, result) { callback(null, result)});
                },
            ],
            function (err, resultat) {
                if (err) {
                    console.log(err);
                    return;
                }
                response.listePays = resultat[0];
                response.ecurie = resultat[1][0];
                response.num = ecunum;
                console.log(resultat[1][0]);
                response.render('ecurie/modifierEcurie', response);
            }
        )
    } else {
        response.redirect('/');
    }
}

module.exports.EssaiModifierEcurie = function(request, response) {
    var sess = request.session;
    console.log(sess.connecter);
    if (sess.connecter != null) {
        let ecunum = request.params.num;
        model.modifierEcurie(request,ecunum, function (err, result) {
            if (err) {
                // gestion de l'erreur
                console.log(err);
                return;
            }
        });
        response.redirect('/ecuries');
    } else {
        response.redirect('/');
    }
}

module.exports.SupprimerEcurie = function (request, response) {
    var sess = request.session;
    console.log(sess.connecter);
    if (sess.connecter != null) {
        let data = request.params.num;
        model.supprimerEcurie(data, function (err, result) {
            if (err) {
                // gestion de l'erreur
                console.log(err);
                return;
            }
        });
        response.redirect('/ecuries');
    } else {
        response.redirect('/');
    }
}