var express = require('express');
var app = express();


app.get('/', function(req, res){
	res.send('Hello home page');

}); //url 치고 들어오는 사용자

app.get('/login', function(req, res){
	res.send("Login please");
});

app.get('/route', function(req, res){
	res.send('hello router , <img src="/hi.png">');
});

app.get('/dynamic', function(req, res){
	var lis = '';
	for (var i=0;i<5;i++){
		lis=lis+'<li>coding</li>';
	}
	var time = Date();

	var output = `<!DOCTYPE html>
<html>
<head>
  <meta charset ='utf-8'>
</head>

<body>
  hello static!
<ui>
	${lis}
</ui>
	${time};
</body>
</html>
`;
	res.send(output);
});
app.use(express.static('public')); //public dir	을 정적인 파일이 위치하는 dir로 하겠다.

app.set('view engine', 'jade');//template engine와 express 연
app.set('views', './views');
app.locals.pretty = true; //ㅋ코드 예쁘게 만들어주기
app.get('/template', function(req, res){
	res.render('temp',{time:Date(), _title:'Jade'});
});
app.get('/topic', function(req, res){
	var topics= [
		'Javascript is ...',
		'Nodejs is ... ',
		'Express is ... '
	];
	var str=`
	<a href="/topic?id=0">JavaScript</a><br>
	<a href="/topic?id=1">JavaScript</a><br>
	<a href="/topic?id=2">JavaScript</a><br>
${topics[req.query.id]};
	`;
	var output = str+topics[req.query.id];
	res.send(output);
})




app.listen(3001, function(){
	console.log('Connected 3001 port!' );
});
