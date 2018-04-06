const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const t = require('tcomb')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
chai.should()

const validate = require('./')

describe('#test tcomb-koa', () => {
  let server = null

  before(() => {
    const app = new Koa()
    const router = new Router()

    const body = t.struct({
      x: t.Number,
      y: t.Number
    })

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

    app.use(async (ctx, next) => {
      try {
        await next()
      } catch (e) {
        ctx.body = {
          message: e.message
        }
        ctx.status = e.status
        ctx.app.emit('error', e, ctx)
      }
    })

    app.use(router.routes())
      .use(router.allowedMethods())

    server = chai.request(app.listen(3000)).keepOpen()
  })

  after(() => {
    server.close()
  })

  it('should return 400 for bad request payload', async () => {
    await server
      .post('/')
      .then(res => {
        res.status.should.eql(400)
        res.body.message.should.eql('Invalid value undefined supplied to /x: Number')
      })

    await server
      .post('/')
      .send({
        x: 1
      })
      .then(res => {
        res.status.should.eql(400)
        res.body.message.should.eql('Invalid value undefined supplied to /y: Number')
      })
  })

  it('should return 200', () => {
    return server
      .post('/')
      .send({
        x: 1,
        y: 1
      })
      .then(res => {
        res.status.should.eql(200)
      })
  })
})
