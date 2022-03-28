// import package here
const multer = require('multer')

exports.uploadTransaction = (imageFile) => {
  // code here
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/transaction")
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ""))
    }
  })

  const fileFilter = function (req, file, cb) {
    // <input type="file" name="image"></input>
    // image.pdf 
    if (file.fieldname == imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|png|PNG|jpeg|JPEG)$/)) {
        req.fileValidationError = {
          message: 'only image file are allowed'
        }
        return cb(new Error("only image file are allowed"), false)
      }
    }
    cb(null, true)
  }


  const sizeInMB = 10
  const maxSize = sizeInMB * 1000 * 1000

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileize: maxSize
    }
  }).single(imageFile)

  //config middleware multer
  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError)
      }

      // jika tidak ada file yang diupload

      // jika size lebih
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send({
            message: 'Max file size 10 MB'
          })
        }
        return res.status(400).send(err)
      }

      return next()
    })
  }
};

exports.uploudBook = (file1, file2) => {
  // code here
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname == file1){
        cb(null, "uploads/cover")
      } 
      if (file.fieldname == file2) {
        cb(null, "uploads/epub")
      }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ""))
    }
  })

  const fileFilter = function (req, file, cb) {
    // <input type="file" name="image"></input>
    // image.pdf 
    if (file.fieldname == file1) {
      if (!file.originalname.match(/\.(jpg|JPG|png|PNG|jpeg|JPEG|epub)$/)) {
        req.fileValidationError = {
          message: 'only image and epub file are allowed'
        }
        return cb(new Error("only image and epub file are allowed"), false)
      }
    }
    cb(null, true)
  }


  const sizeInMB = 100
  const maxSize = sizeInMB * 1000 * 1000

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileize: maxSize
    }
  }).fields([{name : file1 , maxCount : 1}, {name : file2 , maxCount : 1} ])

  //config middleware multer
  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.filesValidationError) {
        return res.status(400).send(req.filesValidationError)
      }

      // jika tidak ada file yang diupload
      if (!req.files && !err) {
        return res.status(400).send({
          message: 'Please select file to upload'
        })
      }

      // jika size lebih
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send({
            message: 'Max file size 100 MB'
          })
        }
        return res.status(400).send(err)
      }

      return next()
    })
  }
};