const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
chai.use(chaiHttp);

suite('Functional Tests', function() {
  test("Create an issue with every field: POST request",function(){
    let project="spaceX"
    chai.request(server).post("/api/issues/"+project)
    .type("form").send({
      assigned_to:"mido",
      status_text:"we still working on it",
      open:true,
      issue_title:"can some one fix my shit",
      issue_text:"i cannot log in for the last week",
      created_on:new Date(),
      updated_on:new Date()
    }).end((err,res)=>{
      err?console.log(err):console.log(res)
    })
  })
});
