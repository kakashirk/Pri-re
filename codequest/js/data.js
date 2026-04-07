// ===== CODEQUEST DATA =====

const TRACKS = [
  { id: "html-css",    title: "HTML & CSS",     icon: "🌐", color: "#e34c26", desc: "Les fondations du web. Crée ta première page!", difficulty: "Débutant",       tags: ["Web","Frontend"] },
  { id: "javascript", title: "JavaScript",      icon: "⚡", color: "#f7df1e", desc: "Rends tes sites web interactifs et dynamiques!", difficulty: "Débutant",      tags: ["Web","Frontend"] },
  { id: "python",     title: "Python",          icon: "🐍", color: "#3776ab", desc: "Le langage le plus polyvalent pour débuter!",    difficulty: "Débutant",      tags: ["Backend","Data"] },
  { id: "discord",    title: "Bots Discord",    icon: "🤖", color: "#5865f2", desc: "Crée tes propres bots Discord en Python!",       difficulty: "Intermédiaire", tags: ["Discord","Bot"] },
  { id: "react",      title: "React",           icon: "⚛️", color: "#61dafb", desc: "Apps web modernes et professionnelles!",          difficulty: "Intermédiaire", tags: ["Web","App"] }
];

const LEVEL_NAMES = ["Newbie","Apprenti","Codeur","Développeur","Expert","Senior Dev","Tech Lead","Architecte","Guru","Légende"];

function xpForLevel(lvl) { return lvl * lvl * 100; }

const ACHIEVEMENTS = [
  { id: "first-lesson", icon: "🎯", title: "Premier pas",         desc: "Terminer ta première leçon" },
  { id: "first-track",  icon: "🏆", title: "Sur la bonne voie",   desc: "Compléter un track entier" },
  { id: "quiz-perfect", icon: "💯", title: "Perfectionniste",     desc: "Score parfait à un quiz" },
  { id: "streak-7",     icon: "🔥", title: "Semaine de feu",      desc: "7 jours de suite" },
  { id: "level-5",      icon: "⭐", title: "Développeur en herbe", desc: "Atteindre le niveau 5" },
  { id: "night-owl",    icon: "🦉", title: "Hibou du code",        desc: "Coder la nuit" },
  { id: "speed-demon",  icon: "⚡", title: "L'éclair",             desc: "Finir un speed quiz" },
  { id: "bug-hunter",   icon: "🐛", title: "Chasseur de bugs",    desc: "Compléter tous les Bug Hunt" }
];


// ===== LESSONS =====
const LESSONS = {

"html-css": [
 {
  id: "html-1", trackId: "html-css", title: "Introduction à HTML", duration: 5, xp: 50,
  content: [
   {type:"text", text:"HTML (HyperText Markup Language) est le langage de base de toutes les pages web. Ce n'est pas un langage de programmation, mais un langage de balisage qui décrit la structure d'une page. Chaque site web que tu visites est construit avec HTML."},
   {type:"text", text:"HTML utilise des balises (tags) pour structurer le contenu. Une balise s'écrit entre chevrons < >. La plupart des balises ont une ouverture et une fermeture, comme <p> et </p>. Le contenu se place entre les deux."},
   {type:"heading", text:"Anatomie d'une balise"},
   {type:"code", lang:"html", code:'<p>Bonjour le monde!</p>\n<h1>Mon titre principal</h1>\n<a href="https://google.com">Clique ici</a>'},
   {type:"tip", text:"Les attributs donnent des informations supplémentaires aux balises. Par exemple href= dans la balise <a> indique le lien de destination."},
   {type:"text", text:"Les balises peuvent aussi être auto-fermantes, comme <img /> ou <br />. Ces balises n'ont pas de contenu textuel entre elles."},
   {type:"code", lang:"html", code:'<!-- Balise auto-fermante -->\n<img src="photo.jpg" alt="Ma photo" />\n<br />\n\n<!-- Balise avec contenu -->\n<p>Ce texte est dans un paragraphe</p>'}
  ],
  quiz: { id:"q-html-1", questions:[
   {q:"Que signifie HTML?", opts:["HyperText Markup Language","High Tech Modern Language","HyperText Main Layout","Home Tool Markup Language"], correct:0, exp:"HTML = HyperText Markup Language. C'est le langage de balisage hypertexte."},
   {q:"Comment écrit-on une balise de fermeture?", opts:["<p>","</p>","<p/>","[/p]"], correct:1, exp:"Une balise de fermeture a un slash / avant le nom de la balise: </p>"},
   {q:"Lequel est un attribut HTML?", opts:["<style>","class=","#id",".classe"], correct:1, exp:"Les attributs se placent dans la balise ouvrante sous la forme nom='valeur'. Exemple: class='titre'"},
   {q:"Quelle balise crée un lien cliquable?", opts:["<link>","<url>","<a>","<href>"], correct:2, exp:"La balise <a> (anchor) crée des liens. L'attribut href contient l'URL de destination."},
   {q:"Qu'est-ce qu'une balise auto-fermante?", opts:["Une balise sans attributs","Une balise qui se ferme elle-même sans contenu","Une balise HTML5 uniquement","Une balise invisible"], correct:1, exp:"Les balises auto-fermantes comme <img> et <br> n'ont pas de balise de fermeture séparée car elles n'encadrent pas de contenu."}
  ]}
 },
 {
  id: "html-2", trackId: "html-css", title: "Tes premières balises", duration: 7, xp: 60,
  content: [
   {type:"text", text:"HTML offre de nombreuses balises pour structurer ton contenu. Les balises de titre h1 à h6 créent des titres de différentes tailles, h1 étant le plus grand et le plus important. Chaque page devrait avoir un seul h1."},
   {type:"code", lang:"html", code:'<h1>Titre principal (le plus grand)</h1>\n<h2>Sous-titre</h2>\n<h3>Section</h3>\n<p>Voici un paragraphe de texte normal.</p>\n<p>Un <strong>mot en gras</strong> et un <em>mot en italique</em>.</p>'},
   {type:"heading", text:"Listes et liens"},
   {type:"text", text:"Pour créer des listes, utilise <ul> (liste non ordonnée avec puces) ou <ol> (liste ordonnée numérotée). Chaque élément de liste se met dans une balise <li>."},
   {type:"code", lang:"html", code:'<ul>\n  <li>Pomme</li>\n  <li>Banane</li>\n  <li>Orange</li>\n</ul>\n\n<ol>\n  <li>Étape 1: Ouvrir le fichier</li>\n  <li>Étape 2: Écrire le code</li>\n  <li>Étape 3: Sauvegarder</li>\n</ol>'},
   {type:"tip", text:"Pour les images, l'attribut alt est très important! Il décrit l'image pour les personnes malvoyantes et s'affiche si l'image ne charge pas."},
   {type:"code", lang:"html", code:'<!-- Image locale -->\n<img src="chat.jpg" alt="Un chat orange qui dort" />\n\n<!-- Lien externe -->\n<a href="https://google.com" target="_blank">Ouvrir Google</a>\n\n<!-- Lien interne -->\n<a href="contact.html">Page contact</a>'}
  ],
  quiz: { id:"q-html-2", questions:[
   {q:"Quelle balise crée le titre le plus important?", opts:["<title>","<header>","<h1>","<h6>"], correct:2, exp:"<h1> est le titre le plus important. Les titres vont de h1 (plus grand) à h6 (plus petit)."},
   {q:"Quelle balise crée une liste non ordonnée (avec puces)?", opts:["<ol>","<ul>","<li>","<list>"], correct:1, exp:"<ul> = unordered list. Pour une liste numérotée, on utilise <ol> (ordered list)."},
   {q:"Comment mettre du texte en gras?", opts:["<bold>","<b> ou <strong>","<g>","text-weight:bold"], correct:1, exp:"<strong> ou <b> mettent le texte en gras. <strong> a aussi une signification sémantique d'importance."},
   {q:"Quel attribut est obligatoire pour une image accessible?", opts:["src","href","alt","title"], correct:2, exp:"L'attribut alt fournit une description textuelle de l'image. Il est essentiel pour l'accessibilité."},
   {q:"Comment ouvrir un lien dans un nouvel onglet?", opts:['target="_blank"','target="new"','href="tab"','open="true"'], correct:0, exp:'target="_blank" ouvre le lien dans un nouvel onglet. target="_self" (défaut) ouvre dans le même onglet.'}
  ]}
 },
 {
  id: "html-3", trackId: "html-css", title: "Structure d'une page", duration: 6, xp: 60,
  content: [
   {type:"text", text:"Toute page HTML correcte commence par une déclaration DOCTYPE qui indique au navigateur qu'il s'agit d'HTML5. Ensuite vient la balise <html> qui englobe tout le contenu, avec deux sections principales: <head> et <body>."},
   {type:"code", lang:"html", code:'<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>Ma première page</title>\n</head>\n<body>\n  <h1>Bonjour!</h1>\n  <p>Ma première page web.</p>\n</body>\n</html>'},
   {type:"tip", text:"Le <head> contient des infos sur la page (titre, encodage, CSS) mais rien de visible. Le <body> contient tout ce que l'utilisateur voit."},
   {type:"heading", text:"Balises sémantiques HTML5"},
   {type:"text", text:"HTML5 a introduit des balises sémantiques qui décrivent leur rôle. Elles aident les moteurs de recherche et les lecteurs d'écran à comprendre la structure de ta page."},
   {type:"code", lang:"html", code:'<header>\n  <nav>\n    <a href="index.html">Accueil</a>\n    <a href="about.html">À propos</a>\n  </nav>\n</header>\n\n<main>\n  <section>\n    <h2>Section principale</h2>\n    <article>\n      <h3>Mon article</h3>\n      <p>Contenu de l\'article...</p>\n    </article>\n  </section>\n</main>\n\n<footer>\n  <p>&copy; 2025 Mon Site</p>\n</footer>'}
  ],
  quiz: { id:"q-html-3", questions:[
   {q:"Que contient la balise <head>?", opts:["Le contenu visible","Les métadonnées et ressources","Les images","Le menu de navigation"], correct:1, exp:"<head> contient les métadonnées: charset, viewport, title, liens CSS, scripts. Rien de directement visible."},
   {q:"À quoi sert <!DOCTYPE html>?", opts:["Déclarer l'auteur","Indiquer que c'est HTML5","Créer un commentaire","Importer CSS"], correct:1, exp:"<!DOCTYPE html> dit au navigateur d'utiliser le mode HTML5 standard. Toujours mettre en première ligne."},
   {q:"Quelle balise définit le contenu principal unique d'une page?", opts:["<body>","<section>","<main>","<content>"], correct:2, exp:"<main> contient le contenu principal unique de la page. Il ne doit y en avoir qu'un seul par page."},
   {q:"Quelle balise représente un en-tête de page ou de section?", opts:["<head>","<top>","<header>","<h1>"], correct:2, exp:"<header> est une balise sémantique pour l'en-tête. À ne pas confondre avec <head> qui est dans le <html>."},
   {q:"Quelle meta est essentielle pour les sites mobiles?", opts:['charset="UTF-8"','name="viewport"','name="author"','http-equiv="refresh"'], correct:1, exp:'La meta viewport avec content="width=device-width, initial-scale=1.0" est indispensable pour que le site s\'adapte aux mobiles.'}
  ]}
 },
 {
  id: "css-1", trackId: "html-css", title: "Introduction au CSS", duration: 5, xp: 50,
  content: [
   {type:"text", text:"CSS (Cascading Style Sheets) est le langage qui donne du style à tes pages HTML. Avec CSS tu contrôles les couleurs, les polices, les tailles, les espacements et la mise en page de tout ton site."},
   {type:"text", text:"Il y a 3 façons d'ajouter du CSS: en ligne (inline) avec l'attribut style, interne avec une balise <style> dans le <head>, ou externe avec un fichier .css séparé (la meilleure pratique)."},
   {type:"code", lang:"html", code:'<!-- CSS externe (recommandé) -->\n<link rel="stylesheet" href="style.css" />\n\n<!-- CSS interne -->\n<style>\n  p { color: red; }\n</style>\n\n<!-- CSS inline (à éviter) -->\n<p style="color: red;">Texte rouge</p>'},
   {type:"heading", text:"Syntaxe CSS"},
   {type:"text", text:"Une règle CSS se compose d'un sélecteur (qui cibler) et d'un bloc de déclarations (quoi changer). Chaque déclaration a une propriété et une valeur, séparées par deux-points, et se termine par un point-virgule."},
   {type:"code", lang:"css", code:'/* Sélecteur { propriété: valeur; } */\n\nh1 {\n  color: blue;\n  font-size: 32px;\n  text-align: center;\n}\n\np {\n  font-size: 16px;\n  line-height: 1.6;\n  color: #333333;\n}'},
   {type:"tip", text:"Utilise des commentaires CSS avec /* */ pour documenter ton code. Ils sont ignorés par le navigateur."}
  ],
  quiz: { id:"q-css-1", questions:[
   {q:"Que signifie CSS?", opts:["Computer Style Sheets","Cascading Style Sheets","Creative Styling System","Color Style Syntax"], correct:1, exp:"CSS = Cascading Style Sheets (feuilles de style en cascade). Le terme 'cascade' vient de la façon dont les styles se combinent."},
   {q:"Quelle est la meilleure façon d'ajouter du CSS?", opts:["Attribut style inline","Balise <style>","Fichier .css externe","Attribut class"], correct:2, exp:"Un fichier CSS externe est la meilleure pratique: il sépare le style du contenu et peut être réutilisé sur plusieurs pages."},
   {q:"Comment s'appelle la partie { color: red; } dans une règle CSS?", opts:["Sélecteur","Bloc de déclarations","Propriété","Valeur"], correct:1, exp:"Le bloc entre accolades { } contient les déclarations CSS. Chaque déclaration est une paire propriété:valeur."},
   {q:"Quel symbole commence un commentaire CSS?", opts:["//","#","/*","<!--"], correct:2, exp:"Les commentaires CSS s'écrivent entre /* et */. Le // n'est pas valide en CSS (c'est pour JavaScript)."},
   {q:"Comment lier un fichier CSS externe à une page HTML?", opts:['<css src="style.css">','<link rel="stylesheet" href="style.css">','<style src="style.css">','import style.css'], correct:1, exp:'On utilise la balise <link> dans le <head> avec rel="stylesheet" et href pointant vers le fichier CSS.'}
  ]}
 },
 {
  id: "css-2", trackId: "html-css", title: "Couleurs & typographie", duration: 7, xp: 65,
  content: [
   {type:"text", text:"Les couleurs en CSS peuvent s'exprimer de plusieurs façons: par nom (red, blue), en hexadécimal (#ff0000), en RGB (rgb(255,0,0)) ou en HSL. L'hex est le plus courant chez les développeurs."},
   {type:"code", lang:"css", code:'/* Différentes façons d\'écrire la même couleur rouge */\ncolor: red;\ncolor: #ff0000;\ncolor: #f00;        /* Raccourci hex */\ncolor: rgb(255, 0, 0);\ncolor: hsl(0, 100%, 50%);\n\n/* Couleur avec transparence */\ncolor: rgba(255, 0, 0, 0.5);  /* 50% transparent */'},
   {type:"heading", text:"Propriétés typographiques"},
   {type:"text", text:"La typographie est essentielle pour la lisibilité. CSS offre de nombreuses propriétés pour contrôler les polices, la taille, le style et l'espacement du texte."},
   {type:"code", lang:"css", code:'body {\n  font-family: "Roboto", Arial, sans-serif;\n  font-size: 16px;\n  line-height: 1.6;       /* Hauteur de ligne */\n  color: #333;\n}\n\nh1 {\n  font-size: 2.5rem;      /* Relatif à la taille de base */\n  font-weight: bold;\n  letter-spacing: -1px;   /* Espacement entre lettres */\n  text-transform: uppercase;\n}\n\na {\n  color: #0066cc;\n  text-decoration: none;  /* Enlève le soulignement */\n}\n\na:hover {\n  text-decoration: underline;\n}'},
   {type:"tip", text:"Utilise rem plutôt que px pour les tailles de police. 1rem = 16px par défaut. C'est plus accessible car ça respecte les préférences de l'utilisateur."}
  ],
  quiz: { id:"q-css-2", questions:[
   {q:"Comment écrire la couleur rouge en hexadécimal?", opts:["rgb(255,0,0)","#ff0000","red","hsl(0,100%,50%)"], correct:1, exp:"#ff0000 est la notation hexadécimale pour le rouge pur. #ff = rouge à max, 00 = pas de vert, 00 = pas de bleu."},
   {q:"Quelle propriété change la police de caractères?", opts:["text-font","font-family","font-type","typeface"], correct:1, exp:"font-family définit la police. On met plusieurs polices en ordre de préférence: la première disponible sur l'appareil sera utilisée."},
   {q:"Qu'est-ce que line-height?", opts:["La hauteur du texte","L'espace entre les lignes","La largeur du texte","La marge du texte"], correct:1, exp:"line-height contrôle l'espacement vertical entre les lignes de texte. Une valeur de 1.5 à 1.6 est idéale pour la lisibilité."},
   {q:"Comment enlever le soulignement d'un lien?", opts:["underline: none","text-style: none","text-decoration: none","link-decoration: remove"], correct:2, exp:"text-decoration: none enlève la décoration textuelle (soulignement par défaut des liens)."},
   {q:"Quelle unité est relative à la taille de police de base?", opts:["px","%","rem","vh"], correct:2, exp:"rem (root em) est relatif à la taille de police de l'élément racine <html>. 1rem = 16px par défaut."}
  ]}
 },
 {
  id: "css-3", trackId: "html-css", title: "Flexbox", duration: 8, xp: 70,
  content: [
   {type:"text", text:"Flexbox (Flexible Box Layout) est un système de mise en page CSS très puissant. Il permet d'aligner et distribuer des éléments dans un conteneur de façon flexible, que ce soit horizontalement ou verticalement."},
   {type:"code", lang:"css", code:'.container {\n  display: flex;              /* Active Flexbox */\n  flex-direction: row;        /* Direction: row ou column */\n  justify-content: center;    /* Alignement axe principal */\n  align-items: center;        /* Alignement axe secondaire */\n  gap: 16px;                  /* Espace entre les éléments */\n}'},
   {type:"heading", text:"justify-content et align-items"},
   {type:"text", text:"justify-content contrôle l'alignement sur l'axe principal (horizontal par défaut). align-items contrôle l'alignement sur l'axe secondaire (vertical par défaut). Ces deux propriétés combinées permettent de centrer facilement n'importe quel élément."},
   {type:"code", lang:"css", code:'/* Centrer parfaitement un élément */\n.parent {\n  display: flex;\n  justify-content: center;   /* Centre horizontalement */\n  align-items: center;       /* Centre verticalement */\n  height: 100vh;             /* Prend toute la hauteur */\n}\n\n/* Distribuer les éléments uniformément */\n.nav {\n  display: flex;\n  justify-content: space-between;  /* Espace égal entre */\n}\n\n/* Colonne flex */\n.card {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n}'},
   {type:"tip", text:"Pour centrer un élément au milieu de la page: display:flex + justify-content:center + align-items:center sur le parent. C'est la technique la plus utilisée!"}
  ],
  quiz: { id:"q-css-3", questions:[
   {q:"Quelle propriété active Flexbox sur un conteneur?", opts:["flex: true","display: flex","position: flex","layout: flex"], correct:1, exp:"display: flex active le mode Flexbox sur l'élément. Ses enfants directs deviennent des flex items."},
   {q:"Quelle propriété contrôle l'alignement sur l'axe principal?", opts:["align-items","flex-align","justify-content","main-align"], correct:2, exp:"justify-content gère l'alignement sur l'axe principal (horizontal si flex-direction:row)."},
   {q:"Quelle valeur de justify-content met un espace égal entre les éléments?", opts:["flex-end","space-around","space-between","center"], correct:2, exp:"space-between distribue les éléments avec un espace égal entre eux. Le premier et dernier sont aux bords."},
   {q:"Comment changer la direction d'un Flexbox en colonne?", opts:["flex-direction: column","flex-flow: vertical","align-direction: column","display: flex-column"], correct:0, exp:"flex-direction: column empile les éléments verticalement. La valeur par défaut est row (horizontal)."},
   {q:"Quelle propriété crée des espaces entre les flex items?", opts:["margin","spacing","gap","padding"], correct:2, exp:"La propriété gap crée un espace uniforme entre les flex items. Elle remplace les margins pour espacer les éléments."}
  ]}
 }
],


"javascript": [
 {
  id: "js-1", trackId: "javascript", title: "Introduction à JavaScript", duration: 5, xp: 50,
  content: [
   {type:"text", text:"JavaScript (JS) est le langage de programmation du web. Contrairement à HTML (structure) et CSS (style), JS apporte de l'interactivité: répondre aux clics, modifier le contenu, envoyer des données... Aujourd'hui JS s'utilise aussi côté serveur avec Node.js."},
   {type:"code", lang:"html", code:'<!-- Ajouter JS dans HTML -->\n<script>\n  console.log("Bonjour depuis JS!");\n</script>\n\n<!-- Ou fichier externe (recommandé) -->\n<script src="script.js"></script>'},
   {type:"heading", text:"Tes premières instructions"},
   {type:"text", text:"console.log() affiche un message dans la console du navigateur (F12). C'est ton meilleur ami pour déboguer. Les commentaires JS s'écrivent avec // pour une ligne ou /* */ pour plusieurs lignes."},
   {type:"code", lang:"javascript", code:'// Afficher dans la console\nconsole.log("Hello World!");\nconsole.log(42);\nconsole.log(true);\n\n// Afficher une alerte\nalert("Bienvenue sur mon site!");\n\n// Afficher dans la page\ndocument.write("<p>Bonjour!</p>");\n\n/* Commentaire\n   sur plusieurs lignes */'}
  ],
  quiz: { id:"q-js-1", questions:[
   {q:"Quelle fonction affiche un message dans la console?", opts:["print()","log()","console.log()","display()"], correct:2, exp:"console.log() est la fonction pour afficher dans la console du navigateur. Ouvre-la avec F12."},
   {q:"Comment écrire un commentaire sur une seule ligne en JS?", opts:["<!-- commentaire -->","/* commentaire */","// commentaire","# commentaire"], correct:2, exp:"// crée un commentaire sur une ligne en JavaScript. /* */ est pour les commentaires multi-lignes."},
   {q:"Où place-t-on la balise <script> en bonne pratique?", opts:["Dans <head>","Avant </body>","N'importe où","Dans <footer>"], correct:1, exp:"Placer <script> juste avant </body> garantit que le HTML est chargé avant que le JS s'exécute."},
   {q:"JS peut-il s'exécuter côté serveur?", opts:["Non, JS est uniquement côté client","Oui, avec Node.js","Oui, avec PHP","Non, il faut Python"], correct:1, exp:"Avec Node.js, JavaScript peut s'exécuter côté serveur pour créer des APIs, des apps web complètes, etc."},
   {q:"Quelle extension ont les fichiers JavaScript?", opts:[".html",".css",".js",".java"], correct:2, exp:"Les fichiers JavaScript ont l'extension .js. Ne pas confondre avec Java qui est un langage complètement différent!"}
  ]}
 },
 {
  id: "js-2", trackId: "javascript", title: "Variables & types", duration: 7, xp: 60,
  content: [
   {type:"text", text:"Une variable est une boîte qui stocke une valeur. En JavaScript moderne, on utilise let pour les variables qui changent et const pour les constantes qui ne changent pas. var est l'ancien mot-clé à éviter."},
   {type:"code", lang:"javascript", code:'let age = 17;              // Nombre entier\nconst nom = "Alex";        // Chaîne de caractères\nlet actif = true;          // Booléen\nlet score = 9.5;           // Nombre décimal\nlet vide = null;           // Valeur nulle\nlet inconnu;               // undefined\n\nage = 18;                  // On peut changer let\n// nom = "Bob";            // Erreur! const ne change pas'},
   {type:"heading", text:"Les types de données"},
   {type:"text", text:"JavaScript a plusieurs types de données. Les plus utilisés sont String (texte), Number (chiffres), Boolean (vrai/faux), null (rien volontaire) et undefined (non défini). La fonction typeof révèle le type d'une valeur."},
   {type:"code", lang:"javascript", code:'console.log(typeof "bonjour");  // "string"\nconsole.log(typeof 42);         // "number"\nconsole.log(typeof true);       // "boolean"\nconsole.log(typeof null);       // "object" (quirk JS!)\n\n// Concaténation de strings\nlet prenom = "Marie";\nlet message = "Bonjour " + prenom + "!";\nconsole.log(message); // "Bonjour Marie!"\n\n// Template literals (moderne)\nlet msg2 = `Bonjour ${prenom}!`;\nconsole.log(msg2); // "Bonjour Marie!"'},
   {type:"tip", text:"Utilise les template literals (backticks `) pour insérer des variables dans une chaîne. C'est plus lisible que la concaténation avec +."}
  ],
  quiz: { id:"q-js-2", questions:[
   {q:"Quel mot-clé utiliser pour une variable qui peut changer?", opts:["const","var","let","def"], correct:2, exp:"let crée une variable modifiable. const crée une constante. var est l'ancien mot-clé à éviter en JavaScript moderne."},
   {q:"Quel est le type de la valeur true?", opts:["string","number","boolean","object"], correct:2, exp:"true et false sont des valeurs booléennes (boolean). Elles représentent vrai et faux."},
   {q:"Comment insérer une variable dans un template literal?", opts:["${variable}","{variable}","#variable","<variable>"], correct:0, exp:"${variable} insère la valeur d'une variable dans un template literal (texte entre backticks `)."},
   {q:"Quelle est la différence entre null et undefined?", opts:["Aucune","null = intentionnel, undefined = non défini","undefined = intentionnel, null = erreur","Ils ne sont pas en JS"], correct:1, exp:"null est une absence de valeur intentionnelle. undefined signifie qu'une variable a été déclarée mais pas encore assignée."},
   {q:"Que retourne typeof 42?", opts:['"integer"','"float"','"number"','"digit"'], correct:2, exp:'typeof 42 retourne "number". JS a un seul type numérique qui englobe entiers et décimaux.'}
  ]}
 },
 {
  id: "js-3", trackId: "javascript", title: "Conditions", duration: 7, xp: 65,
  content: [
   {type:"text", text:"Les conditions permettent à ton programme de prendre des décisions. La structure de base est if/else: si une condition est vraie, exécute ce bloc, sinon exécute l'autre. On peut enchaîner avec else if."},
   {type:"code", lang:"javascript", code:'let age = 16;\n\nif (age >= 18) {\n  console.log("Tu es majeur!");\n} else if (age >= 13) {\n  console.log("Tu es ado.");\n} else {\n  console.log("Tu es enfant.");\n}\n// Affiche: "Tu es ado."'},
   {type:"heading", text:"Opérateurs de comparaison"},
   {type:"text", text:"Pour comparer des valeurs, utilise == (égal) ou === (strictement égal). La différence: === vérifie aussi le type, ce qui évite des bugs. Préfère toujours === en JavaScript!"},
   {type:"code", lang:"javascript", code:'// Opérateurs de comparaison\nconsole.log(5 === 5);   // true\nconsole.log(5 === "5"); // false (types différents)\nconsole.log(5 == "5");  // true (dangereux!)\nconsole.log(10 > 5);    // true\nconsole.log(3 !== 4);   // true\n\n// Opérateurs logiques\nlet aGagné = true;\nlet aPayé = false;\nif (aGagné && aPayé) { console.log("Super!"); }\nif (aGagné || aPayé) { console.log("L\'un des deux"); }\n\n// Ternaire (if/else en une ligne)\nlet message = age >= 18 ? "Majeur" : "Mineur";\nconsole.log(message);'},
   {type:"tip", text:"Toujours utiliser === au lieu de == en JavaScript. L'opérateur == fait des conversions de type qui peuvent donner des résultats inattendus."}
  ],
  quiz: { id:"q-js-3", questions:[
   {q:"Quelle est la différence entre == et ===?", opts:["Aucune","=== vérifie aussi le type","== est plus rapide","=== est pour les strings seulement"], correct:1, exp:"=== (strict equality) vérifie la valeur ET le type. == convertit les types avant de comparer, ce qui peut donner des bugs."},
   {q:"Que vaut: 5 === '5' ?", opts:["true","false","undefined","error"], correct:1, exp:"5 === '5' est false car même si les valeurs semblent identiques, les types sont différents (number vs string)."},
   {q:"Quel opérateur signifie 'ET logique'?", opts:["||","&&","!","??"], correct:1, exp:"&& est l'opérateur ET. Il retourne true seulement si les deux conditions sont vraies. || est le OU."},
   {q:"Comment s'écrit l'opérateur ternaire?", opts:["if(cond) ? val1 : val2","cond ? val1 : val2","cond then val1 else val2","cond | val1 | val2"], correct:1, exp:"condition ? valeurSiVrai : valeurSiFaux. C'est un if/else condensé en une expression."},
   {q:"Quelle structure permet de tester plusieurs conditions?", opts:["if/switch/end","if/elif/end","if/else if/else","if/or/else"], correct:2, exp:"if/else if/else permet de tester plusieurs conditions en cascade. On peut avoir autant de else if qu'on veut."}
  ]}
 },
 {
  id: "js-4", trackId: "javascript", title: "Boucles", duration: 7, xp: 65,
  content: [
   {type:"text", text:"Les boucles répètent du code plusieurs fois sans avoir à le réécrire. La boucle for est idéale quand on sait combien de fois répéter. Elle a trois parties: initialisation, condition, et incrément."},
   {type:"code", lang:"javascript", code:'// Boucle for classique\nfor (let i = 0; i < 5; i++) {\n  console.log("Tour numéro " + i);\n}\n// Affiche: Tour 0, Tour 1, Tour 2, Tour 3, Tour 4\n\n// Boucle while\nlet compteur = 0;\nwhile (compteur < 3) {\n  console.log("compteur = " + compteur);\n  compteur++;\n}'},
   {type:"heading", text:"Boucler sur un tableau"},
   {type:"text", text:"Pour parcourir les éléments d'un tableau, utilise for...of. C'est la façon la plus lisible. forEach est aussi très utilisé avec les tableaux."},
   {type:"code", lang:"javascript", code:'const fruits = ["pomme", "banane", "orange"];\n\n// for...of (moderne et lisible)\nfor (const fruit of fruits) {\n  console.log(fruit);\n}\n\n// forEach avec fonction\nfruits.forEach(function(fruit) {\n  console.log(fruit.toUpperCase());\n});\n\n// Avec arrow function\nfruits.forEach(fruit => console.log(fruit));\n\n// break et continue\nfor (let i = 0; i < 10; i++) {\n  if (i === 3) continue; // Saute le 3\n  if (i === 7) break;    // Arrête à 7\n  console.log(i);\n}'},
   {type:"tip", text:"break arrête complètement la boucle. continue passe à l'itération suivante. Utilise-les avec précaution pour ne pas créer de boucles infinies!"}
  ],
  quiz: { id:"q-js-4", questions:[
   {q:"Quelle boucle est la plus adaptée pour répéter N fois?", opts:["while","for","do...while","forEach"], correct:1, exp:"La boucle for est parfaite quand on connaît le nombre d'itérations. Sa syntaxe: for(init; condition; increment)."},
   {q:"Que fait le mot-clé break dans une boucle?", opts:["Passe à l'itération suivante","Arrête complètement la boucle","Remet le compteur à 0","Affiche une erreur"], correct:1, exp:"break sort immédiatement de la boucle. continue, lui, passe à l'itération suivante sans arrêter la boucle."},
   {q:"Quelle syntaxe parcourt les éléments d'un tableau?", opts:["for i in tableau","for...of tableau","foreach tableau","tableau.loop()"], correct:1, exp:"for (const element of tableau) est la syntaxe moderne pour parcourir un tableau. C'est lisible et simple."},
   {q:"Que vaut i après: for(let i=0; i<3; i++) {} ?", opts:["0","2","3","undefined"], correct:2, exp:"Après la boucle, i vaut 3. La condition i<3 est vérifiée, et comme 3 n'est pas < 3, la boucle s'arrête."},
   {q:"Quel est le risque d'une boucle while?", opts:["Elle est trop lente","Elle peut créer une boucle infinie","Elle ne marche qu'avec des nombres","Elle consomme trop de mémoire"], correct:1, exp:"Si la condition d'une boucle while ne devient jamais false, elle tourne indéfiniment. Assure-toi que la condition finit par être fausse!"}
  ]}
 },
 {
  id: "js-5", trackId: "javascript", title: "Fonctions", duration: 8, xp: 70,
  content: [
   {type:"text", text:"Une fonction est un bloc de code réutilisable qui effectue une tâche précise. Au lieu de répéter le même code, on l'encapsule dans une fonction et on l'appelle quand on en a besoin. C'est le principe DRY: Don't Repeat Yourself."},
   {type:"code", lang:"javascript", code:'// Déclaration de fonction\nfunction direBonjour(prenom) {\n  console.log("Bonjour " + prenom + "!");\n}\n\ndireBonjour("Alice"); // Bonjour Alice!\ndireBonjour("Bob");   // Bonjour Bob!\n\n// Fonction avec return\nfunction additionner(a, b) {\n  return a + b;\n}\n\nconst resultat = additionner(5, 3);\nconsole.log(resultat); // 8'},
   {type:"heading", text:"Arrow functions"},
   {type:"text", text:"Les arrow functions (fonctions fléchées) sont une syntaxe plus courte pour écrire des fonctions. Elles utilisent => au lieu du mot-clé function. Très utilisées en JavaScript moderne."},
   {type:"code", lang:"javascript", code:'// Fonction traditionnelle\nfunction carré(x) {\n  return x * x;\n}\n\n// Arrow function équivalente\nconst carré = (x) => {\n  return x * x;\n};\n\n// Forme ultra-courte (une ligne)\nconst carré = x => x * x;\n\nconsole.log(carré(4)); // 16\n\n// Paramètres par défaut\nconst saluer = (nom = "ami") => `Salut ${nom}!`;\nconsole.log(saluer());       // Salut ami!\nconsole.log(saluer("Alex")); // Salut Alex!'},
   {type:"tip", text:"Si ta fonction ne fait qu'une chose et retourne une valeur, l'arrow function courte (sans {}) est parfaite. Exemple: const double = x => x * 2;"}
  ],
  quiz: { id:"q-js-5", questions:[
   {q:"Quel mot-clé déclare une fonction?", opts:["func","def","function","method"], correct:2, exp:"function est le mot-clé JavaScript pour déclarer une fonction. def est utilisé en Python."},
   {q:"Que fait le mot-clé return?", opts:["Affiche une valeur","Termine le programme","Renvoie une valeur et arrête la fonction","Crée une variable"], correct:2, exp:"return renvoie une valeur de la fonction et l'arrête. Sans return, la fonction retourne undefined."},
   {q:"Comment s'écrit une arrow function simple?", opts:["function => {}","() -> {}","(x) => x * 2","x: function() {}"], correct:2, exp:"La syntaxe arrow function: (paramètres) => expression. Si un seul paramètre: x => expression."},
   {q:"Qu'est-ce qu'un paramètre par défaut?", opts:["Un paramètre obligatoire","Une valeur utilisée si aucune n'est fournie","Un paramètre global","Un paramètre caché"], correct:1, exp:"Un paramètre par défaut (param = valeur) est utilisé quand la fonction est appelée sans fournir cet argument."},
   {q:"Quelle est la principale utilité des fonctions?", opts:["Elles rendent le code plus lent","Elles évitent la répétition du code","Elles sont obligatoires","Elles remplacent les variables"], correct:1, exp:"Les fonctions permettent de réutiliser du code (principe DRY: Don't Repeat Yourself) et d'organiser son programme."}
  ]}
 },
 {
  id: "js-6", trackId: "javascript", title: "Le DOM", duration: 10, xp: 80,
  content: [
   {type:"text", text:"Le DOM (Document Object Model) est la représentation de ta page HTML sous forme d'arbre d'objets JavaScript. Grâce au DOM, ton JavaScript peut lire et modifier n'importe quel élément de la page en temps réel."},
   {type:"code", lang:"javascript", code:'// Sélectionner des éléments\nconst titre = document.getElementById("titre");\nconst bouton = document.querySelector(".btn");\nconst liens = document.querySelectorAll("a");\n\n// Modifier le contenu\ntitre.textContent = "Nouveau titre!";\ntitre.innerHTML = "<em>Titre en italique</em>";\n\n// Modifier le style\ntitre.style.color = "blue";\ntitre.style.fontSize = "2rem";\n\n// Modifier les classes\ntitre.classList.add("actif");\ntitre.classList.remove("inactif");\ntitre.classList.toggle("visible");'},
   {type:"heading", text:"Événements"},
   {type:"text", text:"Les événements permettent de réagir aux actions de l'utilisateur: clic, frappe au clavier, survol de souris... addEventListener écoute un événement et exécute une fonction quand il se produit."},
   {type:"code", lang:"javascript", code:'const bouton = document.querySelector("#monBouton");\n\n// Écouter un clic\nbouton.addEventListener("click", function() {\n  alert("Tu as cliqué!");\n});\n\n// Avec arrow function\nbouton.addEventListener("click", () => {\n  document.body.style.backgroundColor = "lightblue";\n});\n\n// Créer un élément\nconst nouvelElem = document.createElement("p");\nnouvelElem.textContent = "Nouvel élément!";\ndocument.body.appendChild(nouvelElem);'},
   {type:"tip", text:"querySelector('.classe') sélectionne le premier élément qui correspond. querySelectorAll('.classe') retourne tous les éléments correspondants sous forme de NodeList."}
  ],
  quiz: { id:"q-js-6", questions:[
   {q:"Que signifie DOM?", opts:["Document Object Model","Data Object Method","Direct Object Manager","Document Order Map"], correct:0, exp:"DOM = Document Object Model. C'est la représentation de la page HTML sous forme d'objets manipulables en JS."},
   {q:"Quelle méthode sélectionne un élément par son ID?", opts:["document.getElement()","document.querySelector('#id')","document.getElementById('id')","Toutes les réponses"], correct:3, exp:"document.getElementById('id') et document.querySelector('#id') permettent tous deux de sélectionner par ID."},
   {q:"Quelle propriété modifie le texte d'un élément?", opts:["innerHTML","textContent","text","content"], correct:1, exp:"textContent modifie seulement le texte, sans interpréter le HTML. innerHTML interprète le HTML (attention aux injections!)."},
   {q:"Comment écouter un clic sur un bouton?", opts:["bouton.click()","bouton.on('click', fn)","bouton.addEventListener('click', fn)","bouton.onClick = fn"], correct:2, exp:"addEventListener('event', callback) est la méthode standard pour écouter des événements sur un élément."},
   {q:"Que fait document.createElement('p')?", opts:["Sélectionne tous les <p>","Crée un nouvel élément <p> non encore ajouté à la page","Supprime les <p>","Modifie les <p> existants"], correct:1, exp:"createElement crée un nouvel élément en mémoire. Il faut ensuite l'ajouter au DOM avec appendChild() ou insertBefore()."}
  ]}
 }
],


"python": [
 {
  id: "py-1", trackId: "python", title: "Introduction à Python", duration: 5, xp: 50,
  content: [
   {type:"text", text:"Python est un langage de programmation simple, lisible et très puissant. Créé en 1991 par Guido van Rossum, Python est aujourd'hui le langage le plus populaire au monde, utilisé en data science, IA, développement web, automatisation et bien plus encore."},
   {type:"code", lang:"python", code:'# Mon premier programme Python\nprint("Bonjour le monde!")\nprint("Je commence à coder!")\n\n# Les commentaires commencent avec #\n# Python n\'a pas besoin de point-virgule\n\n# Afficher plusieurs valeurs\nprint("Mon âge:", 17)\nprint(1 + 2 + 3)  # Affiche: 6'},
   {type:"heading", text:"L'indentation: la règle d'or"},
   {type:"text", text:"En Python, l'indentation (les espaces en début de ligne) fait partie de la syntaxe! Elle délimite les blocs de code. Par convention, on utilise 4 espaces. Oublier l'indentation cause des erreurs IndentationError."},
   {type:"code", lang:"python", code:'# Correct: bloc indenté\nif True:\n    print("Ceci est dans le if")\n    print("Moi aussi!")\nprint("Ceci est hors du if")\n\n# ERREUR: pas d\'indentation\n# if True:\n# print("Erreur!")  # IndentationError!'},
   {type:"tip", text:"Python utilise des espaces (ou tabs) pour délimiter les blocs. C'est différent des accolades {} en JavaScript. Ton éditeur de code (VS Code) gère ça automatiquement."}
  ],
  quiz: { id:"q-py-1", questions:[
   {q:"Quelle fonction affiche du texte en Python?", opts:["console.log()","echo()","print()","display()"], correct:2, exp:"print() est la fonction de base pour afficher du texte en Python. Équivalent de console.log() en JavaScript."},
   {q:"Comment écrire un commentaire en Python?", opts:["// commentaire","/* commentaire */","# commentaire","<!-- commentaire -->"], correct:2, exp:"Les commentaires Python commencent par #. Pour les multi-lignes, on utilise des triple-guillemets \"\"\" ... \"\"\"."},
   {q:"Qu'est-ce que l'indentation en Python?", opts:["Des espaces décoratifs","La syntaxe pour délimiter les blocs de code","Un type de variable","Une fonction built-in"], correct:1, exp:"L'indentation (4 espaces par convention) est obligatoire en Python pour délimiter les blocs. C'est une règle fondamentale!"},
   {q:"Python a-t-il besoin de point-virgule en fin de ligne?", opts:["Oui, obligatoire","Non, optionnel","Seulement dans les boucles","Seulement pour les fonctions"], correct:1, exp:"Python n'utilise pas de point-virgule pour terminer les instructions. Chaque ligne est une instruction."},
   {q:"Qui a créé Python?", opts:["Linus Torvalds","Bill Gates","Guido van Rossum","Dennis Ritchie"], correct:2, exp:"Python a été créé par Guido van Rossum et lancé en 1991. Son nom vient des Monty Python, pas du serpent!"}
  ]}
 },
 {
  id: "py-2", trackId: "python", title: "Variables & types", duration: 6, xp: 55,
  content: [
   {type:"text", text:"En Python, les variables se créent simplement en leur assignant une valeur. Pas besoin de let, const ou var! Python reconnaît automatiquement le type (typage dynamique). Une variable peut changer de type."},
   {type:"code", lang:"python", code:'# Créer des variables\nnom = "Alex"\nage = 17\ntaille = 1.75\netudiant = True\nnotes = None   # équivalent de null\n\n# Afficher le type\nprint(type(nom))      # <class \'str\'>\nprint(type(age))      # <class \'int\'>\nprint(type(taille))   # <class \'float\'>\nprint(type(etudiant)) # <class \'bool\'>'},
   {type:"heading", text:"F-strings: le formatage moderne"},
   {type:"text", text:"Les f-strings (format strings) sont la façon moderne d'insérer des variables dans du texte en Python 3.6+. On met f avant les guillemets, et les variables entre accolades {}."},
   {type:"code", lang:"python", code:'nom = "Sophie"\nage = 20\nmoyenne = 14.5\n\n# F-string (recommandé)\nmessage = f"Je m\'appelle {nom}, j\'ai {age} ans."\nprint(message)\n\n# Format avec arrondi\nprint(f"Ma moyenne est {moyenne:.1f}/20")\n\n# Ancienne méthode (à connaître)\nprint("Je m\'appelle %s" % nom)\nprint("Bonjour {}!".format(nom))'},
   {type:"tip", text:"Les f-strings sont la méthode recommandée depuis Python 3.6. Mets f devant la chaîne et utilise {variable} pour insérer des valeurs. Tu peux même faire des calculs: f'Double: {age*2}'"}
  ],
  quiz: { id:"q-py-2", questions:[
   {q:"Comment créer une variable en Python?", opts:["let x = 5","var x = 5","x = 5","int x = 5"], correct:2, exp:"En Python, on assigne simplement: nom = valeur. Pas de mot-clé nécessaire. Le type est déduit automatiquement."},
   {q:"Quel est le type d'une variable contenant 3.14?", opts:["int","str","float","double"], correct:2, exp:"3.14 est un float (nombre décimal) en Python. int est pour les entiers, float pour les décimaux."},
   {q:"Comment écrire un f-string en Python?", opts:['f"Bonjour {nom}"','"Bonjour ${nom}"','`Bonjour ${nom}`','"Bonjour " + nom'], correct:0, exp:'f"..." est la syntaxe des f-strings Python. On met f avant les guillemets et {variable} pour insérer une valeur.'},
   {q:"Quelle valeur représente 'rien' en Python?", opts:["null","undefined","void","None"], correct:3, exp:"None est l'équivalent Python de null. Il représente l'absence de valeur."},
   {q:"Python est un langage à typage...?", opts:["Statique","Dynamique","Fort","Faible"], correct:1, exp:"Python est à typage dynamique: le type est déterminé au moment de l'exécution, pas à la déclaration. Une variable peut changer de type."}
  ]}
 },
 {
  id: "py-3", trackId: "python", title: "Conditions", duration: 7, xp: 60,
  content: [
   {type:"text", text:"Python utilise if, elif et else pour les conditions. La syntaxe est plus lisible qu'en JavaScript: pas d'accolades, juste l'indentation. Notez elif au lieu de else if."},
   {type:"code", lang:"python", code:'note = 14\n\nif note >= 16:\n    print("Très bien!")\nelif note >= 14:\n    print("Bien")\nelif note >= 10:\n    print("Passable")\nelse:\n    print("Insuffisant")\n\n# Sortie: "Bien"'},
   {type:"heading", text:"Opérateurs logiques"},
   {type:"text", text:"Python utilise les mots and, or, not au lieu des symboles &&, ||, !. C'est plus lisible en anglais. On peut aussi utiliser in pour vérifier si une valeur est dans une liste."},
   {type:"code", lang:"python", code:'age = 17\npermis = False\n\n# and, or, not\nif age >= 18 and permis:\n    print("Tu peux conduire")\nelif age >= 17 or permis:\n    print("Accompagné seulement")\nelse:\n    print("Trop jeune")\n\n# Opérateur in\nfruits = ["pomme", "banane", "kiwi"]\nif "banane" in fruits:\n    print("La banane est dans la liste!")\n\n# not in\nif "fraise" not in fruits:\n    print("Pas de fraise!")'},
   {type:"tip", text:"En Python, and/or/not sont des mots-clés, pas des symboles. C'est une des choses qui rendent Python si lisible, presque comme de l'anglais naturel."}
  ],
  quiz: { id:"q-py-3", questions:[
   {q:"Quel mot-clé Python remplace 'else if'?", opts:["elseif","elsif","elif","else if"], correct:2, exp:"Python utilise elif (contraction de else if). C'est plus court et propre."},
   {q:"Quel opérateur vérifie si une valeur est dans une liste?", opts:["contains","includes","in","has"], correct:2, exp:"L'opérateur in vérifie l'appartenance: 'x in liste' retourne True si x est dans la liste."},
   {q:"Comment dit-on && en Python?", opts:["&&","and","AND","&"], correct:1, exp:"Python utilise and pour le ET logique. Or pour OU, not pour NON. Plus lisible que &&, ||, !"},
   {q:"Que retourne: 5 in [1, 2, 5, 8]?", opts:["1","True","False","5"], correct:1, exp:"5 in [1, 2, 5, 8] retourne True car 5 est bien dans la liste."},
   {q:"Python utilise des accolades {} pour délimiter les blocs if?", opts:["Oui","Non, il utilise l'indentation","Non, il utilise begin/end","Non, il utilise des crochets"], correct:1, exp:"Python utilise l'indentation (4 espaces) pour délimiter les blocs, pas les accolades. C'est une des particularités de Python."}
  ]}
 },
 {
  id: "py-4", trackId: "python", title: "Boucles", duration: 7, xp: 60,
  content: [
   {type:"text", text:"Python a deux types de boucles: for et while. La boucle for est très polyvalente et s'utilise souvent avec range() pour répéter N fois, ou directement sur une liste pour parcourir ses éléments."},
   {type:"code", lang:"python", code:'# Répéter 5 fois avec range()\nfor i in range(5):\n    print(f"Tour {i}")  # Tour 0 à Tour 4\n\n# range(début, fin, pas)\nfor i in range(1, 11, 2):\n    print(i)  # 1, 3, 5, 7, 9\n\n# Parcourir une liste\nprenoms = ["Alice", "Bob", "Charlie"]\nfor prenom in prenoms:\n    print(f"Bonjour {prenom}!")'},
   {type:"heading", text:"While et contrôle des boucles"},
   {type:"text", text:"La boucle while continue tant qu'une condition est vraie. break arrête la boucle, continue passe à l'itération suivante. enumerate() est très pratique pour avoir l'index en même temps."},
   {type:"code", lang:"python", code:'# Boucle while\ncompteur = 0\nwhile compteur < 5:\n    print(compteur)\n    compteur += 1  # compteur = compteur + 1\n\n# enumerate: index + valeur\nfruits = ["pomme", "kiwi", "mangue"]\nfor i, fruit in enumerate(fruits):\n    print(f"{i}: {fruit}")\n# 0: pomme, 1: kiwi, 2: mangue\n\n# break et continue\nfor n in range(10):\n    if n == 4:\n        continue  # Saute le 4\n    if n == 7:\n        break     # Arrête au 7\n    print(n)'},
   {type:"tip", text:"range(5) génère 0,1,2,3,4. range(1,6) génère 1,2,3,4,5. range(0,10,2) génère 0,2,4,6,8. Le dernier nombre est toujours exclu!"}
  ],
  quiz: { id:"q-py-4", questions:[
   {q:"Que génère range(4)?", opts:["1,2,3,4","0,1,2,3","0,1,2,3,4","1,2,3"], correct:1, exp:"range(4) génère 0, 1, 2, 3. Le dernier nombre est exclu. Pour avoir 1 à 4: range(1, 5)."},
   {q:"Comment parcourir une liste avec son index?", opts:["for i, v in range(liste)","for i, v in enumerate(liste)","for i to len(liste)","for(i=0; i<len; i++)"], correct:1, exp:"enumerate(liste) retourne des couples (index, valeur) à chaque itération."},
   {q:"Que fait += en Python?", opts:["Crée une variable","Additionne et réassigne: x += 1 équivaut à x = x + 1","Concatène des listes","Vérifie l'égalité"], correct:1, exp:"x += 1 est un raccourci pour x = x + 1. Il existe aussi -=, *=, /=, etc."},
   {q:"Comment s'écrit une boucle while infinie (à interrompre manuellement)?", opts:["while(1):","while True:","loop:","for ever:"], correct:1, exp:"while True: crée une boucle infinie. On l'arrête avec break ou Ctrl+C. Utile pour les menus interactifs."},
   {q:"Que fait continue dans une boucle?", opts:["Arrête la boucle","Repart du début de la boucle","Passe à l'itération suivante","Affiche la valeur courante"], correct:2, exp:"continue saute le reste du code de l'itération courante et passe directement à la suivante."}
  ]}
 },
 {
  id: "py-5", trackId: "python", title: "Fonctions", duration: 8, xp: 65,
  content: [
   {type:"text", text:"En Python, une fonction se définit avec le mot-clé def suivi du nom et des paramètres. L'indentation délimite le corps de la fonction. return envoie une valeur en retour."},
   {type:"code", lang:"python", code:'def saluer(prenom):\n    """Affiche un message de bienvenue."""\n    message = f"Bonjour {prenom}!"\n    return message\n\nresultat = saluer("Emma")\nprint(resultat)  # Bonjour Emma!\n\n# Paramètres par défaut\ndef puissance(base, exposant=2):\n    return base ** exposant\n\nprint(puissance(3))     # 9 (3²)\nprint(puissance(2, 10)) # 1024 (2¹⁰)'},
   {type:"heading", text:"Arguments positionnels et nommés"},
   {type:"text", text:"Python permet d'appeler les fonctions avec des arguments nommés (keyword arguments), ce qui rend le code plus lisible. On peut aussi définir des fonctions avec *args (variable d'arguments) pour accepter un nombre variable de paramètres."},
   {type:"code", lang:"python", code:'def profil(nom, age, ville="Paris"):\n    """Crée un profil utilisateur."""\n    return f"{nom}, {age} ans, vit à {ville}"\n\n# Arguments positionnels\nprint(profil("Léa", 22))\n\n# Arguments nommés (ordre libre)\nprint(profil(age=25, nom="Marc", ville="Lyon"))\n\n# Retourner plusieurs valeurs\ndef min_max(liste):\n    return min(liste), max(liste)\n\npetit, grand = min_max([3, 1, 8, 2])\nprint(f"Min: {petit}, Max: {grand}")'},
   {type:"tip", text:"Les docstrings (commentaires entre triple guillemets \"\"\" \"\"\") décrivent ce que fait la fonction. C'est une bonne pratique: help(ma_fonction) affichera ce texte."}
  ],
  quiz: { id:"q-py-5", questions:[
   {q:"Quel mot-clé définit une fonction en Python?", opts:["function","func","def","fn"], correct:2, exp:"def est le mot-clé Python pour définir une fonction. Syntaxe: def nom_fonction(paramètres):"},
   {q:"Qu'est-ce qu'un docstring?", opts:["Un type de commentaire ignoré","Documentation de fonction entre triple guillemets","Un string formaté","Un fichier de documentation"], correct:1, exp:"Un docstring (\"\"\"...\"\"\") documente une fonction. Il apparaît dans help() et est une bonne pratique."},
   {q:"Que retourne une fonction sans return?", opts:["0","False","None","Erreur"], correct:2, exp:"En Python, une fonction sans return (ou avec return seul) retourne automatiquement None."},
   {q:"Comment appeler une fonction avec des arguments nommés?", opts:["fn(1, 2)","fn(a=1, b=2)","fn{a:1, b:2}","fn[a=1, b=2]"], correct:1, exp:"fn(a=1, b=2) utilise des keyword arguments. L'ordre n'a plus d'importance, le code est plus lisible."},
   {q:"Que signifie exposant=2 dans def puissance(base, exposant=2)?", opts:["exposant doit valoir 2","2 est la valeur par défaut si non fournie","exposant est obligatoire","C'est une erreur de syntaxe"], correct:1, exp:"exposant=2 est un paramètre avec valeur par défaut. Si non fourni lors de l'appel, exposant vaudra 2."}
  ]}
 },
 {
  id: "py-6", trackId: "python", title: "Listes & dictionnaires", duration: 8, xp: 70,
  content: [
   {type:"text", text:"Les listes Python sont des collections ordonnées et modifiables. On les crée avec des crochets []. Les méthodes append(), remove(), pop() et sort() sont les plus utilisées."},
   {type:"code", lang:"python", code:'# Créer et utiliser une liste\nfruits = ["pomme", "banane", "kiwi"]\nfruits.append("mangue")      # Ajouter à la fin\nfruits.insert(1, "fraise")   # Insérer à l\'index 1\nfruits.remove("banane")      # Supprimer par valeur\ndernier = fruits.pop()       # Retire et retourne le dernier\n\nprint(fruits[0])    # "pomme" (premier)\nprint(fruits[-1])   # dernier élément\nprint(len(fruits))  # Longueur de la liste\n\n# Slice (sous-liste)\nprint(fruits[1:3])  # Éléments 1 et 2'},
   {type:"heading", text:"Dictionnaires"},
   {type:"text", text:"Les dictionnaires stockent des paires clé:valeur. Ils sont très utilisés pour représenter des objets avec des propriétés. On y accède via les clés."},
   {type:"code", lang:"python", code:'# Créer un dictionnaire\nplayer = {\n    "nom": "Alex",\n    "niveau": 5,\n    "xp": 1250,\n    "actif": True\n}\n\n# Accéder et modifier\nprint(player["nom"])        # "Alex"\nplayer["niveau"] = 6       # Modifier\nplayer["titre"] = "Pro"    # Ajouter\n\n# Méthodes utiles\nprint(player.keys())       # Toutes les clés\nprint(player.values())     # Toutes les valeurs\nprint(player.get("xp", 0)) # get avec défaut\n\n# Parcourir un dictionnaire\nfor cle, valeur in player.items():\n    print(f"{cle}: {valeur}")'},
   {type:"tip", text:"Utilisez .get('cle', valeur_defaut) pour accéder à une clé sans risque d'erreur KeyError. Si la clé n'existe pas, la valeur par défaut est retournée."}
  ],
  quiz: { id:"q-py-6", questions:[
   {q:"Quelle méthode ajoute un élément à la fin d'une liste?", opts:[".add()",".push()",".append()",".insert()"], correct:2, exp:"list.append(element) ajoute un élément à la fin de la liste. insert(index, element) l'insère à une position précise."},
   {q:"Comment accéder au dernier élément d'une liste?", opts:["liste[last]","liste[-1]","liste[len-1]","liste.last()"], correct:1, exp:"liste[-1] accède au dernier élément. -2 pour l'avant-dernier, etc. L'indexation négative est une feature Python très pratique."},
   {q:"Quelle structure stocke des paires clé:valeur?", opts:["Liste","Tuple","Set","Dictionnaire"], correct:3, exp:"Un dictionnaire (dict) stocke des données sous forme {clé: valeur}. Accès rapide via la clé."},
   {q:"Comment parcourir clés ET valeurs d'un dict?", opts:["for k, v in dict","for k, v in dict.items()","for k:v in dict","for dict(k,v)"], correct:1, exp:"dict.items() retourne des couples (clé, valeur). On les décompose avec for cle, valeur in dict.items()"},
   {q:"Que fait liste[1:4]?", opts:["Éléments aux index 1, 2, 3","Éléments aux index 1, 2, 3, 4","Supprime les éléments 1 à 4","Retourne la longueur"], correct:0, exp:"liste[1:4] est un slice qui retourne les éléments aux index 1, 2 et 3 (le 4 est exclu). Syntaxe: [début:fin]."}
  ]}
 }
],


"discord": [
 {
  id: "discord-1", trackId: "discord", title: "Introduction aux bots", duration: 5, xp: 60,
  content: [
   {type:"text", text:"Un bot Discord est un compte automatisé qui peut réagir à des messages, modérer un serveur, jouer de la musique, afficher des stats de jeux et bien plus. La plupart des bots populaires (MEE6, Dyno) sont créés avec discord.py (Python) ou discord.js (JavaScript)."},
   {type:"text", text:"Pour créer un bot, tu as besoin de: Python 3.8+, la bibliothèque discord.py, un compte Discord, et un serveur de test. Le bot a un 'token' secret qui lui permet de se connecter à Discord. Ne partage JAMAIS ton token!"},
   {type:"code", lang:"python", code:'# Installation\n# pip install discord.py\n\n# Vérifier l\'installation\nimport discord\nprint(discord.__version__)  # Devrait afficher 2.x.x\n\n# Structure basique d\'un bot\nimport discord\nfrom discord.ext import commands\n\nbot = commands.Bot(command_prefix="!", intents=discord.Intents.default())\n\n@bot.event\nasync def on_ready():\n    print(f"Bot connecté: {bot.user}")\n\nbot.run("TON_TOKEN_ICI")'},
   {type:"tip", text:"Stocke ton token dans un fichier .env et utilise python-dotenv pour le charger. Ne le mets JAMAIS directement dans ton code ni sur GitHub!"}
  ],
  quiz: { id:"q-discord-1", questions:[
   {q:"Quel langage utilise-t-on avec discord.py?", opts:["JavaScript","Java","Python","Ruby"], correct:2, exp:"discord.py est une bibliothèque Python. Il existe aussi discord.js pour JavaScript/Node.js."},
   {q:"Qu'est-ce que le token d'un bot Discord?", opts:["Son nom d'utilisateur","Une clé secrète d'authentification","Son ID unique","Son mot de passe Discord"], correct:1, exp:"Le token est une clé secrète qui permet au bot de s'authentifier auprès de Discord. Ne le partage jamais!"},
   {q:"Comment installe-t-on discord.py?", opts:["npm install discord.py","pip install discord.py","apt install discord.py","yarn add discord.py"], correct:1, exp:"pip est le gestionnaire de paquets Python. pip install discord.py installe la bibliothèque."},
   {q:"Quel événement est déclenché quand le bot se connecte?", opts:["on_connect","on_start","on_ready","on_login"], correct:2, exp:"on_ready est déclenché quand le bot est connecté et prêt à recevoir des événements."},
   {q:"Que signifie command_prefix='!'?", opts:["Le bot s'appelle !","Les commandes commencent par !","Le bot répond à tous les messages","C'est le token du bot"], correct:1, exp:"Le préfixe est le caractère qui précède une commande. Avec '!', les commandes s'écrivent !help, !ping, etc."}
  ]}
 },
 {
  id: "discord-2", trackId: "discord", title: "Ton premier bot", duration: 10, xp: 80,
  content: [
   {type:"text", text:"Avant de coder, il faut créer l'application bot sur le portail développeur Discord. Va sur discord.com/developers/applications, crée une nouvelle application, ajoute un Bot, et copie le token. Ensuite, génère un lien d'invitation avec les permissions nécessaires."},
   {type:"code", lang:"python", code:'import discord\nfrom discord.ext import commands\nimport os\nfrom dotenv import load_dotenv\n\nload_dotenv()  # Charge les variables du fichier .env\n\n# Configuration des intents\nintents = discord.Intents.default()\nintents.message_content = True  # Pour lire les messages\n\nbot = commands.Bot(\n    command_prefix="!",\n    intents=intents,\n    description="Mon super bot!"\n)\n\n@bot.event\nasync def on_ready():\n    print(f"Connecté en tant que {bot.user.name}")\n    print(f"ID: {bot.user.id}")\n    await bot.change_presence(\n        activity=discord.Game(name="CodeQuest")\n    )\n\nbot.run(os.getenv("DISCORD_TOKEN"))'},
   {type:"heading", text:"Les décorateurs @bot.event"},
   {type:"text", text:"Les événements Discord utilisent la syntaxe @bot.event avec des fonctions async. async/await est nécessaire car les opérations Discord sont asynchrones (réseau)."},
   {type:"code", lang:"python", code:'@bot.event\nasync def on_message(message):\n    # Ignorer les messages du bot lui-même\n    if message.author == bot.user:\n        return\n    \n    # Répondre à "bonjour"\n    if "bonjour" in message.content.lower():\n        await message.channel.send(\n            f"Bonjour {message.author.mention}! 👋"\n        )\n    \n    # IMPORTANT: traiter les commandes aussi\n    await bot.process_commands(message)'},
   {type:"tip", text:"N'oublie pas d'appeler await bot.process_commands(message) dans on_message, sinon les commandes préfixées ne fonctionneront plus!"}
  ],
  quiz: { id:"q-discord-2", questions:[
   {q:"Pourquoi utilise-t-on async/await avec discord.py?", opts:["C'est une convention","Les opérations Discord sont asynchrones","Python l'exige","Pour aller plus vite"], correct:1, exp:"Discord.py utilise asyncio car les requêtes réseau vers Discord sont asynchrones. async/await permet d'attendre ces opérations sans bloquer le programme."},
   {q:"Comment répondre dans un channel Discord?", opts:["message.send()","await channel.send()","await message.channel.send()","discord.send()"], correct:2, exp:"await message.channel.send('texte') envoie un message dans le channel où le message original a été reçu."},
   {q:"Pourquoi ignorer les messages du bot lui-même?", opts:["Le bot ne peut pas se lire","Pour éviter les boucles infinies","Pour des raisons de sécurité","Ce n'est pas nécessaire"], correct:1, exp:"Sans cette vérification, le bot pourrait répondre à ses propres messages et créer une boucle infinie."},
   {q:"Qu'est-ce que dotenv?", opts:["Une bibliothèque Discord","Un outil pour charger des variables d'environnement","Un éditeur de code","Un gestionnaire de base de données"], correct:1, exp:"python-dotenv charge les variables d'un fichier .env. Parfait pour stocker le token de façon sécurisée."},
   {q:"Comment mentionner un utilisateur dans un message?", opts:["user.name","user.mention","@user.id","mention(user)"], correct:1, exp:"message.author.mention retourne la mention formatée (@Utilisateur) qui notifie la personne dans Discord."}
  ]}
 },
 {
  id: "discord-3", trackId: "discord", title: "Les commandes", duration: 10, xp: 80,
  content: [
   {type:"text", text:"Les commandes préfixées s'écrivent avec @bot.command(). L'utilisateur les invoque avec le préfixe suivi du nom (ex: !ping). Tu peux ajouter des arguments en paramètres de la fonction."},
   {type:"code", lang:"python", code:'@bot.command(name="ping")\nasync def ping(ctx):\n    """Teste la latence du bot."""\n    latence = round(bot.latency * 1000)\n    await ctx.send(f"Pong! 🏓 {latence}ms")\n\n@bot.command(name="salut")\nasync def salut(ctx, *, nom: str = "ami"):\n    """Dit bonjour à quelqu\'un."""\n    await ctx.send(f"Salut {nom}! 👋")\n    # Utilisation: !salut Alex\n\n@bot.command(name="calcul")\nasync def calcul(ctx, a: int, b: int):\n    """Additionne deux nombres."""\n    await ctx.send(f"{a} + {b} = {a + b}")'},
   {type:"heading", text:"Gestion des erreurs"},
   {type:"text", text:"Il est important de gérer les erreurs de commandes. Le décorateur @commande.error capture les erreurs spécifiques à une commande. Ça évite que le bot plante et donne un retour à l'utilisateur."},
   {type:"code", lang:"python", code:'@bot.command()\nasync def diviser(ctx, a: float, b: float):\n    if b == 0:\n        await ctx.send("Impossible de diviser par 0!")\n        return\n    await ctx.send(f"Résultat: {a/b:.2f}")\n\n@diviser.error\nasync def diviser_error(ctx, error):\n    if isinstance(error, commands.MissingRequiredArgument):\n        await ctx.send("Utilisation: !diviser <nombre> <diviseur>")\n    elif isinstance(error, commands.BadArgument):\n        await ctx.send("Les arguments doivent être des nombres!")'}
  ],
  quiz: { id:"q-discord-3", questions:[
   {q:"Quel décorateur définit une commande prefixée?", opts:["@bot.command()","@command()","@discord.command()","@bot.on_command()"], correct:0, exp:"@bot.command() décore une fonction pour en faire une commande. L'utilisateur l'invoque avec le préfixe + nom."},
   {q:"Que représente 'ctx' dans une commande?", opts:["Le contexte (channel, auteur, message...)","Le token du bot","Une configuration","Le client Discord"], correct:0, exp:"ctx (context) contient toutes les infos sur l'invocation: ctx.author, ctx.channel, ctx.guild, etc."},
   {q:"Comment envoyer une réponse à une commande?", opts:["await ctx.reply()","await ctx.send()","await ctx.message.send()","ctx.send()"], correct:1, exp:"await ctx.send('message') envoie un message dans le channel où la commande a été invoquée."},
   {q:"Comment capturer les erreurs d'une commande spécifique?", opts:["try/except","@commande.error","@bot.on_error()","error_handler()"], correct:1, exp:"@nom_commande.error décore une fonction qui gère les erreurs de cette commande spécifique."},
   {q:"À quoi sert '* nom' dans les paramètres d'une commande?", opts:["Argument obligatoire","Capture tout le reste du message comme une string","Argument optionnel","Argument numérique"], correct:1, exp:"*, nom capture tout le reste de l'argument comme une seule chaîne. !salut Hello World donnera nom='Hello World'."}
  ]}
 },
 {
  id: "discord-4", trackId: "discord", title: "Les événements", duration: 8, xp: 75,
  content: [
   {type:"text", text:"Discord émet de nombreux événements auxquels ton bot peut réagir: arrivée d'un membre, suppression d'un message, ajout d'une réaction... Chaque événement a son propre nom et ses propres paramètres."},
   {type:"code", lang:"python", code:'@bot.event\nasync def on_member_join(member):\n    """Accueillir les nouveaux membres."""\n    channel = member.guild.system_channel\n    if channel:\n        embed = discord.Embed(\n            title=f"Bienvenue {member.name}!",\n            description="Content de t\'avoir parmi nous!",\n            color=discord.Color.green()\n        )\n        await channel.send(embed=embed)\n\n@bot.event\nasync def on_member_remove(member):\n    """Dire au revoir."""\n    channel = member.guild.system_channel\n    if channel:\n        await channel.send(f"Au revoir {member.name}... 😢")'},
   {type:"code", lang:"python", code:'@bot.event\nasync def on_message_delete(message):\n    """Logger les messages supprimés."""\n    log_channel = bot.get_channel(123456789)  # ID du channel de logs\n    if log_channel:\n        await log_channel.send(\n            f"Message supprimé de {message.author}: {message.content}"\n        )\n\n@bot.event\nasync def on_reaction_add(reaction, user):\n    """Réagir aux réactions."""\n    if str(reaction.emoji) == "⭐" and not user.bot:\n        await reaction.message.channel.send(\n            f"{user.name} a étoilé ce message!"\n        )'},
   {type:"tip", text:"Pour une liste complète des événements Discord, consulte la documentation discord.py. Il y en a des dizaines: on_guild_join, on_voice_state_update, on_typing, etc."}
  ],
  quiz: { id:"q-discord-4", questions:[
   {q:"Quel événement se déclenche quand quelqu'un rejoint le serveur?", opts:["on_user_join","on_member_join","on_join","on_guild_member_add"], correct:1, exp:"on_member_join(member) se déclenche quand un nouveau membre rejoint le serveur. member contient les infos de l'utilisateur."},
   {q:"Comment accéder au serveur (guild) depuis un membre?", opts:["member.server","member.guild","member.discord","guild.member"], correct:1, exp:"member.guild donne accès à l'objet Guild (serveur Discord) auquel appartient le membre."},
   {q:"Quel objet représente un serveur Discord en code?", opts:["Server","Community","Guild","Channel"], correct:2, exp:"En discord.py, un serveur Discord s'appelle un Guild. Weird mais c'est la terminologie officielle de l'API Discord."},
   {q:"Comment récupérer un channel par son ID?", opts:["bot.get_channel(id)","discord.get_channel(id)","guild.find_channel(id)","channel.get(id)"], correct:0, exp:"bot.get_channel(id) retourne l'objet Channel correspondant à l'ID. Retourne None si non trouvé ou non mis en cache."},
   {q:"Comment vérifier si un utilisateur est un bot?", opts:["user.is_bot","user.bot","user.type == 'bot'","user.bot_account"], correct:1, exp:"user.bot est un booléen qui vaut True si l'utilisateur est un bot. Utile pour ignorer les actions des autres bots."}
  ]}
 },
 {
  id: "discord-5", trackId: "discord", title: "Embeds & messages", duration: 8, xp: 75,
  content: [
   {type:"text", text:"Les embeds sont des messages riches avec titre, description, couleur, image, et champs structurés. Ils rendent ton bot beaucoup plus professionnel et lisible. On les crée avec discord.Embed()."},
   {type:"code", lang:"python", code:'@bot.command()\nasync def profil(ctx, membre: discord.Member = None):\n    membre = membre or ctx.author  # Si personne mentionné, soi-même\n    \n    embed = discord.Embed(\n        title=f"Profil de {membre.display_name}",\n        description="Membre du serveur",\n        color=discord.Color.blue()  # Couleur de la barre\n    )\n    \n    embed.set_thumbnail(url=membre.avatar.url)\n    embed.add_field(name="ID", value=membre.id, inline=True)\n    embed.add_field(name="Rejoint le", value=membre.joined_at.strftime("%d/%m/%Y"), inline=True)\n    embed.set_footer(text=f"Demandé par {ctx.author.name}")\n    \n    await ctx.send(embed=embed)'},
   {type:"code", lang:"python", code:'# Couleurs courantes\ndiscord.Color.red()\ndiscord.Color.green()\ndiscord.Color.gold()\ndiscord.Color.purple()\ndiscord.Color.from_rgb(255, 100, 0)  # Couleur custom\ndiscord.Color(0x58a6ff)               # Hex\n\n# Embed avec image\nembed.set_image(url="https://example.com/image.png")\n\n# Embed avec auteur\nembed.set_author(\n    name=ctx.author.name,\n    icon_url=ctx.author.avatar.url\n)'},
   {type:"tip", text:"Un embed peut avoir maximum 25 champs (fields). Les champs avec inline=True s'affichent côte à côte (3 par ligne). inline=False les place sur des lignes séparées."}
  ],
  quiz: { id:"q-discord-5", questions:[
   {q:"Comment créer un embed Discord?", opts:["discord.Message()","discord.Embed()","discord.RichText()","discord.Card()"], correct:1, exp:"discord.Embed() crée un embed. On lui ajoute des propriétés: title, description, color, fields, etc."},
   {q:"Comment ajouter un champ à un embed?", opts:["embed.field(name, value)","embed.add_field(name=n, value=v)","embed.fields.append()","embed[name] = value"], correct:1, exp:"embed.add_field(name='Titre', value='Contenu', inline=True/False) ajoute un champ structuré."},
   {q:"Que fait inline=True dans add_field?", opts:["Rend le champ obligatoire","Place les champs côte à côte","Cache le champ","Centre le texte"], correct:1, exp:"inline=True permet aux champs d'être affichés côte à côte (3 max par ligne). inline=False les empile verticalement."},
   {q:"Comment définir l'image miniature d'un embed?", opts:["embed.image = url","embed.set_thumbnail(url=url)","embed.thumbnail.url = url","embed.add_image(url)"], correct:1, exp:"embed.set_thumbnail(url=url) définit l'image miniature en haut à droite. set_image(url=url) met une grande image en bas."},
   {q:"Comment mettre une couleur personnalisée hex dans un embed?", opts:["color='#ff0000'","color=discord.Color(0xff0000)","color=0xff0000","Toutes ces réponses"], correct:3, exp:"Toutes ces syntaxes fonctionnent! discord.Color(0xff0000), discord.Color.from_rgb(), ou directement color=0xff0000."}
  ]}
 }
],


"react": [
 {
  id: "react-1", trackId: "react", title: "Introduction à React", duration: 5, xp: 55,
  content: [
   {type:"text", text:"React est une bibliothèque JavaScript créée par Facebook (Meta) pour construire des interfaces utilisateur. Son concept principal: diviser l'UI en composants réutilisables. Au lieu de manipuler le DOM directement, tu déclares ce que tu veux afficher et React s'occupe du reste."},
   {type:"text", text:"Pour démarrer rapidement avec React en 2024, utilise Vite. Il crée un projet React moderne en quelques secondes et offre un rechargement ultra-rapide."},
   {type:"code", lang:"javascript", code:'# Créer un projet React avec Vite\nnpm create vite@latest mon-app -- --template react\ncd mon-app\nnpm install\nnpm run dev\n\n# Structure créée:\n# mon-app/\n#   src/\n#     App.jsx      <- Composant principal\n#     main.jsx     <- Point d\'entrée\n#   index.html\n#   package.json'},
   {type:"tip", text:"React utilise JSX, une syntaxe qui ressemble à du HTML dans du JavaScript. C'est déroutant au début mais très puissant. Chaque fichier composant a l'extension .jsx"},
   {type:"code", lang:"javascript", code:'// App.jsx - Ton premier composant React\nfunction App() {\n  return (\n    <div>\n      <h1>Bonjour React!</h1>\n      <p>Mon premier composant.</p>\n    </div>\n  );\n}\n\nexport default App;'}
  ],
  quiz: { id:"q-react-1", questions:[
   {q:"Qui a créé React?", opts:["Google","Microsoft","Meta (Facebook)","Twitter"], correct:2, exp:"React a été créé par Facebook (maintenant Meta) et rendu open-source en 2013."},
   {q:"Quel outil moderne est recommandé pour créer un projet React?", opts:["create-react-app","Webpack","Vite","Parcel"], correct:2, exp:"Vite est l'outil recommandé en 2024. Il est beaucoup plus rapide que l'ancien create-react-app."},
   {q:"Que signifie JSX?", opts:["JavaScript XML","Java Syntax Extension","JavaScript Extra","JSON XML"], correct:0, exp:"JSX = JavaScript XML. C'est une extension syntaxique qui permet d'écrire du HTML-like dans du JavaScript."},
   {q:"Quelle extension ont les fichiers composants React?", opts:[".react",".rjs",".jsx",".html"], correct:2, exp:"Les fichiers composants React utilisent .jsx (ou .tsx pour TypeScript). Certains projets utilisent aussi .js."},
   {q:"Quel est le concept principal de React?", opts:["Manipulation directe du DOM","Composants réutilisables","Base de données frontend","Serveur web"], correct:1, exp:"React est basé sur les composants: des blocs UI réutilisables et indépendants. L'UI est une arborescence de composants."}
  ]}
 },
 {
  id: "react-2", trackId: "react", title: "Composants & JSX", duration: 8, xp: 65,
  content: [
   {type:"text", text:"Un composant React est une fonction JavaScript qui retourne du JSX. Par convention, les composants commencent par une majuscule. Le JSX ressemble au HTML mais avec quelques différences: class devient className, et toutes les balises doivent être fermées."},
   {type:"code", lang:"javascript", code:'// Composant simple\nfunction Titre() {\n  return <h1>Mon titre</h1>;\n}\n\n// Composant avec JSX multi-lignes (parenthèses obligatoires)\nfunction Carte() {\n  return (\n    <div className="carte">\n      <h2>Titre de la carte</h2>\n      <p>Description ici.</p>\n      <img src="photo.jpg" alt="Photo" />\n    </div>\n  );\n}\n\n// Utiliser les composants\nfunction App() {\n  return (\n    <div>\n      <Titre />\n      <Carte />\n      <Carte />  {/* Réutilisable! */}\n    </div>\n  );\n}'},
   {type:"heading", text:"Expressions JavaScript en JSX"},
   {type:"text", text:"Dans le JSX, tu peux insérer n'importe quelle expression JavaScript entre accolades {}. C'est ainsi qu'on affiche des variables, appelle des fonctions, ou conditionnellement affiche du contenu."},
   {type:"code", lang:"javascript", code:'function Profil() {\n  const nom = "Alex";\n  const age = 17;\n  const majeur = age >= 18;\n\n  return (\n    <div>\n      <h2>{nom}</h2>                    {/* Variable */}\n      <p>Âge: {age}</p>\n      <p>{age * 2} dans 2 fois son âge</p>  {/* Expression */}\n      {majeur && <span>✅ Majeur</span>}     {/* Conditionnel */}\n      {majeur ? <p>Adulte</p> : <p>Mineur</p>} {/* Ternaire */}\n    </div>\n  );\n}'},
   {type:"tip", text:"En JSX, utilise className au lieu de class (class est un mot réservé en JS). Les styles inline s'écrivent avec un objet: style={{color: 'red', fontSize: '16px'}}"}
  ],
  quiz: { id:"q-react-2", questions:[
   {q:"Comment écrire 'class' en JSX?", opts:["class","className","htmlClass","cssClass"], correct:1, exp:"JSX utilise className car class est un mot-clé JavaScript réservé. Pareil pour htmlFor au lieu de for."},
   {q:"Comment afficher une variable en JSX?", opts:["${variable}","{{variable}}","{variable}","(variable)"], correct:2, exp:"{variable} insère une expression JavaScript dans le JSX. Les {} délimitent tout code JS dans le JSX."},
   {q:"Un composant React doit commencer par...?", opts:["Une minuscule","Une majuscule","_","$"], correct:1, exp:"Les composants React commencent par une majuscule (Button, MyCard). Les minuscules sont réservées aux éléments HTML natifs."},
   {q:"Comment afficher conditionnellement un élément?", opts:["{if(cond) <El />}","cond && <El />","cond ? <El /> : null","Les deux dernières"], correct:3, exp:"On peut utiliser && (court-circuit) ou le ternaire pour l'affichage conditionnel. Les deux sont courants en React."},
   {q:"Que retourne un composant React?", opts:["Une chaîne HTML","Du JSX (qui sera converti en éléments React)","Un objet DOM","Rien"], correct:1, exp:"Un composant retourne du JSX. React le convertit ensuite en éléments virtuels puis met à jour le DOM réel."}
  ]}
 },
 {
  id: "react-3", trackId: "react", title: "Les Props", duration: 7, xp: 65,
  content: [
   {type:"text", text:"Les props (properties) permettent de passer des données d'un composant parent à un composant enfant. C'est comme les paramètres d'une fonction: elles rendent les composants réutilisables et configurables."},
   {type:"code", lang:"javascript", code:'// Définir un composant avec props\nfunction Bouton({ texte, couleur, onClick }) {\n  return (\n    <button\n      style={{ backgroundColor: couleur }}\n      onClick={onClick}\n    >\n      {texte}\n    </button>\n  );\n}\n\n// Utiliser le composant avec différentes props\nfunction App() {\n  return (\n    <div>\n      <Bouton texte="Valider" couleur="green" onClick={() => alert("OK!")} />\n      <Bouton texte="Annuler" couleur="red" onClick={() => alert("Annulé")} />\n    </div>\n  );\n}'},
   {type:"heading", text:"Props children"},
   {type:"text", text:"La prop spéciale children contient ce qui est placé entre les balises d'ouverture et fermeture d'un composant. Elle permet de créer des composants de layout flexibles."},
   {type:"code", lang:"javascript", code:'// Composant carte avec children\nfunction Carte({ titre, children }) {\n  return (\n    <div className="carte">\n      <h2>{titre}</h2>\n      <div className="contenu">\n        {children}  {/* Contenu passé entre les balises */}\n      </div>\n    </div>\n  );\n}\n\n// Utilisation\n<Carte titre="Ma carte">\n  <p>Ce paragraphe est dans children.</p>\n  <button>Cliquer</button>\n</Carte>'},
   {type:"tip", text:"Les props sont en lecture seule (immutables). Un composant ne doit jamais modifier ses propres props. Pour des données qui changent, on utilise le state (useState)."}
  ],
  quiz: { id:"q-react-3", questions:[
   {q:"À quoi servent les props?", opts:["Stocker l'état local","Passer des données parent → enfant","Faire des requêtes API","Créer des styles"], correct:1, exp:"Les props permettent de passer des données d'un composant parent à ses enfants. Elles rendent les composants réutilisables."},
   {q:"Comment récupérer les props dans un composant?", opts:["this.props","useState(props)","function Comp(props) ou destructuration","getProps()"], correct:2, exp:"On peut utiliser function Comp(props) et accéder à props.nom, ou directement destructurer: function Comp({nom, age})."},
   {q:"Les props sont...?", opts:["Modifiables par l'enfant","En lecture seule (immutables)","Partagées entre tous","Optionnelles toujours"], correct:1, exp:"Les props sont immutables: un composant ne peut pas modifier ses propres props. Pour les données dynamiques, on utilise useState."},
   {q:"Qu'est-ce que la prop 'children'?", opts:["Les sous-composants créés","Le contenu entre les balises du composant","Les props du composant parent","Les styles CSS"], correct:1, exp:"children est le contenu entre les balises d'ouverture et fermeture. <Comp>ce contenu = children</Comp>"},
   {q:"Comment passer une fonction comme prop?", opts:["<Comp fn={maFonction} />","<Comp fn='maFonction' />","<Comp fn=maFonction />","<Comp fn=(maFonction) />"], correct:0, exp:"<Comp fn={maFonction} /> passe la référence de la fonction. Pour une fonction inline: fn={() => alert('!')}"}
  ]}
 },
 {
  id: "react-4", trackId: "react", title: "useState", duration: 8, xp: 70,
  content: [
   {type:"text", text:"useState est le hook React le plus fondamental. Il permet d'ajouter un état local à un composant. Quand l'état change, React re-rend automatiquement le composant avec les nouvelles valeurs."},
   {type:"code", lang:"javascript", code:'import { useState } from "react";\n\nfunction Compteur() {\n  // [valeur, fonction pour la changer]\n  const [count, setCount] = useState(0); // 0 = valeur initiale\n\n  return (\n    <div>\n      <p>Compteur: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n      <button onClick={() => setCount(count - 1)}>-1</button>\n      <button onClick={() => setCount(0)}>Reset</button>\n    </div>\n  );\n}'},
   {type:"heading", text:"State et re-render"},
   {type:"text", text:"Chaque appel à la fonction setter (setCount, setNom...) déclenche un re-render du composant. React recalcule le JSX avec la nouvelle valeur et met à jour seulement ce qui a changé dans le DOM."},
   {type:"code", lang:"javascript", code:'import { useState } from "react";\n\nfunction Formulaire() {\n  const [nom, setNom] = useState("");\n  const [email, setEmail] = useState("");\n  const [envoyé, setEnvoyé] = useState(false);\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log({ nom, email });\n    setEnvoyé(true);\n  };\n\n  if (envoyé) return <p>✅ Envoyé! Merci {nom}.</p>;\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom" />\n      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />\n      <button type="submit">Envoyer</button>\n    </form>\n  );\n}'},
   {type:"tip", text:"Ne modifie jamais le state directement (count++ est interdit). Utilise toujours la fonction setter: setCount(count + 1). Sinon React ne détecte pas le changement et ne re-rend pas."}
  ],
  quiz: { id:"q-react-4", questions:[
   {q:"Comment importer useState?", opts:["import useState from 'react'","import { useState } from 'react'","const useState = require('react')","import React.useState"], correct:1, exp:"useState est un export nommé. On l'importe avec les accolades: import { useState } from 'react'."},
   {q:"Que retourne useState(0)?", opts:["La valeur 0","[valeur, setter]","Un objet","Une fonction"], correct:1, exp:"useState retourne un tableau [valeur, fonction setter]. On le destructure: const [count, setCount] = useState(0)."},
   {q:"Quand React re-rend un composant?", opts:["Toutes les secondes","Quand les props ou le state changent","Quand la page se recharge","Jamais automatiquement"], correct:1, exp:"React re-rend un composant automatiquement quand ses props ou son state changent."},
   {q:"Est-il correct de faire: count++ pour modifier le state?", opts:["Oui","Non, utiliser setCount(count + 1)","Oui si dans un useEffect","Oui avec let state"], correct:1, exp:"count++ ne déclenche pas de re-render car React ne détecte pas le changement. Il faut toujours utiliser la fonction setter."},
   {q:"Que fait e.preventDefault() dans un formulaire?", opts:["Efface le formulaire","Empêche le rechargement de page par défaut","Valide le formulaire","Envoie les données"], correct:1, exp:"e.preventDefault() empêche le comportement par défaut du formulaire (rechargement de la page). Indispensable pour les formulaires React."}
  ]}
 },
 {
  id: "react-5", trackId: "react", title: "useEffect", duration: 8, xp: 70,
  content: [
   {type:"text", text:"useEffect permet d'effectuer des 'side effects' (effets de bord) dans les composants: requêtes API, abonnements, manipulation du DOM, timers... Il s'exécute après le rendu du composant."},
   {type:"code", lang:"javascript", code:'import { useState, useEffect } from "react";\n\nfunction Utilisateurs() {\n  const [users, setUsers] = useState([]);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    // S\'exécute après le premier rendu\n    fetch("https://jsonplaceholder.typicode.com/users")\n      .then(res => res.json())\n      .then(data => {\n        setUsers(data);\n        setLoading(false);\n      });\n  }, []); // [] = ne s\'exécute qu\'une fois\n\n  if (loading) return <p>Chargement...</p>;\n  return (\n    <ul>\n      {users.map(u => <li key={u.id}>{u.name}</li>)}\n    </ul>\n  );\n}'},
   {type:"heading", text:"Dépendances et cleanup"},
   {type:"text", text:"Le tableau de dépendances contrôle quand useEffect se relance. [] = une seule fois, [variable] = à chaque changement de variable. La fonction de cleanup évite les memory leaks."},
   {type:"code", lang:"javascript", code:'// useEffect avec dépendance\nfunction Recherche({ query }) {\n  const [résultats, setRésultats] = useState([]);\n\n  useEffect(() => {\n    if (!query) return;\n    // Se relance à chaque changement de query\n    fetch(`/api/search?q=${query}`)\n      .then(r => r.json())\n      .then(setRésultats);\n  }, [query]); // Dépendance\n\n  return <ul>{résultats.map(r => <li key={r.id}>{r.title}</li>)}</ul>;\n}\n\n// Cleanup avec timer\nuseEffect(() => {\n  const timer = setInterval(() => setTime(Date.now()), 1000);\n  return () => clearInterval(timer); // Cleanup!\n}, []);'},
   {type:"tip", text:"Oublie pas le tableau de dépendances []. Sans lui, useEffect s'exécute après chaque re-render (boucle infinie possible). Avec [], une seule fois au montage."}
  ],
  quiz: { id:"q-react-5", questions:[
   {q:"Quand s'exécute useEffect?", opts:["Avant le rendu","Après le rendu","Pendant le rendu","Seulement au clic"], correct:1, exp:"useEffect s'exécute après que React ait rendu le composant et mis à jour le DOM."},
   {q:"Que signifie [] dans useEffect(fn, [])?", opts:["Ne jamais exécuter","Exécuter une seule fois au montage","Exécuter à chaque rendu","Exécuter en continu"], correct:1, exp:"[] comme tableau de dépendances vide signifie 'exécuter une seule fois après le premier rendu'. Équivalent de componentDidMount."},
   {q:"À quoi sert la fonction de cleanup (return)?", opts:["Retourner une valeur","Nettoyer les effets (timers, abonnements) au démontage","Réinitialiser le state","Afficher un écran de chargement"], correct:1, exp:"La fonction retournée par useEffect s'exécute au démontage du composant. Elle nettoie les effets comme les timers et les event listeners."},
   {q:"Si useEffect dépend de 'query', comment l'écrire?", opts:["useEffect(fn)","useEffect(fn, [])","useEffect(fn, [query])","useEffect(fn, query)"], correct:2, exp:"useEffect(fn, [query]) se re-exécute à chaque changement de la variable query."},
   {q:"Quel hook fait des requêtes API au chargement d'un composant?", opts:["useState","useEffect","useFetch","useAPI"], correct:1, exp:"useEffect avec [] est le pattern standard pour faire des requêtes API au chargement d'un composant."}
  ]}
 }
]

}; // fin LESSONS


// ===== GAMES =====
const GAMES = [
 // Bug Hunt
 {
  id: "game-bug-1", type: "bug-hunt", title: "Bug HTML",
  icon: "🔍", xp: 40, difficulty: "Facile",
  desc: "Trouve la ligne qui contient l'erreur dans ce code HTML",
  code: ['<!DOCTYPE html>', '<html lang="fr">', '<head>', '  <meta charset="UTF-8">', '  <title>Ma Page</title>', '</head>', '<body>', '  <h1>Titre</h1>', '  <p>Un paragraphe.', '  <a href="">Lien</a>', '</body>', '</html>'],
  bugLine: 8, bugExplanation: 'La balise <p> n\'est pas fermée! Il manque </p> à la fin du paragraphe.'
 },
 {
  id: "game-bug-2", type: "bug-hunt", title: "Bug CSS",
  icon: "🔍", xp: 40, difficulty: "Facile",
  desc: "Ce style CSS a une erreur, saurais-tu la trouver?",
  code: ['.bouton {', '  background-color: blue;', '  coleur: white;', '  padding: 10px 20px;', '  border-radius: 5px;', '  font-size: 16px;', '}'],
  bugLine: 2, bugExplanation: '"coleur" n\'est pas une propriété CSS valide. La bonne propriété est "color".'
 },
 {
  id: "game-bug-3", type: "bug-hunt", title: "Bug JavaScript",
  icon: "🔍", xp: 50, difficulty: "Moyen",
  desc: "Ce code JavaScript ne fonctionne pas comme prévu, trouve le bug!",
  code: ['function estMajeur(age) {', '  if (age => 18) {', '    return "Majeur";', '  } else {', '    return "Mineur";', '  }', '}'],
  bugLine: 1, bugExplanation: 'Ligne 2: => est une arrow function, pas un opérateur de comparaison! Il faut >= pour "supérieur ou égal".'
 },
 {
  id: "game-bug-4", type: "bug-hunt", title: "Bug Python",
  icon: "🔍", xp: 50, difficulty: "Moyen",
  desc: "Ce code Python produit une erreur. Quelle ligne est problématique?",
  code: ['def calculer_moyenne(notes):', '    total = 0', '    for note in notes:', '        total += note', '    moyenne = total / len(notes)', '  return moyenne', ''],
  bugLine: 5, bugExplanation: 'L\'indentation est incorrecte! "return moyenne" doit être aligné avec "total = 0" (4 espaces), pas 2.'
 },
 // Fill in the Blank
 {
  id: "game-fill-1", type: "fill-blank", title: "HTML: Structure de base",
  icon: "✏️", xp: 45, difficulty: "Facile",
  desc: "Complète la structure HTML de base",
  template: '<!_____ html>\n<html lang="fr">\n<_____>\n  <meta charset="UTF-8">\n  <title>Ma page</title>\n</_____>\n<_____>\n  <h1>Bonjour!</h1>\n</_____>\n</html>',
  blanks: ['DOCTYPE', 'head', 'head', 'body', 'body'],
  hints: ['Déclaration du type de document', 'Section des métadonnées', 'Fermeture de la section métadonnées', 'Section visible de la page', 'Fermeture de la section visible']
 },
 {
  id: "game-fill-2", type: "fill-blank", title: "CSS: Flexbox centré",
  icon: "✏️", xp: 45, difficulty: "Facile",
  desc: "Complète le CSS pour centrer un élément",
  template: '.centre {\n  display: _____;\n  justify-_____: center;\n  align-_____: center;\n  height: _____vh;\n}',
  blanks: ['flex', 'content', 'items', '100'],
  hints: ['Valeur qui active Flexbox', 'Partie du nom de propriété qui aligne sur l\'axe principal', 'Partie du nom pour l\'axe secondaire', 'Valeur pour prendre toute la hauteur']
 },
 {
  id: "game-fill-3", type: "fill-blank", title: "JS: Fonction de calcul",
  icon: "✏️", xp: 55, difficulty: "Moyen",
  desc: "Complète cette fonction JavaScript",
  template: '_____ calculer(a, b, operation) {\n  if (operation _____ "addition") {\n    _____ a + b;\n  } else if (operation === "multiplication") {\n    return a _____ b;\n  }\n}',
  blanks: ['function', '===', 'return', '*'],
  hints: ['Mot-clé pour déclarer une fonction', 'Opérateur de comparaison stricte', 'Mot-clé pour renvoyer une valeur', 'Opérateur de multiplication']
 },
 {
  id: "game-fill-4", type: "fill-blank", title: "Python: Boucle et liste",
  icon: "✏️", xp: 55, difficulty: "Moyen",
  desc: "Complète ce code Python",
  template: 'nombres = [1, 2, 3, 4, 5]\ntotal = _____\n\n_____ nombre in nombres:\n    total _____ nombre\n\nprint(f"Total: {_____}")' ,
  blanks: ['0', 'for', '+=', 'total'],
  hints: ['Valeur initiale du total', 'Mot-clé pour la boucle', 'Opérateur d\'addition et réassignation', 'Variable à afficher']
 },
 // Code Arrange
 {
  id: "game-arrange-1", type: "arrange", title: "HTML: Page complète",
  icon: "🔀", xp: 60, difficulty: "Moyen",
  desc: "Remets ces lignes dans le bon ordre",
  lines: ['<!DOCTYPE html>', '<html lang="fr">', '<head>', '<title>Ma Page</title>', '</head>', '<body>', '<h1>Bonjour!</h1>', '</body>', '</html>'],
  solution: [0, 1, 2, 3, 4, 5, 6, 7, 8]
 },
 {
  id: "game-arrange-2", type: "arrange", title: "JS: Fonction de tri",
  icon: "🔀", xp: 65, difficulty: "Moyen",
  desc: "Arrange les lignes pour créer une fonction valide",
  lines: ['function trouverMax(tableau) {', '  let max = tableau[0];', '  for (const val of tableau) {', '    if (val > max) {', '      max = val;', '    }', '  }', '  return max;', '}'],
  solution: [0, 1, 2, 3, 4, 5, 6, 7, 8]
 },
 {
  id: "game-arrange-3", type: "arrange", title: "Python: Calculatrice",
  icon: "🔀", xp: 65, difficulty: "Moyen",
  desc: "Remets ce code Python dans l'ordre correct",
  lines: ['def calculatrice(a, b, op):', '    if op == "+":', '        return a + b', '    elif op == "-":', '        return a - b', '    else:', '        return None', 'résultat = calculatrice(10, 5, "+")', 'print(f"Résultat: {résultat}")'],
  solution: [0, 1, 2, 3, 4, 5, 6, 7, 8]
 }
];

