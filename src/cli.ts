import { Command } from 'commander';

import { runAlgo } from '.';

const program = new Command();

program
  .version('0.1.0')
  .arguments('<hours> <buckets>')
  .description('test command', {
    hours: 'rain hours',
    buckets: 'landscape array as string: "[1, 2, 3]"',
  })
  .action((hours, buckets) => {
    runAlgo(hours, JSON.parse(buckets));
  });

program.parse();
