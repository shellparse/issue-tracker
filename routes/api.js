'use strict';

module.exports = function (app,client) {
  //data base validations
  let db = client.db("issuesDb",{validator:{
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
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      console.log(`a request to open an issue with project ${project} has been received`);
      db.insertOne(req.body,(err,doc)=>{
        err?console.error(err):console.log("success")
      })
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
