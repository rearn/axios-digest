/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import AxiosDigest from '.';

const username = 'taro';
const passwd = 'pass';

const base = 'http://localhost';

const axios = new AxiosDigest(username, passwd);
describe('digest', () => {
  const url = `/digest-auth/auth/${username}/${passwd}/`;
  test('MD5', async () => {
    const a = await axios.get(`${base}${url}MD5`);
    expect(a.status).toBe(200);
  });
  test('SHA-256', async () => {
    const a = await axios.get(`${base}${url}SHA-256`);
    expect(a.status).toBe(200);
  });
  test('SHA-512', async () => {
    const a = await axios.get(`${base}${url}SHA-512`);
    expect(a.status).toBe(200);
  });
});
describe('digest-int', () => {
  const url = `/digest-auth/auth-int/${username}/${passwd}/`;
  test('MD5-int (not support)', () => {
    expect(axios.get(`${base}${url}MD5`)).rejects.toMatch('error');
  });
  test('SHA-256-int (not support)', () => {
    expect(axios.get(`${base}${url}SHA-256`)).rejects.toMatch('error');
  });
  test('SHA-512-int (not support)', () => {
    expect(axios.get(`${base}${url}SHA-512`)).rejects.toMatch('error');
  });
});

describe('no auth', () => {
  const url = '/status/200';
  test('GET', async () => {
    const a = await axios.get(`${base}${url}`);
    expect(a.status).toBe(200);
  });
  test('POST', async () => {
    const a = await axios.post(`${base}${url}`);
    expect(a.status).toBe(200);
  });
});
