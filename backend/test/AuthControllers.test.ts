import { test, describe, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import AuthRoutes from '../src/routes/AuthRoutes'
import { UserSchema } from '../src/Models/User.model'
import { Mongoose } from '../src/helpers/Mongoose'
import { User } from '../src/Models/dto/User.dto'

describe.skip('Auth Controllers tests', () => {
  beforeAll(async () => {
    await Mongoose.connect()
    await new User({
      name: 'Ramón Hernández',
      phone: '322 146 37 29',
      email: 'raan.heam@gmail.com',
      password: 'somerandompassword1',
      role: 'admin'
    }).saveUser()
  })

  afterAll(async () => {
    await UserSchema.deleteMany({})
    await Mongoose.disconnect()
  })

  describe(`POST ${AuthRoutes.signup}`, () => {
    describe('Correct responses', () => {
      test('Should respond with status 201 and an auth token', async () => {
        const response = await request(app)
          .post(`${AuthRoutes.auth}${AuthRoutes.signup}`)
          .send({
            name: 'Ramón Hernández',
            phone: '322 146 37 29',
            email: 'raan.heam5086@gmail.com',
            password: 'somerandompassword1',
            role: 'admin'
          })
          .set('Content-Type', 'application/json')

        expect(response.statusCode).toBe(201)
        expect(response.body.token).toBeTruthy()
      })
    })

    describe('Wrong responses', () => {
      test('Should respond with status 409', async () => {
        const response = await request(app)
          .post(`${AuthRoutes.auth}${AuthRoutes.signup}`)
          .send({
            name: 'Ramón Hernández',
            phone: '322 146 37 29',
            email: 'raan.heam@gmail.com',
            password: 'somerandompassword1',
            role: 'admin'
          })
          .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(409)
      })

      test('Should respond with status 500', async () => {
        const response = await request(app)
          .post(`${AuthRoutes.auth}${AuthRoutes.signup}`)
          .send({
            name: 'Ramón Hernández',
            phone: '322 146 37 29',
            email: 'raan.heamgmail.com',
            password: 'somerandompassword1',
            role: 'admin'
          })
          .set('Content-Type', 'application/json')

        expect(response.statusCode).toBe(500)
      })
    })
  })

  describe(`POST ${AuthRoutes.login}`, () => {
    describe('Correct responses', () => {
      test('Should respond with status 200 and an auth token', async () => {
        const response = await request(app)
          .post(`${AuthRoutes.auth}${AuthRoutes.login}`)
          .send({
            email: 'raan.heam@gmail.com',
            password: 'somerandompassword1'
          })
          .set('Content-Type', 'application/json')

        expect(response.statusCode).toBe(200)
        expect(response.body.token).toBeTruthy()
      })
    })

    describe('Wrong responses', () => {
      test('Should respond with status 404', async () => {
        const response = await request(app)
          .post(`${AuthRoutes.auth}${AuthRoutes.login}`)
          .send({
            email: 'some.email@gmail.com',
            password: 'somerandompassword1'
          })
          .set('Content-Type', 'application/json')

        expect(response.statusCode).toBe(404)
      })

      test('Should respond with status 401', async () => {
        const response = await request(app)
          .post(`${AuthRoutes.auth}${AuthRoutes.login}`)
          .send({
            email: 'raan.heam5086@gmail.com',
            password: 'somerandompasswordd1'
          })
          .set('Content-Type', 'application/json')

        expect(response.statusCode).toBe(401)
        expect(response.body.token).toBeFalsy()
      })
    })
  })
})
