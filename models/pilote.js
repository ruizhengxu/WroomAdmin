
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
module.exports.getRepertoirePilotes = function (callback) {
    // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT DISTINCT SUBSTRING(PILNOM,1,1) as lettre from pilote ORDER BY 1";
            //console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};

module.exports.getListesPilotes = function (callback) {
    // connection à la base

    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT pilnum, pilnom, pilprenom, pildatenais FROM pilote ORDER BY pilnom" ;
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
            console.log(sql);

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
            console.log(sql);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};

module.exports.ajouterPilote = function (data, callback) {
    // connection à la base

    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL

            var ajouter = '(' + data.nationalite + ',' + "'" + data.nom + "'" + ',' + "'"+ data.prenom  + "'" + ',' + "'" + data.datenais + "'" + ',' + data.points + ',' + data.poids + ',' +
                data.taille + ',' + "'" + data.description + "'" + ',' + data.ecurie + ')';
            console.log(ajouter);
            let sql ="INSERT INTO pilote (paynum,pilnom,pilprenom,pildatenais,pilpoints,pilpoids,piltaille,piltexte,ecunum) VALUES " + ajouter ;
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};

module.exports.modifierPilote = function (data, ajouter , callback) {
    // connection à la base

    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL


            let sql ="UPDATE pilote set " +
                "pilnom = '"+ data.nom +"', " +
                "pilprenom = '" + data.prenom + "', " +
                "PILDATENAIS = '" + data.datenais + "', " +
                "paynum = " + data.nationalite + ", " +
                "ecunum = " + data.ecurie + ", " +
                "pilpoints = " + data.points + ", " +
                "pilpoids = " + data.poids + ", " +
                "piltaille = " + data.taille + ", " +
                "piltexte = '" + data.description + "' " +
                "WHERE pilnum = " + ajouter ;
            console.log(sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};


module.exports.getDetailPilote = function (data, callback) {
    // connection à la base

    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL
            let sql ="SELECT pi.paynum as paynum,pilnom,pilprenom,pildatenais,pilpoints,pilpoids,piltaille,piltexte,pi.ecunum as ecunum,paynat,ecunom FROM pilote pi JOIN pays pa ON pi.PAYNUM = pa.PAYNUM LEFT JOIN ecurie e ON e.ECUNUM = pi.ECUNUM WHERE pilnum = " + data ;
            console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};



module.exports.supprimerPilote = function (data, callback) {
    // connection à la base

    db.getConnection(function(err, connexion){
        if(!err){
            // s'il n'y a pas d'erreur de connexion
            // execution de la requête SQL

            let sql ="DELETE FROM pilote WHERE pilnum = " + data ;
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
        }
    });
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