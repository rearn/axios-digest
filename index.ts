// eslint-disable-next-line no-unused-vars
import axios, { AxiosInstance, AxiosRequestConfig, AxiosStatic } from 'axios';
import * as md5 from 'js-md5';
import { sha256 } from 'js-sha256';
import { sha512, sha512_256 as sha512256 } from 'js-sha512';

export default class AxiosDigest {
  private readonly axios: AxiosInstance|AxiosStatic;

  private username: string;

  private passwd: string;

  constructor(username: string, passwd: string, customAxios?: AxiosInstance|AxiosStatic) {
    this.axios = customAxios !== undefined ? customAxios : axios;
    this.username = username;
    this.passwd = passwd;
  }

  set info(d: {username: string, passwd: string}) {
    this.username = d.username;
    this.passwd = d.passwd;
  }

  get info() {
    return { username: this.username, passwd: '***' };
  }

  public async get(path: string, config?: AxiosRequestConfig) {
    try {
      return await this.axios.get(path, config);
    } catch (v) {
      const c = this.getAuthHeader(this.getWwwAuth(v), 'GET', path, config);
      return this.axios.get(path, c);
    }
  }

  public async post(path: string, data?: any, config?: AxiosRequestConfig) {
    try {
      return await this.axios.post(path, data, config);
    } catch (v) {
      const c = this.getAuthHeader(this.getWwwAuth(v), 'POST', path, config);
      return this.axios.post(path, data, c);
    }
  }

  public async put(path: string, data?: any, config?: AxiosRequestConfig) {
    try {
      return await this.axios.put(path, data, config);
    } catch (v) {
      const c = this.getAuthHeader(this.getWwwAuth(v), 'PUT', path, config);
      return this.axios.put(path, data, c);
    }
  }

  public async delete(path: string, config?: AxiosRequestConfig) {
    try {
      return await this.axios.delete(path, config);
    } catch (v) {
      const c = this.getAuthHeader(this.getWwwAuth(v), 'DELETE', path, config);
      return this.axios.delete(path, c);
    }
  }

  public head(path: string, config?: AxiosRequestConfig) {
    return this.axios.head(path, config).catch(this.getWwwAuth).then((wwwAuth) => {
      const c = this.getAuthHeader(wwwAuth, 'HEAD', path, config);
      return this.axios.head(path, c);
    });
  }

  public patch(path: string, data?: any, config?: AxiosRequestConfig) {
    return this.axios.patch(path, data, config).catch(this.getWwwAuth).then((wwwAuth) => {
      const c = this.getAuthHeader(wwwAuth, 'PATCH', path, config);
      return this.axios.patch(path, data, c);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private getWwwAuth(r: any) {
    const { status } = r.response;
    if (status === 401) {
      return r.response.headers['www-authenticate'];
    }
    throw r;
  }

  private getAuthHeader(
    authHeader: string,
    method: string,
    url: string,
    config?: AxiosRequestConfig,
  ) {
    const paramsString: string[] = authHeader.split(/\s*,?\s*Digest\s*/).filter((v) => v !== '');
    const paramsArray: string[][] = paramsString.map((v) => v.split(/\s*,(?=(?:[^"]*"[^"]*")*)\s*/));
    const paramsKvArray: [string, string][][] = paramsArray.map((v) => v.map((value) => {
      const ret = value.split(/\s*=(?:(?=[^"]*"[^"]*")|(?!"))\s*/, 2).map((v2) => v2.replace(/^"/, '').replace(/"$/, ''));
      return [ret[0], ret[1]];
    }));
    const paramsMapArray: {[s: string]: string}[] = paramsKvArray.map((v) => {
      const t: {[s: string]: string} = {};
      v.forEach((w) => {
        // eslint-disable-next-line prefer-destructuring
        t[w[0]] = w[1];
      });
      return t;
    });
    const calams = ['realm', 'nonce', 'qop'];
    const paramsCalamsOk = paramsMapArray.map((v) => {
      if (!('algorithm' in v)) {
        // eslint-disable-next-line no-param-reassign
        v.algorithm = 'MD5';
      }
      return v;
    }).filter((v) => ['MD5', 'SHA-256', 'SHA-512-256', 'SHA-512'].findIndex((i) => i === v.algorithm) >= 0)
      .filter((v) => calams.filter((value) => !(value in v)).length === 0)
      .filter((v) => v.qop.split(/\s*,\s*/).filter((v2) => v2 === 'auth').length !== 0);

    if (paramsCalamsOk.length === 0) {
      throw new Error('Auth params error.');
    }
    paramsCalamsOk.sort((a, b) => {
      const [aEval, bEval] = [a.algorithm, b.algorithm].map((v) => {
        if (v === 'MD5') return 0;
        if (v === 'SHA-256') return 1;
        if (v === 'SHA-512-256') return 2;
        return 3;
      });
      return bEval - aEval;
    });
    const params: {[s: string]: string} = paramsCalamsOk[0];
    const { username } = this;
    const { passwd } = this;
    const {
      realm,
      nonce,
      opaque,
      algorithm,
    } = params;
    const uri: string = url.split(/^https?:\/\/[^/]+/).filter((v) => v !== '')[0];
    const cnonce: string = Math.random().toString(36).substring(2, 10);
    const nc: string = '00000001';
    const qop: string = 'auth';

    const hashHex = ((): (str: string) => string => {
      if (algorithm === 'MD5') return md5;
      if (algorithm === 'SHA-256') return sha256;
      if (algorithm === 'SHA-512-256') return sha512256;
      return sha512;
    })();

    const hashHexArray = (data: string[]) => hashHex(data.join(':'));
    const a1 = [username, realm, passwd];
    const a1hash = hashHexArray(a1);
    const a2 = [method, uri];
    const a2hash = hashHexArray(a2);
    const a3 = [a1hash, nonce, nc, cnonce, qop, a2hash];
    const response = hashHexArray(a3);
    const dh: {[s: string]: string} = {
      realm,
      nonce,
      uri,
      username,
      cnonce,
      nc,
      qop,
      algorithm,
      response,
      opaque,
    };

    const auth = `Digest ${Object.keys(dh).map((v) => `${v}="${dh[v]}"`).join(', ')}`;

    if (config === undefined) {
      return { headers: { Authorization: auth } };
    }

    if (config.headers === undefined) {
      // eslint-disable-next-line no-param-reassign
      config.headers = {};
    }
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = auth;
    return config;
  }
}
