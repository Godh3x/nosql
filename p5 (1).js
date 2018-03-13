// Nombre 1 : David Antuña Rodríguez
// Nombre 2 : Daniel Gutiérrez Gertrúdix

// Importante: No modificar el código que ya viene incluido, solo añadir la respuesta

/*1*/
db.capturasTotal.drop()
db.createView("capturasTotal","capturas", 
	[
        {$group: {
		_id: {user: '$user', bicho: '$bicho'},
		total: {$sum: '$puntos'}
	}},
	{$sort: {_id:1}}
])
db.capturasTotal.find()
				  
/*2  Consulta*/
db.capturasTotal.find({total: {$gt: 1000}},{}).pretty()

/*3*/ 
db.capturasImportantes.drop()
db.createView("capturasImportantes","capturas", 
  [ 
  {$group: {
    _id: {user: '$user', bicho: '$bicho'},
    total: {$sum: '$puntos'}
  }},
  {$match: {total: {$gt: 1000}}},
  {$sort: {_id:1}}
  ]) 
db.capturasImportantes.find()

/*4*/
db.masPuntos.drop()
db.createView("masPuntos","capturas", 
  [ 
  {$group: {
    _id: '$user',
    total: {$sum: '$puntos'}
  }},
  {$sort: {total:-1}},
  {$limit: 1}
  ])
db.masPuntos.find()

/*5*/ 
db.bichosPorClase.drop()
db.createView("bichosPorClase","bichos",
  [
  {$group: {
    _id: '$tipo',
    bichos: {$addToSet: '$_id'}
  }}
  ])
db.bichosPorClase.find()	

/*6*/ 
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
  ])
db.puntosMedio.find()	

/*7*/
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
  ])
db.capturasTotalPorNombre.find()	

/*8*/
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
  ])
db.capturadores.find()			  		  		  		  		  		  		  		  

/*9 Copiar función map, función reduce y la llamada a mapreduce */
var mapCapturas = function() {
   emit({user: this.user, bicho: this.bicho}, this.puntos);
};

var reduceCapturas = function(id, puntos){
     return Array.sum(puntos);
};

db.capturas.mapReduce(
  mapCapturas,
  reduceCapturas,
  {out: {inline:1}}
)
/*10*/
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
  ])
db.evolucion.find()			  		  		  		  		  		  		  		  

