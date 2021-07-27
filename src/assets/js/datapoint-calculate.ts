export default class DataPoint {
  static regexSetsReps = /(\d*)x((\d*\/*)*)/gi
  static regexLoad = /at\s*((\d\.*\/*)*)\s*\w*/gi
  static regexGetNumber = /[0-9.]+/gi

  vueParent: VueParent
  sessionName: string
  sessionDate: string
  exerciseName: string
  protocol: string
  returnDataType: string

  public constructor (vueParent: VueParent, dataPacket: DataPacket, returnDataType: string) {
    this.vueParent = vueParent
    this.sessionName = dataPacket.sessionName
    this.sessionDate = dataPacket.sessionDate
    this.exerciseName = dataPacket.exerciseName
    this.protocol = dataPacket.exerciseProtocol.replace(/\s/g, '')
    this.returnDataType = returnDataType
  }

  /**
    * Indexes the correct function to extract for each type of data.
    * @returns The extracted value.
    */
  public calculate () {
    switch (this.returnDataType) {
      case 'Sets':
        return this.getSets(true)
      case 'Reps':
        return this.getReps()
      case 'Load':
        return this.getLoad()
      case 'Volume':
        return this.getReps() * this.getLoad()
      case 'Other':
        return this.getOtherMeasure()
    }
  }

  /**
    * Extracts the sets.
    * @param {boolean} returnAdditionalDescData - Whether to load the largest and smallest value to Vue data.
    * @returns The extracted value.
    */
  private getSets (returnAdditionalDescData: boolean) {
    let returnValue
    let finder
    while ((finder = DataPoint.regexSetsReps.exec(this.protocol)) !== null) {
      if (finder.index === DataPoint.regexSetsReps.lastIndex) {
        DataPoint.regexSetsReps.lastIndex++
      }
      finder.forEach((setsMatch, setsIndex) => {
        if (setsIndex === 1) {
          returnValue = parseFloat(setsMatch)
          if (returnAdditionalDescData) {
            this.vueParent.largestValue = this.vueParent.largestValue === null ? parseFloat(setsMatch) : (this.vueParent.largestValue < parseFloat(setsMatch) ? parseFloat(setsMatch) : this.vueParent.largestValue)
            this.vueParent.smallestValue = this.vueParent.smallestValue === null ? parseFloat(setsMatch) : (this.vueParent.smallestValue > parseFloat(setsMatch) ? parseFloat(setsMatch) : this.vueParent.smallestValue)
          }
        }
      })
    }
    return returnValue
  }

  /**
    * Extracts the reps.
    * @returns The extracted value.
    */
  private getReps () {
    const NUM_OF_SETS = this.getSets(false)
    let returnValue = 0
    let repsFinder
    while ((repsFinder = DataPoint.regexSetsReps.exec(this.protocol)) !== null) {
      if (repsFinder.index === DataPoint.regexSetsReps.lastIndex) {
        DataPoint.regexSetsReps.lastIndex++
      }
      repsFinder.forEach((repsMatch, repsIndex) => {
        if (repsIndex === 2) {
          if (repsMatch.includes('/')) {
            const SPLIT_VALUE = repsMatch.split('/').map(Number)
            returnValue = SPLIT_VALUE.reduce((a, b) => a + b)
            const LARGEST = Math.max(SPLIT_VALUE)
            const SMALLEST = Math.min(SPLIT_VALUE)
            this.vueParent.largestValue = this.vueParent.largestValue === null ? LARGEST : (this.vueParent.largestValue < LARGEST ? LARGEST : this.vueParent.largestValue)
            this.vueParent.smallestValue = this.vueParent.smallestValue === null ? SMALLEST : (this.vueParent.smallestValue > SMALLEST ? SMALLEST : this.vueParent.smallestValue)
          } else {
            returnValue = parseFloat(repsMatch) * NUM_OF_SETS
            this.vueParent.largestValue = this.vueParent.largestValue === null ? parseFloat(repsMatch) : (this.vueParent.largestValue < parseFloat(repsMatch) ? parseFloat(repsMatch) : this.vueParent.largestValue)
            this.vueParent.smallestValue = this.vueParent.smallestValue === null ? parseFloat(repsMatch) : (this.vueParent.smallestValue > parseFloat(repsMatch) ? parseFloat(repsMatch) : this.vueParent.smallestValue)
          }
        }
      })
    }
    return returnValue
  }

  /**
    * Extracts the loads.
    * @returns The extracted value.
    */
  private getLoad () {
    const NUM_OF_SETS = this.getSets(false)
    let returnValue = 0
    let loadFinder
    while ((loadFinder = DataPoint.regexLoad.exec(this.protocol)) !== null) {
      if (loadFinder.index === DataPoint.regexLoad.lastIndex) {
        DataPoint.regexLoad.lastIndex++
      }
      loadFinder.forEach((loadMatch, loadIndex) => {
        if (loadIndex === 1) {
          if (loadMatch.includes('/')) {
            const SPLIT_VALUE = loadMatch.split('/').map(Number)
            returnValue = SPLIT_VALUE.reduce((a, b) => a + b)
            const LARGEST = Math.max(SPLIT_VALUE)
            const SMALLEST = Math.min(SPLIT_VALUE)
            this.vueParent.largestValue = this.vueParent.largestValue === null ? LARGEST : (this.vueParent.largestValue < LARGEST ? LARGEST : this.vueParent.largestValue)
            this.vueParent.smallestValue = this.vueParent.smallestValue === null ? SMALLEST : (this.vueParent.smallestValue > SMALLEST ? SMALLEST : this.vueParent.smallestValue)
          } else {
            returnValue = parseFloat(loadMatch) * NUM_OF_SETS
            this.vueParent.largestValue = this.vueParent.largestValue === null ? parseFloat(loadMatch) : (this.vueParent.largestValue < parseFloat(loadMatch) ? parseFloat(loadMatch) : this.vueParent.largestValue)
            this.vueParent.smallestValue = this.vueParent.smallestValue === null ? parseFloat(loadMatch) : (this.vueParent.smallestValue > parseFloat(loadMatch) ? parseFloat(loadMatch) : this.vueParent.smallestValue)
          }
        }
      })
    }
    return returnValue
  }

  /**
    * Extracts all other measures.
    * @returns The extracted value.
    */
  private getOtherMeasure () {
    let returnValue
    let numberFinder
    while ((numberFinder = DataPoint.regexGetNumber.exec(this.protocol)) !== null) {
      if (numberFinder.index === DataPoint.regexGetNumber.lastIndex) {
        DataPoint.regexGetNumber.lastIndex++
      }
      numberFinder.forEach((numberMatch) => {
        returnValue = parseFloat(numberMatch)
      })
    }
    return returnValue
  }
}

interface VueParent {
  largestValue: number
  smallestValue: number
}

interface DataPacket {
  sessionName: string
  sessionDate: string
  exerciseName: string
  exerciseProtocol:string
}