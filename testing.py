import sqlite3

connection = sqlite3.connect("database.db")
cur = connection.cursor()

cur.execute("DROP TABLE IF EXISTS movie")
cur.execute("CREATE TABLE movie(title, year, score)")
