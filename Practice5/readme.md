# Practice 5
Authors
 - David Antuña Rodríguez
 - Daniel Gutiérrez Gertrúdix

## Preparation
 1. Start the server 
 
> cd; rm -rf data; mkdir data; mongod -dbpath data

 2. Paste the following commands in the mongo shell
 
```json
db.users.drop()
db.users.insert([
  {_id: 1, nombre: "bertoldo", fecha: ISODate("2016-07-07T01:00:00+01:00")},
  {_id: 2, nombre: "herminia", fecha: ISODate("2017-02-02T02:02:00+01:00")},
  {_id: 3, nombre: "calixto", fecha: ISODate("2017-03-03T03:03:00+01:00")},
  {_id: 4, nombre: "melibea", fecha: ISODate("2017-04-04T04:04:00+01:00")},
])

db.capturas.drop()
db.capturas.insert([
  {user:1,bicho:"chorizard",puntos:125},
  {user:1,bicho:"cassandro",puntos:150},
  {user:1,bicho:"snoreless",puntos:950},
  {user:1,bicho:"cassandro",puntos:50},
  {user:1,bicho:"cassandro",puntos:150},
  {user:1,bicho:"cassandro",puntos:150},
  {user:1,bicho:"cassandro",puntos:150},
  {user:2,bicho:"plastoise",puntos:1150},
  {user:2,bicho:"cassandro",puntos:50},
  {user:2,bicho:"snoreless",puntos:1150},
  {user:2,bicho:"cassandro",puntos:50},
  {user:2,bicho:"cassandro",puntos:150},
  {user:2,bicho:"cassandro",puntos:150},
  {user:2,bicho:"cassandro",puntos:150},
  {user:3,bicho:"chorizard",puntos:430},
  {user:3,bicho:"cassandro",puntos:450},
  {user:3,bicho:"snoreless",puntos:500},
  {user:3,bicho:"cassandro",puntos:150},
  {user:3,bicho:"belcebuh", puntos:50},
  {user:3,bicho:"cassandro",puntos:150},
])
  
db.bichos.drop()
db.bichos.insert([
  {_id:"cassandro",tipo:"aire",pts:500, evolucion:"kassandron"},
  {_id:"snoreless",tipo:"malote",pts:1000, evolucion:"snoremore"},
  {_id:"chorizard",tipo:"parrilla"},
  {_id:"belcebuh",tipo:"parrilla"},
  {_id:"plastoise",tipo:"pelma"},
])
```

------
### Create the view _capturasTotal_, this view uses the collecion **capturas** and matchs the following criteria:
 - There is a document for each **user** and **bicho**, both fields must appear in the document.
 - There is a field called **s** that stores the total amount of points of that **bicho** for the **user**.
 
 _Expected output_
 ```json
 > db.capturasTotal.find()
{ "_id" : { "user" : 1, "bicho" : "cassandro" }, "total" : 650 }
{ "_id" : { "user" : 1, "bicho" : "chorizard" }, "total" : 125 }
{ "_id" : { "user" : 1, "bicho" : "snoreless" }, "total" : 950 }
{ "_id" : { "user" : 2, "bicho" : "cassandro" }, "total" : 550 }
{ "_id" : { "user" : 2, "bicho" : "plastoise" }, "total" : 1150 }
{ "_id" : { "user" : 2, "bicho" : "snoreless" }, "total" : 1150 }
{ "_id" : { "user" : 3, "bicho" : "belcebuh" }, "total" : 50 }
{ "_id" : { "user" : 3, "bicho" : "cassandro" }, "total" : 750 }
{ "_id" : { "user" : 3, "bicho" : "chorizard" }, "total" : 430 }
{ "_id" : { "user" : 3, "bicho" : "snoreless" }, "total" : 500 }
 ```

```json
db.capturasTotal.drop()
db.createView("capturasTotal","capturas", 
  [
    {$group: {
      _id: {user: '$user', bicho: '$bicho'},
      total: {$sum: '$puntos'}
    }},
    {$sort: {_id:1}}
  ]
)
db.capturasTotal.find()
```

------
### Query using the previous view but shows only those whose **s** is greater than 1000,

```json
db.capturasTotal.find({total: {$gt: 1000}}, {}).pretty()
```

------
### Create the view _capturasImportantes_ to get the previous query result, without using any other views.

_Expected output_
```json
> db.capturasImportantes.find()
{ "_id" : { "user" : 2, "bicho" : "plastoise" }, "total" : 1150 }
{ "_id" : { "user" : 2, "bicho" : "snoreless" }, "total" : 1150 }
```

```json
db.capturasImportantes.drop()
db.createView("capturasImportantes","capturas", 
  [
    {$group: {
      _id: {user: '$user', bicho: '$bicho'},
      total: {$sum: '$puntos'}
    }},
    {$match: {total: {$gt: 1000}}},
    {$sort: {_id: 1}}
  ]
) 
db.capturasImportantes.find()
```

------
### Create the view _masPuntos_, this view shows the user with the highest amount of total points. Total points are the accumulation of every point the user gets from **bichos**.

```json
db.masPuntos.drop()
db.createView("masPuntos","capturas", 
  [
    {$group: {
      _id: '$user',
      total: {$sum: '$puntos'}
    }},
    {$sort: {total:-1}},
    {$limit: 1}
  ]
)
db.masPuntos.find()
```

------
###

```json
db.bichosPorClase.drop()
db.createView("bichosPorClase","bichos",
  [
    {$group: {
      _id: '$tipo',
      bichos: {$addToSet: '$_id'}
    }}
   ]
)
db.bichosPorClase.find()
```

------
###

```json
db.puntosMedio.drop()
db.createView("puntosMedio","capturas",
  [
    {$group: {
      _id: '$user',
      media: {$avg: '$puntos'}
    }},
    {$group: {
      _id: true,
      mediaTotal: {$avg: '$media'}
    }}
  ]
)
db.puntosMedio.find()
```

------
### 

```json
db.capturasTotalPorNombre.drop()
db.createView("capturasTotalPorNombre","capturas",
  [
    {$group: {
      _id: {user: '$user', bicho: '$bicho'},
      total: {$sum: '$puntos'}
    }},
    {$lookup: {
      from: 'users',
      localField: '_id.user',
      foreignField: '_id',
      as: 'datosUsuario'
    }}
  ]
)
db.capturasTotalPorNombre.find()
```

------
###

```json
db.capturadores.drop()
db.createView("capturadores","capturas",
  [
    {$group: {
      _id: {user: '$user', bicho: '$bicho'}
    }},
    {$lookup: {
      from: 'users',
      localField: '_id.user',
      foreignField: '_id',
      as: 'datosUsuario'
    }},
    {$group: {
      _id: '$_id.bicho',
      capturadores: {$addToSet: '$datosUsuario'}
    }},
  ]
)
db.capturadores.find() 
```

------
###

```json
var mapCapturas = function() {
  emit({user: this.user, bicho: this.bicho}, this.puntos);
};

var reduceCapturas = function(id, puntos) {
  return Array.sum(puntos);
};

db.capturas.mapReduce(mapCapturas, reduceCapturas, {out: {inline: 1}})
```
------
###

```json
db.evolucion.drop()
db.createView("evolucion","capturas",
  [
    {$group: {
      _id: {user: '$user', bicho: '$bicho'},
      total: {$sum: '$puntos'}
    }},
    {$lookup: {
      from: 'bichos',
      localField: '_id.bicho',
      foreignField: '_id',
      as: 'datosBicho'
    }},
    {$project: {
      _id: 1,
      bichoEvolucionado: '$datosBicho.evolucion',
      cmp: {$cmp: ["$total", "$datosBicho.pts"]},
      total: 1,
      'datosBicho.pts': 1
    }},
    {$match: {cmp: {$gte: 0}}}
  ]
)
db.evolucion.find()
```
