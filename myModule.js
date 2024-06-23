var mysql = require('mysql');
var fs = require('fs');
var con;

// connect to database
exports.connectToDB = function () {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "csit128_project"
    });
    return con;
};

//create session
exports.postAuthentication = function (res, mySess, empId, body) {
    if (empId != -1 && empId != "" && empId !== undefined) {
        mySess.setMySession(body.user_username);
        mySess.setUserIdSession(empId);
        s = mySess.getMySession();
        if (s.user_username != "" && s.user_username !== undefined) {
            // Redirect to the Home page.
            fs.readFile("homepage.html", function (err, data) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                return res.end();
            });
             
  
        }
    }
}

//login user in the web

exports.login = function (res) {   // to display error message if there is any.
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

//logout user in the web

exports.logout = function (res) {
    fs.readFile("loginPage.html", function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        if (con != undefined && con != "") {
            con.destroy();
        }        
        return res.end();
    });
};

//navigate to home page

exports.navigateToHome = function (res, mySess) {
    fs.readFile("ADMINhomepage.html", function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
};

exports.navigateToAddRecipe = function (res, mySess, result) {
    fs.readFile('addRecipePage.html', function (err, data) {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('Error loading the page');
        return res.end();
      }
  
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.write('<script>');
      if (result !== undefined) {
        res.write('document.getElementById("record_added").innerHTML = "The recipe has been added successfully";');
      }
      res.write('</script>');
      return res.end();
    });
  };
  
  // Function to add a recipe to the database
  exports.addRecipe = function (recipe, res) {
    const sql = 'INSERT INTO recipes (recipe_name, recipe_content, recipe_image, recipe_tag1, recipe_tag2, recipe_user) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [recipe.name, recipe.content, recipe.image, recipe.tag1, recipe.tag2, recipe.user];
  
    con.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error adding recipe:', err.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('Error adding recipe');
        return res.end();
      }
  
      console.log('Recipe added:', result);
      // Call the navigateToAddRecipe function to display the success message
      exports.navigateToAddRecipe(res, null, result);
    });
  };