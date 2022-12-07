import { Directory, File } from "./filesystem.ts";

export class Scanner {
  constructor(private input: string) {}

  scan(): Directory {
    const root = new Directory('/');
    const lines = this.input.split('\n');
    let currentDirectory: Directory = root;
    
    if (lines.shift() !== '$ cd /') {
      throw new Error('Invalid input');
    }

    for (const line of lines) {
      if (line.startsWith('$')) {
        // handle command
        const [, command, option] = line.split(' ');

        switch (command) {
          case "cd":
            switch (option) {
              case '..':
                // go up a directory
                currentDirectory = currentDirectory.getParent();
                break;
              default:
                // go to a directory
                const newDirectory = currentDirectory.children.find((child) => child.name === option) as Directory;
                if (!newDirectory) {
                  throw new Error(`Could not find child directory ${option} in ${currentDirectory.name}`)
                }
                currentDirectory = newDirectory;
                break;
            }
            break;
          case "ls":
            // do nothing
            break;
        }
      } else if (line.startsWith('dir')) {
        // add directory
        const [, name] = line.split(' ');
        currentDirectory.addChild(new Directory(name, currentDirectory));
      } else if (line.match(/^\d/)) {
        // add file
        const [size, name] = line.split(' ');
        currentDirectory.addChild(new File(name, parseInt(size)));
      }
    }

    return root;
  }
}