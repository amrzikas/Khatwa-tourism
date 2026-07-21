# Firestore Security Specification

This document outlines the security specifications, data invariants, and negative test cases ("Dirty Dozen") for the Rayahati (رحلاتي) application.

## 1. Data Invariants

1. **Public Readability**: Destinations (`/destinations/{destId}`) and Hotels (`/hotels/{hotelId}`) are public assets. Anyone (including unauthenticated guests) can view and list them.
2. **Admin-Only Modification**: Creating, updating, or deleting destinations and hotels is strictly restricted to authenticated administrators.
3. **Admin Verification**: The administrator must be authenticated, verified (`email_verified == true`), and match the whitelisted bootstrap admin email (`AmrZikas20@gmail.com`).
4. **Referential Integrity**: A hotel cannot be created without a valid `destinationId` linking it to an existing destination document.
5. **Data Size Limits**: String fields (like descriptions and URLs) must be strictly bounded in size to prevent "Denial of Wallet" exhaustion attacks.

---

## 2. The "Dirty Dozen" Malicious Payloads

The following 12 payloads represent malicious or invalid database mutations designed to bypass database integrity. All of these must be rejected by Firestore Security Rules (`PERMISSION_DENIED`).

### Payload 1: Anonymous Create Destination
- **Attack Vector**: Unauthenticated user trying to create a destination.
- **Payload**:
```json
{
  "id": "malicious-dest",
  "name": "اختراق",
  "country": "مصر",
  "description": "حذف كل شيء",
  "image": "http://malicious.com/image.jpg"
}
```

### Payload 2: Non-Admin Authenticated User Create Destination
- **Attack Vector**: A signed-in non-admin user (e.g. `user@attacker.com`) attempts to create a destination.
- **Payload**: Same as above, sent with token of `user@attacker.com`.

### Payload 3: Unverified Email Admin Create Destination
- **Attack Vector**: Attacker registers an account with email `AmrZikas20@gmail.com` on an unverified provider (where `email_verified == false`) and attempts to write.
- **Payload**: Destination payload, sent with `email_verified: false` token.

### Payload 4: ID Poisoning / Giant Document ID Destination
- **Attack Vector**: Injecting a massive 100KB string containing junk characters as the document ID.
- **Path**: `/destinations/giant_id_of_100_kilobytes_junk_characters_...`

### Payload 5: Destination Missing Required Fields
- **Attack Vector**: Creating a destination without required fields (`country` or `image`), leaving a broken document structure.
- **Payload**:
```json
{
  "id": "broken-dest",
  "name": "وجهة مجهولة",
  "description": "لا توجد حقول أساسية"
}
```

### Payload 6: Destination String Volumetric Attack (Denial of Wallet)
- **Attack Vector**: Injecting a 1MB description into a destination to increase document storage costs.
- **Payload**:
```json
{
  "id": "vol-dest",
  "name": "تخريب",
  "country": "مصر",
  "description": "[A massive 1MB random string...]",
  "image": "https://images.unsplash.com/photo-1"
}
```

### Payload 7: Hotel referencing Non-Existent Destination (Orphaned Record)
- **Attack Vector**: Creating a hotel referencing a junk/non-existent destination ID.
- **Payload**:
```json
{
  "id": "hotel-orphan",
  "destinationId": "non-existent-dest-xyz",
  "name": "فندق مجهول",
  "stars": 5,
  "description": "لا وجهة له",
  ...
}
```

### Payload 8: Hotel Star Rating Boundary Out of Bounds
- **Attack Vector**: Setting stars to 10 or -1 (valid values are 1 to 5).
- **Payload**:
```json
{
  "id": "hotel-stars-invalid",
  "destinationId": "dest-1",
  "name": "فندق الخمسين نجمة",
  "stars": 10,
  ...
}
```

### Payload 9: Shadow Field Injection in Hotel Update (The "Shadow Update")
- **Attack Vector**: An admin or attacker injects an undocumented field `isFeaturedPremium: true` to bypass administrative audits.
- **Payload**:
```json
{
  "name": "ريكسوس بريميوم",
  "isFeaturedPremium": true
}
```

### Payload 10: Modifying Immutable Destination ID during Update
- **Attack Vector**: Attempting to alter the immutable ID fields during an update operation.
- **Payload**:
```json
{
  "id": "new-malicious-id",
  "name": "اسم جديد"
}
```

### Payload 11: Invalid Value Type in Nested Object (Transfer Policy)
- **Attack Vector**: Infiltrating the `transfers` sub-schema by setting price to a string `"free"` instead of a number.
- **Payload**:
```json
{
  "transfers": {
    "policy": "انتقالات مجانية",
    "price": "free",
    "isAvailable": true
  }
}
```

### Payload 12: Blank Reads Query Scraping
- **Attack Vector**: Client attempting to query the entire database without security boundaries.
- **Query**: Read list with no ownership filter or security constraint.

---

## 3. Test Runner Concept

A standalone `firestore.rules.test.ts` file can be executed using the `@firebase/rules-unit-testing` framework to assert that all of the above payloads fail with a `PERMISSION_DENIED` code, and that standard reads succeed.
