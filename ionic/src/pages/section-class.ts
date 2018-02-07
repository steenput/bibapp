export class Section {
  id: string;
  name: string;
  acronym: string;
  code: string;

  constructor(id: string, name: string, acronym: string, code: string) {
    this.id = id;
    this.name = name;
    this.acronym = acronym;
    this.code = code;
  }
}