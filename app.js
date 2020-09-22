
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const passport = require('passport');
const passportStrategy = require('./middleware/passport-strategy');
const startRoutes = require('./routes/start.routes');
const authRoutes = require('./routes/auth.routes');
const deliveryRoutes = require('./routes/delivery.routes');
const modificationRoutes = require('./routes/modification.routes');
const productsRoutes = require('./routes/products.routes');
const categoryRoutes = require('./routes/category.routes');
const paramsRoutes = require('./routes/params.routes');
const mainpageRoutes = require('./routes/mainpage.routes');
const orderRoutes = require('./routes/order.routes');
const searchRoutes = require('./routes/search.routes');
const newsRoutes = require('./routes/news.routes');
const pageRoutes = require('./routes/page.routes');
const commentRoutes = require('./routes/comment.routes');
const satisRoutes = require('./routes/satis.routes');
const satisuploadRoutes = require('./routes/satisupload.routes');
const satisexcellRoutes = require('./routes/satisexcell.routes');
const satisdeliveryRoutes = require('./routes/satisdelivery.routes');
const satispdfRoutes = require('./routes/satispdf.routes');
const cronosworkRoutes = require('./routes/cronoswork.routes');



const keys = require('./keys');
const app = express();
app.use(cors());


app.use(passport.initialize())
passport.use(passportStrategy)

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

app.use('/api/start', startRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/modification', modificationRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/category', categoryRoutes);
//app.use('/api/filter', filterRoutes);
app.use('/api/params', paramsRoutes);
app.use('/api/mainpage', mainpageRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/page', pageRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/satisupload', satisuploadRoutes);
app.use('/api/satis', satisRoutes);
app.use('/api/satisexcell', satisexcellRoutes);
app.use('/api/satisdelivery', satisdeliveryRoutes);
app.use('/api/satispdf', satispdfRoutes);
app.use('/api/cronoswork', cronosworkRoutes);


app.use(express.static(path.join(__dirname, 'static')));

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.use(mongoSanitize())
app.use(mongoSanitize({
    replaceWith: '_'
}))


const PORT = keys.PORT || 5000


async function start() {
  try {
    await mongoose.connect(keys.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log("MongoDB connected");
    const db = mongoose.connection;

    db.on('reconnected', function () {
        console.log('reconnected successfully')
    });
    db.on('reconnectFailed', function (error) {
        console.error('reconnectTries - filed', error);
    });

    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()