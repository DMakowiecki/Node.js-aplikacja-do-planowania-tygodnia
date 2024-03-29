import express from 'express';
import mysql from 'mysql';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from 'passport';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';
import { v4 as uuidv4 } from 'uuid';
import flash from 'connect-flash'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash())
app.use(session({
    secret: 'secret-value',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'static'));
app.use(express.static(path.join(__dirname, 'static')));
app.get('/', function(req, res) {
    const errors = req.session.error ? [req.session.error] : [];
    const success = req.session.success ? [req.session.success] : [];
    req.session.error = null;
    req.session.success = null;
    res.render('login', { errors: errors, success: success });
});
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_todo'
});

connection.connect((err) => {
    if (err) {
        console.error('Błąd połączenia z bazą', err);
        return;
    }
    console.log('Połączono z bazą');
});
// uwierzytelniania lokalnego użytkownika
passport.use(new LocalStrategy(
    function(username, password, done) {
        connection.query('SELECT * FROM users WHERE username = ?', [username], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                const hashedPassword = results[0].password;
                bcrypt.compare(password, hashedPassword, function(err, result) {
                    if (result) {
                        return done(null, { username: username });
                    } else {
                        return done(null, false, {
                            message: 'Nie poprawne login i hasło' });
                    }
                });
            } else {
                return done(null, false, { message: 'Uzytkownik nie znaleziony!' });
            }
        });
    }
));
//  serializacja użytkownika
passport.serializeUser(function(user, done) {
    const sessionKey = uuidv4();
    done(null, {username:user.username, sessionKey:sessionKey});
});
//  deserializacja użytkownika
passport.deserializeUser(function({username,sessionKey}, done) {
    console.log('Session Key:', sessionKey);
    connection.query('SELECT * FROM users WHERE username = ?', [username], function(error, results) {
        if (error) return done(error);
        if (results.length === 0) return done(null, false);

        const user = {
            iduser: results[0].iduser,
            username: results[0].username
        };

        return done(null, user);
    });
});


//Routingi endpointy
app.post('/register', async (req, res) => {
    const { username, email, password, passwordConfirm } = req.body;

    if (!username || !email || !password || !passwordConfirm) {
        req.session.error = 'Wszystkie pola są wymagane';
        return res.redirect('/login');
    }
    if (password !== passwordConfirm) {
        req.session.error = 'Hasło i jego potwierdzenie nie pasują do siebie';
        return res.redirect('/login');
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        connection.query(sql, [username, hashedPassword, email], (err) => {
            if (err) {
                req.session.error = 'Wystąpił błąd podczas rejestracji';
            } else {
                req.session.success = 'Pomyślnie zarejestrowano. Możesz się zalogować.';
            }
            return res.redirect('/login');
        });
    } catch (error) {
        req.session.error = 'Wystąpił błąd podczas rejestracji';
        return res.redirect('/login');
    }
});

app.get('/login', function(req, res) {
    const errors = req.session.error ? [req.session.error] : [];
    const success = req.session.success ? [req.session.success] : [];
    req.session.error = null;
    req.session.success = null;
    res.render('login', { errors: errors, success: success });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.get('/home', checkAuthentication, function(req, res) {
    const userId = req.user.iduser;

    const sql = 'SELECT * FROM tasks WHERE user_id = ?';
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            return res.redirect('/home');
        }
        const tasksByDay = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: []
        };
        results.forEach(task => {
            tasksByDay[task.day_week].push(task);
        });

        res.render('home', { tasksByDay});
    });
});

app.post('/addtask', checkAuthentication, function(req, res) {
    const userId = req.user.iduser;
    const { task, day } = req.body;

    const sql = 'INSERT INTO tasks (user_id, day_week, task) VALUES (?, ?, ?)';
    connection.query(sql, [userId, day, task], (err) => {
        if (err) {

            return res.redirect('/home');
        }

        return res.redirect('/home');
    });
});

app.delete('/deleteTask/:taskId', checkAuthentication, function(req, res) {
    const userId = req.user.iduser;
    const taskId = req.params.taskId;

    const sql = 'DELETE FROM tasks WHERE user_id = ? AND id = ?';
    connection.query(sql, [userId, taskId], (err, result) => {
        if (err) {
            console.error('Błąd podczas usuwania zadania:', err);

            return res.sendStatus(400);
        }
        return res.sendStatus(200);
    });
});
app.delete('/delete_all_tasks', checkAuthentication, function(req, res) {
    const userId = req.user.iduser;

    const sql = 'DELETE FROM tasks WHERE user_id = ?';
    connection.query(sql, [userId], (err, result) => {
        if (err) {
            return res.sendStatus(400);

        }
        return res.sendStatus(200);
    });
});
app.post('/logout', function(req, res) {
    req.logout(function(err) {
        if (err) {
            console.error(err);
            return res.redirect('/');
        }
        req.session.destroy(function(err) {
            if (err) {
                console.error(err);
            }
            res.redirect('/login');
        });
    });
});
app.get('/editTask/:taskId', checkAuthentication, function(req, res) {
    const taskId = req.params.taskId;
    console.log(req.params.taskId)
    const sql = 'SELECT task FROM tasks WHERE id = ?';
    connection.query(sql, [taskId], (err, result) => {
        if (err) {
            console.error('Błąd podczas pobierania treści zadania:', err);
            return res.sendStatus(500);
        }

        if (result.length === 0) {
            console.error('Nie znaleziono zadania o podanym identyfikatorze');
            return res.sendStatus(404);
        }

        const taskContent = result[0].task;

        res.render('editTask', { taskId, taskContent });
    });
});


app.post('/editTask/:taskId', checkAuthentication, function(req, res) {
    const taskId = req.params.taskId;
    const editedTask = req.body.editedTask;
    const sql = 'UPDATE tasks SET task = ? WHERE id = ?';
    connection.query(sql, [editedTask, taskId], (err) => {
        if (err) {
            console.error('Błąd podczas aktualizacji zadania:', err);
            return res.redirect('/home');
        }


        res.redirect('/home');
    });
});
app.get('/sharedTasks', checkAuthentication, function(req, res) {
    const userId = req.user.iduser;
    const sql = `
        SELECT shared_tasks.id as shared_task_id, shared_tasks.task, shared_tasks.task_status, users.username as shared_by_username
        FROM shared_tasks
                 JOIN users ON shared_tasks.shared_by_user_id = users.iduser
        WHERE shared_tasks.shared_with_user_id = ?;`;
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Błąd podczas pobierania udostępnionych zadań:', err);
            return res.redirect('/home');
        }
        res.render('sharedTask', { sharedTasks: results });
    });
});
app.get('/mySharedTasks', checkAuthentication, function(req, res) {
    const userId = req.user.iduser;
    const sqlSharedByMe = `
        SELECT shared_tasks.id as shared_task_id, shared_tasks.task ,shared_tasks.task_status, users.username as shared_with_username
        FROM shared_tasks
                 JOIN users ON shared_tasks.shared_by_user_id = users.iduser
        WHERE shared_tasks.shared_by_user_id = ?
    `;

    connection.query(sqlSharedByMe, [userId], (err, results) => {
        if (err) {
            console.error('Błąd podczas pobierania zadań udostępnionych przeze mnie:', err);
            return res.redirect('/home');
        }

        res.render('mySharedTasks', { sharedTasksByMe: results });
    });
});


app.post('/share', checkAuthentication, function(req, res) {
    const sharedWithUsername = req.body.sharedWithUsername;
    const taskContent = req.body.taskContent;
    const sharedByUserId = req.user.iduser;

    connection.query('SELECT iduser FROM users WHERE username = ?', [sharedWithUsername], (error, results) => {
        if (error) {
            console.error('Błąd podczas wyszukiwania użytkownika:', error);
            return res.redirect('/home?status=error&message=Wyst%C4%85pi%C5%82+b%C5%82%C4%85d+podczas+wyszukiwania+u%C5%BCytkownika');
        }

        if (results.length === 0) {
            return res.redirect('/home?status=error&message=Nie+znaleziono+u%C5%BCytkownika+o+podanej+nazwie');
        }

        const sharedWithUserId = results[0].iduser;

        console.log("XD");
        const sql = 'INSERT INTO shared_tasks (task, shared_by_user_id, shared_with_user_id) VALUES (?, ?, ?)';
        connection.query(sql, [taskContent, sharedByUserId, sharedWithUserId], (error) => {
            if (error) {
                console.error('Błąd podczas dodawania udostępnionego zadania:', error);
                return res.redirect('/home?status=error&message=Wyst%C4%85pi%C5%82+b%C5%82%C4%85d+podczas+dodawania+udost%C4%99pnionego+zadania');
            }


            return res.redirect('/home?status=success&message=Zadanie+zosta%C5%82o+pomy%C5%9Blnie+udost%C4%99pnione');

        });
    });
});




app.post('/change-status/:taskId', checkAuthentication, function(req, res) {
    const userId = req.user.iduser;
    const taskId = req.params.taskId;

    const sql = 'UPDATE shared_tasks SET task_status = "Zrobiony" WHERE shared_with_user_id = ? AND id = ?';
    connection.query(sql, [userId, taskId], (err, result) => {
        if (err) {
            console.error('Błąd podczas zmiany statusu zadania:', err);
            return res.sendStatus(500);
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Nie znaleziono zadania o podanym identyfikatorze');
        }

        return res.sendStatus(200);
    });
});







const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
