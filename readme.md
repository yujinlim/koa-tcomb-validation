# koa-tcomb-validation [![Build Status](https://img.shields.io/travis/yujinlim/koa-tcomb-validation.svg?style=flat-square)](https://travis-ci.org/yujinlim/koa-tcomb-validation) ![npm](https://img.shields.io/npm/dt/koa-tcomb-validation.svg?style=flat-square) ![npm](https://img.shields.io/npm/v/koa-tcomb-validation.svg?style=flat-square)
> tcomb validation as koa middleware

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fyujinlim%2Fkoa-tcomb-validation.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fyujinlim%2Fkoa-tcomb-validation?ref=badge_large)

## Description
A koa middleware that checks `body/query` request matches with tcomb type, if not valid, return standard `400` http code, or can be intercepted via koa global error handling.

## API
### `validate(type, [location])`
#### type  
Type: `Function`  
a type defined with the tcomb library

#### location  
Type: `String`  
Default: `body`  
request property to compare with type object, eg `body/query`

## Usage
```js
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const validate = require('koa-tcomb-validation')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

const body = t.struct({
  x: t.Number,
  y: t.Number
})

// request body will be check
router.post('/', validate(body, 'body'), async (ctx, next) => {
  ctx.status = 200
})

app.use(bodyParser())

// global middlewares
app.use(async (ctx, next) => {
  // the parsed body will store in ctx.request.body
  // if nothing was parsed, body will be an empty object {}
  ctx.body = ctx.request.body
  await next()
})

app.use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)
```
