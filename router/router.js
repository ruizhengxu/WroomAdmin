
let HomeController = require('./../controllers/HomeController');
let ResultatController = require('./../controllers/ResultatController');
let EcurieController = require('./../controllers/EcurieController');
let PiloteController = require('./../controllers/PiloteController');
let CircuitController = require('./../controllers/CircuitController');

// Routes
module.exports = function(app, passport){

    /*app.post('/auth', passport.authenticate(
        'local', {
            successRedirect: '/accueil',
            failureRedirect: '/',
            session: true

        }));*/
app.post('/auth', function (req, res) {
    var sess = req.session;
    sess.email = 'gmail';
    let db = require('../configDb');
    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL

            connexion.query('SELECT passwd FROM login WHERE login = ? ', [req.body.username], function (err, results, fields) {
                if(err){res.redirect('/')}

                if(results.length === 0){
                }else {

                    let Cryptr = require('cryptr');
                    let cryptr = new Cryptr('MaSuperCléDeChiffrementDeouF');
                    const motDepasse = results[0].passwd;
                    console.log(motDepasse);
                    console.log(cryptr.decrypt(motDepasse));
                    if(cryptr.decrypt(motDepasse) === req.body.password){
                        console.log('Enter');
                        sess.connecter = true;
                        res.redirect('/accueil');
                    }else {
                        res.redirect('/')
                    }
                }

            });
            connexion.release();
        }
    });
}) ;
// Main Routes

    app.get('/accueil', HomeController.Index);

// pilotes
    app.get('/pilotes', PiloteController.ListerPilote);

    app.get('/pilotes/ajouter', PiloteController.AjouterPilote);

    app.post('/pilotes/ajouter/ajout', PiloteController.EssaiAjoutPilote);

    app.post('/pilotes/ajouter/ajout', PiloteController.EssaiAjoutPilote);

    app.get('/pilotes/modifier/:num', PiloteController.ModifierPilote);

    app.post('/pilotes/modifier/modif/:num', PiloteController.EssaiModifPilote);

    app.get('/pilotes/supprimer/:num', PiloteController.SupprimerPilote);

    app.get('/pilotes/supprimer/suppression/:num', PiloteController.EssaiSuppressionPilote);
 // circuits
   app.get('/circuits', CircuitController.ListerCircuit);

   app.get('/circuits/ajouter', CircuitController.AjouterCircuit);

   app.post('/circuits/ajouter/ajout', CircuitController.EssaiAjouterCircuit);

   app.get('/circuits/modifier/:num', CircuitController.ModifierCircuit);

   app.post('/circuits/modifier/modif/:num', CircuitController.EssaiModifierCircuit);

   app.get('/circuits/supprimer/:num', CircuitController.SupprimerCircuit);

// Ecuries
   app.get('/ecuries', EcurieController.ListerEcurie);

   app.get('/ecuries/detailEcurie/:nom', EcurieController.DetailEcurie);

 //Résultats
   app.get('/resultats', ResultatController.ListerGrandPrxi);

   app.get('/resultats/saisie', ResultatController.SaisieResultats);

   app.get('/resultats/suppression/:gpnum/:pilnum', ResultatController.EssaiSuppressionResultats);

   app.post('/resultats/ajout/:num', ResultatController.EssaiAjoutResultats);

    //app.get('/listerResultat/detailResultat/:nom', ResultatController.DetailResultat);

    app.get('/retour', function (request, response) {
        request.logOut();
        request.session.destroy();
        response.redirect('http://localhost:6800');
    });


// tout le reste
app.get('*', HomeController.NotFound);
app.post('*', HomeController.NotFound);

};

