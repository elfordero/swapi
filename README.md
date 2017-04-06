# SWAPI for Grow Test

## Local Development Setup

1. `npm install`
1. `npm run start`
1. Navigate to [http://localhost:3000](http://localhost:3000)
---

Endpoints:

* '/character/:name' - Returns an EJS view with data about the given character.

* '/characters' - Returns raw JSON of 50 characters. This endpoint takes a query parameter in the URL called 'sort', sort parameters are:
    *name
    *mass
    *height

    *Ex: '/characters?sort=height'

* '/planetresidents' - Returns raw JSON in the form {planetName1: [characterName1, characterName2], planetName2: [characterName3]}.