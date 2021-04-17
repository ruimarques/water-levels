import { Command } from 'commander';
import { truncate } from 'node:fs';
const babar = require('babar');

export * from './lib/async';
export * from './lib/number';

const barChartConfig = {
  minY: -1,
  minX: 0,
  yFractions: 0,
  xFractions: 0,
};

const program = new Command();

const buckets = [3, 1, 6, 4, 8, 9];

// console.log(
//   babar(
//     [
//       [1, 3],
//       [2, 1],
//       [3, 6],
//       [4, 4],
//       [5, 8],
//       [6, 9],
//     ],
//     barChartConfig
//   )
// );

function prepareForChart(buckets: number[]) {
  const result = [];
  for (let i = 0; i < buckets.length; i++) {
    result.push([i + 1, buckets[i]]);
  }
  return result;
}

function validRight(buckets: number[], currentIndex: number) {
  if (
    currentIndex < buckets.length - 1 &&
    buckets[currentIndex] >= buckets[currentIndex + 1]
  ) {
    return true;
  }
  return false;
}

function validLeft(buckets: number[], currentIndex: number) {
  if (currentIndex > 0 && buckets[currentIndex - 1] < buckets[currentIndex]) {
    return true;
  }
  return false;
}

function validNeighbourIndexes(buckets: number[], currentIndex: number) {
  const result: number[] = [];
  if (validLeft(buckets, currentIndex)) {
    result.push(currentIndex - 1);
  }

  if (validRight(buckets, currentIndex)) {
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
}

function flowRight(buckets: number[], index: number) {
  if (validRight(buckets, index)) {
  }
}

function rec(buckets: number[], index: number) {
  console.log(`rec index ${index}:`, buckets);
  if (!validRight(buckets, index) && !validLeft(buckets, index)) {
    // console.log(`sum index ${index}`);
    buckets[index] += 1;
    return;
  }

  if (validRight(buckets, index)) {
    // console.log(`flowright index ${index} value ${buckets[index]}`);
    rec(buckets, index + 1);
  } else if (validLeft(buckets, index)) {
    rec(buckets, index - 1);
  }
}

program
  .version('0.1.0')
  .arguments('<hours> ')
  .description('test command', {
    hours: 'rain hours',
  })
  .action((hours) => {
    console.log('rain hours:', hours);

    for (let i = 0; i < buckets.length; i++) {
      // buckets[i] += hours;
      // console.log('i: ', buckets.length, validNeighbourIndexes(buckets, i));
    }

    for (let i = 1; i <= hours; i++) {
      console.log('hour: ', i);
      for (let i = 0; i < buckets.length; i++) {
        console.log('bucket: ', i);
        rec(buckets, i);
        console.log(`result bucket ${i}:`, buckets);
      }
    }

    console.log('final result: ', buckets);

    console.log(babar(prepareForChart(buckets), barChartConfig));
  });

program.parse();
