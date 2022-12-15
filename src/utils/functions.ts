// TODO: Move the function to utils
export const sortVersion = (a: string | string[], b: string | string[]) => {
  const aver = Array.isArray(a) ? a : a.split(".");
  const bver = Array.isArray(b) ? b : b.split(".");

  for (let i = 0; i < 3; i++) {
    if (+aver[i] - +bver[i] !== 0) return +aver[i] - +bver[i];
  }
  return 0;
};

export const sanitizeVersion = (version: string) => {
  return version.replace(/\^|~/g, "");
};

export const getPackageLatestReleases = (current: string, versions: string[]) => {
  // if (current === "latest") return { major: false, minor: false, patch: false };
  let major = current.split(".");
  let minor = major;
  let patch = major;

  versions.forEach((version) => {
    const compare = version.split(".");
    if (major[0] !== compare[0]) major = sortVersion(major, compare) > 0 ? major : compare;
    if (minor[0] === compare[0] && minor[1] !== compare[1]) minor = sortVersion(minor, compare) > 0 ? minor : compare;
    if (patch[0] === compare[0] && patch[1] === compare[1]) patch = sortVersion(patch, compare) > 0 ? patch : compare;
  });

  return {
    major: sortVersion(major, current) > 0 ? major.join(".") : false,
    minor: sortVersion(minor, current) > 0 ? minor.join(".") : false,
    patch: sortVersion(patch, current) > 0 ? patch.join(".") : false,
  };
};
