//node.jsのインストールしたパッケージを読み出している。
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var cors = require('cors');
var mysql = require('mysql2');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var cookies = require('js-cookie')//いちむら追加分：Cookieの扱いを楽にするやつ


//パス情報を変数に格納している。
var indexRouter = require('./routes/index');
var accountRouter = require('./routes/account');
var account_additionRouter = require('./routes/account_addition');
var account_additionMethodRouter = require('./routes/account_additionMethod');
var account_additionCSVRouter = require('./routes/account_additionCSV');
var account_additionCSVExplanationRouter = require('./routes/account_additionCSVExplanation');
var account_additionChangeRouter = require('./routes/account_additionChange');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var helloRouter = require('./routes/hello');
var newplayerRouter = require('./routes/new_player');
var mondaiRouter = require('./routes/mondai');
var hyoujiRouter = require('./routes/hyouji');
var kaitouRouter = require('./routes/kaitou1');
var kaitou2Router = require('./routes/kaitou2');
var hyouji2Router = require('./routes/hyouji1');
var mondai2Router = require('./routes/mondai2');
var kaitou3Router = require('./routes/kaitou3');
var mondai3Router = require('./routes/mondai3');
var hyouji3Router = require('./routes/hyou');
var hyouji4Router = require('./routes/hyouji2');
var kakuninRouter = require('./routes/kakunin');
var tuikaRouter = require('./routes/tuika');
var failRouter = require('./routes/fail');
var kanryouRouter = require('./routes/kanryou');
var missRouter = require('./routes/miss');
var uploadRouter = require('./routes/upload.js');
var tuika2Router = require('./routes/tuika2');
var Question_manageRouter = require('./routes/Question_manage.js');
var Answer_backRouter = require('./routes/Answer_back');
var mainRouter = require('./routes/main');
var account_listRouter = require('./routes/account_list');
var account_additionRouter = require('./routes/account_addition');
var account_editRouter = require('./routes/account_edit');
var question_listRouter = require('./routes/question_list');
var question_additionRouter = require('./routes/question_addition');
var question_editRouter = require('./routes/question_edit');

const router = require('./routes/index');
//読み込んだexpressをapp変数に格納
var app = express();

const db_conf = {
  host: 'localhost',
  user: 'root',
  password: '20010426',
  database: 'mydb2',
};

const db_conf2 ={
  host :'localhost',
  user :'root',
  //password :'20021225',
  password :'ha031008',
  database :'mydb2',
}
  //shimamura_password
  //password :'matosui122083',

  //ichi_password
  //password :'Bonobo09040425',
  
  //nakano_password
  //password :'20010426',
  
  //myoujin_password
  //password :'20021225'
  
  //yoshida_password
  //password :'ha031008',
const pool = mysql.createPoolCluster();
pool.add('MASTER',db_conf);

const pool2 = mysql.createPoolCluster();
pool2.add('MASTER',db_conf2);

app.set('pool',pool);
app.set('pool2',pool2);

//ejsを使えるようにしている。
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(express.static('images'));

var options = {
  host: 'localhost',
  user: 'root',

  password: 'Bonobo09040425',

  password: '20010426',

  database: 'mydb2'
};

var sessionStore = new MySQLStore(options);

const sessionMiddleware = session({
  secret: 'team_king_oyster_mashroom',
  resave: false,
  store: sessionStore,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000
  }
});
app.use(sessionMiddleware);

var sessionCheck = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

//パスを読み込み、ページを移動する際に使用する。
app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/account_addition', account_additionRouter);
app.use('/account_additionMethod', account_additionMethodRouter);
app.use('/account_additionCSV', account_additionCSVRouter);
app.use('/account_additionCSVExplanation', account_additionCSVExplanationRouter);
app.use('/account_additionChange', account_additionChangeRouter);
app.use('/users', usersRouter);
app.use('/hello',helloRouter);
app.use('/new_player',newplayerRouter);
app.use('/login',loginRouter);
app.use('/mondai',mondaiRouter);
app.use('/h',hyoujiRouter);
app.use('/kaitou',kaitouRouter);
app.use('/kaitou2',kaitou2Router);
app.use('/hyouji2',hyouji2Router);
app.use('/mondai2',mondai2Router);
app.use('/kaitou3',kaitou3Router);
app.use('/mondai3',mondai3Router);
app.use('/hyou3',hyouji3Router);
app.use('/hyou4',hyouji4Router);
app.use('/kakunin',kakuninRouter);
app.use('/tuika',tuikaRouter);
app.use('/fail',failRouter);
app.use('/kanryou',kanryouRouter);
app.use('/miss',missRouter);
app.use('/upload',uploadRouter);
app.use('/tuika2',tuika2Router);
app.use('/Question_manage',Question_manageRouter);
app.use('/Answer_back',Answer_backRouter);
app.use('/main',mainRouter);
app.use('/account_list',account_listRouter);
app.use('/account_addition',account_additionRouter);
app.use('/account_edit',account_editRouter);
app.use('/question_list',question_listRouter);
app.use('/question_addition',question_additionRouter);
app.use('/question_edit',question_editRouter);



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

var storage = multer.diskStorage({
  destination: function(req,file,cb){
      cb(null,'./public/images')
  },
  filename: function(req,file,cb){
      cb(null,file.originalname)
  }
})

var upload = multer({storage: storage});

app.post('/',upload.array('uploadfile'),function(req,res){
  console.log(req.file);
})

app.use(cors());
module.exports = { app,sessionMiddleware };
