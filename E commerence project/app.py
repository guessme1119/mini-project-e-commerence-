from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_mysqldb import MySQL
from flask_bcrypt import Bcrypt
import os
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
bcrypt = Bcrypt(app)

# Secret key for session management
app.secret_key = os.getenv("SECRET_KEY", "default_secret_key")

# MySQL Configuration
app.config['MYSQL_HOST'] = os.getenv("MYSQL_HOST", "localhost")
app.config['MYSQL_USER'] = os.getenv("MYSQL_USER", "root")
app.config['MYSQL_PASSWORD'] = os.getenv("MYSQL_PASSWORD", "@Nayeem08")
app.config['MYSQL_DB'] = os.getenv("MYSQL_DB", "feellogin")
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

# Initialize MySQL
mysql = MySQL(app)

@app.route('/')
def home():
    if 'loggedin' in session:
        return render_template('index.html', username=session['username'])
    return redirect(url_for('login'))

@app.route('/about')
def about():
    if 'loggedin' not in session:
        return redirect(url_for('login'))
    return render_template('about.html', username=session['username'])

@app.route('/cart')
def cart():
    if 'loggedin' not in session:
        return redirect(url_for('login'))
    return render_template('cart.html', username=session['username'])

@app.route('/check_login')
def check_login():
    return jsonify({'loggedin': 'loggedin' in session})

@app.route('/login', methods=['GET', 'POST'])
def login():
    msg = ''
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        with mysql.connection.cursor() as cursor:
            cursor.execute('SELECT * FROM accounts WHERE username = %s', (username,))
            account = cursor.fetchone()

        if account and bcrypt.check_password_hash(account['password'], password):
            session['loggedin'] = True
            session['username'] = account['username']
            return redirect(url_for('home'))
        else:
            msg = 'Incorrect username/password!'

    return render_template('login.html', msg=msg)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    msg = ''
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        email = request.form.get('email')

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        with mysql.connection.cursor() as cursor:
            cursor.execute('SELECT * FROM accounts WHERE username = %s', (username,))
            account = cursor.fetchone()

            if account:
                msg = 'Account already exists!'
            elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
                msg = 'Invalid email address!'
            else:
                cursor.execute('INSERT INTO accounts (username, password, email) VALUES (%s, %s, %s)',
                               (username, hashed_password, email))
                mysql.connection.commit()
                msg = 'Successfully registered!'

    return render_template('register.html', msg=msg)

if __name__ == "__main__":
    app.run(debug=True)
