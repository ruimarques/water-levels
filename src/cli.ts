import { Command } from 'commander';

import { runAlgo } from '.';

const program = new Command();

const buckets = [3, 1, 6, 4, 8, 9];

program
  .version('0.1.0')
  .arguments('<hours> ')
  .description('test command', {
    hours: 'rain hours',
  })
  .action((hours) => {
    runAlgo(hours, buckets);
  });

program.parse();
