/*
* config.Db contient les parametres de connection à la base de données
* il va créer aussi un pool de connexions utilisables
* sa méthode getConnection permet de se connecter à MySQL
*
*/

let db = require('../configDb');
var moment = require('moment'),
    alert = require('alert-node');
/*
* Récupérer l'intégralité les écuries avec l'adresse de la photo du pays de l'écurie
* @return Un tableau qui contient le N°, le nom de l'écurie et le nom de la photo du drapeau du pays
*/
module.exports.getListeGrandPrix= function (callback) {
    // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT gpnum, gpnom FROM grandprix ORDER BY gpnum";
            //console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};

module.exports.getResultats = function (data, callback) {
    // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="select *, case\n" +
                "when place = 1 then 25\n" +
                "when place = 2 then 18\n" +
                "when place = 3 then 15\n" +
                "when place = 4 then 12\n" +
                "when place = 5 then 10\n" +
                "when place = 6 then 8\n" +
                "when place = 7 then 6\n" +
                "when place = 8 then 4\n" +
                "when place = 9 then 2\n" +
                "when place = 10 then 1\n" +
                "end as points from\n" +
                "(SELECT row_number() over() as place, g.gpnum, p.pilnum, pilnom, tempscourse\n" +
                "FROM grandprix g JOIN course c ON c.GPNUM = g.GPNUM JOIN pilote p ON p.PILNUM = c.PILNUM WHERE g.GPNUM = " + data + "\n" +
                "ORDER BY c.TEMPSCOURSE) a";
            //console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};

module.exports.getPilotes = function(callback) {
    // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT pilnum, pilnom FROM pilote ORDER BY pilnom";
            //console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
}

module.exports.getNouveauNumero = function(data, callback) {
    // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql = "SELECT count(*) + 1 as numero\n" +
                "FROM grandprix g JOIN course c ON c.GPNUM = g.GPNUM JOIN pilote p ON p.PILNUM = c.PILNUM WHERE g.GPNUM = " + data + "\n" +
                "ORDER BY c.TEMPSCOURSE";
            //console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
}

module.exports.supprimerResultat = function(gpnum, pilnum, callback) {
    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql = "delete from course where gpnum = " + gpnum + " and pilnum = " + pilnum;

            // Mise à jour de la date de modification du grand prix
            var moment = require('moment');
            currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            let update = "update grandprix set gpdatemaj = '" + currentDate + "' where gpnum = " + gpnum;

            // Exécution
            connexion.query(sql, callback);
            connexion.query(update, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
}

module.exports.ajoutResultat = function(gpnum, data, callback) {
    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            if (data.heure.length == 0 || data.minute.length == 0 || data.seconde.length == 0) {
                alert("Vous devez compléter le temps effectué par le pilote !");
            } else {
                let heure = data.heure;
                if (heure.length == 1) {
                    heure = "0" + heure;
                }
                let minute = data.minute;
                if (minute.length == 1) {
                    minute = "0" + minute;
                }
                let seconde = data.seconde;
                if (seconde.length == 1) {
                    seconde = "0" + seconde;
                }
                let temps = heure + ":" + minute + ":" + seconde;
                let sql = "insert into course (gpnum, pilnum, tempscourse) values(" + gpnum + ", " + data.pilote + ", '" + temps + "')";
                //console.log(sql);
                // Exécution
                connexion.query(sql, callback);
                // la connexion retourne dans le pool
                connexion.release();
            }
        }
    });
}