import * as yaml from "js-yaml";
import * as fs from "fs";
import * as escape from "pg-escape";

export class Schema {
  private parsedDoc: any;

  public parse(filename: string) {
    this.parsedDoc = yaml.safeLoad(fs.readFileSync(filename, "utf-8"));
  }

  public generateFixtures(): string[] {
    let statements: string[] = [];

    return statements;
  }
}
