# Practice 4
Authors
 - David Antuña Rodríguez
 - Daniel Gutiérrez Gertrúdix

Import user.json file
> mongoimport --db test --collection user --file user.json

------
### Count the number of verified and non-verified users, key 'verified'. The output should be:
```json
{"_id": "true", "total": 51}
{"_id": "false", "total": 2949}
```

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
### Same query but now we want the followers average not the count. Expected output:
```json
{"_id": "true", "media": 385419.07843137253}
{"_id": "false", "media": 1592.3058663953882}
```

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
### Find the average followers, every user on the dataset counts.

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
### Group the users base on their number of original tweets, key 'original' in 'tweets'. Ordered by the number of original tweets. Output should be like:
```json
{"_id": 0, "menciones": 1.4010791366906474}
{"_id": 1, "menciones": 1.490909090909091}
{"_id": 2, "menciones": 0.823045267489712 }
....
```

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
### Number of users whose location is not ''. The expected output is 1939.

```json
db.user.count({location: {$ne: ''}})
```

------
### Group users by their account creation date, list must be ordered, show the average number of tweets for those users. Expected output:
```json
{"_id": 2006, "total": 1, "media": 31513}
{"_id": 2007, "total": 20, "media": 37829.55}
{"_id": 2008, "total": 104, "media": 41137.25961538462}
....
```

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
### Take the previous query and take the months into consideration too. For example, for year 2007 month 2 there should be 2 users and 131956 average tweets.

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
### Find out the min, max and average value of hpref, in key 'opinion', for the following intervals of key 'total' under 'tweets': [0, 25), [25, 50), [50, 100), [100, 200) and [200, infinity). Expected output:
```json
{"_id": 0, "media": 0.07732043632564295}
{"_id": 25, "media": 0.11719976500577525}
{"_id": 50, "media": 0.14747790843417374}
{"_id": 100, "media": 0.15528629782796752}
{"_id": 200, "media": 0.17676528712130535}
{"_id": "Other", "media": 0.21380677512278842}
```

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
### We want to know the average of 'opinion.tp'/'opinion.hp' for every value in 'tweets.total', if 'opinion.hp' is the value of 'opinion.tp'/'opinion.hp' must be set to 1. Order the output by 'tweets.total'. Expected output:
```json
{"_id": 4, "media": 0.7103505843071787}
{"_id": 5, "media": 0.7470085470085469}
{"_id": 6, "media": 0.7780934343434343}
{"_id": 7, "media": 0.771658615136876}
{"_id": 8, "media": 0.9417818740399386}
{"_id": 9, "media": 1.2975757575757574}
.....
```

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