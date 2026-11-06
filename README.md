# security_scan

A one-page static site. You enter a website and it gives you links to the free grading scans. Each link opens in a new tab:

| Scanner | Checks | Privacy |
|---|---|---|
| [SSL Labs](https://www.ssllabs.com/ssltest/) | TLS / certificate configuration | `hideResults=on`: kept off the public "Recently seen" boards |
| [securityheaders.com](https://securityheaders.com) | HTTP security response headers | `hide=on`: kept off the public recent-scans list |
| [Mozilla Observatory](https://developer.mozilla.org/en-US/observatory) | Headers and web security best practices | **Public.** Its FAQ says "the scan history for each domain is public" and there's no hide option, so it's opt-in (checkbox, off by default). |

Live: https://spylvas.github.io/security_scan/

## Usage

Enter `example.com`, `www.example.com` or a full URL such as `https://example.com/path`. Only the
hostname is used. IP addresses, `localhost` and bare names are rejected because the scanners can't
grade them.

The page doesn't open tabs by itself, because pop-up blockers would stop all but the first. Click
each link to start that scan.

## Privacy

- The page sends and stores nothing. It's plain HTML/CSS/JS with no third-party assets, and it has a
  strict CSP and `no-referrer`.
- "Hidden" means the result is left off the scanner's public listings. The scanner still sees the
  hostname, and SSL Labs caches results for about 24 h.

## Development

There's no build step. Open `index.html` directly in a browser. The site is served by GitHub Pages
from `main` / root.
