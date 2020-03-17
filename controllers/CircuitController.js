let async = require('async');
let model = require('../models/circuit.js');
// ////////////////////// L I S T E R     C I R C U I T S
module.exports.ListerCircuit = function(request, response){
    console.log(app.session.name);
    response.title = 'Liste des circuits';
    model.getListeCircuits( function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listCircuits = result;
        //console.log(result);
        response.render('partials/listerCircuit', response);
    });
};

// ////////////////////// D E T A I L    C I R C U I T

module.exports.DetailPilote = function(request, response){
    let data = request.params.nom;
    response.title = 'Detail sur le circuit ' + data;
    async.parallel([
            function (callback) {
                model.getListeCircuits(function (err, result) { callback(null, result)});

            },
            function (callback) {
                model.getDetailCircuit(data, (function (errPil, resultPil) {callback(null, resultPil) }));
            },
        ],
        function (err, resultat) {
            if (err) {
                console.log(err);
                return;
            }
            response.listCircuits = resultat[0];
            response.detailCircuit =  resultat[1];
            console.log(resultat[1])
            response.render('detailCircuit', response);
        }
    )
};