// https://stackoverflow.com/a/51114250
declare namespace NodeJS {
  interface Global {
    testRequest: import('supertest').SuperTest<import('supertest').Test>
  }
}
