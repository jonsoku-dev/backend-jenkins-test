const request= require('supertest');
const app = require('../index');

describe('GET /', () => {
    it('hello world라는 요청이 와야한다.', () =>{
        //navigate to root and check the response is 'hello world'
        request(app).get('/').expect('hello world')
    })
})