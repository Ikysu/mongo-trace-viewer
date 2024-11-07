import path from 'path';
import fs from 'fs';

export const writeFileAsyncRecursive = (filename: string, content: string) => {
  const folders = filename.split(path.sep).slice(0, -1).join(path.sep)
  fs.mkdirSync(folders, {recursive:true})

  fs.writeFileSync(filename, content, {
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
