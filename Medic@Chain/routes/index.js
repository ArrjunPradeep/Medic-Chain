var express = require('express');
var router = express.Router();

// T O     R E N D E R     D O C T O R     R E G I S T R A T I O N     P A G E 
router.get('/', function(req, res, next) {
  res.render('dr_reg');
});



// T O     R E N D E R     P A T I E N T     R E G I S T R A T I O N     P A G E 
router.get('/patients_reg', function(req, res, next) {
  res.render('patient_reg');
});



// T O     R E N D E R     A D M I N     R E G I S T R A T I O N     P A G E 
router.get('/admin_reg', function(req, res, next) {
  res.render('admin_reg');
});



// T O     R E N D E R     A D D H E A L T H R E C O R D S     P A G E 
router.get('/addHealthRecords', function(req, res, next) {
  res.render('addHealthRecords');
});



// T O     R E N D E R     P A T I E N T _ A C C E S S     P A G E 
router.get('/patient_access', function(req, res, next) {
  res.render('patient_access');
});



// T O     R E N D E R     A D D D R R E C O R D S     P A G E
router.get('/setDrRecords', function(req, res, next) {
  res.render('addDrRecords');
});



// S I G N I N G     W I T H     A D M I N     I N F O
router.post('/admin_reg',function(req,res,next){
  var admin = req.body.a_adrs;
  var pswd = req.body.a_pswd;
  console.log("\n\nA D M I N     L O G I N     S U C C E S S F U L L\n\n");
  res.send({done:1,adrs:admin,message:"ADMIN LOGIN SUCCESSFULL"});
})


// S I G N I N G     W I T H     D O C T O R     I N F O
router.post('/doctor_reg',function(req,res,next){
  var doctor = req.body.d_adrs;
  var pswd = req.body.a_pswd;
  console.log("\n\nD O C T O R     L O G I N     S U C C E S S F U L L\n\n");
  res.send({done:1,dadrs:doctor,message:"DOCTOR LOGIN SUCCESSFULL"});
});



// S I G N I N G     W I T H     P A T I E N T     I N F O
router.post('/patients_reg',function(req,res,next){
  var patient = req.body.p_adrs;
  var pswd = req.body.p_pswd;
  console.log("\n\nP A T I E N T     L O G I N     S U C C E S S F U L L\n\n");
  res.send({done:1,padrs:patient,message:"PATIENT LOGIN SUCCESSFULL"});
});
 


// A D D     D O C T O R     R E C O R D S     B Y     A D M I N 
router.post('/setDrRecords', function(req, res, next) {
  var state = req.body.d_state;
  var adrs = req.body.d_adrs;
  var name = req.body.d_name;
  var admin = req.body.admin_adrs;
  console.log(admin)

  web3.eth.getAccounts().then(accList=>{
    console.log(accList);
    MyContract.methods.setDoctorDetails(JSON.parse(state),adrs,name).send({from:admin,gas:600000}).then((txn)=>{
      console.log("\n\nA D D I N G     D O C T O R     R E C O R D S     B Y     A D M I N\n\n");
      console.log(txn);
      res.send({done:1,message:"DR DETAILS ADDED"});
    }).catch(err=>{
      console.log(err);
      res.send(err);
    });
  })
});



// R E T R E I V E     D O C T O R     R E C O R D S     B Y     A D M I N
router.post('/getDrRecords', function(req, res, next) {
  var dr = req.body.d_adrs;
  var admin = req.body.adm_adrs;
  web3.eth.getAccounts().then(accList=>{
    MyContract.methods.getDoctorDetails(dr).call({from:admin}).then((results)=>{
      console.log("\n\nR E T R E I V E     D O C T O R     R E C O R D S\n\n");
      console.log(results);
      res.send({done:1,result:results});
    }).catch(err=>{
      console.log(err);
      res.send(err);
    });
  }).catch(err=>{
    console.log(err);
    res.send(err);
  })
});



// A D D     H E A L T H     R E C O R D S
router.post('/setHealthRecords', function(req, res, next) {
  let data = req.body;

  MyContract.methods.setHealthRecordsDetails(data.pa_name,data.pa_adrs,data.pre_inscrptn).send({from:data.d_adrs,gas:6283185}).then((txn)=>{
    console.log("\n\nA D D I N G     H E A L T H R E C O R D S     O F     P A T I E N T\n\n")
    console.log(txn);
    res.send({done:1,message:"HEALTH RECORDS ADDED"});
  }).catch(err=>{
    console.log(err);
    res.send(err);
  })
});


// R E T R E I V E     H E A L T H     R E C O R D S     F O R     D O C T O R S 
router.post('/getHealthRecords',function(req,res,next){
  let data = req.body; //only use GET for query
  MyContract.methods.getHealthRecordsForDoctor(data.pid).call({from:data.d_adrs}).then((result1)=>{
    console.log("\n\nR E T R E I V I N G     H E A L T H R E C O R D S     F O R     D R ."+result1._drName+"\n\n");
    console.log(result1);
    res.send({done:1,result:result1});
  }).catch(err=>{
    console.log("\n\nA C C E S S     D E N I E D\n\n");
    res.send(err);
  })
});



// R E T R E I V E     H E A L T H     R E C O R D S     F O R     P A T I E N T S
router.post('/getHealthRecordsForPatients',function(req,res,next){
  let data = req.body;
  MyContract.methods.getHealthRecords(data.did).call({from:data.p_adrs}).then((result1)=>{
    console.log("\n\nR E T R E I V I N G     H E A L T H R E C O R D S     F O R     P A T I E N T : "+result1._paName+"\n\n");
    console.log(result1);
    res.send({done:1,result:result1});
  }).catch(err=>{
    res.send(err);
  });
});



// G R A N T     A C C E S S     T O     D O C T O R
router.post('/grantAccessToDoctor',function(req,res,next){
  let data = req.body;
  MyContract.methods.grantAccessToDoctor(data.did,data.access).send({from:data.p_adrs,gas:6283185}).then((txn)=>{
    console.log("\n\nA C C E S S     G R A N T E D\n\n")
    console.log(txn);
    res.send({done:1,message:"ACCESS GRANTED"});
  }).catch(err=>{
    console.log(err);
    res.send(err);
  })
});



// R E T R E I V E     H E A L T H      R E C O R D S     H I S T O R Y     F O R     P A T I E N T S
router.post('/getHealthRecordsHistoryForPatients',function(req,res,next){
  let data = req.body; //only use GET for query
  MyContract.methods.getPatientDetails(data.p_adrs).call({from:data.p_adrs}).then((result1)=>{
    console.log("\n\nR E T R E I V I N G     H E A L T H R E C O R D S     H I S T O R Y     F O R     P A T I E N T : "+result1._paName+"\n\n");
    console.log(result1);
    res.send({done:1,result:result1});
  }).catch(err=>{
    console.log(err);
    res.send(err);
  })
});



// R E T R E I V E     H E A L T H     R E C O R D S     H I S T O R Y     F O R     D O C T O R
router.post('/getHealthRecordsHistory',function(req,res,next){
  let data = req.body; //only use GET for query
  MyContract.methods.getPatientDetails(data.pid).call({from:data.d_adrs}).then((result1)=>{
    console.log("\n\nR E T R E I V I N G     H E A L T H R E C O R D S     H I S T O R Y     F O R     P A T I E N T : "+result1._paName+"\n\n");
    console.log(result1);
    res.send({done:1,result:result1});
  }).catch(err=>{
    console.log("\n\nA C C E S S     D E N I E D\n\n");
    res.send(err);
  })
});


module.exports = router;