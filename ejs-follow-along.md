# EJS Follow-Along (Odin) — Step by Step

A clean walkthrough you can build alongside. Each step flags **Type** (build muscle memory / understand syntax) vs **Copy** (boilerplate where typos just waste time).

> **Assumption:** You already have a working Express app from the previous Odin lessons — `const express = require("express")`, `const app = express()`, and `app.listen(...)` already exist in your `app.js`. This lesson only adds the EJS pieces on top.

---

## Step 1 — Install EJS

In your project terminal:

```bash
npm install ejs
```

**Copy.** A fixed command; no learning value in typing it.

---

## Step 2 — Create the `views` folder

At your project root, make a subfolder named `views`. This is where every template lives.

```bash
mkdir views
```

**Copy.** Just a directory.

---

## Step 3 — Configure Express to use EJS

In `app.js`, near the top with your other imports:

```js
const path = require("node:path");
```

Then, after `const app = express()`, add:

```js
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
```

**Type this.** It's the core wiring of the whole lesson and worth understanding line by line. `app.set("views", …)` tells Express *where* templates are; `path.join(__dirname, "views")` builds an absolute path to the `views` folder regardless of where you run the app from; `app.set("view engine", "ejs")` lets you write `res.render("index")` without the `.ejs` extension.

---

## Step 4 — Create your first template

Create `views/index.ejs`:

```html
<!-- views/index.ejs -->
<html>
  <body>
    <%= message %>
  </body>
</html>
```

**Type this.** The `<%= %>` output tag is the single most important piece of EJS syntax — typing it cements that this is the "print a variable into the HTML" tag.

---

## Step 5 — Render the template from a route

In `app.js`:

```js
app.get("/", (req, res) => {
  res.render("index", { message: "EJS rocks!" });
});
```

**Type this.** This is the heart of how a controller hands data to a view. First arg = template name (no extension), second arg = the data object made available inside the template. Start your server, visit `/`, and you should see **EJS rocks!**. Inspect the page — the `<%= message %>` is gone, replaced by the actual value.

> **Understanding check:** the template knew about `message` because EJS exposes everything in that object (plus anything on `res.locals`) inside a `locals` object. Inside the template, `message` and `locals.message` are the same thing.

---

## Step 6 — See how undefined variables behave

Temporarily edit `views/index.ejs`:

```html
<!-- views/index.ejs -->
<html>
  <body>
    <%= message %>
    <%= locals.foo %>
  </body>
</html>
```

**Type this.** Reload — it works, printing nothing for `foo`. Now change `locals.foo` to just `foo` and reload: you'll get a **ReferenceError**. The lesson: `locals.foo` safely returns `undefined`, but a bare undefined variable crashes. This is *why* you'll often guard with `locals.` for optional values. Revert this step before moving on.

---

## Step 7 — Practice raw JS in a template (loops)

To feel the `<% %>` (logic) vs `<%= %>` (output) distinction, try the doc's example in `index.ejs`:

```html
<% const animals = ["Cat", "Dog", "Lemur", "Hawk"] %>
<ul>
  <% animals.forEach((animal) => { %>
    <li><%= animal %>s are cute</li>
  <% }) %>
</ul>
```

**Type this.** Typing it teaches the key rule: `<% … %>` runs JavaScript but prints nothing (the loop scaffolding), while `<%= animal %>` prints a value. Notice the opening `{` and closing `}` each sit in their own `<% %>` tags.

> **Common slip:** writing `<% animal %>` instead of `<%= animal %>` inside the `<li>` — that prints nothing for the name. The `=` is what makes it output. (`.forEach` is used here instead of `.map` because you're looping for side effects, not building a new array — both run identically, but `.forEach` is the semantically correct tool.) Remove this block once you've seen it work.

---

## Step 8 — Build a reusable navbar (includes)

Create `views/navbar.ejs`:

```html
<!-- views/navbar.ejs -->
<nav>
  <ul>
    <% for (let i = 0; i < links.length; i++) { %>
      <li>
        <a href="<%= links[i].href %>">
          <span> <%= links[i].text %> </span>
        </a>
      </li>
    <% } %>
  </ul>
</nav>
```

**Type this.** The loop + property access (`links[i].href`) is good reinforcement.

Then update `app.js` to define `links` and pass it in:

```js
const links = [
  { href: "/", text: "Home" },
  { href: "/about", text: "About" },
];

app.get("/", (req, res) => {
  res.render("index", { links: links });
});
```

**Copy.** It's plain data; typos here are just friction.

And replace the `views/index.ejs` body to include the navbar:

```html
<!-- views/index.ejs -->
<html>
  <head>
    <title>Homepage</title>
  </head>
  <body>
    <%- include('navbar', {links: links}) %>
  </body>
</html>
```

**Type the `include` line specifically.** The critical detail: `<%-` (raw output), **not** `<%=`. Includes already produce HTML, and `<%=` would escape it (you'd see literal `&lt;nav&gt;` tags). Typing `<%-` here burns in that rule.

---

## Step 9 — Include in a loop (per-item partial)

Add a `users` array in `app.js` and pass it too:

```js
const users = ["Rose", "Cake", "Biff"];

app.get("/", (req, res) => {
  res.render("index", { links: links, users: users });
});
```

**Copy** the array; **type** the updated `res.render` line so you internalize that *every* variable a template uses must be passed in here.

Create `views/user.ejs`:

```html
<!-- views/user.ejs -->
<li><%= user %></li>
```

**Type this.** Tiny, but shows a partial receiving a single scoped variable.

Add to the `views/index.ejs` body:

```html
<ul>
  <% users.forEach((user) => { %>
    <%- include('user', {user: user}); %>
  <% }); %>
</ul>
```

**Type this.** This is the payoff pattern — looping in `<% %>` and `include`-ing a partial per item with its own data. Reload and you'll see Rose, Cake, Biff.

---

## Step 10 — Organize partials into subfolders

Rename `views/user.ejs` → `views/users/user.ejs`, then update the include path in `index.ejs`:

```html
<%- include('users/user', {user: user}); %>
```

**Type the path change.** Lesson: include paths are relative to the `views` root, so nesting is just a path string. Trivial but easy to get wrong.

---

## Step 11 — Serve static assets (CSS)

In `app.js`:

```js
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
```

**Type this.** `express.static` is a milestone middleware — worth typing to remember the pattern. It tells Express to serve files in `public/` as if they were at the URL root.

Create `public/styles.css`:

```css
/* public/styles.css */
body {
  color: red;
}
```

**Copy.** It's just a visible-result test.

Link it in the `views/index.ejs` head:

```html
<head>
  <link rel="stylesheet" href="/styles.css">
</head>
```

**Type the `href`.** Note it's `/styles.css`, **not** `/public/styles.css` — `public` is the served root, so it's invisible in the URL. This off-by-one path mistake trips everyone once; typing it makes the rule stick. Reload — red text confirms it works.

---

## Step 12 — The assignment (do this yourself)

The lesson asks you to extend the app. Rough plan, no code given on purpose — this is where the learning lands:

1. Add an `/about` route in `app.js` that does `res.render("about", …)`, and create `views/about.ejs`. Reuse the navbar via include.
2. Create `views/footer.ejs` as a partial, then include it in **every** page (`index.ejs` and `about.ejs`). If your footer needs data, pass it; if not, `<%- include('footer') %>` with no second argument is fine.

Build these by hand — recalling the include + render pattern without copying is the actual skill this lesson is teaching.

---

## Quick mental model to keep

The controller (`res.render`) gathers data → hands it to a view → the view stitches data into HTML using:

- `<%= %>` for **values** (escaped output)
- `<%- %>` for **raw output** (used with includes)
- `<% %>` for **logic** (loops, conditionals — prints nothing)
- `<%- include() %>` for **reusable pieces**

That request → controller → view flow is the whole point; EJS is just the syntax it happens to wear here.
