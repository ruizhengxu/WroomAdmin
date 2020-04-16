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
    path = require('path');

/*
* Récupérer l'intégralité les écuries avec l'adresse de la photo du pays de l'écurie
* @return Un tableau qui contient le N°, le nom de l'écurie et le nom de la photo du drapeau du pays
*/
module.exports.getListeEcurie = function (callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						let sql ="SELECT ecunum,ecunom, ecunomdir, ecupoints FROM ecurie ORDER BY ecunom";
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
};


module.exports.ajouterEcurie = function (data, callback) {
    db.getConnection(function (err, connection) {
        if (!err) {
            var form = new formidable.IncomingForm();
            form.parse(data, function (err, fields, files) {
                // Ajout du circuit dans BD
                var values  = '(' + fields.pays + ',' + " '" + fields.nom + "'";
                if (fields.directeur != '') {
                    values += ', '+ "'" + fields.directeur + "'";
                } else {
                    values += ', null';
                }
                if (fields.adresse !=  '') {
                    values += ', ' + "'" + fields.adresse + "'";
                } else {
                    values += ', null';
                }
                if (fields.points !=  '') {
                    values += ', ' + fields.points;
                } else {
                    values += ', null';
                }
                values += ", '" + files.upload.name + "')";
                let sql = "insert into ecurie (paynum, ecunom, ecunomdir, ecuadrsiege, ecupoints, ecuadresseimage) values " + values;

                console.log(sql);
                connection.query(sql, callback);

                // Ajout d'image
                /*if (files.upload.name != '') {
                    var oldpath = files.upload.path;
                    var newpath = path.dirname(require.main.filename) + '/public/image/ecurie/' + files.upload.name;
                    newpath = newpath.replace("WroomAdmin", "Wroom");
                    fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err;
                        console.log('File uploaded and moved!');
                    });
                }*/

                if (files.upload.name != '') {
                    var oldpath = files.upload.path;
                    var newpath = path.dirname(require.main.filename) + '/public/image/ecurie/' + files.upload.name;
                    console.log(newpath);
                    newpath = newpath.replace("WroomAdmin", "Wroom");
                    console.log(newpath);
                    fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err;
                        console.log('File uploaded and moved!');
                    });
                }
                connection.release();
            });
        }
    })
};


module.exports.modifierEcurie = function (data, ecunum, callback) {
    db.getConnection(function (err, connection) {
        if (!err) {
            var form = new formidable.IncomingForm();
            form.parse(data, function (err, fields, files) {
                // Modification du circuit dans BD
                let sql = "update ecurie set ecunom = '" + fields.nom + "', ecunomdir = '" + fields.directeur +
                    "', paynum = " + fields.pays + ", ecuadrsiege = '" + fields.adresse + "', ecupoints = " + fields.points ;

                // Ajout d'image si le nom n'est pas vide
                if (files.upload.name != '') {
                    sql += ", ecuadresseimage = '" + files.upload.name + "'";
                    var oldpath = files.upload.path;
                    // On place l'image dans le répertoire de Wroom
                    var newpath = path.dirname(require.main.filename) + '/public/image/ecurie/' + files.upload.name;
                    newpath = newpath.replace("WroomAdmin", "Wroom");
                    fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err;
                    });
                }

                sql += " where ecunum = " + ecunum;

                console.log(sql);
                connection.query(sql, callback);
                connection.release();
            });
        }
    })
};

module.exports.supprimerEcurie = function (data, callback) {
    db.getConnection( function (err, connexion) {
        if (!err) {
            let sql = "select * from pilote where ecunum = " + data;
            // console.log(sql);
            connexion.query(sql, function(err, results){
                if (err){
                    throw err;
                }
                if (results[0] == undefined) {
                    connexion.query("delete from ecurie where ecunum = " + data, callback);
                } else {
                    alert("Ce ecurie ne peut pas être supprimé !");
                }
            });
            connexion.release();
        }
    })
};

module.exports.getDetailEcurie = function (data, callback) {
    // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT ecuadresseimage, e.ecunum, ecunom, ecunomdir, ecuadrsiege, paynom, ecupoints " +
                "FROM ecurie e LEFT JOIN pays p ON e.PAYNUM = p.PAYNUM  WHERE e.ECUNUM = '" + data + "'";
            console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};

module.exports.getPilotesEcurie = function (data, callback) {
    // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT p.pilnum, pilnom, pilprenom, phoadresse, SUBSTRING(piltexte, 1, 100) as texte " +
                "FROM pilote p JOIN ecurie e ON p.ECUNUM = e.ECUNUM JOIN photo ph ON p.PILNUM = ph.PILNUM" +
                " WHERE ECUNOM ='"+ data + "' AND ph.PHONUM = 1 ";
            //console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};

module.exports.getVoituresEcurie = function (data, callback) {
    // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT voinom, voiadresseimage, typelibelle " +
                "FROM voiture v JOIN ecurie e ON v.ECUNUM = e.ECUNUM JOIN type_voiture t on t.TYPNUM = v.TYPNUM WHERE ECUNOM = '"+data+"' ";
            //console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};