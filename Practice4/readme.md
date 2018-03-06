# Practice 4
Authors
 - David Antuña Rodríguez
 - Daniel Gutiérrez Gertrúdix

------
###

```json
db.user.aggregate([
  {$group: 
    {
      _id: '$verified',
      total: {$sum: 1}
    }
  }
])
```

------
###

```json
db.user.aggregate([
  {$group: 
    {
      _id: '$verified',
      media: {$avg: '$followers'}
    }
  }
])
```

------
###

```json
db.user.aggregate([
  {$group: 
    {
      _id: true,
      media: {$avg: '$followers'}
    }
  }
])
```

------
###

```json
db.user.aggregate([
  {$group: 
    {
      _id: '$tweets.original',
      media: {$avg: '$mentions'}
    }
  },
  {$sort:
    {
      _id: 1
    }
  }
])
```

------
###

```json
db.user.count({location: {$ne: ''}})
```

------
###

```json
db.user.aggregate([
  {$group: 
    {
      _id: {$year: '$created_at'},
      total: {$sum: 1},
      media: {$avg: '$tweets.all'}
    }
  },
  {$sort:
    {
      _id: 1
    }
  }
])
```

------
###

```json
db.user.aggregate([
  {$group: 
    {
      _id: {year: {$year: '$created_at'},
            month: {$month: '$created_at'}},
      total: {$sum: 1},
      media: {$avg: '$tweets.all'}
    }
  },
  {$sort:
    {
      '_id.year': 1,
      '_id.month': 1,
    }
  }
])
```

------
###

```json
db.user.aggregate([
  {$bucket:
    {
      groupBy: '$tweets.total',
      boundaries: [0, 25, 50, 100, 200],
	  default: 'Other',
      output: {
        min: {$min: '$opinion.hpref'},
        avg: {$avg: '$opinion.hpref'},
        max: {$max: '$opinion.hpref'}
      }
    }
  }
])
```

------
###

```json
db.user.aggregate([
  {$group:
    {
      _id: '$tweets.total',
      div: {
        $avg: {
          $cond: {
            if: {$eq: ['$opinion.hp', 0]},
            then: 1,
            else: {$divide: ['$opinion.tp', '$opinion.hp']}
          }
        }
      }
    }
  },
  {$sort:
    {
      _id: 1
    }
  }
])
```
