# Lista API-ja za Front-Back komunikaciju 

*Lista API-ja koji ce se koristiti za momunikaciju izmedju __front-end__ i __back-end__ dela*

---
---

## # Registracija API (POST)
> __`/api/LogReg/register`__
---

> __BODY__

```ts
User
{
    firstName: string
    lastName: string
    username: string
    email: string
    password: string
}

```

> __RESPONSE__

```ts
// Ako je korisnik uspesno registrovan vracamo poruku
StatusCode(200, Success)

// Ako je email vezan za postojeci nalog
StatusCode(403, Forbidden)

// Ako je korisnicko ime zauzeto
StatusCode(403, NotAcceptable)
```

---
---

## # Login API (POST)
> __`/api/LogReg/login`__
---

> __BODY__

```ts
User
{
    username: string
    password: string
}
```

> __RESPONSE__

```ts

// Losa kombinacija lozinke i username-a
StatusCode(403, Unauthorized)

// Korisnik vec ulogovan
StatusCode(403, Forbidden)

// Poruka o neuspehu / JWT Token neispravan
StatusCode(403, BadRequest)

```
