interface FilesystemObject {
  name: string;
  getSize(): number;
}

export class Directory implements FilesystemObject {
  public children: FilesystemObject[] = [];

  constructor(public name: string, private parent: Directory | undefined = undefined) {}

  getSize() {
    return this.children.reduce((acc, child) => acc + child.getSize(), 0);
  }

  setChildren(children: FilesystemObject[]) {
    this.children = children;
  }

  addChild(child: FilesystemObject) {
    this.children.push(child);
  }

  getParent() {
    if (!this.parent) {
      throw new Error(`Directory ${this.name} has no parent`);
    }

    return this.parent;
  }
}

export class File implements FilesystemObject {
  constructor(public name: string, public size: number) {}

  getSize() {
    return this.size;
  }
}
