# Practice 1
Authors
 - David Antuña Rodríguez
 - Daniel Gutiérrez Gertrúdix

------
### Write a suitable JSON  representation for the following XML document
```html
<persona>
  <nombre>Bertoldo</nombre>
  <edad>25</edad>
  <direccion>
    <ciudad>Santa Desidia</ciudad>
    <cp>10021</cp>
  </direccion>
  <telefonos>
    <telef type="fijo">666-666-666</telef>
    <telef type="movil">999-999-999</telef>
  </telefonos>
</persona>
```

```json
{persona :
  {
    nombre : "Bertoldo",
    edad : 25,
    direccion :
      {
        ciudad : "Santa Desidia",
        cp : 10021
      },
    telefonos :
      {
        fijo : "666-666-666",
        movil : "999-999-999"
      }
  }
}
```

------
### Tweets, from collections 'derbi',  which are replies to user with screen_name 'Jezivi1'

```json
db.derbi.find(
  {"in_reply_to_screen_name" : "Jezivi1"}
).pretty()
```

------
### Count the number of verified users (key 'verified' in key 'user'  with value true).

```json
db.derbi.find(
  {"user.verified" : true}
).count()
```

------
### Count the number of tweets from users with more tan 800 000 followers (key 'followers_count' in key 'user').

```json
db.derbi.find(
  {"user.followers_count" : {$gte : 800000}}
).count()
```

------
### For each tweet from users with more tan 800 000 followers show only the number of followers and the screen_name.

```json
db.derbi.find(
  {"user.followers_count" : {$gte : 800000}},
  {_id : 0, "user.followers_count" : 1, "user.screen_name" : 1}
)
```

------
### List locations  and screen names (keys location y screen_name, in key user, respectivily)  sorted by inverse alphabetical order of location, and inside the same locoation order by screen name  in normal ascending order.

```json
db.derbi.find(
  {},
  {_id : 0, "user.location" : 1, "user.screen_name" : 1}
).sort({"user.location" : -1, "user.screen_name" : 1})
```

------
### Return the key user from the verified user with less followers.

```json
db.derbi.find(
  {"user.verified" : true},
  {_id : 0, user : 1}
).sort({"user.followers_count" : 1}).limit(1).pretty()
```

------
### Copy these statements in the mongo Shell and write a query that produces the output.
_Statements_
```json
db.pru.drop()
db.pru.insert(
  [
    {a:1,b:1},
    {a:1,b:2},
    {a:2,b:1},
    {a:2,b:2},
    {a:3,b:1},
    {a:3,b:2}
  ]
)
```
_Output_
```json
{ "a" : 3, "b" : 1 }
{ "a" : 2, "b" : 1 }
{ "a" : 1, "b" : 1 }
{ "a" : 3, "b" : 2 }
{ "a" : 2, "b" : 2 }
{ "a" : 1, "b" : 2 }
```

```json
db.pru.find(
  {},
  {_id : 0}
).sort({b : 1, a : -1}).pretty()
```

------
### Queries like
```json
db.coleccion.find().limit(5).sort({nombre:1})
```
### are very efficient, because they only need to sort a maximum of 5 elements.

False, because the query orders the whole collection anyway.

------
### Write the missing statement in this mongo Shell session
```json
x = { "a" : 1 };
y = "a";
// missing statement
print(x.a); 2  // the Shell shows 2
```

_Missing statement_
```json
x[y] = 2
```
------
### We have a collections with documents like:
```json
db.pru.insert({a:[10,20,30,40,50]})
```
### write a query to obtain the last two values in each array a. In the previous case:
```json
{ "a" : [ 40, 50 ] }
```

```json
db.pru.find(
  {},
  {a : {$slice : -2}}
)
```