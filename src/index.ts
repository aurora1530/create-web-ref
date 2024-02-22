type Reference = {
  author: string;
  siteName: string;
  title: string;
  lastModified: string;
  lastVisited: string;
  url: string;
  description?: string;
  address?: Address;
  organization?: string;
  note?: string;
  type?: string;
};

type Address = {
  country: string;
  locality: string;
  region: string;
  postalCode: string;
  streetAddress: string;
};

const urlObj = new URL(document.URL);

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

const parseLdJson = () => {
  const jsons = Array.from(
    document.querySelectorAll('script[type="application/ld+json"]')
  ).map((ele) => ele.textContent);

  const returnObj: {
    address?: Address;
    organization?: string;
    author?: string;
  } = {};
  jsons.forEach((json) => {
    if (!json) return;
    const obj = JSON.parse(json) as Object | null;
    if (!obj) return;

    if (returnObj.author === undefined) {
      const author = findShallowestValueByKey(obj, 'author');
      if (author) {
        returnObj.author =
          typeof author === 'string'
            ? author
            : typeof author === 'object' && 'name' in author
            ? (author.name as string)
            : undefined;
      }
    }

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

const getTitle = (): Reference['title'] => {
  return (
    document.title ||
    document.getElementsByTagName('title')[0].textContent ||
    urlObj.hostname
  );
};

const getAuthor = (): Reference['author'] => {
  const authorMeta = (
    document.querySelector('meta[name="author" i]') ??
    document.querySelector('meta[property="author" i]') ??
    document.querySelector('meta[name="article:author" i]')
  )?.getAttribute('content');
  return authorMeta ?? urlObj.hostname;
};

const getSiteName = (): Reference['siteName'] => {
  return (
    document.querySelector('meta[property="og:site_name" i]')?.getAttribute('content') ??
    urlObj.hostname
  );
};

const getLastModified = (): Reference['lastModified'] => {
  const meta = (
    document.querySelector('meta[name="last-modified" i]') ??
    document.querySelector('meta[property="article:modified_time" i]')
  )?.getAttribute('content');
  return new Date(meta ?? document.lastModified).toLocaleDateString();
};

const getLastVisited = (): Reference['lastVisited'] => {
  return new Date().toLocaleDateString();
};

const getDescription = (): Reference['description'] => {
  return (
    (
      document.querySelector('meta[name="description" i]') ??
      document.querySelector('meta[property="og:description" i]')
    )?.getAttribute('content') ?? undefined
  );
};

const getReference = (): Reference => {
  return {
    author: getAuthor(),
    siteName: getSiteName(),
    title: getTitle(),
    lastModified: getLastModified(),
    lastVisited: getLastVisited(),
    url: urlObj.href,
    description: getDescription(),
  };
};

const main = () => {
  const parsedJsonLd = parseLdJson();
  const reference = getReference();
  reference.address = parsedJsonLd.address;
  reference.organization = parsedJsonLd.organization;
  reference.author = parsedJsonLd.author ?? reference.author;

  navigator.clipboard.writeText(JSON.stringify(reference, null, 2)).then(
    () => {
      alert('Reference copied to clipboard');
    },
    (err) => {
      console.error('Error copying to clipboard', err);
      alert('Error copying to clipboard');
    }
  );
};

main();
