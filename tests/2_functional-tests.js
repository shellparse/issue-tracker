const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
chai.use(chaiHttp);

suite('Functional Tests', function() {
  let project ="spaceX";
  test("Create an issue with every field: POST request",function(done){
    chai.request(server).post("/api/issues/"+project)
    .type("form").send({
      assigned_to:"mido",
      status_text:"we still working on it",
      open:true,
      created_by:"mizo",
      issue_title:"can some one fix my shit",
      issue_text:"i cannot log in for the last week",
      created_on:new Date(),
      updated_on:new Date()
    }).end((err,res)=>{
      if(err){
        console.log(err)
      }else{
        console.log(res.body)
        assert.equal(res.body.acknowledged,true)
      }
      done()
    })
  });
  test("Create an issue with only required fields: POST request",function(done){
    chai.request(server).post("/api/issues/"+project)
    .type("form").send({
      issue_title:"can some one fix my shit",
      issue_text:"i cannot log in for the last week",
      created_by:"mido"
    }).end((err,res)=>{
      if(err){
        console.log(err);
      }
      else{
        assert.equal(res.body.acknowledged,true);
      }
      done()
    })
  })
  test("Create an issue with missing required fields: POST request",function(done){
    chai.request(server).post("/api/issues/"+project).type("form")
    .send({
      issue_text:"i cannot log in for the last week",
      created_by:"mido"
    }).end((err,res)=>{
      if(err){
        console.log(err)
      }else{
        assert.deepEqual(res.body,{error:"required field(s) missing"})
      }
      done()
    })
  })
  test("View issues on a project: GET request",function(done){
    chai.request(server).get("/api/issues/"+project).type("form")
    .end((err,res)=>{
      if(err){
        console.log(err)
      }else{
        assert.equal(res.body.length,2);
      }
      done()
    })
  })
  test("View issues on a project with one filter: GET request",function(done){
    chai.request(server).get("/api/issues/"+project+"?open=true")
    .end((err,res)=>{
      if(err){
        console.error(err)
      }else{
        assert.equal(res.body.length,2)
      }
      done()
    })
  })
  test("View issues on a project with multiple filters: GET request to",function(done){
    chai.request(server).get("/api/issues/"+project+"?open=true&assigned_to=mido")
    .end((err,res)=>{
      if(err){
        console.error(err)
      }else{
        assert.equal(res.body.length,1)
      }
      done()
    })
  })
})
