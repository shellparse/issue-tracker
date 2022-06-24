const schema = {
  $jsonSchema:{
    bsonType:Object,
    required:["issue_title","issue_text","created_by"],
    properties:{
        assigned_to:{
          bsonType:String,
          description:"the person to whom the issue is assigned"
        },
        status_text: {
          bsonType:String,
          description:"issue status"
        },
        open:{
          bsonType: Boolean,
          description:"boolean value of the issue status"
        },
        issue_title:{
          bsonType:String,
          description:"the title of the issue"
        },
        issue_text:{
          bsonType:String,
          description:"issue submitter"
        },
        created_on:{
          bsonType:Date,
          description:"the date the issue was submitted"
        },
        updated_on:{
          bsonType:Date,
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

    .get(function get(req, res){
      let project = req.params.project;
      let col = db.collection(project,{validator:schema});
      res.send(project);
    })
    
    .post(async function (req, res){
      let project = req.params.project;
      var col=await checkColl(project,db)
      console.log(`a request to open an issue with project ${project} has been received`);
      if(col){
      col.insertOne(req.body,(err,doc)=>{
        err?res.send(err):res.send(doc)
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
