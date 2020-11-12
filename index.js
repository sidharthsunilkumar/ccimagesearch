const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
console.log(__dirname);
app.use('/imgs', express.static(__dirname+'/views/public') );
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Item = require('./models/Item');

func=(i)=>{
	console.log(i);
	var arr=[];
	var l=i.items;
	var q;
	for(q=0;q<l.length;q++){
		arr.push({name:l[q].name});
	}
	return {items:arr};
}

searchfunc=(i,s)=>{
	console.log({name:s});
	var srr=[];
	var l=i.items;
	var p;
	if(s==''){
		for(p=0;p<l.length;p++){
			if(l[p].category!='0'){
				srr.push({name:l[p].name});
			}
		}
		if(srr.length==0){
			return {items:[{name:'None'}]};
		}
		else{
			return {items:srr};
		}
	}
	else{	//actual searching
		
		//remove last ;
		if(s[s.length-1]==';'){
			s=s.substring(0,s.length-1);
		}
		//remove spaces
		s=s.replace(/ /g,"");
		
		for(p=0;p<l.length;p++){
			var k=0;
			var lst=s.split(";");
			var i=0;
			for(i=0;i<lst.length;i++){
				var li=lst[i].split(":");
				var a=li[0];
				var b=li[1].split(",");
				
				if(a=='iso'){
					var y=0;
					var j=0;
					for(j=0;j<b.length;j++){
						if(b[j]==l[p].iso){
							y=1;
						}
					}
					if(y==1){
						k+=1;
					}
				}
				else if(a=='resolution'){
					var y=0;
					var j=0;
					for(j=0;j<b.length;j++){
						if(b[j]==l[p].resolution){
							y=1;
						}
					}
					if(y==1){
						k+=1;
					}
				}
				else if(a=='category'){
					var y=0;
					var j=0;
					for(j=0;j<b.length;j++){
						if(b[j]==l[p].category){
							y=1;
						}
					}
					if(y==1){
						k+=1;
					}
				}
			}		
			if(k==lst.length){
				srr.push({name:l[p].name});
			}
		}
		if(srr.length==0){
			return {items:[{name:'imgs/none.jpg'}]};
		}
		else{
			return {items:srr};
		}		
	}
}

app.get('/', (req, res) => {
  res.render('login');
});

app.post('/',(req,res) => {
	if(req.body.uname=='guest' && req.body.pass=='guest'){
		res.redirect('/main');
	}
	else{
		res.render('login');
	}
	
});


app.get('/main/', (req, res) => {
  Item.find()
    .then(items => res.render('index', func({items}) ))
    .catch(err => res.status(404).json({ msg: 'No items found' }));
});

app.get('/addimage', (req, res) => {
  res.render('addimage');
});

app.post('/main/',(req,res) => {
	Item.find()
    		.then(items => res.render('index', searchfunc({items},req.body.search) ))
    		.catch(err => res.status(404).json({ msg: 'No items found' }));	
	
});


app.post('/item/add', (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    iso: req.body.iso,
    resolution: req.body.resolution,
    category: req.body.category,
    location: req.body.location
  });
  
  console.log(newItem);

  newItem.save().then(item => res.redirect('/main'));
});


const port = 3000;

app.listen(port, () => console.log('Server running...'));
