# Lista API-ja za Back-ML komunikaciju 

*Lista API-ja koji ce se koristiti za momunikaciju izmedju __back-end__ i __dela za masinsko ucenje__*

---
---


## # Convert Data Set from CSV to JSON (POST)
> __`/api/Project/create`__
---

> __BODY__

```ts
string // CSV string

```

> __RESPONSE__

```ts
// Uspesno konvertovano u JSON
StatusCode(200, Success)

// Los format prosledjenog fajla
StatusCode(400, BadRequest)
```

