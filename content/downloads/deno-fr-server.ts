// Importation du module serveur HTTP de la bibliothéque standard (version 0.50.0)
import { serve } from "https://deno.land/std@0.50.0/http/server.ts";

// Nom d'hôte et port à écouter
const hostname = "localhost";
const port = 8080;

// Création d'un serveur HTTP
const server = serve({ hostname, port });
// Si le nom d'hôte n'est pas spécifié, écoute toutes les adresse via 0.0.0.0
// On peut aussi utiliser une chaine de caractère comme ceci : serve(`${hostname}:${port}`);

// Écrit l'adresse du serveur sur la sortie standard
console.log(`http://${hostname}:${port}`);

// Pour chaque requête vers le serveur
for await (const req of server) {
  // Écrit la méthode et l'URL demander par le client
  console.log(`${req.method} ${req.url}`);

  // Écrit "Hello World" suivis d'un saut ligne dans le corps de la réponse
  req.respond({ body: "Hello World\n" });
}
