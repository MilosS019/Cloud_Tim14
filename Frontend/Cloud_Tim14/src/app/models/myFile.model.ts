export interface MyFile {
  name: string;
  type: string;
  size: number;
  creationDate: string;
  lastModifiedDate: string;
  description: string;
  tags: Array<string>;
  [key: string]: any;
}
