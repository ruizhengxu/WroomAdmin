
let async = require('async');
let model = require('../models/pilote.js');

// ///////////////////////// R E P E R T O I R E    D E S    P I L O T E S

module.exports.Repertoire = function(request, response){
    response.title = 'Répertoire des pilotes';
    model.getRepertoirePilotes( function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.repertoirePilotes = result;
        response.render('partials/repertoirePilotes', response);
    });
};

// ///////////////////////// L I S T E D E S P I L I O T E S

module.exports.ListerPilote = function(request, response){

    var sess = request.session;
    console.log(sess.connecter);
    if (sess.connecter != null){
        response.title = 'Listes des pilotes';
        model.getListesPilotes( function (err, result) {
            if (err) {
                // gestion de l'erreur
                console.log(err);
                return;
            }
            response.listePilotes = result;
            response.render('listerPilote', response);
        });
    }else {
        response.redirect('/');
    }

};

/////////////////////////// A J O U T E R  P I L O T E
module.exports.AjouterPilote = function(request, response){
    var sess = request.session;
    console.log(sess.connecter);
    if (sess.connecter != null){
        response.title = "Ajouter un pilte";
        async.parallel([
                function (callback) {
                    model.getListesNationalite(function (err, result) { callback(null, result)});

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
                response.listeNationalites = resultat[0];
                response.listeEcuries =  resultat[1];
                response.render('ajouterPilote', response);
            }
        )
    }else {
        response.redirect('/');
    }

};



// /////////////////////// E S S A I  A J O U T  P I L O T E
module.exports.EssaiAjoutPilote = function(request, response){
    var sess = request.session;
    console.log(sess.connecter);
    if (sess.connecter != null){

        async.parallel([
                function (callback) {
                    model.ajouterPilote(request.body, (function (errPil, resultPil) {callback(null, resultPil) }));
                },
            ],
            function (err, resultat) {
                if (err) {
                    console.log(err);
                    return;
                }

                response.redirect('/pilotes');
            }
        )
    }else {
        response.redirect('/');
    }

};





module.exports.ModifierPilote = function(request, response){
    var sess = request.session;
    console.log(sess.connecter);
    if (sess.connecter != null){
        let data = request.params.num;
        response.title = "Modifier pilote";
        async.parallel([
                function (callback) {
                    model.getDetailPilote(data, (function (errPil, resultPil) {callback(null, resultPil) }));
                },
                function (callback) {
                    model.getListesNationalite(function (err, result) { callback(null, result)});

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
                console.log(resultat[0]);
                response.detailPilote = resultat[0];
                response.listeNationalites = resultat[1];
                response.listeEcuries =  resultat[2];
                response.render('modifierPilote', response);
            }
        )
    }else {
        response.redirect('/');
    }
};