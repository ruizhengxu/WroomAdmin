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
module.exports.getResultat= function (callback) {
    // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT gpnum, gpnom, payadrdrap FROM grandprix g JOIN circuit c on g.CIRNUM = c.CIRNUM JOIN pays p on c.PAYNUM = p.PAYNUM ORDER BY GPNOM";
            //console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};

module.exports.getDetailResultat = function (data, callback) {
    // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT pilnom, pilprenom, tempscourse FROM grandprix g JOIN course c ON c.GPNUM = g.GPNUM JOIN pilote p ON p.PILNUM = c.PILNUM WHERE g.GPNUM = 4 ORDER BY c.TEMPSCOURSE limit 0,10";
            console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};