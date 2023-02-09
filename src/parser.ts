export function parseYml(yml: string): string[] {
  const lines = yml.split('\n');
  return lines;
}

export function getUniqueLines(source: string[], target: string[]): string[] {
  //   const keysSource = source.map((line) => line.split(':')[0].trim());
  const keysTarget = target.map((line) => line.split(':')[0].trim());

  const uniqueLines = source
    .filter((line) => !line.trim().startsWith('l_'))
    .filter((x) => !keysTarget.includes(x.split(':')[0].trim())); //!target.includes(line)
  return uniqueLines;
}
