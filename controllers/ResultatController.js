let async = require('async');
let model = require('../models/resultat.js');
// ////////////////////// L I S T E R    R E S U L T A T
module.exports.ListerResultat = function(request, response){
	response.title = 'Liste des resultats';
	model.getResultat( function (err, result) {
		if (err) {
			// gestion de l'erreur
			console.log(err);
			return;
		}
		response.listReultats = result;
		//console.log(result);
		response.render('partials/listerResultat', response);
	});
}

// ////////////////////// D E T A I L    R E S U L T A T

module.exports.DetailResultat = function(request, response){
	let data = request.params.nom;
	response.title = 'Detail sur le circuit ' + data;
	async.parallel([
			function (callback) {
				model.getResultat(function (err, result) { callback(null, result)});

			},
			function (callback) {
				model.getDetailResultat(data, (function (errPil, resultPil) {callback(null, resultPil) }));
			},
		],
		function (err, resultat) {
			if (err) {
				console.log(err);
				return;
			}
			response.listReultats = resultat[0];
			response.detailResultat =  resultat[1];
			console.log(resultat[1])
			response.render('detailResultat', response);
		}
	)
};

