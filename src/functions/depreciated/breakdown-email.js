const { schedule } = require('@netlify/functions')
const axios = require('axios')
const smtpTransport = require('nodemailer-smtp-transport')
const nodemailer = require('nodemailer')
const emailBuilder = require('../src/components/js/email')
const CUSTOM_ENV = process.env.NODE_ENV === 'production' ? require('../../../config/prod.env') : require('../../../config/dev.env')
const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp-relay.gmail.com',
  secure: true,
  auth: {
    user: process.env.GOOGLE_WORKSPACE_USERNAME,
    pass: process.env.GOOGLE_WORKSPACE_PASSWORD
  }
}))

let thisWeek = new Date()
thisWeek = thisWeek.setDate(thisWeek.getDate() - 7)

const handler = async function (event, context) {
  try {
    // Get all Personal Trainer users from Okta
    const PTs = await axios.get(`${CUSTOM_ENV.OKTA.ISSUER}/api/v1/groups/00gf92iyuemKhsTcV4x6/users`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: process.env.OKTA_AUTH_KEY
      }
    })
    // Loop through Personal Trainer users
    for (PT in PTs.data) {
      // If the PT is active (and they've opted in to weekly breakdown emails)
      if (PTs.data[PT].status === 'ACTIVE' /* && PTs.data[PT].profile.breakdown === true*/) {
        // Get the PT's data from the API
        const ptData = await axios.get(`https://api.traininblocks.com/v2/${PTs.data[PT].id}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: process.env.TIB_API
          }
        })
        // Sort out the PT's data into each category
        const clients = ptData.data[0]
        const archivedClients = ptData.data[1]
        const templates = ptData.data[2]
        const portfolio = ptData.data[3]
        const bookings = ptData.data[4]
        const products = ptData.data[5]

        // Set the variables that we're reporting back to the user
        const breakdownData = {
          clientsUpdatedThisWeek: 0,
          clientsCreatedThisWeek: 0,
          clientsArchivedThisWeek: 0,
          templatesUpdatedThisWeek: 0,
          templatesCreatedThisWeek: 0,
          bookingsScheduledThisWeek: 0
        }

        // Loop through clients
        for (client in clients) {
          // If the client was created this week
          if (new Date(clients[client].created_at) >= thisWeek) {
            breakdownData.clientsCreatedThisWeek++
            // If the client was updated this week
          } else if (new Date(clients[client].updated_at) >= thisWeek) {
            breakdownData.clientsUpdatedThisWeek++
          }
        }

        /*
        // Send an email to the PT
        const mailOptions = {
          from: 'Train In Blocks <hello@traininblocks.com>',
          to: 'joe@joebailey.xyz', //PTs.data[PT].email
          ...emailBuilder('weekly-breakdown', breakdownData)
        }
        await transporter.sendMail(mailOptions)
        */
      }
    }

    return {
      statusCode: 200,
    };
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500
    }
  }
};

module.exports.handler = schedule("@weekly", handler);