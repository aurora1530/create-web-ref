type Reference = {
  author: string;
  siteName: string;
  title: string;
  lastModified: string;
  lastVisited: string;
  url: string;
  description?: string;
  address?: string;
  organization?: string;
  note?: string;
  type?: string;
};

const getURLObject = (): URL => {
  return new URL(document.URL);
};

const getTitle = (): Reference['title'] => {
  return (
    document.title ||
    document.getElementsByTagName('title')[0].textContent ||
    getURLObject().hostname
  );
};

const getAuthor = (): Reference['author'] => {
  const authorMeta = (
    document.querySelector('meta[name="author" i]') ??
    document.querySelector('meta[property="author" i]') ??
    document.querySelector('meta[name="article:author" i]')
  )?.getAttribute('content');
  return authorMeta ?? getURLObject().hostname;
};

const getSiteName = (): Reference['siteName'] => {
  return (
    document.querySelector('meta[property="og:site_name" i]')?.getAttribute('content') ??
    getURLObject().hostname
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
    url: getURLObject().href,
    description: getDescription(),
  };
};

const main = () => {
  const reference = getReference();
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
