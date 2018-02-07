import { Section } from "./section-class";

export class News {
  id: string;
  title: string;
  author: string;
  language: string;
  year: string;
  description: string;
  editor: string;
  section: Section;
  comment: string;

  constructor(
    id: string, title: string, author: string, language: string, year: string, 
    description: string, editor: string, section: Section, comment: string) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.language = language;
    this.year = year;
    this.description = description;
    this.editor = editor;
    this.section = section;
    this.comment = comment;
  }
}