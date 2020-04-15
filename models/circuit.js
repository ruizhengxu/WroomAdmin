/*
* config.Db contient les parametres de connection à la base de données
* il va créer aussi un pool de connexions utilisables
* sa méthode getConnection permet de se connecter à MySQL
*
*/

let db = require('../configDb');
var formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra'),
    alert = require('alert-node'),
    path = require('path');

/*
* Récupérer l'intégralité les écuries avec l'adresse de la photo du pays de l'écurie
* @return Un tableau qui contient le N°, le nom de l'écurie et le nom de la photo du drapeau du pays
*/
module.exports.getListeCircuits= function (callback) {
    // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT cirnum, cirnom, cirlongueur, cirnbspectateurs FROM circuit";
            //console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};

module.exports.getListePays = function (callback) {
    db.getConnection(function (err, connection) {
        if (!err) {
            let sql = "select paynum, paynom from pays order by paynom";

            connection.query(sql, callback);
            connection.release();
        }
    })
}

module.exports.getDetailCircuit = function (data, callback) {
    db.getConnection(function (err, connection) {
        if (!err) {
            let sql = "SELECT cirnom, cirlongueur, c.paynum, paynom, ciradresseimage, cirnbspectateurs, cirtext FROM circuit c JOIN pays p ON p.paynum = c.paynum WHERE c.cirnum = " + data;
            //console.log(sql);
            connection.query(sql, callback);
            connection.release();
        }
    })
}

module.exports.ajouterCircuit = function (data, callback) {
    db.getConnection(function (err, connection) {
        if (!err) {
            var form = new formidable.IncomingForm();
            form.parse(data, function (err, fields, files) {
                // Ajout du circuit dans BD
                let description = fields.description.replace(/'/g, "''");
                var values  = '(' + fields.pays + ',' + " '" + fields.nom + "'";
                if (fields.longueur != '') {
                    values += ', ' + fields.longueur;
                } else {
                    values += ', null';
                }
                if (fields.nbspectateurs !=  '') {
                    values += ', ' + fields.nbspectateurs;
                } else {
                    values += ', null';
                }
                values += ", '" + files.upload.name + "', '" + description + "')";
                let sql = "insert into circuit (paynum, cirnom, cirlongueur, cirnbspectateurs, ciradresseimage, cirtext) values " + values;
                connection.query(sql, callback);

                // Ajout d'image
                if (files.upload.name != '') {
                    var oldpath = files.upload.path;
                    var newpath = path.dirname(require.main.filename) + '/public/image/circuit/' + files.upload.name;
                    newpath = newpath.replace("WroomAdmin", "Wroom");
                    fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err;
                    });
                }

                connection.release();
            });
        }
    })
}

module.exports.modifierCircuit = function (data, cirnum, callback) {
    db.getConnection(function (err, connection) {
        if (!err) {
            var form = new formidable.IncomingForm();
            form.parse(data, function (err, fields, files) {
                // On récupère la description en prenant en compte les apostrophes
                var cirtext = fields.description;
                cirtext = cirtext.replace(/'/g, "''");
                // Modification du circuit dans BD
                let sql = "update circuit set cirnom = '" + fields.nom + "', cirlongueur = " + fields.longueur +
                    ", paynum = " + fields.pays + ", cirnbspectateurs = " + fields.nbspectateurs + ", cirtext = '" + cirtext + "'";
                // Ajout d'image si le nom n'est pas vide
                if (files.upload.name != '') {
                    sql += ", ciradresseimage = '" + files.upload.name + "'";
                    var oldpath = files.upload.path;
                    // On place l'image dans le répertoire de Wroom
                    var newpath = path.dirname(require.main.filename) + '/public/image/circuit/' + files.upload.name;
                    newpath = newpath.replace("WroomAdmin", "Wroom");
                    fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err;
                    });
                }

                sql += " where cirnum = " + cirnum;

                //console.log(sql);
                connection.query(sql, callback);
                connection.release();
            });
        }
    })
}

module.exports.supprimerCircuit = function (data, callback) {
    db.getConnection( function (err, connexion) {
        if (!err) {
            let sql = "select * from grandprix where cirnum = " + data;
            // console.log(sql);
            connexion.query(sql, function(err, results){
                if (err){
                    throw err;
                }
                if (results[0] == undefined) {
                    connexion.query("delete from circuit where cirnum = " + data, callback);
                } else {
                    alert("Ce circuit ne peut pas être supprimé !");
                }
            });
            connexion.release();
        }
    })
}