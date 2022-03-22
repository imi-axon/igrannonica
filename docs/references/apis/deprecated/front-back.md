# Lista API-ja za Front-Back komunikaciju 

*Lista API-ja koji ce se koristiti za momunikaciju izmedju __front-end__ i __back-end__ dela*

---
---

## # Registracija API (POST)
> __`/api/LogReg/register`__
---

> __BODY__

```ts
UserRegistration
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
StatusCode(406, NotAcceptable)
```

---
---

## # Login API (POST)
> __`/api/LogReg/login`__
---

> __BODY__

```ts
UserLogin
{
    username: string
    password: string
}
```

> __RESPONSE__

```ts

// Losa kombinacija lozinke i username-a
StatusCode(401, Unauthorized)

// Korisnik vec ulogovan
StatusCode(403, Forbidden)

// Poruka o neuspehu / JWT Token neispravan
StatusCode(400, BadRequest)

```

## # Project API (POST)
> __`/api/Project/create`__
---

> __HEADER__

```ts
{
    jwt: string
}

```

> __BODY__

```ts
NewProject
{
    name: string
    description: string
}

```

> __RESPONSE__

```ts
// Ako je uspesno kreiran projekat
StatusCode(200, Success)

// Ako nije ulogovan
StatusCode(401, Unauthorized)

// Ako postoji projekat sa istim imenom
StatusCode(406, NotAcceptable)
```

