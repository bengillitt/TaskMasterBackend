require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// mongoose.connect("mongodb://127.0.0.1:27017/taskMaster");
mongoose.connect(process.env.MONGO_URL);

///?retryWrites=true&w=majority

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  todos: [{ todo: String, key: Number }],
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("TaskMaster Todo List");
});

app.post("/signup", async (req, res) => {
  if ((await User.findOne({ email: req.body.username })) === null) {
    const signup = new User({
      email: req.body.username,
      password: req.body.password,
      todos: [],
    });

    signup.save();

    res.send("Process Complete");
  } else {
    res.send("Email Already in Use");
  }
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if ((await User.findOne({ email: username })) !== null) {
    const user = await User.findOne({ email: username });
    if (user.password == password) {
      res.send("login");
    } else {
      res.send("wrong password");
    }
  } else {
    res.send("User does not exist");
  }
});

app.post("/getTodos", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  if ((await User.findOne({ email: email })) !== null) {
    let user = await User.findOne({ email: email });
    if (user.password === password) {
      res.send(JSON.stringify(user.todos));
    }
  }
});

app.post("/addTodo", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  if ((await User.findOne({ email: email })) !== null) {
    let user = await User.findOne({ email: email });

    if (user.password === password) {
      user.todos.push({ todo: req.body.todo, key: req.body.key });

      user.save();

      res.send("Process Complete");
    }
  } else {
    res.send("error");
  }
});

app.post("/removeTodo", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  if ((await User.findOne({ email: email })) !== null) {
    let user = await User.findOne({ email: req.body.username });

    console.log(user.todos);

    if (user.password === password) {
      user.todos = user.todos.filter((todo) => {
        return todo.todo !== req.body.todo;
      });

      console.log(user.todos);

      user.save();

      res.send("Process Complete");
    }
  } else {
    res.send("error");
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
