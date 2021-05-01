/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
const babar = require('babar');

export * from './lib/async';
export * from './lib/number';

const DEBUG = true;

const barChartConfig = {
  minY: -1,
  minX: 0,
  yFractions: 0,
  xFractions: 0,
};

function prepareForChart(buckets: number[]) {
  const result = [];
  for (let i = 0; i < buckets.length; i++) {
    result.push([i + 1, buckets[i]]);
  }
  return result;
}

function validNeighbourIndexes(buckets: number[], currentIndex: number) {
  const result: number[] = [];
  if (canFlowLeftByIndex(buckets, currentIndex)) {
    result.push(currentIndex - 1);
  }

  if (canFlowRightByIndex(buckets, currentIndex)) {
    result.push(currentIndex + 1);
  }

  return result;
}

function amountToFlow(bucketValue: number, rain: number) {}

function updateNeighbours(buckets: number[], neighbours: number[]) {
  const result = [...buckets];
  if (neighbours.length < 1) {
    return result;
  }
  return result;
}

function flowRight(buckets: number[], index: number) {
  if (canFlowRightByIndex(buckets, index)) {
  }
}

function canFlowRightByValue(
  buckets: number[],
  index: number,
  newValue: number
) {
  if (index < buckets.length - 1 && newValue > buckets[index + 1]) {
    return true;
  }
  return false;
}

function canFlowLeftByValue(
  buckets: number[],
  index: number,
  newValue: number
) {
  if (index > 0 && newValue > buckets[index - 1]) {
    return true;
  }
  return false;
}

function canFlowRightByIndex(buckets: number[], currentIndex: number) {
  if (
    currentIndex < buckets.length - 1 &&
    buckets[currentIndex] >= buckets[currentIndex + 1]
  ) {
    return true;
  }
  return false;
}

function canFlowLeftByIndex(buckets: number[], currentIndex: number) {
  if (currentIndex > 0 && buckets[currentIndex - 1] <= buckets[currentIndex]) {
    return true;
  }
  return false;
}

function headWithEqualNeighbours(buckets: number[], index: number) {
  return index === 0 && buckets[index] === buckets[index + 1];
}

function tailWithEqualNeighbours(buckets: number[], index: number) {
  return index === buckets.length - 1 && buckets[index] === buckets[index - 1];
}

// Edge case: rec index 1, rain 1 [ 7, 7, 6.5, 6.5, 8, 9 ]
// algo gets stuck in a loop between index 2 and 3
function rec(buckets: number[], index: number, rain: number) {
  if (DEBUG) {
    console.log(`rec index ${index}, rain ${rain}`, buckets);
  }

  const canFlowRight = canFlowRightByIndex(buckets, index);
  const canFlowLeft = canFlowLeftByIndex(buckets, index);
  const leftIsEqual = buckets[index - 1] === buckets[index];
  const rightIsEqual = buckets[index + 1] === buckets[index];

  if (headWithEqualNeighbours(buckets, index)) {
    // This is when index is the head and the neighbour value is equal
    buckets[index] += rain / 2;
    buckets[index + 1] += rain / 2;
    console.log('head');
  } else if (tailWithEqualNeighbours(buckets, index)) {
    // This is when index is the tail and the neighbour value is equal
    buckets[index] += rain / 2;
    buckets[index - 1] += rain / 2;
    console.log('tail');
  } else if (canFlowRight && canFlowLeft) {
    if (rightIsEqual && !leftIsEqual) {
      console.log(1);

      // go left
      rec(buckets, index - 1, rain);
    } else if (leftIsEqual && !rightIsEqual) {
      console.log(2);
      // go right
      rec(buckets, index + 1, rain);
    } else {
      console.log(3);
      // split in half
      // rec(buckets, index + 1, rain / 2);
      // rec(buckets, index - 1, rain / 2);
      buckets[index - 1] += rain / 2;
      buckets[index + 1] += rain / 2;
    }
  } else if (canFlowRight) {
    // console.log(`flowright index ${index} value ${buckets[index]}`);
    rec(buckets, index + 1, rain);
  } else if (canFlowLeft) {
    rec(buckets, index - 1, rain);
  } else if (!canFlowRight && !canFlowLeft) {
    // console.log(`sum index ${index}`);
    const newValue = buckets[index] + rain;

    // Checking if adding rain to current position
    // will need to overflow some water to the sides
    if (canFlowLeftByValue(buckets, index, newValue)) {
      const difference = newValue - buckets[index - 1];
      buckets[index] = newValue - difference;

      if (DEBUG) {
        console.log(
          `Difference for left! ${newValue}, ${difference} / ${index} > ${buckets}`
        );
      }

      rec(buckets, index - 1, difference);
    } else if (canFlowRightByValue(buckets, index, newValue)) {
      const difference = newValue - buckets[index + 1];
      buckets[index] = newValue - difference;

      if (DEBUG) {
        console.log(
          `Difference for right! ${newValue}, ${difference} / ${index} > ${buckets}`
        );
      }

      rec(buckets, index + 1, difference);
    } else {
      buckets[index] = newValue;
    }
  }
}

export function runAlgo(hours: number, buckets: number[]) {
  if (DEBUG) {
    console.log('Starting (hours, buckets):', hours, buckets);
  }

  for (let i = 1; i <= hours; i++) {
    if (DEBUG) {
      console.log('HOUR # ', i);
    }
    for (let i = 0; i < buckets.length; i++) {
      if (DEBUG) {
        console.log('BUCKET # ', i);
      }
      rec(buckets, i, 1);

      if (DEBUG) {
        console.log(`Result bucket ${i}:`, buckets);
      }
    }
  }

  if (DEBUG) {
    console.log('Final Result: ', buckets);

    console.log(babar(prepareForChart(buckets), barChartConfig));
  }

  return buckets;
}
