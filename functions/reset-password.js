function passEmail (link) {
  return (
    `<!doctype html>
    <html xmlns='http://www.w3.org/1999/xhtml' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'>
      <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <style type='text/css'>
          p{
          margin:10px 0;
          padding:0;
          }
          table{
          border-collapse:collapse;
          }
          h1,h2,h3,h4,h5,h6{
          display:block;
          margin:0;
          padding:0;
          }
          img,a img{
          border:0;
          height:auto;
          outline:none;
          text-decoration:none;
          }
          body,#bodyTable,#bodyCell{
          height:100%;
          margin:0;
          padding:0;
          width:100%;
          }
          .mcnPreviewText{
          display:none !important;
          }
          #outlook a{
          padding:0;
          }
          img{
          -ms-interpolation-mode:bicubic;
          }
          table{
          mso-table-lspace:0pt;
          mso-table-rspace:0pt;
          }
          .ReadMsgBody{
          width:100%;
          }
          .ExternalClass{
          width:100%;
          }
          p,a,li,td,blockquote{
          mso-line-height-rule:exactly;
          }
          a[href^=tel],a[href^=sms]{
          color:inherit;
          cursor:default;
          text-decoration:none;
          }
          p,a,li,td,body,table,blockquote{
          -ms-text-size-adjust:100%;
          -webkit-text-size-adjust:100%;
          }
          .ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{
          line-height:100%;
          }
          a[x-apple-data-detectors]{
          color:inherit !important;
          text-decoration:none !important;
          font-size:inherit !important;
          font-family:inherit !important;
          font-weight:inherit !important;
          line-height:inherit !important;
          }
          #bodyCell{
          padding:10px;
          }
          .templateContainer{
          max-width:600px !important;
          }
          a.mcnButton{
          display:block;
          }
          .mcnImage,.mcnRetinaImage{
          vertical-align:bottom;
          }
          .mcnTextContent{
          word-break:break-word;
          }
          .mcnTextContent img{
          height:auto !important;
          }
          .mcnDividerBlock{
          table-layout:fixed !important;
          }
          body,#bodyTable{
          background-color:#ffffff;
          }
          #bodyCell{
          border-top:0;
          }
          .templateContainer{
          border:0;
          }
          h1{
          color:#202020;
          font-family:Helvetica;
          font-size:26px;
          font-style:normal;
          font-weight:bold;
          line-height:125%;
          letter-spacing:normal;
          text-align:left;
          }
          h2{
          color:#202020;
          font-family:Helvetica;
          font-size:22px;
          font-style:normal;
          font-weight:bold;
          line-height:125%;
          letter-spacing:normal;
          text-align:left;
          }
          h3{
          color:#202020;
          font-family:Helvetica;
          font-size:20px;
          font-style:normal;
          font-weight:bold;
          line-height:125%;
          letter-spacing:normal;
          text-align:left;
          }
          h4{
          color:#202020;
          font-family:Helvetica;
          font-size:18px;
          font-style:normal;
          font-weight:bold;
          line-height:125%;
          letter-spacing:normal;
          text-align:left;
          }
          #templatePreheader{
          background-color:#ffffff;
          background-image:none;
          background-repeat:no-repeat;
          background-position:center;
          background-size:cover;
          border-top:0;
          border-bottom:0;
          padding-top:9px;
          padding-bottom:9px;
          }
          #templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{
          color:#282828;
          font-family: Helvetica;
          font-size: 12px;
          line-height: 150%;
          text-align: left
          }
          #templatePreheader .mcnTextContent a,#templatePreheader .mcnTextContent p a{
          color:#282828;
          font-weight:normal;
          text-decoration:none;
          }
          #templateHeader{
          background-color:#ffffff;
          background-image:none;
          background-repeat:no-repeat;
          background-position:center;
          background-size:cover;
          border-top:0;
          border-bottom:0;
          padding-top:9px;
          padding-bottom:0;
          }
          #templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{
          color:#282828;
          font-family:Helvetica;
          font-size:16px;
          line-height:150%;
          text-align:left;
          }
          #templateHeader .mcnTextContent a,#templateHeader .mcnTextContent p a{
          color:#282828;
          font-weight:normal;
          text-decoration:none;
          }
          #templateBody{
          background-color:#ffffff;
          background-image:none;
          background-repeat:no-repeat;
          background-position:center;
          background-size:cover;
          border-top:0;
          border-bottom:2px solid #EAEAEA;
          padding-top:0;
          padding-bottom:9px;
          }
          #templateBody .mcnTextContent,#templateBody .mcnTextContent p{
          color:#282828;
          font-family:Helvetica;
          font-size:16px;
          line-height:150%;
          text-align:left;
          }
          #templateBody .mcnTextContent a,#templateBody .mcnTextContent p a{
          color:#282828;
          font-weight:normal;
          text-decoration:underline;
          }
          #templateFooter{
          background-color:#ffffff;
          background-image:none;
          background-repeat:no-repeat;
          background-position:center;
          background-size:cover;
          border-top:0;
          border-bottom:0;
          padding-top:9px;
          padding-bottom:9px;
          }
          #templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{
          color:#282828;
          font-family:Helvetica;
          font-size:14px;
          line-height:150%;
          text-align:center;
          }
          #templateFooter .mcnTextContent a,#templateFooter .mcnTextContent p a{
          color:#282828;
          font-weight:normal;
          text-decoration:underline;
          }
          @media only screen and (min-width:768px){
          .templateContainer{
          width:600px !important;
          }
          }@media only screen and (max-width: 480px){
          body,table,td,p,a,li,blockquote{
          -webkit-text-size-adjust:none !important;
          }
          }@media only screen and (max-width: 480px){
          body{
          width:100% !important;
          min-width:100% !important;
          }
          }@media only screen and (max-width: 480px){
          #bodyCell{
          padding-top:10px !important;
          }
          }@media only screen and (max-width: 480px){
          .mcnRetinaImage{
          max-width:100% !important;
          }
          }@media only screen and (max-width: 480px){
          .mcnImage{
          width:100% !important;
          }
          }@media only screen and (max-width: 480px){
          .mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardRightImageContentContainer{
          max-width:100% !important;
          width:100% !important;
          }
          }@media only screen and (max-width: 480px){
          .mcnBoxedTextContentContainer{
          min-width:100% !important;
          }
          }@media only screen and (max-width: 480px){
          .mcnImageGroupContent{
          padding:9px !important;
          }
          }@media only screen and (max-width: 480px){
          .mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{
          padding-top:9px !important;
          }
          }@media only screen and (max-width: 480px){
          .mcnImageCardTopImageContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{
          padding-top:18px !important;
          }
          }@media only screen and (max-width: 480px){
          .mcnImageCardBottomImageContent{
          padding-bottom:9px !important;
          }
          }@media only screen and (max-width: 480px){
          .mcnImageGroupBlockInner{
          padding-top:0 !important;
          padding-bottom:0 !important;
          }
          }@media only screen and (max-width: 480px){
          .mcnImageGroupBlockOuter{
          padding-top:9px !important;
          padding-bottom:9px !important;
          }
          }@media only screen and (max-width: 480px){
          .mcnTextContent,.mcnBoxedTextContentColumn{
          padding-right:18px !important;
          padding-left:18px !important;
          }
          }@media only screen and (max-width: 480px){
          .mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{
          padding-right:18px !important;
          padding-bottom:0 !important;
          padding-left:18px !important;
          }
          }@media only screen and (max-width: 480px){
          .mcpreview-image-uploader{
          display:none !important;
          width:100% !important;
          }
          }@media only screen and (max-width: 480px){
          h1{
          font-size:22px !important;
          line-height:125% !important;
          }
          }@media only screen and (max-width: 480px){
          h2{
          font-size:20px !important;
          line-height:125% !important;
          }
          }@media only screen and (max-width: 480px){
          h3{
          font-size:18px !important;
          line-height:125% !important;
          }
          }@media only screen and (max-width: 480px){
          h4{
          font-size:16px !important;
          line-height:150% !important;
          }
          }@media only screen and (max-width: 480px){
          .mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{
          font-size:14px !important;
          line-height:150% !important;
          }
          }@media only screen and (max-width: 480px){
          #templatePreheader{
          display:block !important;
          }
          }@media only screen and (max-width: 480px){
          #templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{
          font-size:14px !important;
          line-height:150% !important;
          }
          }@media only screen and (max-width: 480px){
          #templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{
          font-size:16px !important;
          line-height:150% !important;
          }
          }@media only screen and (max-width: 480px){
          #templateBody .mcnTextContent,#templateBody .mcnTextContent p{
          font-size:16px !important;
          line-height:150% !important;
          }
          }@media only screen and (max-width: 480px){
          #templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{
          font-size:14px !important;
          line-height:150% !important;
          }
          }
        </style>
      </head>
      <body style='height: 100%;margin: 0;padding: 0;width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #ffffff;'>
        <center>
          <table align='center' border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable' style='border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;height: 100%;margin: 0;padding: 0;width: 100%;background-color: #ffffff;'>
          <tr>
            <td align='center' valign='top' id='bodyCell' style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;height: 100%;margin: 0;padding: 10px;width: 100%;border-top: 0;'>
              <table border='0' cellpadding='0' cellspacing='0' width='100%' class='templateContainer' style='border-collapse:collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust: 100%;border: 0;max-width: 600px !important;      '>
                <tr>
                  <td valign='top' id='templateHeader' style='background:#ffffff none no-repeat center/cover;mso-line-height-rule:exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #ffffff;background-image: none;background-repeat: no-repeat;background-position: center;background-size: cover;border-top: 0;border-bottom: 0;padding-top: 9px;padding-bottom: 0;'>
                    <table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnImageBlock' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'>
                      <tbody class='mcnImageBlockOuter'>
                        <tr>
                          <td valign='top' style='padding: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' cla  ss='mcnImageBlockInner'>
                            <table align='left' width='100%' border='0' cellpadding='0' cellspacing='0' class='mcnImageContentContainer' style='  min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'>
                              <tbody>
                                <tr>
                                  <td class='mcnImageContent' valign='top' st  yle='padding-right: 9px;padding-left: 9px;padding-top: 0;padding-bottom:   0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-siz  e-adjust: 100%;'>
                                    <img align='left' alt='' src='https://app.traininblocks.com/emailLogo.png' width='118.44' style='max-width: 890px;padding-bottom: 0px;vertical-align: bottom;display: inline !important;border-radius: 0%;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;' class='mcnImage'>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table border='0' cellpadding='0' cellspacing='0' width='10=
                      0%' class='mcnDividerBlock' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;table-layout: fixed !important;'>
                      <tbody class='mcnDividerBlockOuter'>
                        <tr>
                          <td class='mcnDividerBlockInner' style='min-width: 100%;padding: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'>
                            <table class='mcnDividerContent' border='0' cellpadding='0' cellspacing='0' width='100%' style='min-width: 100%;border-top: 2px solid #EAEAEA;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'>
                              <tbody>
                                <tr>
                                  <td style='mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'>
                                    <span></span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td valign='top' id='templateBody' style='background:#ffffff none no-repeat center/cover;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #ffffff;background-image: none;background-repeat: no-repeat;background-position: center;background-size: cover;border-top: 0;border-bottom: 2px solid #EAEAEA;padding-top: 0;padding-bottom: 9px;'>
                    <table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnTextBlock' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'>
                      <tbody class='mcnTextBlockOuter'>
                        <tr>
                          <td valign='top' class='mcnTextBlockInner' style='padding-top: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'>
                            <table align='left' border='0' cellpadding='0' cellspacing='0' style='max-width: 100%;min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' width='100%' class='mcnTextContentContainer'>
                              <tbody>
                                <tr>
                                  <td valign='top' class='mcnTextContent' style='padding: 0px 18px 9px;line-height: 150%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #282828;font-family: Helvetica;font-size: 16px;text-align: left;'>
                                    <h1 class='null' style='display: block;margin: 0;padding: 0;color: #202020;font-family: Helvetica;font-size: 26px;font-style: normal;font-weight: bold;line-height: 125%;letter-spacing: normal;text-align: left;'>
                                      <span style='font-family:arial,helvetica neue,helvetica,sans-serif'><span style='font-size:32px'>Password Reset</span></span>
                                    </h1>
                                    <br>
                                    We've received a request to reset your password.
                                    <br>
                                    If you did not submit this request then please disregard this email.
                                    <br>
                                    If you wish to reset your password, please click the link below.
                                    &nbsp;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnButtonBlock' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'>
                      <tbody class='mcnButtonBlockOuter'>
                        <tr>
                          <td style='padding-top: 0;padding-right: 18px;padding-bottom: 18px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' valign='top' align='center' class='mcnButtonBlockInner'>
                            <table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnButtonContentContainer' style='border-collapse: separate !important;border-radius: 4px;background-color: #282828;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'>
                              <tbody>
                                <tr>
                                  <td align='center' valign='middle' class='mcnButtonContent' style='font-family: Arial;font-size: 16px;padding: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'>
                                    <a class='mcnButton' title='Reset Password' href='${link}' target='_blank' style='font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;  color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;'>Reset Password</a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table border='0' cellpadding='0' cellspacing='0' width='100%' class='mcnTextBlock' style='min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'>
                      <tbody class='mcnTextBlockOuter'>
                        <tr>
                          <td valign='top' class='mcnTextBlockInner' style='padding-top: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;'>
                            <table align='left' border='0' cellpadding='0' cellspacing='0' style='max-width: 100%;min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;' width='100%' class='mcnTextContentContainer'>
                              <tbody>
                                <tr>
                                  <td valign='top' class='mcnTextContent' style='padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #282828;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;'>
                                    All the best,<br>
                                    <br>
                                    <b>The Train In Blocks Team</b>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </table>
        </center>
      </body>
    </html>`
  )
}
function passEmailText (link) {
  return (`** Password Reset
    ------------------------------------------------------------
    We've received a request to reset your password.
    
    If you did not submit this request then please disregard this email.
    
    If you wish to reset your password, please click the link below.
    
    Reset Password (${link})

    All the best,
    
    The Train In Blocks Team`)
}
const axios = require('axios')
const authHeader = 'SSWS 00r26hoJMP9lITIbqrR596dGTWAL0I8lFljhdxfaBV'
const smtpTransport = require('nodemailer-smtp-transport')
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=UTF-8',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=15552000; preload',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': 'default-src "self"'
}
// setup nodemailer
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp-relay.gmail.com',
  secure: true,
  auth: {
    user: 'joe.bailey@traininblocks.com',
    pass: 'fczhxioeejfvtpbi'
  }
}))

let response

exports.handler = async function handler (event, context, callback) {
  if (event.httpMethod === 'OPTIONS') {
    return callback(null, {
      statusCode: 200,
      headers,
      body: ''
    })
  } else if (event.body) {
    const data = JSON.parse(event.body)
    try {
      const oktaOne = await axios.get(`https://dev-183252.okta.com/api/v1/users/?filter=profile.email+eq+"${data.email}"&limit=1`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: authHeader
          }
        }
      )
      const id = oktaOne.data[0].id
      const oktaTwo = await axios.post(`https://dev-183252.okta.com/api/v1/users/${id}/lifecycle/reset_password?sendEmail=false`,
        {},
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: authHeader
          }
        }
      )
      // options
      const mailOptions = {
        from: 'Train In Blocks <hello@traininblocks.com>',
        to: data.email,
        subject: 'Password Reset',
        text: passEmailText(oktaTwo.data.resetPasswordUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com')),
        html: passEmail(oktaTwo.data.resetPasswordUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com'))
      }
      await transporter.sendMail(mailOptions)
      return callback(null, {
        statusCode: 200,
        headers,
        body: 'Email sent successfully'
      })
    } catch (e) {
      return callback(null, {
        statusCode: 500,
        headers,
        body: JSON.stringify(e, response)
      })
    }
  } else {
    return callback(null, {
      statusCode: 401,
      headers,
      body: ''
    })
  }
}
