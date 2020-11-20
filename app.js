const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");
const mongoose = require("mongoose");
const passport = require("passport");
const { ApolloServer } = require("apollo-server-express");
const responseCachePlugin = require("apollo-server-plugin-response-cache");
const passportStrategy = require("./middleware/passport-strategy");
const authRoutes = require("./routes/auth.routes");
//const startRoutes = require("./routes/start.routes");
const deliveryRoutes = require("./routes/delivery.routes");
// const productsRoutes = require("./routes/products.routes");
// const categoryRoutes = require("./routes/category.routes");
// const mainpageRoutes = require("./routes/mainpage.routes");
// const orderRoutes = require("./routes/order.routes");
// const searchRoutes = require("./routes/search.routes");
// const newsRoutes = require("./routes/news.routes");
// const pageRoutes = require("./routes/page.routes");
// const commentRoutes = require("./routes/comment.routes");
const satisRoutes = require("./routes/satis.routes");
const satisuploadRoutes = require("./routes/satisupload.routes");
const satisexcellRoutes = require("./routes/satisexcell.routes");
const satisdeliveryRoutes = require("./routes/satisdelivery.routes");
const satispdfRoutes = require("./routes/satispdf.routes");
const cronosworkRoutes = require("./routes/cronoswork.routes");
const { typeDefs, resolvers } = require("./shema/shema");

const keys = require("./keys");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    ip: req.ip,
  }),
  debug: process.env.NODE_ENV !== "production",
  plugins: [responseCachePlugin()],
  cacheControl: {
    defaultMaxAge: 3600,
  },
});

const app = express();
app.use(cors());

app.use(passport.initialize());
passport.use(passportStrategy);

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.set("trust proxy", true);

const API_SERVER_OFF = process.env.API_SERVER_OFF ? true : false;

app.use((_, res, next) => {
  if (API_SERVER_OFF) {
    return res.status(503).send("На серевере проводятся технические работы...");
  }
  next();
});

app.use((req, _, next) => {
  req.ip = req.headers["X-Real-IP"] || req.connection.remoteAddress;
  next();
});

//app.use("/api/start", startRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/delivery", deliveryRoutes);
// app.use("/api/products", productsRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/mainpage", mainpageRoutes);
// app.use("/api/order", orderRoutes);
// app.use("/api/search", searchRoutes);
// app.use("/api/news", newsRoutes);
// app.use("/api/page", pageRoutes);
// app.use("/api/comment", commentRoutes);
app.use("/api/satisupload", satisuploadRoutes);
app.use("/api/satis", satisRoutes);
app.use("/api/satisexcell", satisexcellRoutes);
app.use("/api/satisdelivery", satisdeliveryRoutes);
app.use("/api/satispdf", satispdfRoutes);
app.use("/api/cronoswork", cronosworkRoutes);

app.use(express.static(path.join(__dirname, "static")));
app.use(express.static(path.join(__dirname, "staticroot")));

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "build")));

  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use(mongoSanitize());
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

const PORT = keys.PORT || 5000;

server.applyMiddleware({ app, path: "/api/graphql" });

async function start() {
  try {
    await mongoose.connect(keys.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(`MongoDB connected, MONGO_URI: ${keys.MONGO_URI}`);
    const db = mongoose.connection;

    db.on("reconnected", function () {
      console.log("reconnected successfully");
    });
    db.on("reconnectFailed", function (error) {
      console.error("reconnectTries - filed", error);
    });

    app.listen(PORT, () =>
      console.log(
        `App has been started on port ${PORT}..., URL: http://localhost:${PORT}`
      )
    );
  } catch (e) {
    console.log("Server Error", e.message);
    process.exit(1);
  }
}

start();
