

module.exports = async function  (app,client) {
  let db = await client.db("issuesDb",{validator:{
    $jsonSchema:{
      bsonType:"object",
      required:["issue_title","issue_text","created_by"],
      properties:{
          assigned_to:{
            bsonType:"string",
            description:"the person to whom the issue is assigned"
          },
          status_text: {
            bsonType:"string",
            description:"issue status"
          },
          open:{
            bsonType:"boolean",
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
  
})
//root
app.route('/')
.get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//Sample front-end
app.route('/:project/')
.get(function (req, res) {
  let col = db.collection(req.params.project);
  res.sendFile(process.cwd() + '/views/issue.html');
});

  app.route('/api/issues/:project')

    .get(function get(req, res){
      let project = req.params.project;
      let col = db.collection(project);
      res.send(project);
    })
    
    .post(async function (req, res){
      let project = req.params.project;
      let col = db.collection(project);
      console.log(`a request to open an issue with project ${project} has been received`);
      col.insertOne(req.body,(err,doc)=>{
        err?console.error(err):res.send(doc)
      })
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let col = db.collection(project);
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let col = db.collection(project);
    });  
    //404 Not Found Middleware
    app.use(function(req, res, next) {
      res.status(404)
        .type('text')
        .send('Not Found');
    });

};
