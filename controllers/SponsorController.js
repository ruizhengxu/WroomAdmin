let async = require('async');
let model = require('../models/sponsor.js');
// ////////////////////// L I S T E R     E C U R I E S
module.exports.ListerSponsors = function(request, response){

    var sess = request.session;

    if (sess.connecter != null) {
        response.title = 'Liste des ecuries';
        model.getListesSponsor( function (err, result) {
            if (err) {
                // gestion de l'erreur
                console.log(err);
                return;
            }
            response.listeSponsor = result;
            response.render('sponsor/listerSponsor', response);
        });
    } else {
        response.redirect('/');
    }
};


module.exports.AjouterSponsor = function(request, response) {

    var sess = request.session;
    if (sess.connecter != null) {
        response.title = "Ajouter un sponsor";
        async.parallel([
                function (callback) {
                    model.getListesEcurie(function (err, result) { callback(null, result)});
                },
            ],
            function (err, resultat) {
                if (err) {
                    console.log(err);
                    return;
                }
                response.listeEcuries = resultat[0];
                response.render('sponsor/ajouterSponsor', response);
            }
        )
    } else {
        response.redirect('/');
    }
}

module.exports.EssaiAjouterSponsor = function(request, response) {
    var sess = request.session;
    console.log(sess.connecter);
    if (sess.connecter != null) {
        console.log(request.body);
        model.ajouterSponsor(request, function (err, result) {
            if (err) {
                // gestion de l'erreur
                console.log(err);
                return;
            }
            response.redirect('/sponsors');
        });
    } else {
        response.redirect('/');
    }
};

module.exports.ModifierSponsor = function(request, response) {
    var sess = request.session;
    if (sess.connecter != null) {
        let sponum = request.params.num;
        response.title = "Modifier un écurie";
        async.parallel([
                function (callback) {
                    model.getDetailSponsor(sponum, function (err, result) { callback(null, result)});
                },
                function (callback) {
                    model.getListesEcurie(function (err, result) { callback(null, result)});
                },
            ],
            function (err, resultat) {
                if (err) {
                    console.log(err);
                    return;
                }

                response.sponsor = resultat[0][0];
                response.num = sponum;
                response.listeEcuries = resultat[1];
                response.render('sponsor/modifierSponsor', response);
            }
        )
    } else {
        response.redirect('/');
    }
}

module.exports.EssaiModifierSponsor = function(request, response) {
    var sess = request.session;
    console.log(sess.connecter);
    if (sess.connecter != null) {
        let sponum = request.params.num;
        async.parallel([
                function (callback) {
                    model.modifierSponsor(request, sponum , (function (errPil, resultPil) {callback(null, resultPil) }));
                },
            ],
            function (err, resultat) {
                if (err) {
                    console.log(err);
                    return;
                }

                response.redirect('/sponsors');
            }
        )
    } else {
        response.redirect('/');
    }
}

module.exports.SupprimerSponsor = function (request, response) {
    var sess = request.session;
    console.log(sess.connecter);
    if (sess.connecter != null) {
        let data = request.params.num;
        model.supprimerSponsor(data, function (err, result) {
            if (err) {
                // gestion de l'erreur
                console.log(err);
                return;
            }
        });
        response.redirect('/sponsors');
    } else {
        response.redirect('/');
    }
}