let async = require('async');
let model = require('../models/circuit.js');
// ////////////////////// L I S T E R     C I R C U I T S
module.exports.ListerCircuit = function(request, response){

    var sess = request.session;

    if (sess.connecter != null) {
        response.title = 'Liste des circuits';
        model.getListeCircuits( function (err, result) {
            if (err) {
                // gestion de l'erreur
                console.log(err);
                return;
            }
            response.listeCircuits = result;
            response.render('listerCircuit', response);
        });
    } else {
        response.redirect('/');
    }
};


module.exports.AjouterCircuit = function(request, response) {

    var sess = request.session;
    if (sess.connecter != null) {
        response.title = "Ajouter un circuit";
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
                response.render('ajouterCircuit', response);
            }
        )
    } else {
        response.redirect('/');
    }
}

module.exports.EssaiAjouterCircuit = function(request, response) {
    var sess = request.session;
    console.log(sess.connecter);
    if (sess.connecter != null) {
        model.ajouterCircuit(request, function (err, result) {
            if (err) {
                // gestion de l'erreur
                console.log(err);
                return;
            }
        });
    } else {
        response.redirect('/');
    }
}

module.exports.ModifierCircuit = function(request, response) {
    var sess = request.session;
    if (sess.connecter != null) {
        let cirnum = request.params.num;
        response.title = "Modifier un circuit";
        async.parallel([
                function (callback) {
                    model.getListePays(function (err, result) { callback(null, result)});
                },
                function (callback) {
                    model.getDetailCircuit(cirnum, function (err, result) { callback(null, result)});
                },
            ],
            function (err, resultat) {
                if (err) {
                    console.log(err);
                    return;
                }
                response.listePays = resultat[0];
                response.circuit = resultat[1][0];
                response.num = cirnum;
                //console.log(resultat[1][0]);
                response.render('modifierCircuit', response);
            }
        )
    } else {
        response.redirect('/');
    }
}

module.exports.EssaiModifierCircuit = function(request, response) {
    var sess = request.session;
    console.log(sess.connecter);
    if (sess.connecter != null) {
        let cirnum = request.params.num;
        model.modifierCircuit(request, cirnum,function (err, result) {
            if (err) {
                // gestion de l'erreur
                console.log(err);
                return;
            }
        });
    } else {
        response.redirect('/');
    }
}

module.exports.SupprimerCircuit = function (request, response) {
    var sess = request.session;
    console.log(sess.connecter);
    if (sess.connecter != null) {
        let data = request.params.num;
        model.supprimerCircuit(data, function (err, result) {
            if (err) {
                // gestion de l'erreur
                console.log(err);
                return;
            }
        });
        response.redirect('/circuits');
    } else {
        response.redirect('/');
    }
}