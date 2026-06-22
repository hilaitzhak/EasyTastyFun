import axios from 'axios';

export const API_BACKEND_URL: string = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:4000/easy-tasty-fun';

// Fail fast instead of hanging on the OS connection timeout when the backend
// is unreachable (e.g. local backend not running). Without this, requests like
// the Google-login POST can block for a minute or more before erroring.
// Slow endpoints (AI image scan, recipe uploads) override this per-request.
axios.defaults.timeout = 20000;

// Generous timeout for slow AI / upload calls (Claude vision extraction, S3 image upload).
export const LONG_REQUEST_TIMEOUT = 60000;