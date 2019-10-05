const json = artifacts.require("MedicalChain");
const interface = json['abi'];
const bytecode = json['bytecode'];

let accounts,MedChain,admin,doctor;



before(async()=>{
  accounts = await web3.eth.getAccounts();
  admin = accounts[0];
  MedChain = await new web3.eth.Contract(interface).deploy({data:bytecode}).send({from:admin,gas:4000000});
});


// T E S T     C A S E     T O     D E P L O Y     C O N T R A C T 
contract('MedicalChain',()=>{

  it('D E P L O Y S     A     C O N T R A C T',async()=>{
    const MedChainAddress = await MedChain.options.address;
    assert.ok(MedChainAddress,'T E S T     F A I L E D ! ! !');
  });

});



// T E S T     C A S E     T O     A D D     D O C T O R     D E T A I L S , D O N E     B Y     A D M I N 
it('D R     D E T A I L S     A D D E D     B Y      A D M I N',async()=>{
  state = true;
  dr_Id = accounts[1];
  dr_Name = "Arjun";

  try{
    await MedChain.methods.setDoctorDetails(state,dr_Id,dr_Name).send({from:admin,gas:4000000});
    RegisteredDoctorDetails = await MedChain.methods.getDoctorDetails(dr_Id).call();

    assert.equal(RegisteredDoctorDetails[0],state,"T E S T     F A I L E D ! ! !");
    assert.equal(RegisteredDoctorDetails[1],dr_Id,"T E S T     F A I L E D ! ! !");
    assert.equal(RegisteredDoctorDetails[2],dr_Name,"T E S T     F A I L E D ! ! !");
  }
  catch(err){
    assert(err);
    console.log(err);
  }

});



// T E S T     C A S E     T O     A D D     H E A L T H R E C O R D S , D O N E     B Y     D O C T O R 
it('H E A L T H     R E C O R D S     A D D E D     B Y     D O C T O R ',async()=>{
  dr_Name = "Arjun";
  dr_Id = accounts[1];
  pa_Name = "Ram";
  pa_Id = accounts[2];
  prescription = "EXPLORE";
  records = ["EXPLORE"];
  access = 1;


  try{
    await MedChain.methods.setHealthRecordsDetails(pa_Name,pa_Id,prescription).send({from:dr_Id,gas:4000000});
  }
  catch(err){
    assert(err);
    console.log(err);
  }

});



// T E S T     C A S E     T O     A D D     P A T I E N T     D E T A I L S , D O N E     B Y     D O C T O R 
it('P A T I E N T     D E T A I L S     A D D E D     B Y     D O C T O R',async()=>{
  try{
    await MedChain.methods.setPatientDetails(state,pa_Id,pa_Name,records).send({from:accounts[1],gas:4000000});
    RegisteredPatientRecords = await MedChain.methods.getPatientDetails(pa_Id).call({from:pa_Id});

    assert.equal(RegisteredPatientRecords[0],state,"T E S T     F A I L E D ! ! !");
    assert.equal(RegisteredPatientRecords[1],pa_Id,"T E S T     F A I L E D ! ! !");
    assert.equal(RegisteredPatientRecords[2],pa_Name,"T E S T     F A I L E D ! ! !");
    assert.equal(RegisteredPatientRecords[3],records[0],"T E S T     F A I L E D ! ! !");
  }
  catch(err){
    assert(err);
    console.log(err);
  }

});



// T E S T     C A S E     T O     R E T R E I V E     H E A L T H R E C O R D S     O N L Y     F O R     P A T I E N T S
it('R E T R E I V E     H E A L T H     R E C O R D S     O N L Y     F O R     P A T I E N T S',async()=>{

  try{    
    RegisteredHealthRecords = await MedChain.methods.getHealthRecords(dr_Id).call({from:pa_Id});

    assert.equal(RegisteredHealthRecords[0],dr_Name,"T E S T     F A I L E D ! ! !");
    assert.equal(RegisteredHealthRecords[1],dr_Id,"T E S T     F A I L E D ! ! !");
    assert.equal(RegisteredHealthRecords[2],pa_Name,"T E S T     F A I L E D ! ! !");
    assert.equal(RegisteredHealthRecords[3],pa_Id,"T E S T     F A I L E D ! ! !");
    assert.equal(RegisteredHealthRecords[4],prescription,"T E S T     F A I L E D ! ! !"); 
    assert.equal(RegisteredHealthRecords[5],records[0],"T E S T     F A I L E D ! ! !");
  }
  catch(err){
    assert(err);
    console.log(err);
  }

});



// T E S T     C A S E     T O     G R A N T     A C C E S S     T O     D O C T O R 
it('A C C E S S     G R A N T E D     T O     D O C T O R',async()=>{
  try{
    await MedChain.methods.grantAccessToDoctor(dr_Id,access).send({from:pa_Id,gas:4000000});    
  }
  catch(err){
    assert(err);
    console.log(err);
  }

});



// T E S T     C A S E     T O     R E T R E I V E     H E A L T H R E C O R D S     O N L Y     F O R     D O C T O R S 
it('R E T R E I V E     H E A L T H     R E C O R D S     O N L Y     F O R     D O C T O R',async()=>{

  try{
    RegisteredHealthRecords = await MedChain.methods.getHealthRecordsForDoctor(pa_Id).call({from:dr_Id});

    assert.equal(RegisteredHealthRecords[0],dr_Name,"T E S T     F A I L E D ! ! !");
    assert.equal(RegisteredHealthRecords[1],dr_Id,"T E S T     F A I L E D ! ! !");
    assert.equal(RegisteredHealthRecords[2],pa_Name,"T E S T     F A I L E D ! ! !");
    assert.equal(RegisteredHealthRecords[3],pa_Id,"T E S T     F A I L E D ! ! !");
    assert.equal(RegisteredHealthRecords[4],prescription,"T E S T     F A I L E D ! ! !");
    assert.equal(RegisteredHealthRecords[5],records[0],"T E S T     F A I L E D ! ! !");
  }
  catch(err){
    assert(err);
    console.log(err);
  }

});
