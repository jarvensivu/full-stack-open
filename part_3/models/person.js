const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const isValidPhoneNumber = (phoneNumber) => {
  var pattern = /^\d{2,3}-\d+$/
  return pattern.test(phoneNumber)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Too short name'],
    required: true,
    unique: true,
  },
  number: {
    type: String,
    minLength: [8, 'Too short number'],
    required: true,
    validate: [isValidPhoneNumber, 'Not a valid phone number'],
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
