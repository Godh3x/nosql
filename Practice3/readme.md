# Practice 3
Authors
 - David Antuña Rodríguez
 - Daniel Gutiérrez Gertrúdix

_Collection_
```json
db.zancajos.drop()
db.zancajos.insert([
  {
    '_id': 'Oldo',
    'País': 'España',
    telf: [33333],
    pedidos: [
      {item: 'cazadora', precio: 200, enviada: true},
      {item: 'pajarita', precio: 40, enviada: true}
    ],
    compras: 2
  },
  {
    '_id': 'Ambros',
    'País': 'Italia',
    telf: [1111, 2222],
    pedidos: [
      {item: 'pantalón chulo', precio: 160,enviada: false},
      {item: 'marianos', precio: 25,enviada: true}
    ]
  },
  {
    '_id': 'Isca',
    'País': 'Alemania',
    telf: [],
    pedidos: [
      {item: 'pañuelo seda', precio: 400, enviada: true},
      {item: 'falda', precio: 60, enviada: false},
      {item: 'calcetines', precio: 6, enviada: false}
    ]
  }
])
```

------
### User 'Ambros' updates 'País', from 'Italia' to 'Bélgica'.

```json
db.zancajos.update(
  {_id: 'Ambros'},
  {$set: {País: 'Bélgica'}}
)
```

------
### New 'pedido' from 'Oldo' (suposse _id: 'Oldo' exists). 'Item' is 'corbata con dibujos de ositos' and 'precio' 120. Add it at the start of the array and set 'enviada' to false.

```json
db.zancajos.update(
  {_id: 'Oldo'},
  {$push: {
    pedidos: {
      $each: [
        {item: 'corbata dibujos de ositos', precio: 120, enviada: false}
      ],
      $position:0
    }
  }}
)
```

------
### The item has been sent. Set 'enviada' to true, it's know the item is in the first position.

```json
db.zancajos.update(
  {_id: 'Oldo'},
  {$set: {'pedidos.0.enviada': true}}
)
```

------
### Oldo has the item, add one to Oldo's 'compras'.

```json
db.zancajos.update(
  {_id: 'Oldo'},
  {$inc: {compras: 1}}
)
```

------
### Ambros has a new phone, 2222. Add it to 'telf' if it doesn't already contain it.

```json
db.zancajos.update(
  {_id: 'Ambros'},
  {$addToSet: {telf: 2222}}
)
```

------
### Add a new key-value pair, {premium: true}, to any client with an item sent whose value it's greater than 99.

```json
db.zancajos.update(
  {pedidos: {
      $elemMatch: {
        precio: {$gt: 99},
        enviada: true
      }
  }},
  {$set: {premium: true}},
  {upsert: true, multi: true}
)
```

------
### Premium account gives the client free shipping, only if the live in 'España'. Remove premium from all the users that live abroad.

```json
db.zancajos.update(
  {'País': {$ne: 'España'}},
  {$unset: {premium: ''}},
  {multi: true}
)
```

------
### Oldo deleted his account, remove him completly if he doesn't have any 'pedidos' with 'enviada' set to false.

```json
db.zancajos.remove(
  {
    _id: 'Oldo',
    'pedidos.enviada': {$ne: false}
  }
)
```

------
### Collection pru has documents like:
```json
db.pru.insert(
  {
    a: [1, 2, 3, 4, 5],
    _id:0
  }
)

db.pru.insert(
  {
    a: [1, 2, 9],
    _id: 1
  }
)
```
### We want to find the documents that are a subset from [1, 4, 5, 2, 3, 5, 1, 4, 8]

```json
db.pru.find(
  {
    a: {
      $not: {
        $elemMatch: {
          $nin: [1, 4, 5, 2, 3, 5, 1, 4, 8]
        }
      }
    }
  }
)
```

------
### A new user registered, 'Oldo', in 'País' he wrote 'Italia'. Write a query that updates 'País' if he already exists and inserts the new user if he doesn't. If the user has to be created also set 'pedidos' to [].

```json
db.zancajos.update(
  {_id: 'Oldo'},
  {
    $set: {'País': 'Italia'},
    $setOnInsert: {pedidos: []}
  },
  {upsert: true}
)
```