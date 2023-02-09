import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';

import glob from 'glob';

import { getUniqueLines, parseYml } from './parser';

// check the available memory
const userHomeDir = os.homedir();

console.log('User home identified as', userHomeDir);

const basePath = path.join(
  userHomeDir,
  '\\Documents\\Paradox Interactive\\Crusader Kings III\\mod\\elder-kings-ck3\\mod_files\\localization'
);

const rif = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let fromLang = 'english';
let toLang = 'german';

rif.question('> Language to pick from (english):', (fromLangInput) => {
  fromLangInput = fromLangInput || 'english';
  fromLang = fromLangInput;

  rif.question('> Target language (german):', (toLangInput) => {
    toLangInput = toLangInput || 'german';
    toLang = toLangInput;

    rif.close();

    glob(
      '**/*.yml',
      { cwd: path.join(basePath, fromLangInput) },
      (_, files) => {
        files.forEach((file) => {
          convertFile(file);
        });

        console.log('Done');
      }
    );
  });
});

function getFileData(path: string) {
  return fs.readFileSync(path, 'utf8');
}

function convertFileName(file: string, from: string, to: string) {
  return file.replace('l_' + from, 'l_' + to);
}

function convertFile(fileName: string) {
  const fromPath = path.join(basePath, fromLang, fileName);
  const toPath = path.join(
    basePath,
    toLang,
    convertFileName(fileName, fromLang, toLang)
  );

  const dataFrom = getFileData(fromPath);

  if (!fs.existsSync(toPath)) {
    const folderPath = path.dirname(toPath);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    fs.writeFileSync(toPath, convertFileName(dataFrom, fromLang, toLang));
    console.log(fileName + ':', 'missing, recreated');

    return;
  }

  const dataTo = getFileData(toPath);

  const ymlFrom = parseYml(dataFrom);
  const ymlTo = parseYml(dataTo);

  const uniqueLines = getUniqueLines(ymlFrom, ymlTo);

  if (uniqueLines.length > 0) {
    ymlTo.push(...uniqueLines);
    console.log(fileName + ':', uniqueLines.length, 'entries added');
    fs.writeFileSync(toPath, ymlTo.join('\n'));
  } else {
    console.log(fileName + ':', 'Same, ignored');
  }
}
