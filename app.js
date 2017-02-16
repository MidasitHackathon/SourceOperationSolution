var express = require('express');
var app = express();


app.get('/', function(req, res){
	res.send('Hello home page');

}); //url 치고 들어오는 사용자
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


app.listen(3001, function(){
	console.log('Connected 3001 port!' );
});
