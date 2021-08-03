interface ProtocolPacket {
  sessionName: string,
  sessionDate: string,
  exerciseName: string,
  exerciseProtocol: string
}

interface Plan {
  sessions: Array<Session>
}

interface Session {
  date: string
}

interface Booking {
  datetime: string
}

export const mixins: any = {

  // -----------------------------
  // System
  // -----------------------------

  /**
   * Toggles body scroll.
   * @param {boolean} state
   */
  willBodyScroll (state: boolean): void {
    const BODY = document.getElementsByTagName('body')[0]
    state ? BODY.style.overflow = 'auto' : BODY.style.overflow = 'hidden'
  },

  // -----------------------------
  // Protocol
  // -----------------------------

  /**
   * Extracts anything that is wrapped in square brackets
   * @param {string} sessionName - The title or name of the session.
   * @param {string} text - The body or notes of the session.
   * @param {string} sessionDate - The date of the session.
   * @returns Data packets of exercises
   */
  pull_protocols (sessionName: string, text: string, sessionDate: string): Array<ProtocolPacket> {
    const REGEX_EXTRACT_EXERCISES = /\[\s*(.*?)\s*:\s*(.*?)\]/gi
    const REGEX_EXTRACT_EXERCISES_NEW = /<div data-type="protocol-item">\s*(.*?)\s*:\s*(.*?)<\/div>/gi
    const RETURN_PACKETS: Array<ProtocolPacket> = []
    let finderNew: any
    while ((finderNew = REGEX_EXTRACT_EXERCISES_NEW.exec(text)) !== null) {
      if (finderNew.index === REGEX_EXTRACT_EXERCISES_NEW.lastIndex) {
        REGEX_EXTRACT_EXERCISES_NEW.lastIndex++
      }
      const PACKET_BUILDER: ProtocolPacket = {
        sessionName,
        sessionDate,
        exerciseName: '',
        exerciseProtocol: ''
      }
      finderNew.forEach((match: string, groupIndex: number) => {
        if (groupIndex === 1) {
          PACKET_BUILDER.exerciseName = match.replace(/<[^>]*>?/gmi, '')
        } else if (groupIndex === 2) {
          PACKET_BUILDER.exerciseProtocol = match.replace(/<[^>]*>?/gmi, '')
        }
      })
      RETURN_PACKETS.push(PACKET_BUILDER)
    }
    let finderOld: any
    const HTML_REMOVED_TAGS = text.replace(/<[^>]*>?/gmi, '')
    while ((finderOld = REGEX_EXTRACT_EXERCISES.exec(HTML_REMOVED_TAGS)) !== null) {
      if (finderOld.index === REGEX_EXTRACT_EXERCISES.lastIndex) {
        REGEX_EXTRACT_EXERCISES.lastIndex++
      }
      const PACKET_BUILDER: ProtocolPacket = {
        sessionName,
        sessionDate,
        exerciseName: '',
        exerciseProtocol: ''
      }
      finderOld.forEach((match: string, groupIndex: number) => {
        if (groupIndex === 1) {
          PACKET_BUILDER.exerciseName = match
        } else if (groupIndex === 2) {
          PACKET_BUILDER.exerciseProtocol = match
        }
      })
      RETURN_PACKETS.push(PACKET_BUILDER)
    }
    return RETURN_PACKETS
  },

  // HTML

  /**
   * Processes the HTML before preview or injection to expected standards.
   * @param {string} html - The HTML input or to be displayed.
   * @param {boolean} rmBrackets - To show the square brackets or not in the processed returned HTML.
   * @returns The processed html ready to view or injected into a editor.
   */
  updateHTML (html: string, rmBrackets: boolean): string {
    if (html === null) {
      return html
    }
    const REGEX_IFRAME = /<iframe[^>]+src="([^"]+)"><\/iframe>/gi
    let m: any
    const TO_UPDATE_ARRAY: Array<Array<string>> = []
    while ((m = REGEX_IFRAME.exec(html)) !== null) {
      if (m.index === REGEX_IFRAME.lastIndex) {
        REGEX_IFRAME.lastIndex++
      }
      const MATCH_EXTRACT_COLLECTOR: Array<string> = []
      m.forEach((match: string, groupIndex: number) => {
        if (groupIndex === 1) {
          MATCH_EXTRACT_COLLECTOR.push(match)
          TO_UPDATE_ARRAY.push(MATCH_EXTRACT_COLLECTOR)
        } else {
          MATCH_EXTRACT_COLLECTOR.push(match)
        }
      })
    }
    TO_UPDATE_ARRAY.forEach((item: Array<string>) => {
      html = html.replace(item[0], `<a href="${item[1]}" rel="noopener noreferrer nofollow">Watch video</a>`)
    })
    html = rmBrackets ? html.replace(/[[\]]/g, '') : html
    return html.replace('onclick="resize(this)"', '').replace(/contenteditable="true"/gi, '')
  },

  // Date

  /**
   * @returns Today's date in YYY-MM-DD.
   */
  today (): string {
    const DATE = new Date()
    const YEAR = DATE.getFullYear()
    const MONTH = String(DATE.getMonth() + 1).padStart(2, '0')
    const DAY = String(DATE.getDate()).padStart(2, '0')
    return `${YEAR}-${MONTH}-${DAY}`
  },

  /**
   * @returns The current time in HH:MM.
   */
  timeNow (): string {
    const DATE = new Date()
    const HOUR = String(DATE.getHours()).padStart(2, '0')
    const MIN = String(DATE.getMinutes()).padStart(2, '0')
    return `${HOUR}:${MIN}`
  },

  /**
   * Takes in the date and returns the day of the week.
   * @param {st} date - The day of the week
   * @returns The day of the week.
   */
  day (date: string): string {
    const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return WEEKDAY[new Date(date).getDay()]
  },

  /**
   * Process into a short-form datetime.
   * @param {string} datetime - The input datetime.
   * @returns Short-form datetime.
   */
  shortTime (datetime: string): string {
    const TIME = new Date(datetime)
    return `${TIME.getHours()}:${(TIME.getMinutes() < 10 ? '0' : '') + TIME.getMinutes()}`
  },

  /**
   * Adds days to the date provided.
   * @param {string} date - The date to add days to.
   * @param {number} days - The number of days to add to date.
   * @returns The processed date.
   */
  addDays (date: string, days: number): string {
    const DATE = new Date(date)
    DATE.setDate(DATE.getDate() + days)
    const YEAR = DATE.getFullYear()
    const MONTH = DATE.getMonth() + 1
    const DAY = DATE.getDate()
    return `${YEAR}-${MONTH}-${DAY}`
  },

  // Tidy

  /**
   * Sorts the sessions of a plan.
   * @param {Plan} plan - The plan of which sessions would be sorted.
   * @returns The plan with sorted sessions by date.
   */
  sort_sessions (plan: Plan): Plan {
    if (plan.sessions) {
      plan.sessions.sort((a, b) => {
        return Number(new Date(a.date)) - Number(new Date(b.date))
      })
    }
    return plan
  },

  /**
   * Gives proper casing to text.
   * @param {string} string - The text to receive proper casing.
   * @returns The proper-cased text.
   */
  proper_case (string: string): string {
    const SENTENCE = string.toLowerCase().split(' ')
    for (let i = 0; i < SENTENCE.length; i++) {
      SENTENCE[i] = SENTENCE[i][0].toUpperCase() + SENTENCE[i].slice(1)
    }
    return SENTENCE.join(' ')
  },

  // Other

  /**
   * Determines if a colour has acceptable contrast and returns ideal colour.
   * @param {string} hex - The current colour.
   * @returns The appropriate text colour.
   */
  accessible_colors (hex: string): string {
    if (hex !== undefined) {
      hex = hex.replace('#', '')
      const RED = parseInt(hex.substring(0, 2), 16)
      const GREEN = parseInt(hex.substring(2, 4), 16)
      const BLUE = parseInt(hex.substring(4, 6), 16)
      const RESULT = ((((RED * 299) + (GREEN * 587) + (BLUE * 114)) / 1000) - 128) * -1000
      return `rgb(${RESULT}, ${RESULT}, ${RESULT})`
    } else {
      return ''
    }
  },

  /**
   * Determines the colour of the text for booking statuses.
   * @param {string} status - The status of the booking.
   * @returns The colour of the text.
   */
  statusColor (status: string): string {
    switch (status) {
      case 'Pending' || 'Past':
        return 'var(--base_light)'
      case 'Scheduled':
        return 'var(--base_green)'
      case 'Cancelled' || 'Declined':
        return 'var(--base_red)'
      default:
        return ''
    }
  },

  /**
   * Checks if the booking is in the past.
   * @param {Booking} booking- The booking.
   * @returns A boolean of if the booking is in the past.
   */
  isInThePast (booking: Booking): boolean {
    return new Date(booking.datetime) < new Date()
  },

  /**
   * Make a data have fixed decimal places.
   * @param {string} data - The data to have decimals.
   * @param {number} dp - The number of decimal places.
   * @returns The data with specified decimal places.
   */
  makeDecimals (data: string, dp: number): string {
    return parseFloat(data).toFixed(dp)
  }
}