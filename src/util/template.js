const Template = {};

Template.linkExpiredTemplate = createLinkExpiredTemplate;

Template.activeAccountFailTemplate = createActiveAccountFailTemplate;
Template.activeAccountSuccessTemplate = createActiveAccountSuccessTemplate;

Template.confirmPasswordTemplate = createConfirmPasswordTemplate;
Template.confirmPasswordSuccessTemplate = createConfirmPasswordSuccessTemplate;
Template.cofirmPasswordFailTemplate = createCofirmPasswordFailTemplate;

Template.forgotPasswordMailTemplate = createForgotPasswordMailTemplate;

Template.activeAccountMailTemplate = createActiveAccountMailTemplate;
Template.activedAccountMailTemplate = createActivedAccountMailTemplate;
Template.createFavoriteShareToEmail=createFavoriteShareToEmail;

module.exports = Template;

function createMailTemplate(link, title, buttonText) {
  return `<html>
<body>
  <div>
    <h2 style="color: #2e6c80; text-align: left;">${title}</h2>
  </div>
  <div>
    <table cellspacing="0" cellpadding="0">
      <tbody>
        <tr>
          <td style="-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; color: #ffffff; display: block;" align="center" bgcolor="#d62828" width="300" height="40"><a style="font-size: 16px; font-weight: bold; font-family: sans-serif; text-decoration: none; line-height: 40px; width: 100%; display: inline-block;" href="${link}"> <span style="color: #ffffff;">${buttonText}</span> </a></td>
        </tr>
      </tbody>
    </table>
  <div>
    Sent by ODauDay
  </div>
</body>
</html>`;
}

function createActivedAccountMailTemplate() {
  return `<html>
<body>
  <div>
    <h2 style="color: #2e6c80; text-align: left;">Your account is activated successfully</h2>
  </div>
    Sent by ODauDay
  </div>
</body>
</html>`;
}

function craeteHtmlWithoutForm(title, message) {
  return `
<html>
<head>
  <title>${title}</title>
  <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css">
</head>
<div class="jumbotron text-xs-center">
  <h1 class="display-3">${title}</h1>
  <p class="lead"><strong>${message}</p>
  <hr>
</div>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js"></script>
</html>`;
}

function createHtmlWithForm(link, title, message) {
  return `
<html>
<head>
  <title>${title}</title>
  <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css">
</head>

<body>
  <div class="jumbotron text-xs-center">
    <h1 class="display-3">${message}</h1>
  <form action = "${link}" method = "post">
    <button class="btn btn-warning"  type="submit" id="resend_link"></button>
  </form>
  </div>
</body>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js"></script>
</html>`;
}

function createActiveAccountMailTemplate(linkActivate) {
  return createMailTemplate(linkActivate,
    'Thanks for registering, please click this button below to activate your account.',
    'Click here to activate account');
}

function createForgotPasswordMailTemplate(link) {
  return createMailTemplate(link,
    'Change password',
    'Click here to change password');
}

function createLinkExpiredTemplate(linkResend) {
  return createHtmlWithForm(linkResend, 'Link has been expired', 'Link has been expired');
}

function createActiveAccountFailTemplate(linkResend) {
  return createHtmlWithForm(linkResend, 'Failure', 'Token is invalid');
}

function createActiveAccountSuccessTemplate() {
  return craeteHtmlWithoutForm('Thanks you', 'Your account is activated successfully');
}


function createConfirmPasswordSuccessTemplate() {
  return craeteHtmlWithoutForm('Thanks you', 'Your password has been changed successfully!');
}

function createCofirmPasswordFailTemplate() {
  return craeteHtmlWithoutForm('Failure', 'Your password has been changed failure!');
}

function createConfirmPasswordTemplate(linkConfirmPassword) {
  return `
<html>
<head>
  <title>Change Password</title>
  <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css">
</head>
<div>
  <div class="jumbotron text-xs-center">
    <h1 class="display-3">Change password</h1>
    <form class="form-horizontal" method="post" action="${linkConfirmPassword}">
      <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4">
          <div class="form-group">
            <div class="input-group mb-2 mr-sm-2 mb-sm-0">
              <input type="password" name="password" class="form-control" id="password" placeholder="Password" required autofocus>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4">
          <div class="form-group">
            <div class="input-group mb-2 mr-sm-2 mb-sm-0">
              <input type="password" name="confirmPassword" class="form-control" id="confirmPassword" placeholder="Confirm Password" required>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <button type="submit" class="btn btn-success">SUBMIT</button>
      </div>
    </form>
    <hr />
  </div>
</div>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js"></script>
<script type="text/javascript">
var password = document.getElementById("password"),
  confirm_password = document.getElementById("confirmPassword");
function validatePassword() {

  if (password.value.length < 6) {
    password.setCustomValidity('Password must be at least 6 characters in length');
  }

  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}
password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;
</script>
</html>`
}

function createFavoriteShareToEmail(data){

  let header=`<html>
  <head>
    <title>Property Shortlist</title>
  </head>
  <style type="text/css">
    b {
      font-weight: bold;
    }
  </style>
  
  <body>
    <div style="width: 350px">
      <div style="height: 70px; width: 350px; background: #4BA000; margin-top: 10px">
        <h1 style="color: white; padding-top: 15px; padding-left: 10px; font-family: 'Aclonica'">ODauDay</h1>
      </div>
      <div style="margin-top: 20px; width: 100%;">
        <p>Hi there,</p>
        <p>There are
          <b>${data.properties.length} properties</b> listed in
          <b>${data.name}'s</b> property shortlist.</p>
      </div>
      <div style="height: 40px; width: 350px; background: #4BA000; margin-top: 20px;">
        <h4 style="color: white; padding-top: 10px; padding-left: 10px;">Property ShortList</h4>
      </div>`
    let body=createItemFavorite(data.properties);
    let footer= `</div>
    </body>
    </html>`

  let result=header+body+footer;

  return result;
}
function createItemFavorite(properties){
    let data="";
    properties.forEach(function(property) {
       data+= `<div >
       <div >
         <div >
             <h4>${property.name}</h4>
         </div>
       </div>
       <div >
               <img src="${property.images[0].url}" width="350" height="300" >

               <div>
                     <div style="width: 45%">
                         <b>Description: </b>${property.description}
                     </div>
                      <div>
                       <b>Price: </b>${property.price} đ
                       <br>
                       <b>Land size: </b>${property.land_size} m2
                       <br>
                       <b>Type: </b>${property.type_id}</p> </br>
                       <a href="https://www.google.com/maps/?q=${property.latitude},${property.longitude}">View map</a>
                     </div>
                     <div>
                       <button style="background: #5CB82E; color: white; margin-top: 20px">View Details</button>
                     </div>
               </div>
       </div>
   </div>`
      
    });

    return data;
}