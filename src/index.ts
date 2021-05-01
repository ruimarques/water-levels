/* eslint-disable @typescript-eslint/no-var-requires */

const babar = require('babar');

export * from './lib/async';
export * from './lib/number';

const DEBUG = false;

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

function handleRainOverflow(
  buckets: number[],
  index: number,
  newValue: number,
  canOverflowLeft: boolean,
  canOverflowRight: boolean
) {
  if (canOverflowLeft && canOverflowRight) {
    const differenceLeft = newValue - buckets[index - 1];
    const differenceRight = newValue - buckets[index + 1];

    if (DEBUG) {
      console.log(
        `Difference for BOTH! i=${index} val=${newValue} left=${differenceLeft} right=${differenceRight} buckets=${buckets}`
      );
    }

    if (differenceLeft > differenceRight) {
      // This means left value is lower than right
      buckets[index] = newValue - differenceLeft;
      rec(buckets, index - 1, differenceLeft);
    } else if (differenceRight > differenceLeft) {
      // This means right value is lower than left
      buckets[index] = newValue - differenceRight;
      rec(buckets, index + 1, differenceRight);
    } else {
      // This means differenceRight === differenceLeft
      // TODO could split difference by 3 (left, current, right)...

      buckets[index] = newValue - differenceRight;
      rec(buckets, index + 1, differenceRight / 2);
      rec(buckets, index - 1, differenceRight / 2);
    }
  } else if (canOverflowLeft) {
    const difference = newValue - buckets[index - 1];
    buckets[index] = newValue - difference;

    if (DEBUG) {
      console.log(
        `Difference for left! ${newValue}, ${difference} / ${index} > ${buckets}`
      );
    }

    rec(buckets, index - 1, difference);
  } else if (canOverflowRight) {
    const difference = newValue - buckets[index + 1];
    buckets[index] = newValue - difference;

    if (DEBUG) {
      console.log(
        `Difference for right! ${newValue}, ${difference} / ${index} > ${buckets}`
      );
    }

    rec(buckets, index + 1, difference);
  }
}

function rec(buckets: number[], index: number, rain: number) {
  if (DEBUG) {
    console.log(`rec index ${index}, rain ${rain}`, buckets);
  }

  const canFlowRight = canFlowRightByIndex(buckets, index);
  const canFlowLeft = canFlowLeftByIndex(buckets, index);
  const leftIsEqual = buckets[index - 1] === buckets[index];
  const rightIsEqual = buckets[index + 1] === buckets[index];

  if (headWithEqualNeighbours(buckets, index)) {
    // This is when index is the head (first index) and the neighbour value is equal
    buckets[index] += rain / 2;
    buckets[index + 1] += rain / 2;
  } else if (tailWithEqualNeighbours(buckets, index)) {
    // This is when index is the tail (last index) and the neighbour value is equal
    buckets[index] += rain / 2;
    buckets[index - 1] += rain / 2;
  } else if (canFlowRight && canFlowLeft) {
    if (rightIsEqual && !leftIsEqual) {
      // This means that right is equal to current position
      // but left is lower, so we go left

      rec(buckets, index - 1, rain);
    } else if (leftIsEqual && !rightIsEqual) {
      // This means that left is equal to current position
      // but right is lower, so we go right

      rec(buckets, index + 1, rain);
    } else {
      // Current position is equal to BOTH neighbours
      // TODO: could split by 3 (left, current, right)...

      buckets[index - 1] += rain / 2;
      buckets[index + 1] += rain / 2;
    }
  } else if (canFlowRight) {
    rec(buckets, index + 1, rain);
  } else if (canFlowLeft) {
    rec(buckets, index - 1, rain);
  } else if (!canFlowRight && !canFlowLeft) {
    const newValue = buckets[index] + rain;
    const canOverflowLeft = canFlowLeftByValue(buckets, index, newValue);
    const canOverflowRight = canFlowRightByValue(buckets, index, newValue);

    // Checking if adding rain to current position
    // will need to overflow some water to the sides
    if (canOverflowLeft || canOverflowRight) {
      handleRainOverflow(
        buckets,
        index,
        newValue,
        canOverflowLeft,
        canOverflowRight
      );
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
    console.log(babar(prepareForChart(buckets), barChartConfig));
  }

  return buckets;
}
