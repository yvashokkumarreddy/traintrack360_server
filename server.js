const app = require('./src/app');
const sequelize = require('./src/models/configDb');  // now returns the sequelize instance

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ DB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚆 TrainTrack360 backend running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
  });
