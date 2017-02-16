var express = require('express')
  , http = require('http')
  , path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');

//var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var _storage = multer.diskStorage({
   destination: function(req, file, cb){
      cb(null, 'uploads/')
   },
   filename:function (req, file, cb){
      cb(null, file.originalname);
   }
})


//업로드 부위
var upload = multer({storage: _storage});


var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  port: '3307', //수정!!!
  host:'localhost',
  user:'root',
  password:'artnotbluff0',
  database:'myapp'
});

var user_id ="";
var sfileContents=[];
var fileID=[];
var fileName=[];


var fileID=[];
var fileName=[];
var fileContents=[];

var fileContents=[];
var uploadTime =['12:03', '14:20', '14:30','12:03', '14:20', '14:30','12:03', '14:20', '14:30'];
var userName = ['jin', 'woo', 'ahn','jin', 'woo', 'ahn','jin', 'woo', 'ahn'];

//===== Express 서버 객체 만들기 =====//
var app = express();


//===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
app.set('port', process.env.PORT || 3001);
app.use('/public', express.static(path.join(__dirname, 'public')));

//===== body-parser, cookie-parser, express-session 사용 설정 =====//
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(expressSession({
   secret:'my key',
   resave:true,
   saveUninitialized:true
}));

// 로그인 처리 함수
app.get('/login',function(req,res){
  res.render('login.html');
})
app.get('/profile',function(req, res){
  res.render('profile.html');
})
//로그인 했을때 board 로 넘어간다.
app.post('/board', upload.single('file_upload2'), function(req, res) {

//search 했을 경우와 login했을 경우를 나누어 생각하자
  if(req.param('comments'))
  {

        //  console.log(req.file);
          console.log(req.param('comments'), req.param('title'));
        //  console.log(req.param('file'));
    //      req.param('file')

          fs.readFile('./uploads/' + req.file.originalname,  function(err, data) {
            if(err) throw err;
             console.log('data' + data);
        //     res.writeHead(200, {"ContentType": "text/plain"})
        //     res.end(data);
      //  fileID.push(rows[i].file_id);
      //  fileName.push(rows[i].file_name);
      //  fileContents.push(rows[i].user_contents);

        //겹치는 녀석인지 비교를 시작한다!
        var flag=0;
        for (var i =0; i<fileName.length; i++)
        {
          //겹치는 녀석이네??
            if(fileName[i]==req.param('title'))
            {
                //history 업데이트

                var sql="insert into file_history (file_upload_time, user_message, file_id, id) values (?,?,?,?)"
                var params = [new Date(), req.param('comments'), fileID[i], user_id];
  console.log(typeof(new Date()),'zzzzzzzzzzzzzzzzz',params);
                //console.log(user_id+"zzz");
                pool.query(sql,params, function(err, rows, fields){
                    if(err)
                      console.log(err);

                      //다시 가져온다!!
                    var sql="select file_id, file_name, user_contents from file where id=?";
                    var params = [user_id];
                    pool.query(sql,params, function(err, rows, fields){
                        if(err)
                          console.log(err);
                        else{
                          for(var i=0;i<rows.length;i++)
                            {
                              //겹치는애 있는지 확인하고 없을 경우 업데이트
                              var dupFlag=0;
                              for(var j=0;j<fileID.length;j++)
                              {
                              //  console.log('h');
                                if (fileID[j]==rows[i].file_id)
                                {
                                //  console.log('z');
                                  dupFlag=1;
                                  break;
                                }
                              }

                              if(dupFlag==0)
                              {
                                fileID.push(rows[i].file_id);
                                fileName.push(rows[i].file_name);
                                fileContents.push(rows[i].user_contents);
                                //console.log(rows[i].file_name, rows[i].file_id. rows[i].user_contents);
                              }

                            }
                            res.render('board.html',{_id : fileID, _name : fileName, _time : uploadTime, _user : user_id});

                        }
                    });



            });
              flag=1;
              break;
          }
        }

        if(flag==0){
        //db 소환
        //var sql="select file_id, file_name, user_contents from file where id=?";
        var sql="insert into file (file_name, user_contents, id) values (?,?,?)"
        var params = [req.param('title'), data, user_id];
        //console.log(user_id+"zzz");
        pool.query(sql,params, function(err, rows, fields){
            if(err)
              console.log(err);



                //다시 가져온다!!
              var sql="select file_id, file_name, user_contents from file where id=?";
              var params = [user_id];
              pool.query(sql,params, function(err, rows, fields){
                  if(err)
                    console.log(err);
                  else{
                    for(var i=0;i<rows.length;i++)
                      {
                        //겹치는애 있는지 확인하고 없을 경우 업데이트
                        var dupFlag=0;
                        for(var j=0;j<fileID.length;j++)
                        {
                        //  console.log('h');
                          if (fileID[j]==rows[i].file_id)
                          {
                          //  console.log('z');
                            dupFlag=1;
                            break;
                          }
                        }

                        if(dupFlag==0)
                        {
                          fileID.push(rows[i].file_id);
                          fileName.push(rows[i].file_name);
                          fileContents.push(rows[i].user_contents);
                          //console.log(rows[i].file_name, rows[i].file_id. rows[i].user_contents);
                        }

                      }
                      res.render('board.html',{_id : fileID, _name : fileName, _time : uploadTime, _user : user_id});

                  }
              });



              //res.render('board.html',{_id : fileID, _name : fileName, _time : uploadTime, _user : user_id});
        });
      }
      });

  }



  else if (req.param('search'))
  {
  //  console.log(req.param('search'));
      var search=req.param('search');

//db  로부터 가져와서 비교하자!
      var sql="select file_id, file_name, user_contents from file where id=?";

      var params = [user_id];
      //console.log(user_id+"zzz");
      pool.query(sql,params, function(err, rows, fields){
          if(err)
            console.log(err);
          else{
            fileID=[];
            fileName=[];
            fileContents=[];
            for(var i=0;i<rows.length;i++)
              {



                var extention=rows[i].file_name.split('.');
                extention = extention[extention.length-1];
                console.log(extention);

                console.log(rows[i].file_name+' hahahoho');

                //예외처리 .exe검색할때
                if(search[0]=='.')
                  search=search.split('.')[1];

                if(search==rows[i].file_name || search==extention)
                {

                  fileID.push(rows[i].file_id);
                  fileName.push(rows[i].file_name);
                  fileContents.push(rows[i].user_contents);
                  //console.log(rows[i].file_name, rows[i].file_id. rows[i].user_contents);
                }

              }
              console.log(fileName);
              res.render('board.html',{_id : fileID, _name : fileName, _time : uploadTime, _user : user_id});

          }
      });

  }
//계정 수정했을 경우
  else if(req.param('email'))
  {
    console.log('zzz');

    var sql="update user set password = ?, name = ?, email = ? where user.id= ?";
    var params = [req.param('password'), req.param('name'), req.param('email'), user_id];
    pool.query(sql,params, function(err, rows, fields){
        if(err)
          console.log(err);
        else{
        //  alert('수정되었습니다!');
        console.log(fileID);
          res.render('board.html',{_id : fileID, _name : fileName, _time : uploadTime, _user : user_id});

        }
    });




  }

//login 했을 경우
  else{

   paramId = req.param('id');
   paramPassword = req.param('password');
   console.log(paramId, paramPassword);
//   console.log("hppay");
   if(pool){
      authUser(paramId, paramPassword, function(err, rows) {
         if (err) {throw err;}

        //로그인 성공!
         if (rows) {
            console.dir(rows);
            console.log('he');
            console.log('hello',rows);

////        복붙
//var user_id='user2';
//var user_id = paramId;//!!얘를 어떻게 다뤄야 하나?
user_id=paramId;
//디비로 부터 파일을 받아와서 뿌려야.
//여기서 db를 받으면 안되고, 초반부에 질러줘야 한다.

var sql="select file_id, file_name, user_contents from file where id=?";
var params = [user_id];
pool.query(sql,params, function(err, rows, fields){
    if(err)
      console.log(err);
    else{
      for(var i=0;i<rows.length;i++)
        {
          //겹치는애 있는지 확인하고 없을 경우 업데이트
          var dupFlag=0;
          for(var j=0;j<fileID.length;j++)
          {
          //  console.log('h');
            if (fileID[j]==rows[i].file_id)
            {
            //  console.log('z');
              dupFlag=1;
              break;
            }
          }

          if(dupFlag==0)
          {
            fileID.push(rows[i].file_id);
            fileName.push(rows[i].file_name);
            fileContents.push(rows[i].user_contents);
            //console.log(rows[i].file_name, rows[i].file_id. rows[i].user_contents);
          }

        }
        res.render('board.html',{_id : fileID, _name : fileName, _time : uploadTime, _user : user_id});

    }
});

////  복붙


      //      res.render('/board');
         } else {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h1>로그인  실패</h1>');
            res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
            res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
            res.end();
         }
      });
   } else {
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
      res.end();
   }
 }
});


var authUser = function(id,password,callback)
{
/*  pool.getConnection(function(err,conn){
    if(err){
      conn.release();
      return;
    }
*/
  console.log('authuser');
    var columns = ['id','password'];
    var tablename='user';

    var exe = pool.query("select * from user where id=? and password =?",[id,password],function(err,rows){
    //  pool.release();

      if(err){
        return;
      }
      if(rows.length>0)
      {
        callback(null,rows);
      }
      else {
        callback(null,null);
      }
    });
/*    pool.on('error', function(err) {
          console.log('데이터베이스 연결 시 에러 발생함.');
          console.dir(err);
          callback(err, null);
    });
*/
}


//===== 서버 시작 =====//
/*
http.createServer(app).listen(app.get('port'), function(){
  console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
});
*/

//url 치고 들어오는 사용자
//var fileID = ['0','1','2','3','4','5','6','7','8','9'];
//var fileName =['f1','f2','f3','f1','f2','f3','f1','f2','f3'];
//var fileContents=['c1fjsdhkfjhsdkjfhsdkjfhsdjkfhjksdhfkjsdhfjksdhfkjdshfjksdhjkfhsdjkfhsdkjfhjksdhjfjkds','c2','c3','c1','c2','c3','c1','c2','c3'];


app.use(express.static('public')); //public dir	을 정적인 파일이 위치하는 dir로 하겠다.
//app.set('view engine', 'ejs');
//app.set('view engine', 'jade');//template engine와 express 연
//app.use(express.static());
app.engine('html', require('ejs').renderFile);
app.set('views', './views');
app.locals.pretty = true; //ㅋ코드 예쁘게 만들어주기
app.get('/index.html', function(req, res){
	res.render('index.html');
});
app.get('/board', function(req,res){

//  var user_id='user2';
	//디비로 부터 파일을 받아와서 뿌려야.
  //여기서 db를 받으면 안되고, 초반부에 질러줘야 한다.
  if(req.query.id)
  {
    console.log('delete');
    //var sql="select file_id, file_name, user_contents from file where id=?";
    var sql = "delete from file_history where ?=file_id"
    var params = [req.query.id];
    console.log(req.query.id, "zzzzzzzz");
    pool.query(sql,params, function(err, rows, fields){
        if(err)
          console.log(err);

          var sql = "delete from file where ?=file_id"
          var params = [req.query.id];
          console.log(req.query.id, "zzzzzzzz");
          pool.query(sql,params, function(err, rows, fields){
              if(err)
                console.log(err);

                //  res.render('board.html',{_id : fileID, _name : fileName, _time : uploadTime, _user : user_id});

                else{
                  console.log("돌아왔어맨");
                  var sql="select file_id, file_name, user_contents from file where id=?";
                  var params = [user_id];
                  fileID=[];
                  fileName=[];
                  fileContents=[];
                  pool.query(sql,params, function(err, rows, fields){
                      if(err)
                        console.log(err);
                      else{
                        for(var i=0;i<rows.length;i++)
                          {
                            //겹치는애 있는지 확인하고 없을 경우 업데이트
                            var dupFlag=0;
                            for(var j=0;j<fileID.length;j++)
                            {
                            //  console.log('h');
                              if (fileID[j]==rows[i].file_id)
                              {
                              //  console.log('z');
                                dupFlag=1;
                                break;
                              }
                            }

                            if(dupFlag==0)
                            {
                              fileID.push(rows[i].file_id);
                              fileName.push(rows[i].file_name);
                              fileContents.push(rows[i].user_contents);
                              //console.log(rows[i].file_name, rows[i].file_id. rows[i].user_contents);
                            }

                          }
                          console.log(fileID);
                          res.render('board.html',{_id : fileID, _name : fileName, _time : uploadTime, _user : user_id});

                      }
                  });
                }

          });

    });



  }

else{
  console.log("돌아왔어맨");
  var sql="select file_id, file_name, user_contents from file where id=?";
  var params = [user_id];
  fileID=[];
  fileName=[];
  fileContents=[];
  pool.query(sql,params, function(err, rows, fields){
      if(err)
        console.log(err);
      else{
        for(var i=0;i<rows.length;i++)
          {
            //겹치는애 있는지 확인하고 없을 경우 업데이트
            var dupFlag=0;
            for(var j=0;j<fileID.length;j++)
            {
            //  console.log('h');
              if (fileID[j]==rows[i].file_id)
              {
              //  console.log('z');
                dupFlag=1;
                break;
              }
            }

            if(dupFlag==0)
            {
              fileID.push(rows[i].file_id);
              fileName.push(rows[i].file_name);
              fileContents.push(rows[i].user_contents);
              //console.log(rows[i].file_name, rows[i].file_id. rows[i].user_contents);
            }

          }
          console.log(fileID);
          res.render('board.html',{_id : fileID, _name : fileName, _time : uploadTime, _user : user_id});

      }
  });
}
  //////////////////////////
	//res.render('board.html',{_id : fileID, _name : fileName, _time : uploadTime, _user : user_id});
})
app.get('/history',function(req,res){
	var _fileID=req.query.id;
	//db로부터 히스토리를 읽어온다.
	//var his_time=['12.4.2', '13.5.6'];
	//var his_comments=['hello','shit'];
  var his_time = [];
  var his_comments=[];
  var his_contents=[];

  var sql="select file_upload_time, user_message, user_contents from file_history join file on file.file_id = file_history.file_id where file.file_id=?";
  var params = [_fileID];
  pool.query(sql,params, function(err, rows, fields){
      if(err)
        console.log(err);
      else{
        for(var i=0;i<rows.length;i++)
          {
            //겹치는애 있는지 확인하고 없을 경우 업데이트
          /*  var dupFlag=0;
            for(var j=0;j<.length;j++)
            {
            //  console.log('h');
              if (fileID[j]==rows[i].file_id)
              {
              //  console.log('z');
                dupFlag=1;
                break;
              }
            }*/

          //  if(dupFlag==0)
          //  {
          console.log(rows[i].file_upload_time, rows[i].user_message, rows[i].user_contents);
            his_time.push(rows[i].file_upload_time);
            his_comments.push(rows[i].user_message);
            his_contents.push(rows[i].user_contents);

              //console.log(rows[i].file_name, rows[i].file_id. rows[i].user_contents);
          //  }

          }
          res.render('history.html', {_times : his_time, _comments : his_comments, _id :_fileID});

      }
  });
//console.log(his_time.length);
/////////
//	res.render('history.html', {_times : his_time, _comments : his_comments, _id :_fileID});
})

app.post('/login', function(req,res){
	res.render('login.html');
})



app.get('/board_contents', function(req,res){
	cur_id = req.query.id;
	console.log(cur_id);
	//디비로 부터 파일 정보를 받아와서 뿌려
	var fileTitle=fileName[cur_id];
	var fileContent=fileContents[cur_id];
	var _fileID = fileID[cur_id];
  console.log(fileTitle, fileContent, _fileID);
	res.render('board_contents.html',{_id : _fileID, _title : fileTitle, _contents : fileContent});
})
app.listen(3001, function(){
	console.log('Connected 3001 port!' );
});


//업로드 부위
//var upload = multer({storage: _storage});

//var upload = require('/routes/upload.js')

//app.use(express.static('public')); //public dir   을 정적인 파일이 위치하는 dir로 하겠다.
//app.use(bodyParser.urlencoded({extended:false}));

app.post('/form_receiver', function(req, res){
   var text1 = req.body.edit;
   var text2 = req.body.edit2;
//   var upload = req.body.file_upload;
   res.send(text1 + text2)
   res.send(upload);
})

app.get('/editors',function(req, res){
  res.render('editors.html');
})

app.get('/upload', function(req, res){
   res.render('file_upload.html');
})
/*
app.post('/upload', upload.single('file_upload2'),  function(req, res){
    //  console.log(req.file);
      console.log(req.param('comments'), req.param('title'));
    //  console.log(req.param('file'));
//      req.param('file')

      fs.readFile('./uploads/' + req.file.originalname,  function(err, data) {
        if(err) throw err;
         console.log('data' + data);
    //     res.writeHead(200, {"ContentType": "text/plain"})
    //     res.end(data);

    //db 소환
    //var sql="select file_id, file_name, user_contents from file where id=?";
    var sql="insert into file (file_name, user_contents, id) values (?,?,?)"
    var params = [req.param('title'), data, user_id];
    //console.log(user_id+"zzz");
    pool.query(sql,params, function(err, rows, fields){
        if(err)
          console.log(err);

          res.render('board.html',{_id : fileID, _name : fileName, _time : uploadTime, _user : user_id});
    });
  });
});
*/
