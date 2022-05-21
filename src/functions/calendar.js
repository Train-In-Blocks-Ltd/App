const ics = function (uidDomain, prodId) {
  'use strict'

  if (typeof uidDomain === 'undefined') { uidDomain = 'default' }
  if (typeof prodId === 'undefined') { prodId = 'Calendar' }

  const SEPARATOR = '\n'
  const calendarEvents = []
  const calendarStart = [
    'BEGIN:VCALENDAR',
    'PRODID:' + prodId,
    'VERSION:2.0'
  ].join(SEPARATOR)
  const calendarEnd = SEPARATOR + 'END:VCALENDAR'
  const BYDAY_VALUES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

  return {
    /**
         * Returns events array
         * @return {array} Events
         */
    events () {
      return calendarEvents
    },

    /**
         * Returns calendar
         * @return {string} Calendar in iCalendar format
         */
    calendar () {
      return calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd
    },

    /**
         * Add event to the calendar
         * @param  {string} subject     Subject/Title of event
         * @param  {string} description Description of event
         * @param  {string} location    Location of event
         * @param  {string} begin       Beginning date of event
         * @param  {string} stop        Ending date of event
         */
    addEvent (subject, description, location, begin, stop, rrule) {
      // I'm not in the mood to make these optional... So they are all required
      if (typeof subject === 'undefined' ||
            typeof description === 'undefined' ||
            typeof location === 'undefined' ||
            typeof begin === 'undefined' ||
            typeof stop === 'undefined'
      ) {
        return false
      }

      // validate rrule
      if (rrule) {
        if (!rrule.rrule) {
          if (rrule.freq !== 'YEARLY' && rrule.freq !== 'MONTHLY' && rrule.freq !== 'WEEKLY' && rrule.freq !== 'DAILY') {
            throw "Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'"
          }

          if (rrule.until) {
            if (isNaN(Date.parse(rrule.until))) {
              throw "Recurrence rrule 'until' must be a valid date string"
            }
          }

          if (rrule.interval) {
            if (isNaN(parseInt(rrule.interval))) {
              throw "Recurrence rrule 'interval' must be an integer"
            }
          }

          if (rrule.count) {
            if (isNaN(parseInt(rrule.count))) {
              throw "Recurrence rrule 'count' must be an integer"
            }
          }

          if (typeof rrule.byday !== 'undefined') {
            if ((Object.prototype.toString.call(rrule.byday) !== '[object Array]')) {
              throw "Recurrence rrule 'byday' must be an array"
            }

            if (rrule.byday.length > 7) {
              throw "Recurrence rrule 'byday' array must not be longer than the 7 days in a week"
            }

            // Filter any possible repeats
            rrule.byday = rrule.byday.filter(function (elem, pos) {
              return rrule.byday.indexOf(elem) == pos
            })

            for (const d in rrule.byday) {
              if (!BYDAY_VALUES.includes(rrule.byday[d])) {
                throw "Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'"
              }
            }
          }
        }
      }

      // TODO add time and time zone? use moment to format?
      const start_date = new Date(begin)
      const end_date = new Date(stop)
      const now_date = new Date()

      const start_year = ('0000' + (start_date.getFullYear().toString())).slice(-4)
      const start_month = ('00' + ((start_date.getMonth() + 1).toString())).slice(-2)
      const start_day = ('00' + ((start_date.getDate()).toString())).slice(-2)
      const start_hours = ('00' + (start_date.getHours().toString())).slice(-2)
      const start_minutes = ('00' + (start_date.getMinutes().toString())).slice(-2)
      const start_seconds = ('00' + (start_date.getSeconds().toString())).slice(-2)

      const end_year = ('0000' + (end_date.getFullYear().toString())).slice(-4)
      const end_month = ('00' + ((end_date.getMonth() + 1).toString())).slice(-2)
      const end_day = ('00' + ((end_date.getDate()).toString())).slice(-2)
      const end_hours = ('00' + (end_date.getHours().toString())).slice(-2)
      const end_minutes = ('00' + (end_date.getMinutes().toString())).slice(-2)
      const end_seconds = ('00' + (end_date.getSeconds().toString())).slice(-2)

      const now_year = ('0000' + (now_date.getFullYear().toString())).slice(-4)
      const now_month = ('00' + ((now_date.getMonth() + 1).toString())).slice(-2)
      const now_day = ('00' + ((now_date.getDate()).toString())).slice(-2)
      const now_hours = ('00' + (now_date.getHours().toString())).slice(-2)
      const now_minutes = ('00' + (now_date.getMinutes().toString())).slice(-2)
      const now_seconds = ('00' + (now_date.getSeconds().toString())).slice(-2)

      // Since some calendars don't add 0 second events, we need to remove time if there is none...
      let start_time = ''
      let end_time = ''
      if (start_hours + start_minutes + start_seconds + end_hours + end_minutes + end_seconds != 0) {
        start_time = 'T' + start_hours + start_minutes + start_seconds
        end_time = 'T' + end_hours + end_minutes + end_seconds
      }
      const now_time = 'T' + now_hours + now_minutes + now_seconds

      const start = start_year + start_month + start_day + start_time
      const end = end_year + end_month + end_day + end_time
      const now = now_year + now_month + now_day + now_time

      // recurrence rrule vars
      let rruleString
      if (rrule) {
        if (rrule.rrule) {
          rruleString = rrule.rrule
        } else {
          rruleString = 'rrule:FREQ=' + rrule.freq

          if (rrule.until) {
            const uDate = new Date(Date.parse(rrule.until)).toISOString()
            rruleString += ';UNTIL=' + uDate.substring(0, uDate.length - 13).replace(/[-]/g, '') + '000000Z'
          }

          if (rrule.interval) {
            rruleString += ';INTERVAL=' + rrule.interval
          }

          if (rrule.count) {
            rruleString += ';COUNT=' + rrule.count
          }

          if (rrule.byday && rrule.byday.length > 0) {
            rruleString += ';BYDAY=' + rrule.byday.join(',')
          }
        }
      }

      const stamp = new Date().toISOString()

      let calendarEvent = [
        'BEGIN:VEVENT',
        'UID:' + calendarEvents.length + '@' + uidDomain,
        'CLASS:PUBLIC',
        'DESCRIPTION:' + description,
        'DTSTAMP;VALUE=DATE-TIME:' + now,
        'DTSTART;VALUE=DATE-TIME:' + start,
        'DTEND;VALUE=DATE-TIME:' + end,
        'LOCATION:' + location,
        'SUMMARY;LANGUAGE=en-us:' + subject,
        'TRANSP:TRANSPARENT',
        'END:VEVENT'
      ]

      if (rruleString) {
        calendarEvent.splice(4, 0, rruleString)
      }

      calendarEvent = calendarEvent.join(SEPARATOR)

      calendarEvents.push(calendarEvent)
      return calendarEvent
    },

    /**
         * Download calendar using the saveAs function from filesave.js
         * @param  {string} filename Filename
         * @param  {string} ext      Extention
         */
    download (filename, ext) {
      if (calendarEvents.length < 1) {
        return false
      }

      ext = (typeof ext !== 'undefined') ? ext : '.ics'
      filename = (typeof filename !== 'undefined') ? filename : 'calendar'
      const calendar = calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd

      const blob = new Blob([calendar])
      saveAs(blob, filename + ext)
      return calendar
    },

    /**
         * Build and return the ical contents
         */
    build () {
      if (calendarEvents.length < 1) {
        return calendarEvents
      }

      const calendar = calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd

      return calendar
    }
  }
}
const axios = require('axios')
const CUSTOM_ENV = process.env.NODE_ENV === 'production' ? require('./helpers/prod.env') : require('./helpers/dev.env')
const authHeader = CUSTOM_ENV.OKTA.AUTH_KEY
const headers = require('././helpers/headers')

let response
let data

exports.handler = async function handler (event, context, callback) {
  // If options request return 200
  if (event.httpMethod === 'OPTIONS') {
    return callback(null, {
      statusCode: 200,
      headers,
      body: ''
    })
  // if email in query string
  } else if (event.queryStringParameters.email) {
    try {
      // Search okta for email
      response = await axios.get(`${CUSTOM_ENV.OKTA.ISSUER}/api/v1/users/?filter=profile.email+eq+"${event.queryStringParameters.email}"&limit=1`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: authHeader
          }
        }
      )
      // if email found in okta then get events from db
      if (response.data.length > 0) {
        // if calendar enabled in settings
        if (response.data[0].profile.calendar === true) {
          // create calendar
          const cal = ics()
          // update headers to include content-type calendar
          headers['Content-Type'] = 'text/calendar'
          // If client user
          if (response.data[0].profile.user_type === 'Client') {
            data = await axios.get(`https://api.traininblocks.com/v2/clientUser/${response.data[0].profile.client_id_db}`, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: CUSTOM_ENV.TIB_API
              }
            })
            // add calendar events for bookings
            if (data.data[3].length > 0) {
              for (const booking of data.data[3]) {
                let date
                date = new Date(booking.datetime)
                date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
                cal.addEvent('Train In Blocks Meeting', booking.notes, '', date, date)
              }
            } else {
              return callback(null, {
                statusCode: 200,
                headers,
                body: 'No Bookings'
              })
            }
          } else {
            data = await axios.get(`https://api.traininblocks.com/v2/${response.data[0].id}`, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: CUSTOM_ENV.TIB_API
              }
            })
            // add calendar events for bookings
            if (data.data[4].length > 0) {
              for (const booking of data.data[4]) {
                let date
                date = new Date(booking.datetime)
                date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
                cal.addEvent('Train In Blocks Meeting with' + data.data[0].find(client => client.client_id === booking.client_id).name, booking.notes, '', date, date)
              }
            } else {
              return callback(null, {
                statusCode: 200,
                headers,
                body: 'No Bookings'
              })
            }
          }
          // return calendar
          return callback(null, {
            statusCode: 200,
            headers,
            body: cal.build()
          })
        // if calendar not enabled return 401
        } else {
          return callback(null, {
            statusCode: 401,
            headers,
            body: 'Not Authorized - Please enable calendar in user settings'
          })
        }
      // if calendar not enabled return 401
      } else {
        return callback(null, {
          statusCode: 401,
          headers,
          body: 'Not Authorized - Email not found'
        })
      }
    // return 500 on error
    } catch (e) {
      return callback(null, {
        statusCode: 500,
        headers,
        body: JSON.stringify(e, response)
      })
    }
  // return 400 on missing query paramters
  } else {
    return callback(null, {
      statusCode: 400,
      headers,
      body: 'Missing Email Paramter'
    })
  }
}