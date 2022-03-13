# Lista API-ja za Front-Back komunikaciju 

*Lista API-ja koji ce se koristiti za momunikaciju izmedju __front-end__ i __back-end__ dela*

---
---

## # Registracija API (POST)
> __`/api/User/registration`__
---

> __BODY__

```ts
User
{
    name: string
    lastname: string
    username: string
    email: string
    password: string
}

```

> __RESPONSE__

```ts
//Ako je korisnik uspesno registrovan vracamo poruku
return "{\"message\":\"Success\"}";

//Inace vracamo

return "{\"message\":\"Email je vezan sa postojeci nalog!\"}";

//Ili

return "{\"message\":\"Korisnicko ime je zauzeto!\"}";

```

---
---

## # Login API (POST)
> __`/api/User/login`__
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

// Poruka o neuspehu / JWT Tokeni
// Doraditi


```
