class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1) Filtering
    const queryObj = { ...this.queryString };
    const exludes = ['sort', 'page', 'limit', 'fields'];
    exludes.forEach((el) => {
      delete queryObj[el];
    });
    //Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    //2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limit() {
    //Limiting
    if (this.queryString.fields) {
      const sortBy = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(sortBy);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    //PAGINATION
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = ApiFeatures;
