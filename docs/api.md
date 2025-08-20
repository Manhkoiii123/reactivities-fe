### API

#### Get activities

```
GET /api/activities

```

#### Get activity by id

```
GET /api/activities/:id

```

#### Create activity


```
POST /api/activities

Body: {
    "title": "Future Activity 2",
    "description": "Activity happening next month",
    "category": "culture",
    "city": "Paris",
    "venue": "Louvre Museum, Rue Saint-Honoré, Quartier du Palais Royal, 1st Arrondissement, Paris, Ile-de-France, Metropolitan France, 75001, France",
    "latitude": 48.8611473,
    "longitude": 2.33802768704666,
    "date": "2025-05-15T12:00:00.000Z"
}

```

#### Delete activity

```
DELETE /api/activities/:id
```

#### Update activity

```
PATCH /api/activities/:id

Body: {
    "title": "Future Activity 2",
    "description": "Activity happening next month",
    "category": "culture",
    "city": "Paris",
    "venue": "Louvre Museum, Rue Saint-Honoré, Quartier du Palais Royal, 1st Arrondissement, Paris, Ile-de-France, Metropolitan France, 75001, France",
    "latitude": 48.8611473,
    "longitude": 2.33802768704666,
    "date": "2025-05-15T12:00:00.000Z"
}
```