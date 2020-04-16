
/*
* config.Db contient les parametres de connection à la base de données
* il va créer aussi un pool de connexions utilisables
* sa méthode getConnection permet de se connecter à MySQL
*
*/

let db = require('../configDb');
let model = require('../models/sponsor.js');
var formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra'),
    path = require('path');

/*
* Récupérer l'intégralité les écuries avec l'adresse de la photo du pays de l'écurie
* @return Un tableau qui contient le N°, le nom de l'écurie et le nom de la photo du drapeau du pays
*/


module.exports.getListesSponsor = function (callback) {
    // connection à la base

    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT sponum, sponom, sposectactivite FROM sponsor ORDER BY sponom" ;
            console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};

module.exports.getListesNationalite = function (callback) {
    // connection à la base

    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT paynum, paynat FROM pays ORDER BY paynat" ;
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};


module.exports.getListesEcurie = function (callback) {
    // connection à la base

    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT ecunum, ecunom FROM ecurie ORDER BY ecunom" ;
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};

module.exports.ajouterSponsor = function (data, callback) {
    // connection à la base

    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            var form = new formidable.IncomingForm();
            form.parse(data, function (err, fields, files) {
                // Ajout du circuit dans BD
                var values  = '('+ "'" + fields.nom + "'" + ',' + " '" + fields.activite + "' " + ")";
                let sql ="INSERT INTO sponsor (sponom,sposectactivite) VALUES " + values;

                let id = 0;
                connexion.query(sql, function(err, result) {
                    if (err) throw err;

                    id = result.insertId;
                    if (fields.ecurie != "NULL"){
                        model.ajouterFinance(id, fields.ecurie,  function (err, result) {
                            if (err) {
                                // gestion de l'erreur
                                console.log(err);
                                return;
                            }
                        });
                    }
                });
                connexion.release();
            });
        }
    });
};
module.exports.ajouterFinance = function (sponum, ecunum, callback) {
    // connection à la base

    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            // Ajout du circuit dans BD
            var values  = '('+ sponum + "," + ecunum + ")";
            let sql ="INSERT INTO finance (sponum,ecunum) VALUES " + values;

            connexion.query(sql, callback);
            connexion.release();
        }
    });
};
module.exports.modifierSponsor = function (data, sponum, callback) {
    db.getConnection(function (err, connection) {
        if (!err) {
            var form = new formidable.IncomingForm();
            form.parse(data, function (err, fields, files) {
                // Modification du circuit dans BD
                let sql = "update sponsor set sponom = '" + fields.nom + "', sposectactivite = '" + fields.activite +
                    "'";


                sql += " where sponum = " + sponum;

                console.log(sql);
                connection.query(sql, callback);
                if(fields.ecurie != "NULL"){
                    model.ajouterFinance(sponum, fields.ecurie,  function (err, result) {
                        if (err) {
                            // gestion de l'erreur
                            console.log(err);
                            return;
                        }
                    });
                }
                connection.release();
            });
        }
    })
};


module.exports.getDetailSponsor = function (data, callback) {
    // connection à la base

    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT sponom, sposectactivite, e.ecunum as ecunum, ecunom FROM sponsor s left join finance f on s.sponum = f.sponum left join ecurie e on e.ecunum = f.ecunum  WHERE s.sponum = " + data ;
            connexion.query(sql, callback);
            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};



module.exports.supprimerSponsor = function (data, callback) {
    db.getConnection( function (err, connexion) {
        if (!err) {
            let sql = "select * from finance where sponum = " + data;
            // console.log(sql);
            connexion.query(sql, function(err, results){
                if (err){
                    throw err;
                }
                if (results[0] == undefined) {
                    connexion.query("delete from sponsor where sponum = " + data, callback);
                }
            });
            connexion.release();
        }
    })
};



module.exports.getSponsors = function (data, callback) {
    // connection à la base

    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT sponom, sp.sposectactivite FROM pilote p JOIN sponsorise s on s.PILNUM = p.PILNUM JOIN sponsor sp ON sp.SPONUM = s.SPONUM WHERE p.PILNUM = " + data ;
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};

module.exports.getPhotos = function (data, callback) {
    // connection à la base

    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT phoadresse, phosujet, phocommentaire FROM pilote p JOIN photo ph on p.PILNUM = ph.PILNUM WHERE p.PILNUM =" + data + " AND ph.PHONUM != 1" ;
            console.log (sql);
            console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};