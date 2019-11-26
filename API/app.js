var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");
var app = express();
var cors = require('cors');
var fileUpload = require('express-fileupload');
var router = express.Router();

router.get("/",function(req,res){
  res.json({"error" : false,"message" : "There is an error"});
});

//DB Commect
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/DigitalFarmer").then(() => console.log("connectd!")).catch(error => console.log(error));

//DB Schema
var farmerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  farmerId: String,
  updated: { type: Date, default: Date.now },
  age: Number,
  villageId:  Number,
  villageName: String,
  longitude: mongoose.Decimal128,
  latitude: mongoose.Decimal128,
  filename: String
});

//DB Model
var Farmer = mongoose.model("Farmer", farmerSchema);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/',router);
app.use('/public', express.static(__dirname + '/public'));
app.use("/testAPI", testAPIRouter);

// API to Post farmer data to the DB and the farmer image to file system
app.post('/farmers', (req, res, next) => {

// Take the input from the client
  var farmerData = new Farmer (req.body);
// Save the image (here we aee using file system)
	let imageFile = req.files.file;
	imageFile.mv(`${__dirname}/public/${req.body.filename}.jpg`, err => {
		if (err) {
			return res.status(500).send(err);
    }
      imageURL=(`public/${req.body.filename}.jpg`);
// Save the data to DB
      farmerData.save()
      .then(item => {
        res.json({ file: `public/${req.body.filename}.jpg` });
      })
// Handle error
      .catch(err => {
        res.status(400).send("unable to save to database");
      });
    })
});

//API to get farmers by villageId
app.get('/farmers/byvillageId/:villageId', (req, res, next)=>
{
  try{
      Farmer.find({'villageId':req.params.villageId},function(err,villageFarmers){
        if(!err){
          res.send(villageFarmers);
        }
      });
    }catch (error)
    {
      res.status(500).send(error);
    }

});

//API to retrieve farmer information by farmerID
app.get('/farmers/byuserId/:farmerId', (req, res, next)=>
{
  try{
      Farmer.find({'farmerId':req.params.farmerId},function(err,theFarmer){
        if(!err){
          res.send(theFarmer);
        }
      });
    }catch (error)
    {
      res.status(500).send(error);
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
