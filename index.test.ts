import { AxiosDigest } from '.';

const rand = (): number => {
  return Math.floor(Math.random() * 0x100);
};
const username = 'taro';
const passwd = 'pass';

const url = `/digest-auth/auth/${username}/${passwd}/`;
const base = 'http://localhost';

const axios = new AxiosDigest(username, passwd);
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
const url2 = `/digest-auth/auth-int/${username}/${passwd}/`;
test('MD5-int (not support)', () => {
  expect(axios.get(`${base}${url2}MD5`)).rejects.toMatch('error');
});
test('SHA-256-int (not support)', () => {
  expect(axios.get(`${base}${url2}SHA-256`)).rejects.toMatch('error');
});
test('SHA-512-int (not support)', () => {
  expect(axios.get(`${base}${url2}SHA-512`)).rejects.toMatch('error');
});
