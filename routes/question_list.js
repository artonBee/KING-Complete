var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const { route } = require(".");
const async = require('async');
//このページに来たら最初に行う処理
/* GET users listing. */
router.get('/', function(req, res, next) {
  var app = req.app;
  var name1 = req.query.name;
  var poolCluster = app.get('pool');
  var pool = poolCluster.of('MASTER');
  var sql = "SELECT g.qualification_name,g.question_genre,g.question_years,q.question_name,q.question_text,COALESCE(s.select_1, '') AS select_1,COALESCE(s.select_2, '') AS select_2,COALESCE(s.select_3, '') AS select_3,COALESCE(s.select_4, '') AS select_4,a.type_name,CASE  WHEN q.picture_flag = 0 THEN '' ELSE p.pics_name END AS pics_name FROM question_table q LEFT JOIN select_table s ON q.question_ID = s.question_ID LEFT JOIN pics_table p ON q.question_ID = p.question_ID JOIN answer_type a ON q.type_ID = a.type_ID JOIN genre_table g ON q.question_ID = g.question_ID;";
  pool.getConnection(function(err,connection){
    connection.query(sql,(err,result,fields) =>{
        if(err){
            console.log(err);
        }
        res.render('question_list',{data:result});
       })
       connection.release();
   })
});

module.exports = router;