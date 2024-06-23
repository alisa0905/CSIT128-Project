var mysql = require('mysql');
var fs = require('fs');
var con;

// Create the connection once
con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "csit128_project"
});

con.connect(function(err) {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to database!");
});

exports.postAuthentication = function (res, mySess, user_id, body) {
    console.log("Post-authentication process started");
    if (user_id != -1 && user_id) {
        mySess.setMySession(body.username);
        mySess.setUserIdSession(user_id);
        s = mySess.getMySession();
        if (s.user_id) {
            console.log("Redirecting to myRecipes.html");
            res.writeHead(302, { 'Location': '/myRecipes.html' });
            return res.end();
        }
    } else {
        console.log("Authentication failed in post-authentication");
        fs.readFile("loginPage.html", function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end("404 Not Found");
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data + "<script>document.getElementById('demo_error_message').innerHTML = 'You have entered an incorrect username or password!';</script>");
            return res.end();
        });
    }
};

exports.login = function (res) {
    fs.readFile("loginPage.html", function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
};

exports.authenticateUser = function (res, body, mySess, callback) {
    console.log("Authenticating user:", body.username);
    const username = body.username;
    const password = body.password;

    const sql = "SELECT * FROM user WHERE user_username = ? AND user_password = ?";
    con.query(sql, [username, password], function (err, result) {
        if (err) {
            console.error("Database query error:", err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Internal Server Error');
        }
        
        if (result.length > 0) {
            console.log("User authenticated successfully");
            callback(res, mySess, result[0].user_id, body);
        } else {
            console.log("Authentication failed");
            res.writeHead(302, { 'Location': '/loginPage?error=1' });
            res.end();
        }
    });
};

exports.handleLogin = function (req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Convert Buffer to string
    });
    req.on('end', () => {
        const formData = querystring.parse(body);
        authenticateUser(res, formData);
    });
};

exports.addRecipe = function (res, mySess, body) {
    console.log("Adding recipe:", body);
    const { recipeTitle, ingredients, cookingTime, servingSize, tags, cuisine, image, recipeBody } = body;
    const user_id = mySess.getMySession().user_id;

    if (!user_id) {
        console.error("User not authenticated");
        res.writeHead(302, { 'Location': '/loginPage' });
        return res.end();
    }

    const sql = "INSERT INTO recipes (user_id, title, ingredients, cooking_time, serving_size, tags, cuisine, image, instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    con.query(sql, [user_id, recipeTitle, ingredients, cookingTime, servingSize, tags, cuisine, image, recipeBody], function (err, result) {
        if (err) {
            console.error("Database insert error:", err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Internal Server Error');
        }
        console.log("Recipe added successfully");
        res.writeHead(302, { 'Location': '/myRecipes.html' });
        res.end();
    });
};

exports.getMySession = function () {
    return mySession;
};

exports.getRecipeById = function (res, recipeId) {
    const sql = "SELECT * FROM recipes WHERE recipe_id = ?";
    con.query(sql, [recipeId], function (err, result) {
        if (err) {
            console.error("Database query error:", err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        if (result.length === 0) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Recipe not found');
            return;
        }

        const recipe = result[0];
        renderRecipePage(res, recipe);
    });
};

function renderRecipePage(res, recipe) {
    let recipeHtml = `
    <div class="body" style="height:1300px;">
        <div class="ingredientCard">
            <div class="ingredientFunnyLine">
                <h3>ingredient list</h3>
            </div>
            <div class="ingredientFunnyLine" style="text-align: left;padding: 5px;background-color: #D0DB92;">
                <b>serving size -</b> ${recipe.recipe_servingsize} person
            </div>
            <div style="padding:30px;">
                <ul>
                    ${recipe.recipe_ingredients.split('\n').map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
        </div>
        <div class="previewSection">
            <div class="pageTitle">
                ${recipe.recipe_name.toUpperCase()}
            </div> 
            <div class="pageTagWrapper">
                <div class="pageTag">
                  #${recipe.recipe_tag1.replace('_', ' ')}
                </div>
                <div class="pageTag">
                  #${recipe.recipe_tag2.replace('_', ' ')}
                </div>
            </div>
        <img style="width: 630px;" src="data:image/jpeg;base64,${Buffer.from(recipe.recipe_image).toString('base64')}" alt="${recipe.recipe_name}">
        <h2>INSTRUCTIONS</h2>
        <br>
        <p>
            ${recipe.recipe_content}
        </p>
    </div>
    `;

    fs.readFile('template.html', 'utf8', (err, data) => {
        if (err) {
            console.error("File read error:", err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }
        const page = data.replace('{{recipeContent}}', recipeHtml);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(page);
        res.end();
    });
}

app.get('/search', (req, res) => {
    const query = req.query.query;

    if (!query) {
        res.redirect('/');
        return;
    }

    const sql = `SELECT * FROM recipes WHERE recipe_name LIKE '%${query}%' OR recipe_tag1 LIKE '%${query}%' OR recipe_tag2 LIKE '%${query}%'`;

    con.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('searchResults', { recipes: result }); 
    });
});

app.set('view engine', 'ejs'); 

app.get('/searchResults', (req, res) => {
    res.render('searchResults', { recipes: [] });
});
