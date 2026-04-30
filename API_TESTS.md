# Tests des Routes API - SOREA

## Setup

```bash
# Installer les dépendances
npm install

# Démarrer le serveur
npm run dev
# Serveur sera sur: http://localhost:3000
```

---

## 1. Health Check (PUBLIC)

```bash
curl http://localhost:3000/api/health
```

**Résultat attendu:**

```json
{
  "status": "online",
  "timestamp": "2026-04-30T...",
  "message": "Server is running"
}
```

---

## 2. Authentication - REGISTER (PUBLIC)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePassword123",
    "isCoach": false
  }'
```

**Résultat attendu:** 201 Created

```json
{
  "message": "Inscription réussie",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

---

## 3. Authentication - LOGIN (PUBLIC)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Résultat attendu:** 200 OK + Cookie `sorea_session`

```json
{
  "message": "Connexion réussie",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

---

## 4. Get Current User (PROTECTED)

```bash
# Remplace COOKIE_VALUE par la valeur du cookie sorea_session
curl -b "sorea_session=COOKIE_VALUE" \
  http://localhost:3000/api/auth/me
```

**Résultat attendu:** 200 OK

```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

---

## 5. Logout (PROTECTED)

```bash
curl -X POST -b "sorea_session=COOKIE_VALUE" \
  http://localhost:3000/api/auth/logout
```

**Résultat attendu:** 200 OK

```json
{
  "message": "Déconnexion réussie"
}
```

---

## 6. Get Products (PUBLIC)

```bash
curl http://localhost:3000/api/products
```

**Résultat attendu:** 200 OK

```json
{
  "data": [
    {
      "id": 1,
      "name": "Relaxation Kit",
      "description": "Kit pour moments de détente",
      "price": 29.99,
      "stockQuantity": 0,
      "imageUrl": null,
      "isActive": true
    }
  ],
  "message": "Produits récupérés avec succès"
}
```

---

## 7. Create Product (PROTECTED - ADMIN ONLY)

```bash
# D'abord créer un utilisateur avec role "admin" manuellement en DB
# Ou modifier le rôle dans la DB

curl -X POST -b "sorea_session=ADMIN_COOKIE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tapis Premium",
    "description": "Tapis de yoga premium",
    "price": 79.99,
    "stockQuantity": 10,
    "imageUrl": "/images/tapis.webp"
  }' \
  http://localhost:3000/api/products
```

**Résultat attendu:** 201 Created

```json
{
  "data": {
    "id": 2,
    "name": "Tapis Premium",
    "description": "Tapis de yoga premium",
    "price": 79.99,
    "stockQuantity": 10,
    "imageUrl": "/images/tapis.webp",
    "isActive": true,
    "createdAt": "2026-04-30T...",
    "updatedAt": "2026-04-30T..."
  },
  "message": "Produit créé avec succès"
}
```

---

## 8. Get Sessions (PUBLIC)

```bash
curl http://localhost:3000/api/sessions
```

**Résultat attendu:** 200 OK

```json
{
  "data": [
    {
      "id": 1,
      "title": "Pilates",
      "description": null,
      "sessionType": null,
      "startsAt": null,
      "durationMinutes": null,
      "capacity": null,
      "price": 45,
      "imageUrl": "/images/session_1.webp",
      "coach": null
    }
  ],
  "message": "Sessions récupérées avec succès"
}
```

---

## 9. Create Session (Coach) (PROTECTED - COACH ONLY)

```bash
# D'abord créer un utilisateur coach en DB
# Puis se connecter avec ce compte

curl -X POST -b "sorea_session=COACH_COOKIE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Yoga Avancé",
    "description": "Session de yoga pour niveaux avancés",
    "sessionType": "Yoga",
    "startsAt": "2026-05-15T10:00:00Z",
    "durationMinutes": 60,
    "capacity": 15,
    "price": 45
  }' \
  http://localhost:3000/api/sessions
```

**Résultat attendu:** 201 Created (draft/unpublished)

---

## Test de Sécurité - Erreurs Expected

### Non-authentifié (devrait retourner 401)

```bash
curl http://localhost:3000/api/users
# Erreur: "Non autorisé"
```

### Rôle insuffisant (devrait retourner 403)

```bash
# Utilisateur "user" essayant d'accéder à /api/products POST
curl -X POST -b "sorea_session=USER_COOKIE" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}' \
  http://localhost:3000/api/products
# Erreur: "Accès refusé"
```

### Password faible (devrait retourner 400)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "password": "weak"
  }'
# Erreur: "Password must be at least 8 characters long"
```

### Vérifier que password N'EST PAS retourné

```bash
curl http://localhost:3000/api/auth/me -b "sorea_session=COOKIE"
# ✓ Pas de champ "password" dans la réponse
```

---

## Avec Postman (Recommandé)

1. Importe cette collection:

```json
{
  "info": {
    "name": "SOREA API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health",
      "request": { "method": "GET", "url": "{{base_url}}/api/health" }
    },
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/auth/register",
        "body": {
          "mode": "raw",
          "raw": "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\",\"password\":\"SecurePassword123\"}"
        }
      }
    }
  ]
}
```

2. Configure la variable `base_url = http://localhost:3000`
3. Teste chaque endpoint

---

## Checklist des Corrections Testées

- [ ] `/api/users` GET retourne users SANS passwords
- [ ] `/api/users` POST utilise bcrypt (pas de plain text)
- [ ] `/api/users` POST requiert minimum 8 caractères
- [ ] `/api/users` GET/POST nécessite authentification admin
- [ ] `/api/products` POST nécessite authentification admin
- [ ] `/api/sessions` POST nécessite authentification coach
- [ ] Les passwords ne sont JAMAIS retournés dans les réponses
- [ ] Non-authentifiés reçoivent 401
- [ ] Rôles insuffisants reçoivent 403

---

## Notes

- Les cookies sont sécurisés avec `httpOnly` et `secure` (prod)
- Sessions expirent après 7 jours
- Tous les passwords sont hashés avec bcrypt (10 rounds)
- Les données sensibles sont filtrées avec `select` au niveau Prisma
