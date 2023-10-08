// Import necessary modules and libraries
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const { DateTime } = require("luxon");

// Initialize Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "supersecretkey", // Change this to a more secure key in production
    resave: false,
    saveUninitialized: true
}));

// Define routes and functions
app.get("/", (req, res) => {
    // Check if user is logged in
    if (req.session.username) {
        // Render homepage with existing blog posts
        res.render("home", { posts: existingPosts });
    } else {
        // Render homepage with login option
        res.render("login");
    }
});

app.get("/signup", (req, res) => {
    // Render signup page
    res.render("signup");
});

app.post("/signup", (req, res) => {
    // Get username and password from form
    const username = req.body.username;
    const password = req.body.password;
    // Save user credentials to database
    saveUserToDatabase(username, password);
    // Log user in and redirect to homepage
    req.session.username = username;
    res.redirect("/");
});

app.get("/login", (req, res) => {
    // Render login page
    res.render("login");
});

app.post("/login", (req, res) => {
    // Get username and password from form
    const username = req.body.username;
    const password = req.body.password;
    // Check if user credentials are valid
    if (checkUserCredentials(username, password)) {
        // Log user in and redirect to homepage
        req.session.username = username;
        res.redirect("/");
    } else {
        // Render login page with error message
        res.render("login", { error: "Invalid username or password" });
    }
});

app.get("/logout", (req, res) => {
    // Clear session and redirect to homepage
    req.session.destroy();
    res.redirect("/");
});

app.get("/dashboard", (req, res) => {
    // Check if user is logged in
    if (req.session.username) {
        // Get user's existing blog posts from database
        const userPosts = getUserPostsFromDatabase(req.session.username);
        // Render dashboard with existing blog posts
        res.render("dashboard", { posts: userPosts });
    } else {
        // Redirect to login page
        res.redirect("/login");
    }
});

app.get("/newpost", (req, res) => {
    // Render new post page
    res.render("newpost");
});

app.post("/newpost", (req, res) => {
    // Get title and contents of new blog post from form
    const title = req.body.title;
    const contents = req.body.contents;
    // Save new blog post to database
    savePostToDatabase(req.session.username, title, contents, DateTime.now());
    // Redirect to dashboard
    res.redirect("/dashboard");
});

app.get("/editpost/:postId", (req, res) => {
    // Get blog post from database
    const post = getPostFromDatabase(req.params.postId);
    // Render edit post page with existing post data
    res.render("editpost", { post: post });
});

app.post("/editpost/:postId", (req, res) => {
    // Get updated title and contents of blog post from form
    const title = req.body.title;
    const contents = req.body.contents;
    // Update blog post in database
    updatePostInDatabase(req.params.postId, title, contents);
    // Redirect to dashboard
    res.redirect("/dashboard");
});

app.get("/deletepost/:postId", (req, res) => {
    // Delete blog post from database
    deletePostFromDatabase(req.params.postId);
    // Redirect to dashboard
    res.redirect("/dashboard");
});

// Run app
app.listen(3000, () => {
    console.log("Server started on port 3000");
});