const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://miguelangelmercado00:sBbIH0Cpwj02keuZ@filljob.59jjq.mongodb.net/?retryWrites=true&w=majority&appName=FillJob')
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((error) => console.error('Error al conectar a MongoDB Atlas:', error));

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'El nombre es obligatorio'] },
  lastName: { type: String, required: [true, 'El apellido es obligatorio'] },
  email: { type: String, required: [true, 'El correo electrónico es obligatorio'] },
  phone: { type: String, required: [true, 'El número de teléfono es obligatorio'] },
  id: { type: String, required: [true, 'El número de identificación es obligatorio'] },
  experience: { type: String, required: [true, 'La experiencia laboral es obligatoria'] },
  education: { type: String, required: false },
  languages: { type: String, required: false },
  professionalSummary: { type: String, required: false },
  salaryExpectation: { type: String, required: false },
  residenceAddress: { type: String, required: false },
  jobPlatform: { type: String, required: false }, // Nueva plataforma seleccionada
  profileURL: { type: String, required: false },  // Campo adicional para LinkedIn
  certifications: { type: String, required: false },  // Campo adicional para LinkedIn
  recomendations: { type: String, required: false },  // Campo adicional para LinkedIn
  disponibilityToRemoteWork: { type: String, required: false },  // Campo adicional para LinkedIn
  industry: { type: String, required: false },    // Campo adicional para Magneto
  skills: { type: String, required: false },   // Campo adicional para Magneto
  typeOfContract: { type: String, required: false }, // Campo adicional para Magneto
  disponibilityToStart: { type: String, required: false }, // Campo adicional para Magneto

});

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(express.json());

app.get('/api', async (req, res) => {
  const users = await User.find();
  res.json({ users });
});

app.get('/api/user', async (req, res) => {
  try {
    // Ordena los usuarios en orden descendente por _id y toma el primero (último usuario agregado)
    const user = await User.findOne().sort({ _id: -1 });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'No se encontró ningún usuario' });
    }
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
});


app.post('/api/addUser', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: 'Usuario añadido exitosamente', user: newUser });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Error de validación', errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
