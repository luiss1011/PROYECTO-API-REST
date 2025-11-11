const mongoose = require('mongoose');
const CONFIG = require('./configuracion');

module.exports.connect = async () => {
  try {
    await mongoose.connect(CONFIG.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};
