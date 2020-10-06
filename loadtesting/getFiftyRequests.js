import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter, Rate } from 'k6/metrics';

// A simple counter for http requests

export const requests = new Counter('http_reqs');
export let errorRate = new Rate('errors');

// you can specify stages of your test (ramp up/down patterns) through the options object
// target is the number of VUs you are aiming for

export const options = {
  stages: [
    { target: 50, duration: '1m' },
    { target: 50, duration: '3m' },
  ],
  thresholds: {
    requests: ['count < 100'],
  },
};

export default function () {
  // our HTTP request, note that we are saving the response to res, which can be accessed later
  const res = http.get(`http://localhost:3000/?product=100`);
  sleep(1);

  const checkRes =
    check(res, {
      'status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);
}
