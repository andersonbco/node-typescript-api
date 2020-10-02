describe('Beaches functional teste', () => {
  describe('When creating a beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      }

      const response = await global.testRequest.post('/beaches').send(newBeach)
      expect(response.status).toBe(201)
      // compare the contents but not the id of the new beach
      expect(response.body).toEqual(expect.objectContaining(newBeach))
    })
  })
})
