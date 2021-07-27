/**
 * @file Contains the class to extract data from exercise protocols.
 * @author Train In Blocks
 * @version 1.0 
 */

/**
 * @class Represents the data extracted from the protocols provided.
 */
export default class ExtractedData {
  static regexSetsReps = /(\d*)x((\d*\/*)*)/gi
  static regexLoad = /at\s*((\d\.*\/*)*)\s*\w*/gi
  static regexGetNumber = /[0-9.]+/gi

  vueParent: VueParent
  sessionName: string
  sessionDate: string
  exerciseName: string
  protocol: string
  returnDataType: string

  /**
   * Starts the extraction process.
   * @param vueParent - The vue parent component.
   * @param dataPacket - The data to extract from.
   * @param returnDataType - The type of data to extract. E.g., sets, reps, load, etc.
   */
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
    while ((finder = ExtractedData.regexSetsReps.exec(this.protocol)) !== null) {
      if (finder.index === ExtractedData.regexSetsReps.lastIndex) {
        ExtractedData.regexSetsReps.lastIndex++
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
    return returnValue ?? 0
  }

  /**
    * Extracts the reps.
    * @returns The extracted value.
    */
  private getReps () {
    const NUM_OF_SETS = this.getSets(false)
    let returnValue
    let repsFinder
    while ((repsFinder = ExtractedData.regexSetsReps.exec(this.protocol)) !== null) {
      if (repsFinder.index === ExtractedData.regexSetsReps.lastIndex) {
        ExtractedData.regexSetsReps.lastIndex++
      }
      repsFinder.forEach((repsMatch, repsIndex) => {
        if (repsIndex === 2) {
          if (repsMatch.includes('/')) {
            const SPLIT_VALUE = repsMatch.split('/').map(Number)
            returnValue = SPLIT_VALUE.reduce((a, b) => a + b)
            const LARGEST = Math.max(...SPLIT_VALUE)
            const SMALLEST = Math.min(...SPLIT_VALUE)
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
    return returnValue ?? 0
  }

  /**
    * Extracts the loads.
    * @returns The extracted value.
    */
  private getLoad () {
    const NUM_OF_SETS = this.getSets(false)
    let returnValue
    let loadFinder
    while ((loadFinder = ExtractedData.regexLoad.exec(this.protocol)) !== null) {
      if (loadFinder.index === ExtractedData.regexLoad.lastIndex) {
        ExtractedData.regexLoad.lastIndex++
      }
      loadFinder.forEach((loadMatch, loadIndex) => {
        if (loadIndex === 1) {
          if (loadMatch.includes('/')) {
            const SPLIT_VALUE = loadMatch.split('/').map(Number)
            returnValue = SPLIT_VALUE.reduce((a, b) => a + b)
            const LARGEST = Math.max(...SPLIT_VALUE)
            const SMALLEST = Math.min(...SPLIT_VALUE)
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
    return returnValue ?? 0
  }

  /**
    * Extracts all other measures.
    * @returns The extracted value.
    */
  private getOtherMeasure () {
    let returnValue
    let numberFinder
    while ((numberFinder = ExtractedData.regexGetNumber.exec(this.protocol)) !== null) {
      if (numberFinder.index === ExtractedData.regexGetNumber.lastIndex) {
        ExtractedData.regexGetNumber.lastIndex++
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