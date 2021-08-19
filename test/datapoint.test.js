const DataPoint = require('../src/components/js/datapoint')

describe('Stats datapoint class', () => {
  const DATA_PACKET = {
    sessionName: 'Unit test session',
    sessionDate: '2020-07-02',
    exerciseName: 'Test exercise name'
  }
  const TEST_PROTOCOLS = [
    '3 x 10/8/6 at 50/60/70',
    '3 x 12 at 50'
  ]

  let parent
  beforeEach(() => {
    parent = {
      smallestValue: null,
      largestValue: null
    }
  })

  it.each([
    { exerciseProtocol: TEST_PROTOCOLS[0], expected: 3 },
    { exerciseProtocol: TEST_PROTOCOLS[1], expected: 3 }
  ])('Getting sets', ({ exerciseProtocol, expected }) => {
    const DP = (new DataPoint(parent, { ...DATA_PACKET, exerciseProtocol }, 'sets')).calculate
    expect(DP).toEqual(expected)
  })

  it.each([
    { exerciseProtocol: TEST_PROTOCOLS[0], expected: 10 + 8 + 6, expectedSmallest: 6, expectedLargest: 10 },
    { exerciseProtocol: TEST_PROTOCOLS[1], expected: 3 * 12, expectedSmallest: 12, expectedLargest: 12 }
  ])('Getting reps', ({ exerciseProtocol, expected, expectedSmallest, expectedLargest }) => {
    const DP = (new DataPoint(parent, { ...DATA_PACKET, exerciseProtocol }, 'reps')).calculate
    expect(DP).toEqual(expected)
    expect(parent.smallestValue).toEqual(expectedSmallest)
    expect(parent.largestValue).toEqual(expectedLargest)
  })

  it.each([
    { exerciseProtocol: TEST_PROTOCOLS[0], expected: 50 + 60 + 70, expectedSmallest: 50, expectedLargest: 70 },
    { exerciseProtocol: TEST_PROTOCOLS[1], expected: 3 * 50, expectedSmallest: 50, expectedLargest: 50 }
  ])('Getting load', ({ exerciseProtocol, expected, expectedSmallest, expectedLargest }) => {
    const DP = (new DataPoint(parent, { ...DATA_PACKET, exerciseProtocol }, 'load')).calculate
    expect(DP).toEqual(expected)
    expect(parent.smallestValue).toEqual(expectedSmallest)
    expect(parent.largestValue).toEqual(expectedLargest)
  })

  it.each([
    { exerciseProtocol: TEST_PROTOCOLS[0], expected: (50 + 60 + 70) * (10 + 8 + 6) },
    { exerciseProtocol: TEST_PROTOCOLS[1], expected: 3 * 12 * 3 * 50 }
  ])('Getting volume', ({ exerciseProtocol, expected }) => {
    const DP = (new DataPoint(parent, { ...DATA_PACKET, exerciseProtocol }, 'volume')).calculate
    expect(DP).toEqual(expected)
  })
})
