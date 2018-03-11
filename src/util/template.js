const Template = {};

Template.linkExpiredTemplate = createLinkExpiredTemplate;
Template.activeAccountFailTemplate = createActiveAccountFailTemplate;
Template.activeAccountSuccessTemplate = createActiveAccountSuccessTemplate;
Template.activeAccountTemplate = createActiveAccountTemple;

module.exports = Template;

function createActiveAccountTemple(linkActivate) {
  return `<html>
<body>
  <div>
    <h2 style="color: #2e6c80; text-align: left;">Thanks for registering, please click this button below to activate your account.</h2>
  </div>
  <div>
    <!-- [if mso]>
  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${linkActivate}" style="height:40px;v-text-anchor:middle;width:300px;" arcsize="10%" stroke="f" fillcolor="#d62828">
    <w:anchorlock/>
    <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:bold;">
      Button Text Here!
    </center>
  </v:roundrect>
  <![endif]-->
  &lt;![if !mso]&gt;
    <table cellspacing="0" cellpadding="0">
      <tbody>
        <tr>
          <td style="-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; color: #ffffff; display: block;" align="center" bgcolor="#d62828" width="300" height="40"><a style="font-size: 16px; font-weight: bold; font-family: sans-serif; text-decoration: none; line-height: 40px; width: 100%; display: inline-block;" href="${linkActivate}"> <span style="color: #ffffff;"> Click here to activate account</span> </a></td>
        </tr>
      </tbody>
    </table>
    &lt;![endif]&gt;</div>
  <div>
    Sent by ODauDay
  </div>
</body>
</html>`
}

function createLinkExpiredTemplate(linkResend) {
  return `
<html>
<head>
  <title>Link has been expired</title>
  <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css">
</head>

<body>
  <div class="jumbotron text-xs-center">
    <h1 class="display-3">Link has been expired</h1>
    <a class="btn btn-warning" href="${linkResend}" id="resend_link">Click here to resend the activation email</a>
  </div>
</body>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js"></script>
</html>`;
}

function createActiveAccountFailTemplate(linkResend){
  return `
<html>
<head>
  <title>Failure</title>
  <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css">
</head>
<div class="jumbotron text-xs-center">
  <h1 class="display-3">Failure</h1>
  <p class="lead"><strong>Token is invalid</p>
   <a class="btn btn-warning" href="${linkResend}" id="resend_link">Click here to resend the activation email</a>
  <hr>
</div>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js"></script>
</html>`;
}

function createActiveAccountSuccessTemplate(){
  return `
<html>
<head>
  <title>Thanks you</title>
  <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css">
</head>
<div class="jumbotron text-xs-center">
  <h1 class="display-3">Thank You!</h1>
  <p class="lead"><strong>Your account is activated successfully</p>
  <hr>
</div>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js"></script>
</html>`;
}