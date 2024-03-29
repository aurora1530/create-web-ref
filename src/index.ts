const urlObj = new URL(document.URL);

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
