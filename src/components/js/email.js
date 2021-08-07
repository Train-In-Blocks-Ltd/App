/**
 * @file Contains all the custom email templates.
 * @author Train In Blocks Ltd.
 */

// -----------------------------
// Builder and content
// -----------------------------

/**
 * Builds an email HTML template to send to users.
 * @param {string} type - The email body text to use.
 * @param {object} data - Additional specific details required to fill the email.
 * @returns The built email.
 * @example <caption>An example of how to generate an HTML template for the client feedback email.</caption>
 * emailBuilder ('client-feedback', {
 *  cId: ...,
 *  pId: ...
 * })
 */
module.exports = function emailBuilder (type, data) {
  return {
    subject: titles[type],
    text: textEmail(type, data),
    html: baseEmail({
      title: titles[type],
      html: bodyHtml(type, data)
    })
  }
}

/** A dictionary of all the email titles. */
const titles = {
  'activate-account': 'Activate your account',
  'password-changed': 'Password changed',
  'password-reset': 'Password reset',
  'weekly-breakdown': 'Here\'s a breakdown of what you did this week',
  'client-account-reactivated': 'Welcome back',
  'client-account-deactivated': 'Account deactivated',
  'client-feedback': 'Your client has given some feedback',
  'booking-created': 'Your trainer has scheduled a booking',
  'booking-requested': 'Your client has requested a booking',
  'booking-request-cancelled': 'Your client has cancelled their request for a booking',
  'booking-rejected': 'Your trainer has rejected a booking',
  'booking-accepted': 'Your trainer has accepted a booking'
}

const textEmail = (type, data) => {
  let processedText = bodyHtml(type, data).replace('<p>', '').replace('</p>', '\n').replace('</a>', '\n')
  if (processedText.includes('href')) {
    const regex = /<a.*?href="(.*?)".*?>/gi
    let link
    let finder
    while ((finder = regex.exec(processedText)) !== null) {
      if (finder.index === regex.lastIndex) {
        regex.lastIndex++
      }
      finder.forEach((match, groupIndex) => {
        if (groupIndex === 1) {
          link = match
        }
      })
    }
    processedText = processedText.replace(/<a.*?>/gi, `(${link})`)
  }
  return `**${titles[type]}
---------------------------

${processedText}

All the best,

The Train In Blocks Team`
}

/**
 * Contains all the email HTMLs.
 * @param {string} type - The email body text to use.
 * @param {object} data - Additional specific details required to fill the email.
 * @returns The filled HTML for the email.
 */
const bodyHtml = (type, data) => {
  switch (type) {
    case 'activate-account':
      return `<p>Welcome to Train In Blocks. Your trainer has given you access to view your sessions, submit feedback, pay for services, and to make bookings.<br><a href="${data.link}" target="_blank" class="link-button">Activate Your Account</a></p>`
    case 'password-changed':
      return '<p>Your password has been changed. If you did not change your password please contact us immediately at hello@traininblocks.com.</p>'
    case 'password-reset':
      return `<p>We've received a request to reset your password. If you did not submit this request then please disregard this email. If you wish to reset your password, please click the link below.<br><a href="${data.link}" target="_blank" class="link-button">Reset Password</a></p>`
    case 'weekly-breakdown':
      return `<table>${data.body}</table>`
    case 'client-account-reactivated':
      return `<p>Your trainer has re-activated your account.<br>You just need to click the link below to get started!<br><a href="${data.link}" target="_blank" class="link-button">Re-activate Your Account</a></p>`
    case 'client-account-deactivated':
      return '<p>Your account and information was removed by your trainer. If this was a mistake, please contact your trainer and let them know.</p>'
    case 'client-feedback':
      return `<p>Log in to find out what you client has said about the session. <a href="https://app.traininblocks.com/client/${data.cId}/plan/${data.pId}" target="_blank" class="link-button">See feedback</a></p>`
    case 'booking-created':
      return `<p>Your trainer has scheduled a booking on ${data.datetime.split(' ')[0]} at ${data.datetime.split(' ')[1].substring(0, 5)}.</p>`
    case 'booking-requested':
      return `<p>${data.clientName} has requested a booking on ${data.datetime.split(' ')[0]} at ${data.datetime.split(' ')[1].substring(0, 5)}.</p>`
    case 'booking-request-cancelled':
      return `<p>${data.clientName} has cancelled their request for a session on ${data.datetime.split(' ')[0]} at ${data.datetime.split(' ')[1].substring(0, 5)}.</p>`
    case 'booking-rejected':
      return `<p>The booking for ${data.datetime.split(' ')[0]} at ${data.datetime.split(' ')[1].substring(0, 5)} has been rejected by your trainer.</p>`
    case 'booking-accepted':
      return `<p>The booking for ${data.datetime.split(' ')[0]} at ${data.datetime.split(' ')[1].substring(0, 5)} has been accepted by your trainer.</p>`
  }
}

// -----------------------------
// Template
// -----------------------------

/**
 * The base email template.
 * @param {string} data.title - The email title.
 * @param {string} data.html - The email content in HTML.
 * @returns The built email.
 */
function baseEmail (data) {
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
            padding: 10vh 10vw;
            font-size: 16px;
            line-height: 1.42;
            background-color: #F9F9F9
          }
          #content {
            margin: 2rem 0
          }
          .link {
            text-decoration: none;
            color: #282828;
            font-size: 1rem;
          }
          .link-button {
            display: block;
            padding: 1rem;
            margin: 2rem 0;
            width: fit-content;
            color: white;
            background-color: #282828;
            border-radius: 5px;
            text-decoration: none;
            transition: .6s all;
          }
          .link-button:hover {
            opacity: .6;
          }
          #footer {
            border-top: 2px solid #282828;
            padding: 2rem 0;
          }
          #footer .content {
            display: grid;
            grid-gap: 1rem;
          }
          #footer p {
            font-size: .8rem;
          }
          #footer .company-info {
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <div id="email">
          
          <!-- Header -->

          <table id="header" role="presentation" width="100%">
            <tr>
              <td>
                <img align='left' alt='' src='https://dev.traininblocks.com/emailLogo.png' width='118.44' style='max-width: 890px;padding-bottom: 0px;vertical-align: bottom;display: inline !important;border-radius: 0%;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;' class='mcnImage'>
              </td>
            </tr>
          </table>

          <!-- Content -->

          <table id="content" role="presentation" width="100%">
            <tr>
              <td>
                <h1>${data.title}</h1>
                <div class="content-text">
                  ${data.html}
                </div>
                <p>
                  All the best,<br><br><strong>The Train In Blocks Team</strong>
                </p>  
              </td>
            </tr>
          </table>

          <table id="footer" role="presentation" width="100%">
            <tr>
              <td class="content">
                <div>
                  <a href="https://app.traininblocks.com" target="_blank" rel="noreferrer" class="link">App</a>
                  <a href="https://traininblocks.com" target="_blank" rel="noreferrer" class="link">Website</a>
                  <a href="https://www.instagram.com/traininblocks" target="_blank" rel="noreferrer" class="link">Instagram</a>
                </div>
                <div class="company-info">
                  <p>
                    <b>Wallingford</b> United Kingdom
                  </p>
                  <p>
                    <b>Train In Blocks Ltd</b> 12515717
                  </p>
                </div>
              </td>
            </tr>
          </table>

        </div>
      </body>
    </html>`
  )
}