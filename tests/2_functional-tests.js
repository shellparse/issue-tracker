const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
chai.use(chaiHttp);
var issue_to_edit="";

suite('Functional Tests', function() {
  let project ="spaceX";
  test("Create an issue with every field: POST request",function(done){
    let to_send= {
      assigned_to:"mido",
      status_text:"we still working on it",
      open:true,
      created_by:"mizo",
      issue_title:"can some one fix my shit",
      issue_text:"i cannot log in for the last week",
      created_on:new Date(),
      updated_on:new Date()
    }
    chai.request(server).post("/api/issues/"+project)
    .type("form").send(to_send).end((err,res)=>{
      if(err){
        console.log(err)
      }else{
        assert.nestedInclude(res.body,{
          assigned_to:"mido",
          status_text:"we still working on it",
          open:true,
          created_by:"mizo",
          issue_title:"can some one fix my shit",
          issue_text:"i cannot log in for the last week",
          created_on:to_send.created_on.toISOString(),
          updated_on:to_send.updated_on.toISOString()
        })
        assert.isNumber(Date.parse(res.body.created_on));
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
        assert.nestedInclude(res.body,{issue_title:"can some one fix my shit",
        issue_text:"i cannot log in for the last week",
        created_by:"mido"});
        assert.property(res.body, 'created_on');
        assert.isNumber(Date.parse(res.body.created_on));
        assert.property(res.body, 'updated_on');
        assert.isNumber(Date.parse(res.body.updated_on));
        assert.property(res.body, 'open');
        assert.isBoolean(res.body.open);
        assert.isTrue(res.body.open);
        assert.property(res.body, '_id');
        assert.isNotEmpty(res.body._id);
        assert.property(res.body, 'status_text');
        assert.isEmpty(res.body.status_text);
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
    chai.request(server).get("/api/issues/"+project)
    .end((err,res)=>{
      if(err){
        console.log(err)
      }else{
        if(res.body[0]._id){
          issue_to_edit=res.body[0]._id;
        }
        assert.equal(res.body.length,2);
      }
      done()
    })
  })
  test("View issues on a project with one filter: GET request",function(done){
    chai.request(server).get("/api/issues/"+project).query({open:true})
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
    chai.request(server).get("/api/issues/"+project).query({open:true,assigned_to:"mido"})
    .end((err,res)=>{
      if(err){
        console.error(err)
      }else{
        assert.equal(res.body.length,1)
      }
      done()
    })
  })
  test("Update one field on an issue: PUT request to",function(done){
    if(issue_to_edit){
    chai.request(server).put("/api/issues/"+project).type("form")
    .send({_id:issue_to_edit,issue_text:"new issue text"}).end((err,res)=>{
      if(err){console.error(err)}else{
        assert.deepEqual(res.body, {result:'successfully updated',_id: issue_to_edit});
      }
    })
    }else{
      console.error("test body not provided in the test ")
      assert.typeOf(issue_to_edit,"string");
    }
    done()
  })
  test("Update multiple fields on an issue: PUT request",function(done){
    chai.request(server).put("/api/issues/"+project).type("form")
    .send({_id:issue_to_edit,open:true,assigned_to:"new person"}).end((err,res)=>{
      if(err){
        console.error(err);
      }else{
        assert.equal(res.body._id,issue_to_edit)
      }
    })
    done()
  })
  test("Update an issue with missing _id",function(done){
    chai.request(server).put("/api/issues/"+project).send({}).end((err,res)=>{
      if(err){
        console.error(err);
      }else{
        assert.deepEqual(res.body,{error:"missing _id"})
      }
    })
    done();
  })
  test("Update an issue with no fields to update",function(done){
    chai.request(server).put("/api/issues/"+project).type("form").send({_id:"5f665eb46e296f6b9b6a504d"}).end((err,res)=>{
      if(err){
        console.error(err)
      }else{
        assert.deepEqual(res.body,{error: "no update field(s) sent",_id: "5f665eb46e296f6b9b6a504d"})

      }
    })
    done();
  })
  test("Update an issue with an invalid id",function(done){
    chai.request(server).put("/api/issues/"+project).type("form").send({_id:"5f665eb46e296f6b9b6a504d",issue_text:"new issue text"}).end((err,res)=>{
      if(err){
        console.error(err);
      }else{
        assert.deepEqual(res.body, {
          error: 'could not update',
          _id: '5f665eb46e296f6b9b6a504d'
        });
      }
    })
    done();
  })
  test("a get request with id as a query param will return the document",function(done){
    chai.request(server).get("/api/issues/"+project).query({_id:issue_to_edit}).end((err,res)=>{
      if(err){
        console.error(err)
      }else{
        assert.isArray(res.body);
        assert.isObject(res.body[0]);
      }
    })
    done();
  })
  test("Delete an issue: DELETE request ",function(done){
    chai.request(server).delete("/api/issues/"+project).send({_id:issue_to_edit}).end((err,res)=>{
      if (err){
        console.error(err);
      }else{
        assert.isObject(res.body);
    assert.deepEqual(res.body, {
      result: 'successfully deleted',
      _id: issue_to_edit
    })
      }
    })
    done();
  })
  test("Delete an issue with missing _id: DELETE request",function(done){
    chai.request(server).delete("/api/issues/"+project).send({}).end((err,res)=>{
      if(err){
        console.error(err);
      }else{
        assert.isObject(res.body);
        assert.deepEqual(res.body, { error: 'missing _id' });
      }
    })
    done();
  })
  test("Delete an issue with an invalid _id: DELETE request",function(done){
    chai.request(server).delete("/api/issues/"+project).send({_id:"5sdfg4sdr545sdf5g5x"}).end((err,res)=>{
      if(err){
        console.error(err);
      }else{
        assert.isObject(res.body);
    assert.deepEqual(res.body, {
      error: 'could not delete',
      _id: '5sdfg4sdr545sdf5g5x'
    });
      }
    })
    done();
  })
})
