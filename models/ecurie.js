/*
* config.Db contient les parametres de connection à la base de données
* il va créer aussi un pool de connexions utilisables
* sa méthode getConnection permet de se connecter à MySQL
*
*/

let db = require('../configDb');

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
						let sql ="SELECT ecunum, payadrdrap, ecunom FROM " +
                            "ecurie e INNER JOIN pays p ";
						sql= sql + "ON p.paynum=e.paynum ORDER BY ecunom";
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

module.exports.getDetailEcurie = function (data, callback) {
    // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT ecuadresseimage, e.ecunum, ecunom, ecunomdir, ecuadrsiege, paynom, fpnom " +
                "FROM ecurie e LEFT JOIN pays p ON e.PAYNUM = p.PAYNUM LEFT JOIN fourn_pneu f ON f.FPNUM = e.FPNUM WHERE ECUNOM = '" + data + "'";
            //console.log (sql);
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