document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // ── TECH LOGOS (inline SVG keyed by tech name) ──
  const LOGOS = {
    "HTML": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M5 3l2.3 25.5L16 31l8.7-2.5L27 3H5z" fill="#E44D26"/><path d="M16 28.6l7-2L25 5.5H16v23.1z" fill="#F16529"/><path d="M16 13.5h-4.4l-.3-3.5H16V6.5H7.8l.8 9H16v-2zm.1 8.7l-3.6-1-.3-2.8H9.7l.5 5.7L16 26l.1-3.8z" fill="#EBEBEB"/><path d="M15.9 13.5v2H20l-.4 4.2-3.7 1v3.8l6.9-1.9.1-1 .8-9.1H15.9zm0-7v3.5h7.9l.3-3.5H16z" fill="#fff"/></svg>`,
    "CSS": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M5 3l2.3 25.5L16 31l8.7-2.5L27 3H5z" fill="#1572B6"/><path d="M16 28.6l7-2L25 5.5H16v23.1z" fill="#33A9DC"/><path d="M16 13.5H11l.3 3.5H16v-3.5zm-5.6-7l.3 3.5H16V6.5h-5.6zm5.6 14.2l-3.6-1-.2-2.3H9.7l.5 5.7 5.7 1.6v-4z" fill="#EBEBEB"/><path d="M16 13.5v3.5h4.7l-.5 5-4.2 1.2v4l6.9-1.9.9-10.3.1-1.5H16zm0-7v3.5h9.2l.3-3.5H16z" fill="#fff"/></svg>`,
    "JavaScript": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="2" fill="#F7DF1E"/><path d="M20.6 23.4c.5.8 1.1 1.4 2.3 1.4 1 0 1.6-.5 1.6-1.1 0-.8-.6-1.1-1.7-1.5l-.6-.3c-1.7-.7-2.8-1.6-2.8-3.5 0-1.7 1.3-3 3.4-3 1.5 0 2.5.5 3.3 1.8l-1.8 1.2c-.4-.7-.8-1-1.5-1-.7 0-1.1.4-1.1 1 0 .7.4 1 1.5 1.4l.6.3c2 .8 3.1 1.7 3.1 3.7 0 2.1-1.7 3.3-3.9 3.3-2.2 0-3.6-1-4.3-2.4l1.9-1.3zm-9.1.2c.4.6.7 1.2 1.5 1.2.7 0 1.2-.3 1.2-1.4v-7.6h2.3v7.7c0 2.3-1.4 3.4-3.4 3.4-1.8 0-2.9-1-3.4-2.1l1.8-1.2z" fill="#333"/></svg>`,
    "TypeScript": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="2" fill="#3178C6"/><path d="M18.6 22.7v2.3c.4.2.9.4 1.4.5.6.1 1.2.2 1.8.2.6 0 1.2-.1 1.7-.2.5-.1 1-.3 1.4-.6.4-.3.7-.6.9-1.1.2-.5.3-1 .3-1.6 0-.5-.1-.9-.2-1.3-.1-.4-.4-.7-.6-1-.3-.3-.6-.5-1-.7-.4-.2-.9-.4-1.4-.6-.4-.1-.7-.3-1-.4-.3-.1-.5-.2-.7-.4-.2-.1-.3-.3-.4-.4-.1-.2-.1-.4-.1-.6 0-.2 0-.4.1-.5.1-.2.2-.3.4-.4.2-.1.4-.2.6-.2.2-.1.5-.1.8-.1.3 0 .5 0 .8.1.3 0 .5.1.8.2.2.1.5.2.7.4.2.1.4.3.5.5v-2.2c-.4-.1-.8-.3-1.3-.3-.5-.1-1-.1-1.6-.1-.6 0-1.2.1-1.7.2-.5.1-1 .3-1.4.6-.4.3-.7.6-.9 1.1-.2.5-.3 1-.3 1.6 0 .8.2 1.5.7 2 .4.5 1.1 1 2 1.3.4.1.8.3 1.1.4.3.1.6.3.8.4.2.1.4.3.5.5.1.2.2.4.2.6 0 .2 0 .4-.1.6-.1.2-.2.3-.4.4-.2.1-.4.2-.6.2-.3.1-.5.1-.8.1-.6 0-1.2-.1-1.7-.4-.4-.2-.9-.6-1.3-1zm-5.2-7.8H17v-2H8v2h3.4V27h2V14.9z" fill="white"/></svg>`,
    "React": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="2.8" fill="#61DAFB"/><ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" stroke-width="1.5" fill="none"/><ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" stroke-width="1.5" fill="none" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" stroke-width="1.5" fill="none" transform="rotate(120 16 16)"/></svg>`,
    "Next.js": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" fill="#000"/><path d="M10.5 21V11.5h1.2l8 12h-.1c-.6-.1-1.1-.3-1.5-.8L12.2 14v7h-1.7zm9 0v-9.5h1.7V21H19.5z" fill="white"/></svg>`,
    "Vue": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 28L2 6h5.5L16 21 24.5 6H30L16 28z" fill="#42B883"/><path d="M16 28L9.5 6h6.5v15L19.5 6H22L16 28z" fill="#35495E"/></svg>`,
    "Angular": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 3L4 7.5l1.8 15.7L16 29l10.2-5.8L28 7.5 16 3z" fill="#DD0031"/><path d="M16 3v26l10.2-5.8L28 7.5 16 3z" fill="#C3002F"/><path d="M16 7.5L9 22h2.6l1.4-3.5h6l1.4 3.5H23L16 7.5zm0 4.5l2.2 5.5h-4.4L16 12z" fill="white"/></svg>`,
    "Svelte": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M27.3 7.3C25 3.8 20.3 2.8 16.9 5L8.5 10.3c-1.6 1-2.8 2.6-3.2 4.4-.3 1.5-.1 3.1.6 4.4-.5.7-.8 1.5-.9 2.3-.3 1.8.2 3.7 1.4 5 2.3 3.5 7 4.5 10.4 2.3l8.4-5.3c1.6-1 2.8-2.6 3.2-4.4.3-1.5.1-3.1-.6-4.4.5-.7.8-1.5.9-2.3.3-1.8-.2-3.7-1.4-5z" fill="#FF3E00"/><path d="M14.3 25.5a5 5 0 01-5.5-2 4.6 4.6 0 01-.8-3.5c.1-.3.2-.5.2-.8l.2-.5.4.3c1 .7 2 1.2 3.2 1.5l.3.1-.1.3c-.1.4 0 .9.3 1.2.5.8 1.6 1 2.4.5l8.4-5.3c.4-.3.7-.7.8-1.1.1-.5 0-.9-.3-1.3-.5-.8-1.6-1-2.4-.5l-3.2 2c-.9.6-2 .9-3.1.9a5 5 0 01-5.5-2 4.6 4.6 0 01-.8-3.5c.3-1.3 1.1-2.4 2.2-3.1l8.4-5.3c.9-.6 2-.9 3.1-.9a5 5 0 015.5 2c.7 1 1 2.3.8 3.5-.1.3-.2.5-.2.8l-.2.5-.4-.3c-1-.7-2-1.2-3.2-1.5l-.3-.1.1-.3c.1-.4 0-.9-.3-1.2-.5-.8-1.6-1-2.4-.5l-8.4 5.3c-.4.3-.7.7-.8 1.1-.1.5 0 .9.3 1.3.5.8 1.6 1 2.4.5l3.2-2c.9-.6 2-.9 3.1-.9a5 5 0 015.5 2c.7 1 1 2.3.8 3.5-.3 1.3-1.1 2.4-2.2 3.1l-8.4 5.2c-.9.6-2 .9-3.1.9z" fill="white"/></svg>`,
    "Tailwind CSS": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 8c-2.1 0-3.5 1.1-4.2 3.2.6-.8 1.4-1.1 2.2-.9.5.1.8.4 1.2.8.6.6 1.3 1.4 2.8 1.4 2.1 0 3.5-1.1 4.2-3.2-.6.8-1.4 1.1-2.2.9-.5-.1-.8-.4-1.2-.8C18.2 8.8 17.5 8 16 8zm-4.2 8c-2.1 0-3.5 1.1-4.2 3.2.6-.8 1.4-1.1 2.2-.9.5.1.8.4 1.2.8.6.6 1.3 1.4 2.8 1.4 2.1 0 3.5-1.1 4.2-3.2-.6.8-1.4 1.1-2.2.9-.5-.1-.8-.4-1.2-.8-.6-.6-1.3-1.4-2.8-1.4z" fill="#38BDF8"/></svg>`,
    "Bootstrap": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="6" fill="#7952B3"/><path d="M9 8h8.5c2 0 3.5.4 4.5 1.3 1 .8 1.5 2 1.5 3.4 0 1-.3 1.8-.8 2.5-.5.6-1.1 1-1.9 1.2 1 .2 1.8.6 2.4 1.4.6.7.9 1.6.9 2.7 0 1-.2 1.8-.7 2.5-.5.7-1.1 1.3-2 1.7-.9.4-1.9.5-3.1.5H9V8zm3 5.5h4.5c.9 0 1.6-.2 2-.5.5-.3.7-.8.7-1.5 0-.6-.2-1.1-.7-1.4-.5-.3-1.1-.4-2-.4H12v3.8zm0 6.5h5c1 0 1.7-.2 2.2-.6.5-.4.8-.9.8-1.7 0-.7-.3-1.3-.8-1.6-.5-.4-1.3-.5-2.2-.5H12V20z" fill="white"/></svg>`,
    "jQuery": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M4 13.5C5.8 8.5 11 5 16.5 5c3.7 0 7 1.5 9.5 4l-2 2c-2-1.8-4.6-3-7.5-3-4.3 0-8 2.5-9.8 6.2L4 13.5z" fill="#0769AD"/><path d="M7 17c1-3.5 4.3-6 8.2-6 2.4 0 4.5 1 6 2.6l-2 2c-1-1.1-2.4-1.8-4-1.8-2.8 0-5 1.8-5.8 4.3L7 17z" fill="#0769AD"/><path d="M10.5 20.5c.5-2 2.3-3.5 4.5-3.5 1.2 0 2.3.5 3 1.4l-2 2c-.2-.3-.6-.5-1-.5-1 0-1.8.6-2 1.5l-2.5-1z" fill="#0769AD"/><circle cx="14" cy="24" r="3" fill="#0769AD"/></svg>`,
    "Icon Libraries": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 4l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" fill="#7ee8fa" opacity="0.8"/></svg>`,
    "Google Fonts": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="4" fill="#4285F4"/><text x="7" y="23" font-size="18" font-family="serif" font-weight="bold" fill="white">G</text></svg>`,
    "Google Analytics": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="16" width="6" height="12" rx="2" fill="#F9AB00"/><rect x="13" y="10" width="6" height="18" rx="2" fill="#E37400"/><rect x="22" y="4" width="6" height="24" rx="2" fill="#E37400" opacity="0.6"/></svg>`,
    "Google Tag Manager": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="26" height="26" rx="5" fill="#4285F4" opacity="0.15" stroke="#4285F4" stroke-width="1.5"/><text x="5" y="22" font-size="10" font-family="monospace" font-weight="bold" fill="#4285F4">GTM</text></svg>`,
    "Mixpanel": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="13" fill="#7856FF"/><path d="M9 20V12l4 5 3-8 3 8 4-5v8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    "Segment": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="13" fill="#52BD94"/><circle cx="16" cy="9" r="3" fill="white"/><circle cx="9" cy="22" r="3" fill="white"/><circle cx="23" cy="22" r="3" fill="white"/><line x1="16" y1="12" x2="10" y2="20" stroke="white" stroke-width="1.5"/><line x1="16" y1="12" x2="22" y2="20" stroke="white" stroke-width="1.5"/></svg>`,
    "Hotjar": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="13" fill="#FD3A5C"/><path d="M10 22c0-4 3-7 6-7s6 3 6 7" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M16 15V9" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M13 11l3-3 3 3" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`,
    "Clarity": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="13" fill="#0078D4"/><path d="M22 16a6 6 0 11-12 0 6 6 0 0112 0z" stroke="white" stroke-width="1.5" fill="none"/><circle cx="16" cy="16" r="2" fill="white"/></svg>`,
    "Amplitude": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="6" fill="#1C64F2"/><path d="M8 22l5-12 3 7 2-4 5 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    "Sentry": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M18.5 6L10 20h17L18.5 6z" stroke="#FB4226" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M13 20c0-3 2-5.5 5.5-5.5" stroke="#FB4226" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
    "Datadog": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="6" fill="#632CA6"/><path d="M8 22V10l5 9 3-7 3 7 5-9v12" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    "REST API": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="10" width="26" height="12" rx="3" fill="#1e2333" stroke="#7ee8fa" stroke-width="1.5"/><text x="6" y="20" font-size="9" font-family="monospace" fill="#7ee8fa">REST</text></svg>`,
    "GraphQL API": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><polygon points="16,4 27,10 27,22 16,28 5,22 5,10" stroke="#E535AB" stroke-width="1.5" fill="none"/><circle cx="16" cy="4" r="2" fill="#E535AB"/><circle cx="27" cy="10" r="2" fill="#E535AB"/><circle cx="27" cy="22" r="2" fill="#E535AB"/><circle cx="16" cy="28" r="2" fill="#E535AB"/><circle cx="5" cy="22" r="2" fill="#E535AB"/><circle cx="5" cy="10" r="2" fill="#E535AB"/><circle cx="16" cy="16" r="3" fill="#E535AB"/></svg>`,
    "Application Server": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="8" width="24" height="6" rx="2" fill="#1e2333" stroke="#7ee8fa" stroke-width="1.2"/><rect x="4" y="18" width="24" height="6" rx="2" fill="#1e2333" stroke="#7ee8fa" stroke-width="1.2"/><circle cx="25" cy="11" r="1.5" fill="#7ee8fa"/><circle cx="25" cy="21" r="1.5" fill="#7ee8fa"/></svg>`,
    "Firebase": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M6 24L11 5l5 9 2-4 6 19H6z" fill="#FFA000"/><path d="M6 24l5-19 5 9L6 24z" fill="#F57F17"/><path d="M24 24L18 10l-2 4L6 24h18z" fill="#FFCA28"/></svg>`,
    "Supabase": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M17 4L4 19h11v9l14-15H18V4z" fill="#3ECF8E"/></svg>`,
    "MongoDB": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 3c0 0-7 8-7 15a7 7 0 0014 0C23 11 16 3 16 3z" fill="#47A248"/><rect x="15" y="20" width="2" height="9" rx="1" fill="#47A248"/></svg>`,
    "PostgreSQL": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="11" rx="10" ry="5" fill="#336791"/><rect x="6" y="11" width="20" height="10" fill="#336791"/><ellipse cx="16" cy="21" rx="10" ry="5" fill="#4479A1"/><line x1="22" y1="9" x2="22" y2="17" stroke="white" stroke-width="1.5"/></svg>`,
    "MySQL": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="10" rx="10" ry="4" fill="#00758F"/><rect x="6" y="10" width="20" height="12" fill="#00758F"/><ellipse cx="16" cy="22" rx="10" ry="4" fill="#F29111"/></svg>`,
    "Redis": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="22" rx="12" ry="4" fill="#A41E11"/><rect x="4" y="11" width="24" height="11" fill="#D82C20"/><ellipse cx="16" cy="11" rx="12" ry="4" fill="#F5A623"/></svg>`,
    "Firestore": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 4l10 6v12L16 28 6 22V10L16 4z" fill="#FFA000" opacity="0.3" stroke="#FFA000" stroke-width="1.5"/><path d="M16 10l6 3.5v7L16 24l-6-3.5v-7L16 10z" fill="#FFA000"/></svg>`,
    "Database": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="9" rx="10" ry="4" stroke="#7ee8fa" stroke-width="1.5" fill="none"/><path d="M6 9v14c0 2.2 4.5 4 10 4s10-1.8 10-4V9" stroke="#7ee8fa" stroke-width="1.5" fill="none"/><path d="M6 16c0 2.2 4.5 4 10 4s10-1.8 10-4" stroke="#7ee8fa" stroke-width="1.2" fill="none"/></svg>`,
    "Vercel": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" fill="#000"/><path d="M16 7l11 18H5L16 7z" fill="white"/></svg>`,
    "Netlify": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="6" fill="#00C7B7"/><path d="M12 10h8v3h-8zM12 19h8v3h-8zM10 13h12v6H10z" fill="white" opacity="0.9"/></svg>`,
    "GitHub Pages": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" fill="#24292E"/><path d="M16 5a11 11 0 00-3.5 21.4c.6.1.8-.2.8-.5v-2c-3.1.7-3.7-1.3-3.7-1.3-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.5 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5-1.2-5-5.4 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1a10.5 10.5 0 015.6 0c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.8 1.1 3 0 4.2-2.6 5.1-5.1 5.4.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11 11 0 0016 5z" fill="white"/></svg>`,
    "Cloudflare CDN": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M21 20H9a5 5 0 110-10 5 5 0 019.9 1H21a4 4 0 010 8z" fill="#F6821F"/></svg>`,
    "AWS": `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="4" fill="#232F3E"/><path d="M8 20l2-7 2 7 2-7 2 7" stroke="#FF9900" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M5 23h22" stroke="#FF9900" stroke-width="1.2"/></svg>`
  };

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      let clues = [];

      const scripts = Array.from(document.scripts).map(s => s.src.toLowerCase());
      const html = document.documentElement.innerHTML.toLowerCase();

      // ── CLUE COLLECTION ──

      // Script src analysis
      scripts.forEach(src => {
        if (src.includes("react") && !src.includes("reactive")) clues.push("react");
        if (src.includes("next"))       clues.push("nextjs");
        if (src.includes("vue"))        clues.push("vue");
        if (src.includes("angular"))    clues.push("angular");
        if (src.includes("svelte"))     clues.push("svelte");
        if (src.includes("tailwind"))   clues.push("tailwind");
        if (src.includes("bootstrap"))  clues.push("bootstrap");
        if (src.includes("jquery"))     clues.push("jquery");
        if (src.includes("graphql"))    clues.push("graphql");
        // Analytics
        if (src.includes("google-analytics.com/analytics") || src.includes("google-analytics.com/ga.js")) clues.push("ga");
        if (src.includes("googletagmanager.com/gtm.js")) clues.push("gtm");
        if (src.includes("googletagmanager.com/gtag")) clues.push("gtag");
        if (src.includes("mixpanel"))   clues.push("mixpanel");
        if (src.includes("segment.com") || src.includes("segment.io")) clues.push("segment");
        if (src.includes("hotjar") || src.includes("hj.js")) clues.push("hotjar");
        if (src.includes("clarity.ms") || src.includes("clarity.js")) clues.push("clarity");
        if (src.includes("amplitude"))  clues.push("amplitude");
        if (src.includes("sentry"))     clues.push("sentry");
        if (src.includes("datadog"))    clues.push("datadog");
        // Backend/DB
        if (src.includes("firebase"))   clues.push("firebase");
        if (src.includes("supabase"))   clues.push("supabase");
      });

      // HTML body checks
      if (html.includes("__react") || html.includes("data-reactroot") || html.includes("_reactfiber")) clues.push("react");
      if (html.includes("_next/"))            clues.push("nextjs");
      if (html.includes("__nuxt") || html.includes("data-v-"))    clues.push("vue");
      if (html.includes("svelte"))            clues.push("svelte");
      if (html.includes("tailwind"))          clues.push("tailwind");

      // Analytics inline snippets
      if (html.includes("google-analytics.com/analytics") || html.includes("gtag('config'") || html.includes('gtag("config"') || html.includes("ga('send'") || html.includes('ga("send"')) clues.push("ga");
      if (html.includes("googletagmanager.com/gtm.js") || html.includes("gtm.js") || html.includes("gtm-")) clues.push("gtm");
      if (html.includes("window.datalayer") || html.includes("datalayer.push")) clues.push("gtag");
      if (html.includes("mixpanel.init") || html.includes("mixpanel.track") || html.includes("mixpanel.__loaded")) clues.push("mixpanel");
      if (html.includes("analytics.identify") || html.includes("analytics.track") || html.includes("cdn.segment")) clues.push("segment");
      if (html.includes("_hjsettings") || html.includes("hotjar.com") || html.includes("hj(")) clues.push("hotjar");
      if (html.includes("clarity(") || html.includes("ms.clarity") || html.includes("clarity.ms")) clues.push("clarity");
      if (html.includes("amplitude.getinstance") || html.includes("amplitude.init") || html.includes("cdn.amplitude")) clues.push("amplitude");
      if (html.includes("sentry.init") || html.includes("@sentry/") || html.includes("browser.sentry-cdn")) clues.push("sentry");
      if (html.includes("datadoghq.com") || html.includes("dd-rum") || html.includes("datadog")) clues.push("datadog");

      // Database hints in HTML
      if (html.includes("firebase") || typeof window.firebase !== "undefined") clues.push("firebase");
      if (html.includes("supabase") || typeof window.supabase !== "undefined") clues.push("supabase");
      if (html.includes("mongodb") || html.includes("mongoose")) clues.push("mongodb");
      if (html.includes("redis")) clues.push("redis");
      if (html.includes("postgresql") || html.includes("prisma")) clues.push("postgresql");
      if (html.includes("mysql") || html.includes("sequelize")) clues.push("mysql");

      // Link tags
      document.querySelectorAll("link").forEach(link => {
        let href = (link.href || "").toLowerCase();
        if (href.includes("bootstrap"))     clues.push("bootstrap");
        if (href.includes("font-awesome") || href.includes("ionicons") || href.includes("material-icons") || href.includes("lucide")) clues.push("icons");
        if (href.includes("tailwind"))      clues.push("tailwind");
        if (href.includes("fonts.googleapis")) clues.push("googlefonts");
      });

      // Window globals
      if (window.jQuery || window.$)     clues.push("jquery");
      if (window.fetch)                  clues.push("api");
      if (window.ga || window.gtag || window.dataLayer) clues.push("ga");
      if (window.mixpanel)               clues.push("mixpanel");
      if (window.analytics)              clues.push("segment");
      if (window.hj)                     clues.push("hotjar");
      if (window.clarity)                clues.push("clarity");
      if (window.amplitude)              clues.push("amplitude");
      if (window.Sentry)                 clues.push("sentry");
      if (window.DD_RUM)                 clues.push("datadog");

      // Network resource URLs
      performance.getEntriesByType("resource").forEach(res => {
        let url = res.name.toLowerCase();
        if (url.includes("/api/"))           clues.push("rest");
        if (url.includes("graphql"))         clues.push("graphql");
        if (url.includes("firebase"))        clues.push("firebase");
        if (url.includes("supabase"))        clues.push("supabase");
        if (url.includes("vercel"))          clues.push("vercel");
        if (url.includes("netlify"))         clues.push("netlify");
        if (url.includes("google-analytics") || url.includes("analytics.js")) clues.push("ga");
        if (url.includes("googletagmanager")) clues.push("gtm");
        if (url.includes("mixpanel"))        clues.push("mixpanel");
        if (url.includes("hotjar"))          clues.push("hotjar");
        if (url.includes("amplitude"))       clues.push("amplitude");
        if (url.includes("sentry"))          clues.push("sentry");
        if (url.includes("clarity.ms"))      clues.push("clarity");
        if (url.includes("datadoghq"))       clues.push("datadog");
        if (url.includes("segment.com") || url.includes("segment.io")) clues.push("segment");
        if (url.includes("mongodb"))         clues.push("mongodb");
      });

      // Hosting checks
      if (html.includes("cloudflare"))     clues.push("cloudflare");
      if (html.includes("amazonaws") || html.includes(".aws.")) clues.push("aws");
      if (html.includes("vercel"))         clues.push("vercel");
      if (html.includes("netlify"))        clues.push("netlify");
      if (window.location.hostname.includes("github")) clues.push("github");

      clues = [...new Set(clues)];

      // ── CATEGORISE ──
      let categorized = {
        frontend: [],
        ui: [],
        analytics: [],
        network: [],
        backend: [],
        database: [],
        hosting: []
      };

      function add(arr, name) { if (!arr.includes(name)) arr.push(name); }

      // Frontend
      if (clues.includes("react"))    add(categorized.frontend, "React");
      if (clues.includes("nextjs"))   add(categorized.frontend, "Next.js");
      if (clues.includes("vue"))      add(categorized.frontend, "Vue");
      if (clues.includes("angular"))  add(categorized.frontend, "Angular");
      if (clues.includes("svelte"))   add(categorized.frontend, "Svelte");
      add(categorized.frontend, "HTML");
      add(categorized.frontend, "CSS");
      if (clues.includes("tailwind")) add(categorized.frontend, "Tailwind CSS");

      // UI
      if (clues.includes("bootstrap"))   add(categorized.ui, "Bootstrap");
      if (clues.includes("jquery"))      add(categorized.ui, "jQuery");
      if (clues.includes("icons"))       add(categorized.ui, "Icon Libraries");
      if (clues.includes("googlefonts")) add(categorized.ui, "Google Fonts");

      // Analytics — comprehensive
      if (clues.includes("ga") || clues.includes("gtag"))  add(categorized.analytics, "Google Analytics");
      if (clues.includes("gtm"))          add(categorized.analytics, "Google Tag Manager");
      if (clues.includes("mixpanel"))     add(categorized.analytics, "Mixpanel");
      if (clues.includes("segment"))      add(categorized.analytics, "Segment");
      if (clues.includes("hotjar"))       add(categorized.analytics, "Hotjar");
      if (clues.includes("clarity"))      add(categorized.analytics, "Clarity");
      if (clues.includes("amplitude"))    add(categorized.analytics, "Amplitude");
      if (clues.includes("sentry"))       add(categorized.analytics, "Sentry");
      if (clues.includes("datadog"))      add(categorized.analytics, "Datadog");

      // Network
      if (clues.includes("graphql"))           add(categorized.network, "GraphQL API");
      if (clues.includes("rest") || clues.includes("api")) add(categorized.network, "REST API");

      // Backend
      if (categorized.network.length > 0) add(categorized.backend, "Application Server");
      if (clues.includes("firebase"))     add(categorized.backend, "Firebase");
      if (clues.includes("supabase"))     add(categorized.backend, "Supabase");

      // Database
      if (clues.includes("firebase"))    add(categorized.database, "Firestore");
      if (clues.includes("supabase"))    add(categorized.database, "PostgreSQL");
      if (clues.includes("mongodb"))     add(categorized.database, "MongoDB");
      if (clues.includes("postgresql"))  add(categorized.database, "PostgreSQL");
      if (clues.includes("mysql"))       add(categorized.database, "MySQL");
      if (clues.includes("redis"))       add(categorized.database, "Redis");
      if (categorized.backend.length > 0 && categorized.database.length === 0) add(categorized.database, "Database");

      // Hosting
      if (clues.includes("github"))     add(categorized.hosting, "GitHub Pages");
      if (clues.includes("vercel"))     add(categorized.hosting, "Vercel");
      if (clues.includes("netlify"))    add(categorized.hosting, "Netlify");
      if (clues.includes("cloudflare")) add(categorized.hosting, "Cloudflare CDN");
      if (clues.includes("aws"))        add(categorized.hosting, "AWS");

      return categorized;
    }
  }, (results) => {
    if (!results || !results[0]) return;
    const categorized = results[0].result;

    // ── ARCH GRID ──
    const archGrid = document.getElementById("archGrid");
    archGrid.innerHTML = "";

    const sections = [
      { key: "frontend",  label: "Frontend" },
      { key: "ui",        label: "UI Libraries" },
      { key: "analytics", label: "Analytics" },
      { key: "network",   label: "Network" },
      { key: "backend",   label: "Backend" },
      { key: "database",  label: "Database" },
      { key: "hosting",   label: "Hosting / CDN" },
    ];

    const nonEmpty = sections.filter(s => categorized[s.key].length > 0);

    if (nonEmpty.length === 0) {
      archGrid.innerHTML = '<div class="empty" style="grid-column:1/-1">Nothing detected on this page.</div>';
    } else {
      nonEmpty.forEach((sec) => {
        const col = document.createElement("div");
        col.className = "arch-col";

        const label = document.createElement("div");
        label.className = "arch-col-label";
        label.textContent = sec.label + ":";
        col.appendChild(label);

        categorized[sec.key].forEach(name => {
          const item = document.createElement("div");
          item.className = "arch-item";

          const logoWrap = document.createElement("div");
          logoWrap.className = "arch-logo";
          logoWrap.innerHTML = LOGOS[name] ||
            `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="6" fill="#7ee8fa" opacity="0.4"/></svg>`;

          const text = document.createElement("span");
          text.textContent = name;

          item.appendChild(logoWrap);
          item.appendChild(text);
          col.appendChild(item);
        });

        archGrid.appendChild(col);
      });
    }

    // ── PIPELINE ──
    const parts = ["User"];
    if (categorized.frontend.length)  parts.push(categorized.frontend.slice(0, 2).join(", "));
    if (categorized.ui.length)        parts.push(categorized.ui.slice(0, 1).join(", "));
    if (categorized.analytics.length) parts.push("Analytics");
    if (categorized.network.length)   parts.push(categorized.network.slice(0, 1).join(", "));
    if (categorized.backend.length)   parts.push(categorized.backend.slice(0, 1).join(", "));
    if (categorized.database.length)  parts.push(categorized.database.slice(0, 1).join(", "));
    if (categorized.hosting.length)   parts.push(categorized.hosting.slice(0, 1).join(", "));

    const pipeline = document.getElementById("pipeline");
    pipeline.innerHTML = "";
    parts.forEach((p, i) => {
      const box = document.createElement("div");
      box.className = "pipe-box" + (i === 0 || i === parts.length - 1 ? " active" : "");
      box.textContent = p;
      pipeline.appendChild(box);
      if (i !== parts.length - 1) {
        const arrow = document.createElement("div");
        arrow.className = "pipe-arrow";
        arrow.innerHTML = "&rarr;";
        pipeline.appendChild(arrow);
      }
    });

    // ── EXPLANATION ──
    const fe  = categorized.frontend.join(", ")  || "HTML/CSS";
    const ui  = categorized.ui.join(", ")        || "native styles";
    const an  = categorized.analytics.join(", ") || "none detected";
    const net = categorized.network.join(", ")   || "no detected API";
    const db  = categorized.database.join(", ")  || "unknown";
    const ho  = categorized.hosting.join(", ")   || "unknown platform";

    document.getElementById("explanation").innerText =
      `Frontend built with ${fe}.\n` +
      `UI layer uses ${ui}.\n` +
      `Analytics: ${an}.\n` +
      `Communicates via ${net}.\n` +
      `Data stored in ${db}.\n` +
      `Deployed on ${ho}.`;

    // ── RESOURCES ──
    const resources = {
      "React":                "https://react.dev",
      "Next.js":              "https://nextjs.org/docs",
      "Vue":                  "https://vuejs.org/guide/",
      "Angular":              "https://angular.io/docs",
      "Svelte":               "https://svelte.dev/docs",
      "Tailwind CSS":         "https://tailwindcss.com/docs",
      "Bootstrap":            "https://getbootstrap.com/docs/",
      "jQuery":               "https://api.jquery.com/",
      "REST API":             "https://developer.mozilla.org/en-US/docs/Web/HTTP",
      "GraphQL API":          "https://graphql.org/learn/",
      "Firebase":             "https://firebase.google.com/docs",
      "Supabase":             "https://supabase.com/docs",
      "Database":             "https://www.w3schools.com/sql/",
      "PostgreSQL":           "https://www.postgresql.org/docs/",
      "MySQL":                "https://dev.mysql.com/doc/",
      "MongoDB":              "https://www.mongodb.com/docs/",
      "Redis":                "https://redis.io/docs/",
      "Firestore":            "https://firebase.google.com/docs/firestore",
      "Application Server":   "https://nodejs.org/en/docs",
      "Cloudflare CDN":       "https://www.cloudflare.com/learning/cdn/",
      "AWS":                  "https://aws.amazon.com/getting-started/",
      "Vercel":               "https://vercel.com/docs",
      "Netlify":              "https://docs.netlify.com",
      "GitHub Pages":         "https://pages.github.com/",
      "Google Analytics":     "https://developers.google.com/analytics",
      "Google Tag Manager":   "https://support.google.com/tagmanager",
      "Mixpanel":             "https://docs.mixpanel.com",
      "Segment":              "https://segment.com/docs/",
      "Hotjar":               "https://help.hotjar.com",
      "Clarity":              "https://learn.microsoft.com/en-us/clarity/",
      "Amplitude":            "https://www.docs.developers.amplitude.com",
      "Sentry":               "https://docs.sentry.io",
      "Datadog":              "https://docs.datadoghq.com"
    };

    const allTech = [...new Set(Object.values(categorized).flat())];
    const learn = document.getElementById("learningPath");
    learn.innerHTML = "";

    let hasAny = false;
    allTech.forEach(t => {
      if (resources[t]) {
        hasAny = true;
        const li = document.createElement("li");

        if (LOGOS[t]) {
          const logoEl = document.createElement("span");
          logoEl.className = "res-logo";
          logoEl.innerHTML = LOGOS[t];
          li.appendChild(logoEl);
        }

        const a = document.createElement("a");
        a.href = resources[t];
        a.textContent = `Learn ${t}`;
        a.target = "_blank";
        li.appendChild(a);
        learn.appendChild(li);
      }
    });

    if (!hasAny) {
      learn.innerHTML = '<li class="empty">No resources found for this stack.</li>';
    }
  });
});
