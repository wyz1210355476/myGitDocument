export default {
  transformResponse: [function(data) {
    // console.log(typeof data)
    try {
      if (typeof data === 'string') {
        data = JSON.parse(data)
      }
    } catch (e) {
      console.log(e);
    }
    return data;
  }]
}
