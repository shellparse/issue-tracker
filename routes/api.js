const schema = {
  $jsonSchema:{
    bsonType:"object",
    required:["issue_title","issue_text","created_by"],
    properties:{
        assigned_to:{
          bsonType:"string",
          description:"the person to whom the issue is assigned"
        },
        status_text: {
          type:"string",
          description:"issue status"
        },
        open:{
          bsonType: "bool",
          description:"boolean value of the issue status"
        },
        issue_title:{
          bsonType:"string",
          description:"the title of the issue"
        },
        issue_text:{
          bsonType:"string",
          description:"issue submitter"
        },
        created_on:{
          bsonType:"date",
          description:"the date the issue was submitted"
        },
        updated_on:{
          bsonType:"date",
          description:"the date of issue updated at"
        }
    }
  }
}

async function checkColl(project,db) {
  let collection;
  try{
    collection= await db.createCollection(project,{validator:schema})
   }catch (e){
     if(e.code=48){
       collection=await db.collection(project);
     }else{console.error(e)}
   }
   return collection;
}

module.exports = async function  (app,client) {
  let db = await client.db("issuesDb")
//root
app.route('/')
.get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//Sample front-end
app.route('/:project/')
.get(function (req, res) {
  let col = db.collection(req.params.project,{validator:schema});
  res.sendFile(process.cwd() + '/views/issue.html');
});

  app.route('/api/issues/:project')

    .get(async function(req, res){
      let project = req.params.project;
      if(req.query){
        let issues= await db.collection(project).find({open:req.query==="true"?true:false,assigned_to:req.query?req.query:}).toArray();
        res.send(issues);
      }else{
      let issues = await db.collection(project).find().toArray()
      res.send(issues);
      }
    })
    .post(async function (req, res){
      let project = req.params.project;
      let {assigned_to="",status_text="",open="true",created_on=new Date().toDateString(),updated_on=new Date().toDateString(),created_by,issue_text,issue_title}=req.body;
      var col=await checkColl(project,db);
      if(col){
      col.insertOne({
        assigned_to:assigned_to,status_text:status_text,open:open==="true",created_on:new Date(created_on),updated_on:new Date(updated_on),created_by:created_by,issue_text:issue_text,issue_title:issue_title
      },(err,doc)=>{
        if(err){
          if(err.code==121){
            res.send({error:"required field(s) missing"})
          }
        }else{
          res.send(doc)
        }
      })
      }else{
        res.send("could'nt create collection")
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let col = db.collection(project,{validator:schema});
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let col = db.collection(project,{validator:schema});
    });  
    //404 Not Found Middleware
    app.use(function(req, res, next) {
      res.status(404)
        .type('text')
        .send('Not Found');
    });

};
