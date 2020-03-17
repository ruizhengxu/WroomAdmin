let model = require('../models/ecurie.js');
let async = require('async');

   // //////////////////////// L I S T E R  E C U R I E S

module.exports.ListerEcurie = function(request, response){
   response.title = 'Liste des écuries';
    model.getListeEcurie( function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeEcurie = result;
        //console.log(result);
response.render('partials/listerEcurie', response);
});
}

// //////////////////////// D E T A I L   E C U R I E S

module.exports.DetailEcurie = function(request, response){
    let data = request.params.nom;
    response.title = "Detail sur l'ecurie " + data;
    async.parallel([
            function (callback) {
                model.getListeEcurie(function (err, result) { callback(null, result)});
            },
            function (callback) {
                model.getDetailEcurie(data, (function (errPil, resultPil) {callback(null, resultPil) }));
            },
            function (callback) {
                model.getPilotesEcurie(data, (function (errPil, resultPil) {callback(null, resultPil) }));
            },
            function (callback) {
                model.getVoituresEcurie(data, (function (errPil, resultPil) {callback(null, resultPil) }));
            },
        ],
        function (err, resultat) {
            if (err) {
                console.log(err);
                return;
            }
            response.listeEcurie = resultat[0];
            response.detailEcurie =  resultat[1];
            response.pilotes = resultat[2];
            response.voitures = resultat[3];
            console.log(resultat[1])
            response.render('detailEcurie', response);
        }
    )
}