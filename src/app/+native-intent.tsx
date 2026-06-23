export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    const url = new URL(path, 'com.charmflex.app.planstack://');

    if (url.hostname === 'oauthredirect' || url.pathname === '/oauthredirect') {
      return '/sign-in';
    }

    return path;
  } catch {
    return '/sign-in';
  }
}
