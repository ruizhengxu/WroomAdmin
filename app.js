let express         = require('express'),
    session         = require('express-session'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'), //pour récupérer les résultats des post
    http = require('http'),
    path = require('path'),
    global = require('global');

let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let Cryptr = require('cryptr');
let cryptr = new Cryptr('MaSuperCléDeChiffrementDeouF');
let encrytedString = cryptr.encrypt('TakeTheLongWayHome');
let decryptedString = cryptr.decrypt(encrytedString);
global.connecter = false;

console.log(encrytedString);
console.log(decryptedString);

let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('port', 6900);
app.set('views', path.join(__dirname, 'views'));

// routes static, le routeur n'y aura pas accès
app.use(express.static(path.join(__dirname+ '/public')));

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.html'));
});

app.use(passport.initialize());
app.use(passport.session());


app.use(function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});
app.use(cookieParser());

app.use(session({
    secret: 'nC0@#1pM/-0qA1+é',
    name: 'GrandPrix',
    resave: true,
    saveUninitialized: true,
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username);
        console.log(password);
        let db = require('./configDb');
        db.getConnection(function(err, connexion){
            if(!err){
                // s'il n'y a pas d'erreur de connexion
                // execution de la requête SQL

                connexion.query('SELECT passwd FROM login WHERE login = ? ', [username], function (err, results, fields) {
                    if(err){done(err)}

                    if(results.length === 0){
                        return done(null, false);
                    }else {
                        const motDepasse = results[0].passwd;
                        console.log(motDepasse);
                        console.log(cryptr.decrypt(motDepasse));
                        if(cryptr.decrypt(motDepasse) === password){
                            console.log('Enter');
                            global.connecter = true;
                            return done(null, {user_id: 43});
                        }else {
                            return done(null, false);
                        }
                    }

                });
                connexion.release();
            }
        });
    }
));

/* ces lignes permettent d'utiliser directement les variables de session dans handlebars
 UTILISATION : {{session.MaVariable}}  */
app.use(function(request, response, next){
    response.locals.session = request.session;
    next();
});



/* express-handlebars - https://github.com/ericf/express-handlebars
*  Handlebars : moteur de template pour Express.
* il va gérer les vues
*/
var exphbs = require('express-handlebars');
app.set('view engine', 'handlebars'); //nom de l'extension des fichiers
var handlebars  = require('./helpers/handlebars.js')(exphbs); //emplacement des helpers
// helpers : ajouts de fonctionnalités pour handlebars

app.engine('handlebars', handlebars.engine);

// chargement du routeur
require('./router/router')(app,passport);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Serveur Node.js en attente sur le port ' + app.get('port'));
});

module.exports = {
    switch: function(value, options) {
        this._switch_value_ = value;
        this._switch_break_ = false;
        var html = options.fn(this);
        delete this._switch_break_;
        delete this._switch_value_;
        return html;
    },
    case: function(value, options) {
        var args = Array.prototype.slice.call(arguments);
        var options    = args.pop();
        var caseValues = args;

        if (this._switch_break_ || caseValues.indexOf(this._switch_value_) === -1) {
            return '';
        } else {
            if (options.hash.break === true) {
                this._switch_break_ = true;
            }
            return options.fn(this);
        }
    },
    default: function(options) {
        if (!this._switch_break_) {
            return options.fn(this);
        }
    }
};



