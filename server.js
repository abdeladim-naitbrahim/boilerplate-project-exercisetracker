const express = require('express')
var dateFormat = require('dateformat')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require("body-parser");
var dns = require('dns');
mongoose=require('mongoose');
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})



process.env.MONGO_URI="mongodb+srv://bnight:8DRaVVfxQdJJQz7f@cluster0.pdoqs.mongodb.net/<dbname>?retryWrites=true&w=majority";
try{
   mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
   console.log("conect pice");
}
 catch(e)
  {
    console.log("catch3");
    console.log(e.error);
    console.log("catch4");
  }


let User;
const  {Schema}  = mongoose;
let users=[];
const userSchema  = new Schema({
  type :  String ,  
name :  String ,
log:[     {
  _id:false,
	description:String, 
	duration:Number, 
date:String}
]});
User = mongoose.model('PeUserrson', userSchema);
let data0;
async function  getuser()
  {await User.find({type:"user"}).exec((err,data)=>{
   if (err) {
   console.log("err");
        console.log(err);
        return 0;
      }
    else {
     // console.log("user array:");
      data0=data;
      //console.log(data0);
     urls= data0.map((x)=>{return {username:x.name,_id:x._id}});
	 //console.log(urls);
      return data;     
      }
      });}
 getuser();

function  saveuser(x,f)
{
	let u= new User( {type:"user",name:x});

 u.save(function(err,data) {if (err) {
   console.log("err2");
        console.log(err);}
		else
		{users.push(u);
    //console.log(u);
 f({username:x,_id:u._id,log:[]});}
		});
}
 
function  updateexe(f,id,y)
{
	console.log("y");
	console.log(y);
//let u new User( {type:"user",name:x});
User.findById(id).exec((err,data4)=>
{
let dl=data4.log[data4.log.length-1];
//console.log({_id:data4._id,username:data4.name,date:dl.date,duration:dl.duration,description:dl.description});
f		   ({_id:data4._id.toString(),username:data4.name,date:y.date,duration:y.duration,description:y.description});
console.log({_id:data4._id.toString(),username:data4.name,date:y.date,duration:y.duration,description:y.description});
console.log("sucs");
if(err)
console.log(err);
})

User.update(
{_id:id},{ $push: { log:y } },(err,data)=>
{
console.log("sucshoho");
if(err)
console.log(err);
}	
);
 //f(y);

//f()
 /*u.save(function(err,data) {if (err) {
   console.log("err2");
        console.log(err);}
		else
		{users.push(u);
    console.log(u);
 f({username:x,_id:u._id});}
		});*/
}

function  getex(id,f,from,to,limit)
{
	console.log(limit);
	console.log("log");
	console.log(id);
User.findById(id).exec((err,data4)=>
{let data5=data4.log
	let count=data5.length;
//let dl=data4.log[count-1];
let log=data5.map(x=>x);
log=log.filter(x=>(!from||new Date(from).getTime()<=new Date(x.date).getTime())&&(!to||new Date(to).getTime()>=new Date(x.date).getTime()));
if(limit)
	log=log.splice(0,limit);
f({_id:data4._id.toString(),username:data4.name,count:count,log:log});
console.log({_id:data4._id.toString(),username:data4.name,count:count,log:log});
console.log("sucs");
if(err)
console.log(err);
})

}

app.get('/api/exercise/users', function(req, res
){
	res.json(urls);
});
 
app.post('/api/exercise/new-user', function(req, res) {
saveuser( req.body.username,y=>res.json(y));
});

app.post('/api/exercise/add', function(req, res) {
	 let date0=req.body.date;
   console.log(req.body);
   console.log(date0);
   console.log("date");
	 date0=dateFormat((!date0)?new Date(Date.now()):date0, "ddd mmm dd yyyy");
 if(req.body.description&&req.body.duration&&req.body.userId)
updateexe( y=>res.json(y),req.body.userId,
{description:req.body.description,duration:parseInt(req.body.duration),date:date0});
else
	res.json({err:"full all fieled"});

});
app.get('/api/exercise/log', function(req, res
){
	getex( req.query.userId,y=>res.json(y),req.query.from,req.query.to,req.query.limit);
});






