export default class DataProcessor {

  private outputType: string
  private maxValue: number
  private relativeToDate: boolean = false
  private yDataset: Array<number> 
  private xDataset: Array<number> 
  private pointLabels: Array<string> 
  private processedPoints: Array<any> = []
  private scaledXDataset: Array<number> = []
  private scaledYDataset: Array<number> = []
  private xSampleMean: number = 0
  private ySampleMean: number = 0
  private xSampleSD: number = 0
  private ySampleSD: number = 0
  private gradient: number = 0
  private yIntercept: number = 0
  private rCorrelation: number = 0
  private accuracy: number = 0

  constructor (yDataset: Array<number>, xDataset: Array<number>, pointLabels: Array<string>, outputType: string) {
    this.yDataset = yDataset
    this.xDataset = xDataset
    this.pointLabels = pointLabels
    this.outputType = outputType
    this.maxValue = Math.max(...yDataset)
  }

  get create () {
    switch (this.outputType) {
    case 'line':
      this.relativeToDate = false
      this.makePoints(false)
      return {
        processedPoints: this.processedPoints,
        processedPaths: this.makePaths()
      }
    case 'scatter':
      this.relativeToDate = true
      this.makePoints(false)
      return {
        processedPoints: this.makePoints(true),
        processedPaths: this.regression()
      }
    }
  }

  /**
   * Instantiates the points.
   * @param {boolean} toReturn - Whether to return the positional data.
   * @returns If specified, the positional data of the point.
   */
  makePoints (toReturn: boolean) {
    const RETURN_DATA_VALUES: Array<any> = []
    this.yDataset.forEach((data, index) => {
      function relativeInterval (xDataset: Array<number>, index: number) {
        const sumOfPrevious = () => {
          let returnSum: number = 0
          for (let i = 0; i < index; i++) {
              returnSum += xDataset[i]
          }
          return returnSum
        }
        const SUM_OF_DATE_DAYS: number = xDataset.reduce((a, b) => a + (b || 0))
        const RETURN_INTERVAL_VALUE = index !== 0 ? (90 / SUM_OF_DATE_DAYS) * sumOfPrevious() : 5
        return RETURN_INTERVAL_VALUE
      }
      RETURN_DATA_VALUES.push([
        [
          this.relativeToDate ? relativeInterval(this.xDataset, index) : ((90 / this.yDataset.length) * (index + 1)),
          90 - (data * 0.8 / this.maxValue) * 100
        ],
        data,
        this.pointLabels[index][0],
        this.pointLabels[index][1]
      ])
    })
    if (toReturn) {
      return RETURN_DATA_VALUES
    } else {
      this.processedPoints = RETURN_DATA_VALUES
    }
  }

  /**
   * Creates the path to connect each point.
   * @returns The path data.
   */
  makePaths () {
    const RETURN_PATH_VALUES: Array<any> = []
    this.processedPoints.forEach((data, index) => {
      if (index < this.processedPoints.length - 1) {
        RETURN_PATH_VALUES.push([
          data[0][0],
          data[0][1],
          this.processedPoints[index + 1][0][0],
          this.processedPoints[index + 1][0][1]
        ])
      }
    })
    return RETURN_PATH_VALUES
  }

  /**
   * Calculates a least-squares regression.
   * @returns The path for the regression line.
   */
  regression () {
    this.scaledXDataset = []
    this.scaledYDataset = []
    this.processedPoints.forEach((point) => {
    this.scaledXDataset.push(point[0][0])
    this.scaledYDataset.push(point[0][1])
    })

    // Sample means
    this.xSampleMean = this.scaledXDataset.reduce((a, b) => a + b) / this.scaledXDataset.length
    this.ySampleMean = this.scaledYDataset.reduce((a, b) => a + b) / this.scaledYDataset.length

    // Sample SDs
    const standardDeviation = (dataset: Array<number>, sampleMean: number) => {
      const SUM_OF_SQUARES: Array<number> = []
      dataset.forEach((datapoint) => {
        SUM_OF_SQUARES.push(Math.pow((datapoint - sampleMean), 2))
      })
      return Math.sqrt(SUM_OF_SQUARES.reduce((a, b) => a + b) / (dataset.length - 1))
    }
    this.xSampleSD = standardDeviation(this.scaledXDataset, this.xSampleMean)
    this.ySampleSD = standardDeviation(this.scaledYDataset, this.ySampleMean)

    // Pearson's correlation
    const SUM_OF_POINTS: Array<number> = []
    for (let i = 0; i < this.scaledXDataset.length; i++) {
      SUM_OF_POINTS.push(((this.scaledXDataset[i] - this.xSampleMean) / this.xSampleSD) * ((this.scaledYDataset[i] - this.ySampleMean) / this.ySampleSD))
    }
    this.rCorrelation = (SUM_OF_POINTS.reduce((a, b) => a + b) / (this.scaledXDataset.length - 1))

    // Equation attributes
    this.gradient = this.rCorrelation * this.ySampleSD / this.xSampleSD
    this.yIntercept = this.ySampleMean - this.gradient * this.xSampleMean

    // Line plot
    const y = (x: number) => {
      return this.gradient * x + this.yIntercept
    }
    const accuracy = () => {
      const SUM_OF_SQUARES: Array<number> = []
      for (const index in this.scaledXDataset) {
        SUM_OF_SQUARES.push(Math.pow(this.scaledYDataset[index] - y(this.scaledXDataset[index]), 2))
      }
      return Math.sqrt(SUM_OF_SQUARES.reduce((a, b) => a + b) / this.scaledXDataset.length)
    }
    this.accuracy = accuracy()
    return [[5, y(5), 90, y(90)]]
  }
}