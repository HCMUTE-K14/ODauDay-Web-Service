var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

const NotificationUtils={};
NotificationUtils.sendNotification=sendNotification;
module.exports=NotificationUtils;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://odauday-b996.firebaseio.com"
});

var options={
  priority:"high",
  timeToLive:60*60*24
};

function sendNotification(registrationToken,payload){
    admin.messaging().sendToDevice(registrationToken,payload,options)
    .then(function(respone){
      console.log("Successfully sent message: ",respone)
    })
    .catch(function(error){
      console.log("Error sent message: ",error)
    });
}