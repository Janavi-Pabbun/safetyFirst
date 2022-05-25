var express = require('express');
const cookieParser = require("cookie-parser");
var app = express();

var bodyParser = require('body-parser');
var passport = require("passport");
var methodOverride = require("method-override");
var path = require('path');
///var firebase=require('firebase')
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const { credential } = require('firebase-admin');
admin.initializeApp({

	credential: admin.credential.cert(serviceAccount)
});
const mongoose=require('mongoose');
const feedback = require("./models/feedback");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//app.use(express.static('public'));
//app.get('/public', express.static('public'));

//app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(cookieParser());
mongoose.connect('mongodb+srv://janaviPabbun:luvuzindagi6@clusterproject.3t9zj.mongodb.net/node-project?retryWrites=true&w=majority',{
	useNewUrlParser:true,useUnifiedTopology:true
}).then((result)=> console.log("Connceted to db")).catch((err)=>console.log(err));
app.get("/", function (req, res) {
	res.render("index");
});
app.get("/login", function (req, res) {
	res.render("login");
});
app.get("/signup", function (req, res) {
	res.render("signup");
});

app.post("/signup", function (req, res) {
	res.redirect("/maps");
});





//saving cookies and verify cookies
// Reference : https://firebase.google.com/docs/auth/admin/manage-cookies

function savecookie(idtoken, res) {
	//const uid=0;

	const expiresIn = 60 * 60 * 24 * 5 * 1000;
	admin.auth().createSessionCookie(idtoken, { expiresIn })
		.then((sessionCookie) => {
			const options = { maxAge: expiresIn, httpOnly: true, secure: true };
			res.cookie('__session', sessionCookie, options);
			user = admin.auth().currentUser;
			//console.log(user);
			admin.auth().verifyIdToken(idtoken).then(function (decodedToken) {
				var uid;
				uid = decodedToken.uid;
				//console.log("Rendered");

				res.sendFile(path.join(__dirname + '/MapAndLoc.html'))
				//req.decodedToken.uid;
				//console.log("UID of Signed in User is" + );

			}).catch((error) => {
				// Session cookie is unavailable or invalid. Force user to login.
				res.redirect("/login");
				console.log("error is mine save cookieN")

			});

		}).catch((error) => {
			console.log("error is here");
			res.status(401).send("UnAuthorised Request");
			//res.render('/login');
		});


}
function checkCookie(req, res, next) {


	const sessionCookie = req.cookies.__session || '';
	admin.auth().verifySessionCookie(
		sessionCookie, true).then((decodedClaims) => {
			req.decodedClaims = decodedClaims;
			//res.redirect("/maps");
			//next();
		})
		.catch(error => {
			console.log("error is mine check cookie")
			// Session cookie is unavailable or invalid. Force user to login.
			res.redirect('/login');
		});

}
app.get('/savecookie', (req, res) => {
	const Idtoken = req.query.idToken;
	//console.log(Idtoken);
	savecookie(Idtoken, res);
});

app.post("/login", function (req, res) {
	checkCookie(req, res);


});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + '/whyme.html'));
});

app.get("/maps", (req, res) => {
	res.sendFile(path.join(__dirname + '/MapAndLoc.html'));
});
app.get("/about", (req, res) => {
	res.sendFile(path.join(__dirname + '/about.html'));
});
app.get("/feedback", function (req, res) {
	res.sendFile(path.join(__dirname + '/feedbackForm.html'));

});

app.post("/maps", (req, res) => {
});	
app.post("/feedback", function (req, res){
		let newFeedback=new feedback(
			{
				username:req.body.username,
				data_id_o:req.body.origin,
				data_id_d:req.body.destination,
				danger_index:req.body.danger,
				lighting:req.body.light,
				ranking:req.body.rate,
				remark:req.body.remarks
			});
		newFeedback.save();
		res.redirect("/feedback")
		});
app.get("/review", function (req, res) {
	feedback.find({}, function(err, feedbacks) {
        res.render('review', {
            feedbackList: feedbacks
        })
    })
	
	});

app.listen(3000, function () {
	console.log("Server started");

});