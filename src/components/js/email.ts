type EmailType =
    | "activate-account"
    | "password-changed"
    | "password-reset"
    | "weekly-breakdown"
    | "client-account-reactivated"
    | "client-account-deactivated"
    | "client-feedback"
    | "booking-created"
    | "booking-requested"
    | "booking-request-cancelled"
    | "booking-rejected"
    | "booking-accepted"
    | "new-idea";

type EmailData = {
    datetime?: string;
    cId?: number;
    pId?: number;
    text?: string;
    link?: string;
    body?: string;
    clientName?: string;
    email?: string;
    idea?: string;
    idea_text?: string;
};

/** Builds an email HTML template to send to users. */
export default (type: EmailType, data?: EmailData) => {
    return {
        subject: titles[type],
        text: textEmail(type, data),
        html: baseEmail({
            title: titles[type],
            html: bodyHtml(type, data),
        }),
    };
};

/** A dictionary of all the email titles. */
const titles: Record<EmailType, any> = {
    "activate-account": "Activate your account",
    "password-changed": "Password changed",
    "password-reset": "Password reset",
    "weekly-breakdown": "Here's a breakdown of what you did this week",
    "client-account-reactivated": "Welcome back",
    "client-account-deactivated": "Account deactivated",
    "client-feedback": "Your client has given some feedback",
    "booking-created": "Your trainer has scheduled a booking",
    "booking-requested": "Your client has requested a booking",
    "booking-request-cancelled":
        "Your client has cancelled their request for a booking",
    "booking-rejected": "Your trainer has rejected a booking",
    "booking-accepted": "Your trainer has accepted a booking",
    "new-idea": "Someone has just submitted a new idea",
};

const textEmail = (type: EmailType, data?: EmailData) => {
    let processedText = bodyHtml(type, data)
        ?.replace("<p>", "")
        .replace("</p>", "\n")
        .replace("</a>", "\n");
    if (processedText?.includes("href")) {
        const regex = /<a.*?href="(.*?)".*?>/gi;
        let link;
        let finder;
        while ((finder = regex.exec(processedText)) !== null) {
            if (finder.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            finder.forEach((match, groupIndex) => {
                if (groupIndex === 1) {
                    link = match;
                }
            });
        }
        processedText = processedText.replace(/<a.*?>/gi, `(${link})`);
    }
    return `**${titles[type]}
---------------------------

${processedText}

All the best,

The Train In Blocks Team`;
};

const nth = function (d: number) {
    if (d > 3 && d < 21) {
        return "th";
    }
    switch (d % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};
const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

/** Contains all the email HTMLs. */
const bodyHtml = (type: EmailType, data?: EmailData) => {
    switch (type) {
        case "activate-account":
            return `<p>Welcome to Train In Blocks. Your trainer has given you access to view your sessions, submit feedback, pay for services, and to make bookings.
        <br>
        <a href="${data?.link}" target="_blank" class="link-button">Activate Your Account</a>
      </p>`;
        case "password-changed":
            return '<p>Your password has been changed. If you did not change your password please contact us immediately at <a href="mailto:hello@traininblocks.com">hello@traininblocks.com</a>.</p>';
        case "password-reset":
            return `<p>We've received a request to reset your password. If you did not submit this request then please disregard this email. If you wish to reset your password, please click the link below.
        <br>
        <a href="${data?.link}" target="_blank" class="link-button">Reset Password</a>
      </p>`;
        case "weekly-breakdown":
            return `<table>${data?.body}</table>`;
        case "client-account-reactivated":
            return `<p>Your trainer has re-activated your account.<br>You just need to click the link below to get started!
        <br>
        <a href="${data?.link}" target="_blank" class="link-button">Re-activate Your Account</a>
      </p>`;
        case "client-account-deactivated":
            return "<p>Your account and information was removed by your trainer. If this was a mistake, please contact your trainer and let them know.</p>";
        case "client-feedback":
            return `<p>Log in to find out what your client has said about the session.
        <br>
        <a href="https://app.traininblocks.com/client/${data?.cId}/plan/${data?.pId}" target="_blank" class="link-button">See feedback</a>
      </p>`;
        case "booking-created":
            return `<p>Your trainer has scheduled a booking on the ${new Date(
                data?.datetime ?? ""
            ).getDay()}<sup>${nth(
                new Date(data?.datetime ?? "").getDay()
            )}</sup> of ${
                month[new Date(data?.datetime ?? "").getMonth()]
            } at ${data?.datetime ?? "".split(" ")[1].substring(0, 5)}.
        <br>
        <a href="https://app.traininblocks.com" target="_blank" class="link-button">View It Here</a>
      </p>`;
        case "booking-requested":
            return `<p>${
                data?.clientName
            } has requested a booking on the ${new Date(
                data?.datetime ?? ""
            ).getDay()}<sup>${nth(
                new Date(data?.datetime ?? "").getDay()
            )}</sup> of ${
                month[new Date(data?.datetime ?? "").getMonth()]
            } at ${data?.datetime ?? "".split(" ")[1].substring(0, 5)}.
        <br>
        <a href="${
            data?.link
        }" target="_blank" class="link-button">Accept It Here</a>
      </p>`;
        case "booking-request-cancelled":
            return `<p>${
                data?.clientName
            } has cancelled their request for a session on the ${new Date(
                data?.datetime ?? ""
            ).getDay()}<sup>${nth(
                new Date(data?.datetime ?? "").getDay()
            )}</sup> of ${
                month[new Date(data?.datetime ?? "").getMonth()]
            } at ${data?.datetime ?? "".split(" ")[1].substring(0, 5)}.
        <br>
        <a href="${
            data?.link
        }" target="_blank" class="link-button">Create A New One Now</a>
      </p>`;
        case "booking-rejected":
            return `<p>The booking for the ${new Date(
                data?.datetime ?? ""
            ).getDay()}<sup>${nth(
                new Date(data?.datetime ?? "").getDay()
            )}</sup> of ${
                month[new Date(data?.datetime ?? "").getMonth()]
            } at ${
                data?.datetime ?? "".split(" ")[1].substring(0, 5)
            } has been rejected by your trainer.
        <br>
        <a href="https://app.traininblocks.com" target="_blank" class="link-button">Request A New Booking Now</a>
      </p>`;
        case "booking-accepted":
            return `<p>The booking for the ${new Date(
                data?.datetime ?? ""
            ).getDay()}<sup>${nth(
                new Date(data?.datetime ?? "").getDay()
            )}</sup> of ${
                month[new Date(data?.datetime ?? "").getMonth()]
            } at ${
                data?.datetime ?? "".split(" ")[1].substring(0, 5)
            } has been accepted by your trainer.
        <br>
        <a href="https://app.traininblocks.com" target="_blank" class="link-button">View Your Booking Here</a>
      </p>`;
        case "new-idea":
            return `<p>Good news, ${data?.email} has submitted a new idea:
        <br>
        ${data?.idea_text}
      </p>`;
    }
};

/** The base email template.*/
function baseEmail(data: { title: string; html: string }) {
    return `<!doctype html>
    <html xmlns='http://www.w3.org/1999/xhtml' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'>
      <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <style type='text/css'>
          .link {
            text-decoration: none;
            color: #282828!important;
            font-size: 1rem;
            margin-right: 1rem;
          }
          .link-button {
            display: block;
            padding: .6rem 1.6rem;
            margin: 2rem 0;
            width: fit-content;
            width: -moz-fit-content;
            color: white!important;
            background-color: #282828;
            border-radius: 5px;
            text-decoration: none;
            transition: opacity .6s!important;
          }
          .link-button:hover, .link-button:focus {
            opacity: .6;
          }
          .link-button:focus {
            box-shadow: 0 0 0 4px #585858;
            outline: none
          }
          #footer p {
            font-size: .8rem;
          }
        </style>
      </head>
      <body style="font-family: Arial, Helvetica, sans-serif;margin: auto;padding: 50px 0 0;max-width: 800px;font-size: 16px;line-height: 1.42">
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

          <table id="content" role="presentation" width="100%" style="margin: 2rem 0">
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

          <table id="footer" role="presentation" width="100%" style="border-top: 2px solid #282828;padding: 2rem 0;">
            <tr>
              <td class="content">
                <p>
                  <b>Wallingford</b> United Kingdom
                </p>
              </td>
              <td align="center">
                <p>
                  <a href="https://app.traininblocks.com" target="_blank" rel="noreferrer" class="link">Login</a>
                  <a href="https://traininblocks.com" target="_blank" rel="noreferrer" class="link">Website</a>
                  <a href="https://www.instagram.com/traininblocks" target="_blank" rel="noreferrer" class="link">Instagram</a>
                </p>
              </td>
              <td>
                <p>
                  <b>Train In Blocks Ltd</b> 12515717
                </p>
              </td>
            </tr>
          </table>

        </div>
      </body>
    </html>`;
}
