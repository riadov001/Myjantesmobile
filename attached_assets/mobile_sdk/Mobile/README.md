# Guide d'Intégration Mobile MyJantes

Ce dossier contient les ressources nécessaires pour connecter votre application mobile au backend MyJantes.

## Contenu
- `openapi.json` : Spécification OpenAPI 3.0 (Swagger) décrivant tous les points d'entrée de l'API.
- `SDK/myjantes-sdk.ts` : Un client TypeScript prêt à l'emploi pour gérer l'authentification, les devis, les factures et les téléchargements de photos.

## Utilisation du SDK (TypeScript/React Native)

1. Importez le client dans votre projet mobile :
   ```typescript
   import { MyJantesClient } from './SDK/myjantes-sdk';
   const client = new MyJantesClient('https://myjantes.replit.app/api');
   ```

2. Authentification :
   ```typescript
   await client.login('email@exemple.com', 'votre_mot de passe');
   ```

3. Gestion des photos (Workflow recommandé) :
   - Demandez une URL de téléversement : `requestUploadUrl()`
   - Envoyez le fichier binaire vers l'URL reçue (via PUT)
   - Liez la photo au devis : `linkQuoteMedia()`

## Authentification et Sessions
L'API utilise des sessions basées sur les cookies. Dans votre application mobile (Fetch ou Axios), assurez-vous d'activer l'option `credentials: 'include'` pour que le backend puisse identifier l'utilisateur entre les requêtes.
