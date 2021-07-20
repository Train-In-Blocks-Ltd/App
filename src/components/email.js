export function email (link) {
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
                                      <span style='font-family:arial,helvetica neue,helvetica,sans-serif'><span style='font-size:32px'>Almost there...</span></span>
                                    </h1>
                                    <br>
                                    Welcome to Train In Blocks. We provide an affordable means of creating a bespoke exercise plan - quickly and effectively. Combined with your skills and knowledge, you can start generating more leads and revenue for your personal training/coaching business.<br>
                                    <br>
                                    You just need to activate your account below to get started!<br>
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
                                    <a class='mcnButton' title='Activate Your Account' href='${link}' target='_blank' style='font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;  color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;'>Activate Your Account</a>
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

export function emailText (link) {
  return (
    `** Almost there...
    ------------------------------------------------------------
    Welcome to Train In Blocks. We provide an affordable means of creating a be=
    spoke exercise plan - quickly and effectively. Combined with your skil=
    ls and knowledge, you can start generating more leads and revenue for your =
    personal training/coaching business.
    
    You just need to activate your account below to get started!
    
    Activate Your Account (${link})

    All the best,
    
    The Train In Blocks Team`
  )
}

export function resetEmail (link) {
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
                                      <span style='font-family:arial,helvetica neue,helvetica,sans-serif'><span style='font-size:32px'>Welcome Back...</span></span>
                                    </h1>
                                    <br>
                                    Your trainer has re-activated your account.
                                    <br>
                                    You just need to click the link below to get started!<br>
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
                                    <a class='mcnButton' title='Re-activate Your Account' href='${link}' target='_blank' style='font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;  color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;'>Re-activate Your Account</a>
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

export function resetEmailText (link) {
  return (`** Welcome Back...
    ------------------------------------------------------------
    Your trainer has re-activated your account.
    
    You just need to click the link below to get started!
    
    Re-activate Your Account (${link})

    All the best,
    
    The Train In Blocks Team`)
}

export function deleteEmail () {
  return (`
  <!doctype html>
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
                                      <span style='font-family:arial,helvetica neue,helvetica,sans-serif'><span style='font-size:32px'>Account Deactivated</span></span>
                                    </h1>
                                    <br>
                                    Your account and information was removed by your trainer. If this was a mistake, please contact your trainer and let them know.
                                    <br>
                                    &nbsp;
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
    </html>`)
}

export function deleteEmailText () {
  return (`** Account Deactivated
    ------------------------------------------------------------
    Your account and information was removed by your trainer. If this was a mistake, please contact your trainer and let them know.

    All the best,
    
    The Train In Blocks Team`)
}

export function passChangeEmail () {
  return (`
  <!doctype html>
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
                                      <span style='font-family:arial,helvetica neue,helvetica,sans-serif'><span style='font-size:32px'>Password Changed</span></span>
                                    </h1>
                                    <br>
                                    Your password has been changed. If you did not change your password please contact us immediately at hello@traininblocks.com.
                                    <br>
                                    &nbsp;
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
    </html>`)
}

export function passChangeEmailText () {
  return (`** Password Changed
    ------------------------------------------------------------
    Your password has been changed. If you did not change your password please contact us immediately at hello@traininblocks.com.

    All the best,
    
    The Train In Blocks Team`)
}

export function feedbackEmail (cId, pId) {
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
                                      <span style='font-family:arial,helvetica neue,helvetica,sans-serif'><span style='font-size:32px'>Your client has given some feedback</span></span>
                                    </h1>
                                    <br>
                                    Log in to find out what your client has said about the session.
                                    <br>
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
                                    <a class='mcnButton' title='View feedback' href='https://app.traininblocks.com/client/${cId}/block/${pId}' target='_blank' style='font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;  color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;'>Log In</a>
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

export function feedbackEmailText (cId, pId) {
  return (`** Your client has given some feedback
    ------------------------------------------------------------
    Log in to find out what your client has said about the session.
    
    View feedback (https://app.traininblocks.com/client/${cId}/block/${pId})

    All the best,
    
    The Train In Blocks Team`)
}

export function weeklyBreakdown (body) {
  return (`** Here's a breakdown of what you did this week
    ------------------------------------------------------------
    ${body}

    All the best,
    
    The Train In Blocks Team`)
}

/**
 * The email body to notify the trainer-user that a new booking request has been received.
 * @param {string} clientName - The client's name that requested a booking.
 * @param {string} datetime - The date and time requested.
 * @returns The body text for the email.
 */
export function bookingRequest (clientName, datetime) {
  return (`** Your client has requested for a session
    ------------------------------------------------------------
    
    ${clientName} has requested a session for ${datetime}. Head over to the app now to accept or reject this booking.

    All the best,
    
    The Train In Blocks Team`)
}

/**
 * The email body to notify the client-user of a cancelled/rejected booking.
 * @param {string} datetime - The date and time for when the booking would have taken place.
 * @returns The body text for the email.
 */
export function bookingCancelled (datetime) {
  return (`** Your trainer has cancelled/rejected a booking
    ------------------------------------------------------------
    
    The booking for ${datetime} has been cancelled/rejected by your trainer.

    All the best,
    
    The Train In Blocks Team`)
}

/**
 * The email body to notify the client-user of an accepted/confirmed booking.
 * @param {string} datetime - The date and time for when the booking will take place.
 * @returns The body text for the email.
 */
export function bookingAccepted (datetime) {
  return (`** Your trainer has accepted/confirmed a booking
    ------------------------------------------------------------
    
    The booking for ${datetime} has been accepted/confirmed by your trainer.

    All the best,
    
    The Train In Blocks Team`)
}

export function textEmail (title, html) {
  return (
    `<!doctype html>
    <html xmlns='http://www.w3.org/1999/xhtml' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'>
      <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <style type='text/css'>
          body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            font-size: 16px;
            line-height: 1.42;
            background-color: #F9F9F9
          }
          #content {
            margin: 2rem 0
          }
        </style>
      </head>
      <body>
        <div id="email">
          
          <!-- Header -->

          <table id="header" role="presentation" width="100%">
            <tr>
              <td>
                <h1>
                  ${title}
                </h1>
              </td>
            </tr>
          </table>

          <!-- Content -->

          <table id="content" role="presentation" width="100%">
            <tr>
              <td>
                <div class="content-text">
                  ${html}
                </div>
                <p>
                  All the best,<br><strong>The Train In Blocks Team</strong>
                </p>  
              </td>
            </tr>
          </table>

          <!-- Footer

          <table id="footer" role="presentation" width="100%">
            <tr>
              <td>

              </td>
            </tr>
          </table>

          -->
        </div>
      </body>
    </html>`
  )
}
