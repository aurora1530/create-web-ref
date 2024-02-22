function findShallowestValueByKey<T extends object, K extends PropertyKey>(
  obj: T,
  key: K
) {
  let result: unknown;
  let shallowestLevel = Infinity;

  function search(o: any, currentLevel: number): void {
    if (currentLevel >= shallowestLevel) return;

    if (typeof o === 'object' && o !== null) {
      if (key in o && currentLevel < shallowestLevel) {
        result = o[key];
        shallowestLevel = currentLevel;
        return; // if we found first value, we don't need to go deeper
      }
      for (const k in o) {
        search(o[k], currentLevel + 1);
      }
    }
  }

  search(obj, 0);
  return result;
}

const parseAuthor = (jsons: object[]): string | undefined => {
  for (const json of jsons) {
    if (json === null) return;
    const author = findShallowestValueByKey(json, 'author');
    if (author) {
      return typeof author === 'string'
        ? author
        : typeof author === 'object' && 'name' in author
        ? (author.name as string)
        : undefined;
    }
  }
};

const parseLdJson = () => {
  const jsons = Array.from(
    document.querySelectorAll('script[type="application/ld+json"]')
  )
    .map((ele) => ele.textContent)
    .map((json) => json && JSON.parse(json))
    .filter(Boolean);

  const returnObj: {
    address?: Address;
    organization?: string;
    author?: string;
  } = {};

  returnObj.author = parseAuthor(jsons);

  jsons.forEach((json) => {
    if (!json) return;
    const obj = JSON.parse(json) as Object | null;
    if (!obj) return;

    if (returnObj.organization === undefined) {
      const organization =
        findShallowestValueByKey(obj, 'organization') ??
        findShallowestValueByKey(obj, 'Organization') ??
        findShallowestValueByKey(obj, 'ORGANIZATION') ??
        findShallowestValueByKey(obj, 'publisher') ??
        findShallowestValueByKey(obj, 'Publisher') ??
        findShallowestValueByKey(obj, 'PUBLISHER');
      if (organization) {
        returnObj.organization =
          typeof organization === 'string'
            ? organization
            : typeof organization === 'object' && 'name' in organization
            ? (organization.name as string)
            : undefined;
      }
    }
  });
  return returnObj;
};
