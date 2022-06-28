const {ObjectId} = require("mongodb");
const schema = {
  $jsonSchema:{
    bsonType:"object",
    required:["issue_title","issue_text","created_by"],
    properties:{
        created_by:{
          bsonType:"string",
          description:"who submitted the issue"
        },
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
          description:"issue description"
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
      let query = {}
      if(req.query.open){query.open=req.query.open==="false"?false:true}
      if(req.query.assigned_to){query.assigned_to=req.query.assigned_to}
      if(req.query.issue_text){query.issue_text=req.query.issue_text}
      if(req.query.issue_title){query.issue_title=req.query.issue_title}
      if(req.query.status_text){query.status_text=req.query.status_text}
      if(req.query.created_by){query.created_by=req.query.created_by}
      if(req.query.created_on){query.created_on=new Date(req.query.created_on)}
      if(req.query.updated_on){query.updated_on=new Date(req.query.updated_on)}
      let issues= await db.collection(project).find(query).toArray();
      res.send(issues);
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
          if(doc.acknowledged===true){
          res.send({...req.body,_id:doc.insertedId})
          }else{
            res.send({error:"document to inserted"})
          }
        }
      })
      }else{
        res.send({error:"could'nt create collection"})
      }
    })
    
    .put(async function (req, res){
      let project = req.params.project;
      let update_with={}
      if(req.query.open){update_with.open=req.query.open==="false"?false:true}
      if(req.query.assigned_to){update_with.assigned_to=req.query.assigned_to}
      if(req.query.issue_text){update_with.issue_text=req.query.issue_text}
      if(req.query.issue_title){update_with.issue_title=req.query.issue_title}
      if(req.query.status_text){update_with.status_text=req.query.status_text}
      if(req.query.created_by){update_with.created_by=req.query.created_by}
      if(req.query.created_on){update_with.created_on=new Date(req.query.created_on)}
      if(req.query.updated_on){update_with.updated_on=new Date(req.query.updated_on)}
      if(req.body._id){
        if(Object.keys(update_with).length>0){
      let col = await db.collection(project).findOneAndUpdate({_id:ObjectId(req.body._id)},{$set:update_with},{returnDocument:"after"});
      if(col){
        res.send(col)
      }else{
        res.send({error:"could'nt update with id "+req.body._id})
      }
    }else{
      res.send({error:"no update field(s) sent"})
    }
    }else{
      res.send({error:"missing _id"})
    }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });  
    //404 Not Found Middleware
    app.use(function(req, res, next) {
      res.status(404)
        .type('text')
        .send('Not Found');
    });

};
