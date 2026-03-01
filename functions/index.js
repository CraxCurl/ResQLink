const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");

admin.initializeApp();

const client = twilio("TWILIO_SID","TWILIO_AUTH_TOKEN");

exports.sendSOS = functions.https.onRequest(async (req,res)=>{

  const {guardian,location}=req.body;

  await client.messages.create({
    body:`🚨 EMERGENCY ALERT!\nLive Location:\n${location}`,
    from:"YOUR_TWILIO_NUMBER",
    to:guardian
  });

  res.send("SMS Sent");
});
