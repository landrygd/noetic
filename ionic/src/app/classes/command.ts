export class Command {
  name: string;
  icon: string;
  args: {name: string, type: any}[];
  opts: string[];
  add: {method: string, count: number, input: {name: string, type: any}, button: string, output: string[]};
}

