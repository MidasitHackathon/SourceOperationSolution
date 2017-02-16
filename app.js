var express = require('express');
var app = express();
//var hell= require('/fileDB.js');
//var fileDB  = require('./models/fileDB');
//console.log(models.hello(3));
//var hi = fileDB.hello(1);
//console.log(hi.var1);
/*console.log(hi);
app.get('/', function(req, res){
	res.send('Hello home page');

});*/
//url 치고 들어오는 사용자
var fileID = ['0','1','2','3','4','5','6','7','8','9'];
var fileName =['f1','f2','f3','f1','f2','f3','f1','f2','f3'];
var uploadTime =['12:03', '14:20', '14:30','12:03', '14:20', '14:30','12:03', '14:20', '14:30'];
var userName = ['jin', 'woo', 'ahn','jin', 'woo', 'ahn','jin', 'woo', 'ahn'];
var fileContents=['c1fjsdhkfjhsdkjfhsdkjfhsdjkfhjksdhfkjsdhfjksdhfkjdshfjksdhjkfhsdjkfhsdkjfhjksdhjfjkds','c2','c3','c1','c2','c3','c1','c2','c3'];


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

	//디비로 부터 파일을 받아와서 뿌려야.
	res.render('board.html',{_id : fileID, _name : fileName, _time : uploadTime, _user : userName });
})
app.get('/history',function(req,res){
	var _fileID=req.query.id;
	//db로부터 히스토리를 읽어온다.
	var his_time=['12.4.2', '13.5.6'];
	var his_comments=['hello','shit'];

	res.render('history.html', {_times : his_time, _comments : his_comments, _id :_fileID});
})

app.get('/board_contents', function(req,res){
	cur_id = req.query.id;
	console.log(cur_id);
	//디비로 부터 파일 정보를 받아와서 뿌려
	var fileTitle=fileName[cur_id];
	var fileContent=fileContents[cur_id];
	var _fileID = fileID[cur_id];
	res.render('board_contents.html',{_id : _fileID, _title : fileTitle, _contents : fileContent});
})
app.listen(3001, function(){
	console.log('Connected 3001 port!' );
});
