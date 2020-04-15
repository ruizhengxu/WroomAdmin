let async = require('async');
let model = require('../models/resultat.js');

// ////////////////////// L I S T E R    R E S U L T A T
module.exports.ListerGrandPrxi = function(request, response){
	response.title = 'Liste des resultats';
	model.getListeGrandPrix( function (err, result) {
		if (err) {
			// gestion de l'erreur
			console.log(err);
			return;
		}
		response.listeGrandPrix = result;
		//console.log(result);
		response.render('listerResultat', response);
	});
}

// ////////////////////// D E T A I L    R E S U L T A T

module.exports.SaisieResultats = function(request, response) {
	let data = request.query['res'];
	response.title = 'Saisie des resultats';
	// console.log(data);
	async.parallel([
			function (callback) {
				model.getResultats(data,function (err, result) {callback(null, result)});
			},
			function (callback) {
				model.getPilotes(function (err, result) {callback(null ,result)});
			},
			function (callback) {
				model.getNouveauNumero( data,function(err, result) {callback(null, result)});
			},
		],
		function (err, result) {
			if (err) {
				console.log(err);
				return;
			}
			response.listeResultats = result[0];
			response.listePilotes = result[1];
			response.nouveauNum = result[2][0];
			response.grandprix = data;
			//console.log(result[0]);
			response.render('saisieResultats', response);
		}
	)
}

module.exports.EssaiSuppressionResultats = function (request, response) {
	let gpnum = request.params.gpnum;
	let pilnum = request.params.pilnum;
	model.supprimerResultat(gpnum, pilnum, function (err, result) {
		if (err) {
			// gestion de l'erreur
			console.log(err);
			return;
		}
	});
	response.redirect('/resultats/saisie?res=' + gpnum);
}

module.exports.EssaiAjoutResultats = function (request, response) {
	let gpnum = request.params.num;
	model.ajoutResultat(gpnum, request.body, function (err, result) {
		if (err) {
			// gestion de l'erreur
			console.log(err);
			return;
		}
	});
	response.redirect('/resultats/saisie?res=' + gpnum);
}
