# axios-digest
[![Build Status](https://travis-ci.com/rearn/axios-digest.svg?branch=master)](https://travis-ci.com/rearn/axios-digest)

`axios-digest` is axios add digest auth.

## Installation

``` sh
npm install --save axios-digest
```

## Usage
See test code. (`index.test.ts`)
It pretty much is a wrapper around Axios. the primary or most commonly-used HTTP methods only are available -> `POST, PUT, PATCH, GET, DELETE, HEAD`. See below for usage upfront (It was inspired from the test file).

### AxiosDigest Constructor AxiosDigest(username: string, passwd: string, customAxios: AxiosInstance|AxiosStatic)

### Parameters

- `username`: Not optional | `string`.
- `password`: Not optional | `string`.
- `customAxios`: Optional. An existing axios instance | `AxiosInstance|AxiosStatic`.

```js
import AxiosDigest from '.';

const username = '[username]';
const passwd = '[pass]';

const base = 'http://localhost';

const axiosDigest = new AxiosDigest(username, passwd);
// Go ahead and make them request!

```

### Fields && Methods

#### axiosDigest.info

Interface for setting the username && password beyond the `constructor`. It does not include a custom Axios instance as in the constructor.
It receives an object and the fields `username` && `passwd` are not Optional, and returns the same, only that the value for field `passwd` is masked.  

```js
axiosDigest.info = {username, passwd};
const info = axiosDigest.info; // { username: '[username]', passwd: '***' }
```

### axiosDigest[HTTP_METHODS]

The HTTP Methods available have been previously highlighted and returns a Promise<any>.

### Similar Parameters

- `path`: Not optional | `string`.
-  `data`: Optional | `any`.
- `config`: Optional | `AxiosRequestConfig`.


#### axiosDigest.head

Makes a `HEAD` request.

```js
axiosDigest.head(path: string, config?: AxiosRequestConfig): Promise<any>;
```
  
#### axiosDigest.delete

Makes a `DELETE` request.

```js
axiosDigest.delete(path: string, config?: AxiosRequestConfig): Promise<any>;
```
  
#### axiosDigest.get

Makes a `GET` request.

```js
axiosDigest.get(path: string, config?: AxiosRequestConfig): Promise<any>;
```
  
#### axiosDigest.patch

Makes a `PATCH` request.

```js
axiosDigest.get(path: string, data: any, config?: AxiosRequestConfig): Promise<any>;
```

#### axiosDigest.put

Makes a `PUT` request.

```js
axiosDigest.put(path: string, data: any, config?: AxiosRequestConfig): Promise<any>;
```
  
#### axiosDigest.post

Makes a `POST` request.

```js
axiosDigest.post(path: string, data: any, config?: AxiosRequestConfig): Promise<any>;
```

## License

MIT
