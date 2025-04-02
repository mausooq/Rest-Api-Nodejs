const express = require('express');
const Users = require('./MOCK_DATA.json');
const fs = require('fs')
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

app.use((req,res,next) => {
    console.log('Request received 1');
    req.user = "mausooq"
    next()
})
app.use((req,res,next) => {
    console.log('Request received 2 '+req.user);
    fs.appendFile('log.txt', `\n${Date.now()}   :   ${req.method}  :  ${req.path}  :  ${req.ip}`,(err,data) => {
        next()
    })
})

// GET all users
app.get('/api/users', (req, res) => {
    res.json(Users);
});

// GET a single user by ID
app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = Users.find(user => user.id === id);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
});

// POST - Create a new user
app.post('/api/users', (req, res) => {
    const newUser = { id: Users.length + 1, ...req.body };
    Users.push(newUser);
    res.status(201).json(newUser);
});

// PUT - Update an existing user (full update)
app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = Users.findIndex(user => user.id === id);
    
    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    Users[index] = { id, ...req.body }; // Replace entire user object
    res.json(Users[index]);
});


// DELETE - Remove a user
app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = Users.findIndex(user => user.id === id);
    
    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    Users.splice(index, 1);
    res.json({ message: 'User deleted successfully' });
});

// Render users as an HTML list
app.get('/users', (req, res) => {
    const html = `
    <ul>
    ${Users.map(user => `<li>${user.first_name}</li>`).join('')}
    </ul>
    `;
    res.send(html);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
