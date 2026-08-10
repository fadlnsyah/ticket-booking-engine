import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  stages: [
    { duration: '5s', target: 50 },
    { duration: '10s', target: 200 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:8080/api/v1';
const TEST_TICKET_ID = __ENV.TICKET_ID || '11111111-1111-1111-1111-111111111111';
const TEST_EVENT_ID = __ENV.EVENT_ID || '22222222-2222-2222-2222-222222222222';

export default function () {
  const payload = JSON.stringify({
    user_id: uuidv4(),
    event_id: TEST_EVENT_ID,
    ticket_id: TEST_TICKET_ID,
    idempotency_key: uuidv4(),
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/bookings`, payload, params);

  check(res, {
    'status is 201 (Booked) or 409 (Conflict/Unavailable) or 429 (Lock Busy)': (r) =>
      r.status === 201 || r.status === 409 || r.status === 429,
  });

  sleep(0.1);
}
