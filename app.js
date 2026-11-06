'use strict';

const SCANNERS = [
  {
    name: 'SSL Labs',
    checks: 'TLS and certificate configuration',
    private: true,
    url: (host) => `https://www.ssllabs.com/ssltest/analyze.html?d=${encodeURIComponent(host)}&hideResults=on`,
  },
  {
    name: 'securityheaders.com',
    checks: 'HTTP security response headers',
    private: true,
    url: (host) => `https://securityheaders.com/?q=${encodeURIComponent('https://' + host)}&hide=on&followRedirects=on`,
  },
  {
    name: 'Mozilla Observatory',
    checks: 'Headers and web security best practices',
    private: false,
    optional: true,
    url: (host) => `https://developer.mozilla.org/en-US/observatory/analyze?host=${encodeURIComponent(host)}`,
  },
];

// Returns a bare public hostname, or throws an Error with a user-facing message.
function normaliseHost(input) {
  const raw = input.trim();
  if (!raw) throw new Error('Enter a URL or hostname.');

  let parsed;
  try {
    parsed = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : 'https://' + raw);
  } catch {
    throw new Error('That doesn\'t look like a valid URL.');
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error('Only http and https URLs can be scanned.');
  }

  const host = parsed.hostname.toLowerCase().replace(/\.$/, '');
  if (host === 'localhost' || host.endsWith('.localhost')) {
    throw new Error('Scanners can only reach public sites, not localhost.');
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[')) {
    throw new Error('Enter a domain name, not an IP address.');
  }
  if (!host.includes('.')) {
    throw new Error('Enter a full domain name, e.g. example.com.');
  }
  return host;
}

function showError(message) {
  const el = document.getElementById('error');
  el.textContent = message;
  el.hidden = !message;
  document.getElementById('target').setAttribute('aria-invalid', message ? 'true' : 'false');
}

function onSubmit(event) {
  event.preventDefault();
  const results = document.getElementById('results');

  let host;
  try {
    host = normaliseHost(document.getElementById('target').value);
  } catch (err) {
    showError(err.message);
    results.hidden = true;
    return;
  }
  showError('');

  const includeObservatory = document.getElementById('include-observatory').checked;
  const selected = SCANNERS.filter((s) => !s.optional || includeObservatory);

  document.getElementById('host').textContent = host;
  const list = document.getElementById('links');
  list.replaceChildren(...selected.map((s) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'card';
    a.href = s.url(host);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    const name = document.createElement('span');
    name.className = 'card-name';
    name.textContent = s.name;

    const badge = document.createElement('span');
    badge.className = s.private ? 'badge badge-private' : 'badge badge-public';
    badge.textContent = s.private ? 'Results hidden' : 'Results public';

    const checks = document.createElement('span');
    checks.className = 'card-checks';
    checks.textContent = s.checks;

    const open = document.createElement('span');
    open.className = 'card-open';
    open.setAttribute('aria-hidden', 'true');
    open.textContent = 'Open ↗';

    a.append(name, badge, checks, open);
    li.append(a);
    return li;
  }));
  results.hidden = false;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('scan-form').addEventListener('submit', onSubmit);
});
