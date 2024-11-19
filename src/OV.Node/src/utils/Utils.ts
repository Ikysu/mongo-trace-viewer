import path from 'path';
import fs from 'fs';
import { MongoConfig } from '../models/MongoConfig';

export const writeFileAsyncRecursive = (filename: string, content: MongoConfig) => {
  const folders = filename.split(path.sep).slice(0, -1).join(path.sep)
  fs.mkdirSync(folders, {recursive:true})

  let out = {
    strings: {},
    cfg: content
  }

  if(fs.existsSync(filename)) {
    const result = fs.readFileSync(filename);
    const {strings} = JSON.parse(result.toString('utf8'))
    out.strings = strings
  }

  fs.writeFileSync(filename, JSON.stringify(out, null, 2), {
    encoding: "utf8",
    flag: 'w'
  });
}

export const isEmpty = (value: any): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};
