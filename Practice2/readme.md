# Practice 2
Authors
 - David Antuña Rodríguez
 - Daniel Gutiérrez Gertrúdix

Import libros.json
------
### Books without autor key with a price over 12 euros (show just title and price)

```json
db.libros.find(
  {
    autor: {$exists: false},
    precio: {$gt: 12}
  },
  {_id: 0, titulo: 1, precio: 1}
)
```

------
### Number of books such that the key autor is of type string

```json
db.libros.count({autor: {$type: 'string'}})
```

------
### Titles of the books that do not contains any opinión from the user bertoldo

```json
db.libros.find(
  {'opiniones.usuario': {$nin: ['bertoldo']}},
  {_id: 0, titulo: 1}
)
```

------
### Titles of those books that have the gender romance y terror at the same time

```json
db.libros.find(
  {genero: {$all: ['romance', 'terror']}},
  {_id: 0, titulo: 1}
)
```

------
### Number of books that belong to gender romance but not to gender terror
```json
db.libros.count(
  {$and: [
    {genero: 'romance'},
    {genero: {$nin: ['terror']}}
  ]}
)
```

------
### Number of books that belong to gender romance but not to gender terror

```json
db.libros.count({'opiniones.0.puntos': {$gt: 5}})
```

------
### Number of books that either have at least one opinion from herminia, or the prices is less than 10 euros
```json
db.libros.count(
  {$or: [
      {'opiniones.usuario': 'herminia'},
      {precio: {$lt: 10}}
  ]}
)
```

------
### Books with at least  3 opinions. For each of these books, show just the title and the third opinion

```json
db.libros.find(
  {'opiniones.2': {$exists: true}},
  {_id: 0, 'opiniones.$': 1}
).pretty()
```

------
### For each book of gender romance, show:
 - Title
 - The first opinión of bertoldo for this book with a score equal to or greater than 8 (if no such opinion exists, then the query displays just the title)

```json
db.libros.find(
  {genero: 'romance'},
  {
    _id: 0,
    titulo: 1,
    opiniones: {
      $elemMatch: {
        'usuario': 'bertoldo',
        'puntos': {$gte: 8}
      }
    }
  }
).pretty()
```
------
### Write an insert statement such that the following query
```json
db.entero.find(
  {a: {$type: "int"}},
  {_id: 0}
)
```
### displays
```json
{"a": 1}
```

```json
db.entero.insert({'a': NumberInt(1)})
```