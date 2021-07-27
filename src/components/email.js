/**
 * @file Contains all the custom email templates.
 * @author Train In Blocks Ltd.
 */

// -----------------------------
// Text version of email bodies
// -----------------------------

/**
 * Notifies the client that they can activate their account.
 * @param {string} link - The link to activate the account.
 * @returns The body text for the email.
 */
export function activateAccount (link) {
  return (
    `** Almost there...
    ------------------------------------------------------------
    Welcome to Train In Blocks. Your trainer has given you access to view your sessions, submit feedback, pay for services, and to make bookings.
    
    You just need to activate your account below to get started!
    
    Activate Your Account (${link})

    All the best,
    
    The Train In Blocks Team`
  )
}

/**
 * Notifies the user that their account password has been changed.
 * @returns The body text for the email.
 */
export function passwordChanged () {
  return (`** Password Changed
    ------------------------------------------------------------
    Your password has been changed. If you did not change your password please contact us immediately at hello@traininblocks.com.

    All the best,
    
    The Train In Blocks Team`)
}

/**
 * The email body to notify the trainer-user of their weekly activities.
 * @param {string} body - The text content of the email.
 * @returns The body text for the email.
 */
export function weeklyBreakdown (body) {
  return (`** Here's a breakdown of what you did this week
    ------------------------------------------------------------

    ${body}

    All the best,
    
    The Train In Blocks Team`)
}

/**
 * The email body to notify the client-user that their account has been reactivated.
 * @param {string} link - The link to reactivate the account.
 * @returns The body text of the email.
 */
export function clientAccountReactivated (link) {
  return (`** Welcome Back...
    ------------------------------------------------------------
    Your trainer has re-activated your account.
    
    You just need to click the link below to get started!
    
    Re-activate Your Account (${link})

    All the best,
    
    The Train In Blocks Team`)
}

/**
 * The email body to notify the client-user that their account has been deactivated.
 * @returns The body text of the email.
 */
export function clientAccountDeactivated () {
  return (`** Account Deactivated
    ------------------------------------------------------------
    Your account and information was removed by your trainer. If this was a mistake, please contact your trainer and let them know.

    All the best,
    
    The Train In Blocks Team`)
}

/**
 * The email body to notify the trainer-user that a client has given feedback.
 * @param {integer} cId - The client's id.
 * @param {integer} pId - The trainer's id.
 * @returns The body text of the email.
 */
export function clientFeedback (cId, pId) {
  return (`** Your client has given some feedback
    ------------------------------------------------------------
    Log in to find out what your client has said about the session.
    
    View feedback (https://app.traininblocks.com/client/${cId}/plan/${pId})

    All the best,
    
    The Train In Blocks Team`)
}

/**
 * The email body to notify the trainer-user that a new booking request has been received.
 * @param {string} clientName - The client's name that requested a booking.
 * @param {string} datetime - The date and time requested.
 * @returns The body text for the email.
 */
export function bookingRequested (clientName, datetime) {
  return (`** Your client has requested for a session
    ------------------------------------------------------------
    
    ${clientName} has requested a session for ${datetime}. Head over to the app now to accept or reject this booking.

    All the best,
    
    The Train In Blocks Team`)
}

/**
 * The email body to notify the trainer-user of a cancelled booking request.
 * @param {string} clientName - The client's name that cancelled the booking.
 * @param {string} datetime - The date and time for when the booking would have taken place.
 * @returns The body text for the email.
 */
export function bookingRequestCancelled (clientName, datetime) {
  return (`** Your client has cancelled their request for a session
    ------------------------------------------------------------
    
    ${clientName} has cancelled their request for a session for ${datetime}.

    All the best,
    
    The Train In Blocks Team`)
}

/**
 * The email body to notify the client-user of a cancelled/rejected booking.
 * @param {string} datetime - The date and time for when the booking would have taken place.
 * @returns The body text for the email.
 */
export function bookingRejected (datetime) {
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
export function emailBuilder (type, data) {
  return baseEmail({
    title: titles[type],
    html: htmls(type, data)
  })
}

/** A dictionary of all the email titles. */
const titles = {
  'activate-account': 'Activate your account',
  'password-changed': 'Password changed',
  'weekly-breakdown': 'Here\'s a breakdown of what you did this week',
  'client-account-reactivated': 'Welcome back',
  'client-account-deactivated': 'Account deactivated',
  'client-feedback': 'Your client has given some feedback',
  'booking-requested': 'Your client has requested for a booking',
  'booking-request-canclled': 'Your client has canclled their request for a booking',
  'booking-rejected': 'Your trainer has rejected/cancelled a booking',
  'booking-accepted': 'Your trainer has accepted/confirmed a booking'
}

/**
 * Contains all the email HTMLs.
 * @param {string} type - The email body text to use.
 * @param {object} data - Additional specific details required to fill the email.
 * @returns The filled HTML for the email.
 */
const htmls = (type, data) => {
  switch (type) {
    case 'activate-account':
      return `<p>Welcome to Train In Blocks. Your trainer has given you access to view your sessions, submit feedback, pay for services, and to make bookings.<br><a href="${data.link}" target="_blank" class="link-button">Activate Your Account</a></p>`
    case 'password-changed':
      return '<p>Your password has been changed. If you did not change your password please contact us immediately at hello@traininblocks.com.</p>'
    case 'weekly-breakdown':
      return `<table>${data.body}</table>`
    case 'client-account-reactivated':
      return `<p>Your trainer has re-activated your account.<br>You just need to click the link below to get started!<br><a href="${data.link}" target="_blank" class="link-button">Re-activate Your Account</a></p>`
    case 'client-account-deactivated':
      return '<p>Your account and information was removed by your trainer. If this was a mistake, please contact your trainer and let them know.</p>'
    case 'client-feedback':
      return `<p>Log in to find out what you client has said about the session. <a href="https://app.traininblocks.com/client/${data.cId}/plan/${data.pId}" target="_blank" class="link-button">See feedback</a></p>`
    case 'booking-requested':
      return `<p>${data.clientName} has requested for a booking on ${data.datetime}.</p>`
    case 'booking-request-cancelled':
      return `<p>${data.clientName} has cancelled their request for a session for ${data.datetime}.</p>`
    case 'booking-rejected':
      return `<p>The booking for ${data.datetime} has been rejected/cancelled by your trainer.</p>`
    case 'booking-accepted':
      return `<p>The booking for ${data.datetime} has been accepted/confirmed by your trainer.</p>`
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
        </style>
      </head>
      <body>
        <div id="email">
          
          <!-- Header -->

          <table id="header" role="presentation" width="100%">
            <tr>
              <td>
                <img align='left' alt='' src='https://dev.traininblocks.com/emailLogo.svg' width='118.44' style='max-width: 890px;padding-bottom: 0px;vertical-align: bottom;display: inline !important;border-radius: 0%;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;' class='mcnImage'>
              </td>
            </tr>
          </table>

          <!-- Content -->

          <table id="content" role="presentation" width="100%">
            <tr>
              <td>
                <h1>
                  ${data.title}
                </h1>
                <div class="content-text">
                  ${data.html}
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
