import express from "express"
import mongoose from "mongoose"
import multer from "multer"
import { postCreateValidation, loginValidation, registerValidation } from "./validations.js"
import { checkAuth, handleValidationErrors } from './utils/index.js'
import { PostController, UserController } from './controllers/index.js'
mongoose.set('strictQuery', true)
mongoose
  .connect('mongodb+srv://iykisoba:artur42r@cluster0.reryft7.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
  // .connect('mongodb+srv://dgoskiy:artur42r@cluster0.tohy41e.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')

  .then(() => console.log('DB ok'))
  .catch((err) => console.log("DB error", err))

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
})

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, handleValidationErrors, PostController.update)


// app.post('/auth/ebasit', ebasit)
app.listen(4444, (err) => {
  if (err) {
    return console.log("Ошибка!!!")
  }
  console.log("Server ОК")
})
