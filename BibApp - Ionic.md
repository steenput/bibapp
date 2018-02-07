# BibApp - Journal de bord

*Steven Liatti - projet de semestre*

À travers ce petit journal, je vais lister (un peu en vrac), les ressources que j'ai consultées et les codes exemples/tests que j'aurai réalisés. Il m'aidera pour la rédaction du "tuto Ionic" et pour la rédaction finale de mon rapport de projet de semestre. 

Comme Ionic dépend d'autres frameworks/conventions, j'ai du un peu me documenter sur eux. Tout en lisant/essayant, je pensais également à la suite, c'est-à-dire la partie back-end/authentification/base de données, c'est pour cela que certaines parties de ce journal font mention de ce genre concepts.

*Ce journal a été rédigé avec [Typora](https://typora.io/), un éditeur Markdown vraiment efficace et stylisé.*



[TOC]



## Bases ante Ionic

Pour appréhender Ionic, il m'a fallut me documenter/avoir un aperçu d'autres technologies.



### Angular 4

[Angular](https://angular.io/) est un framework front-end Javascript développé par Google. Il impose une architecture de modules, où, pour chaque module, sont définis des fichiers HTML pour la structure (avec une syntaxe ajoutée, voir plus loin), des fichiers CSS (ou autres préprocesseurs CSS comme [Sass](http://sass-lang.com/)) et des fichiers composants écrits en Typescript, gérant la logique "métier".

#### Syntaxe HTML

```html
<input [value]="firstName">
<button (click)="someFunction($event)">
<p>Hi, {{ name }} {{ 1 + 1 }}</p>
<input [(ngModel)]="name">
<p #myParagraph></p>
<section *ngIf="showSection">
<li *ngFor="let item of items">
```

Descriptif ligne par ligne :

1. Change la propriété `value` en lui attribuant la vraie valeur de l'attribut de classe `firstName` (définit dans une classe Typescript)
2. Appèle la fonction `someFunction()` en lui passant l'événement `$event` au moment du clic sur le bouton
3. Évalue les expressions entre `{}` et les afficher, ici en l'occurence un attribut `name` et le calcul de `1 + 1`, 2
4. Applique la valeur de `name` à l'input, mais si il y a changement de la part de l'utilisateur, met à jour l'objet associé
5. Crée une variable locale au template HTML
6. `*ngIf` : supprime l'élément du DOM (ici `section`) si la condition n'est pas remplie
7. `*ngFor` : boucle sur un tableau et répète l'élément du DOM



### Typescript

Angular fait usage de Typescript, une surcouche à Javascript, offrant des types vérifés à la "compilation" (car Typescript est traduit, "transpiled", vers du Javascript conventionnel) et non à l'exécution, évitant de nombreuses erreurs, et offrant aussi plus de rigueur à l'écriture du code ([Petite explication sur stackoverflow](https://stackoverflow.com/questions/12694530/what-is-typescript-and-why-would-i-use-it-in-place-of-javascript/12694578#12694578), [Doc site officiel](http://www.typescriptlang.org/docs/home.html)).


```typescript
function add(x : number, y : number) : number {
    return x + y;
}
add('a', 'b'); // compiler error
```
Exemple d'une classe :
```typescript
class Greeter {
    greeting: string;
    constructor (message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}
```

La structure basique des fichiers composants Typescript avec Angular est semblable à ceci :

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'my-app'
})
export class AppComponent {
  title = 'My App';
}
```

On importe le composant `Component`, on définit le sélecteur utilisé dans le HTML pour faire le rendu et on définit notre classe `AppComponent` qui pourra être exportée dans d'autres modules. Dans cette classe nous définissons un attribut `title`.



### Promises

Je suis tombé à plusieurs reprises sur le concept de "promises" ou "promesses" en français, c'est une technique pour réaliser des traitements de façon asynchrone. J'en aurais sûrement besoin lors des communications avec le serveur. Apparement c'est plus puissant et propre que les callbacks classiques ([Doc Mozilla sur les Promises](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise)).



## Ionic 3

### Installation

Tout d'abord, comme pour Angular, Ionic nécessite [Node.js](https://nodejs.org/en/), un serveur Javascript et [npm](https://www.npmjs.com/), un gestionnaire de paquets/dépendances Javascript. Une fois npm installé, il suffit d'entrer la commande suivante dans un terminal :

```shell
npm install -g ionic cordova
```

Cela installe Ionic et [Cordova](https://cordova.apache.org/), l'outil permettant de traduire une web app à base de HTML, CSS et Javascript en application hybride (moitié native, moitié web) pour la plateforme choisie (Android, iOS, etc.). Pour créer un nouveau projet, il faut alors faire ceci :

```shell
ionic start myapp
cd myapp
ionic serve
```



### Navigation

Ionic utilise un système de pile pour la navigation entre ses pages. Selon si on la page suivante a une relation semblable à celle "parent-enfant", ça vaut la peine de "push" la nouvelle page sur la première, pour facilement y revenir : par exemple, une liste d'articles, avec pour chaque article la possibilité de naviguer vers lui, il semble naturel de pouvoir facilement revenir à la liste des articles. Au contraire, si on change de section sur notre application ou si les deux pages n'ont pas de lien direct entre elles, il vaut mieux changer la `root page`, autrement dit, la "page racine". [Tuto sur la navigation](https://www.joshmorony.com/a-simple-guide-to-navigation-in-ionic-2/), [Page de doc sur la navigation](http://ionicframework.com/docs//intro/tutorial/navigation/)



### HTTP

Angular fournit un composant HTTP, utilisable dans Ionic, pour faire des requêtes asynchrones. Exemple ici d'une requête `GET`. La fonction `map` applique pour chaque élément des données reçues (un tableau par exemple) la fonction passée en argument et retourne un `Observable`. Ici on parse les données JSON reçues. Ensuite, dans `subscribe`, trois cas de figure :

1. Soit on accède aux données lorsqu'elles sont "prêtes"
2. Si la requête a échoué, on affiche un message d'erreur (dans le cas présent)
3. Enfin, on exécute les instructions dans tous les cas de figure

```typescript
this.http.get('http://example.com/api')
.map(res => res.json())
.subscribe(
  data => {
    // process data
  },
  err => {
    console.log("Error : ", err);
  },
  () => {
    // finally block
  }
);
```



### Ionic Storage

Ionic fournit une méthode simple pour stocker des données sour forme de paires clé/valeur sur le client local, que ce soit dans le navigateur ou dans l'application mobile. Une utilisation possible est de déclarer une classe qui fait appel à `storage` de la manière suivante :

```typescript
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class DataProvider {

  constructor(private storage: Storage) {}

  getPairs() {
    let pairs = [];
    this.storage.forEach((v, k) => {
      comments.push({key: k, value: v});
    });
    return pairs;
  }

  get(key: string) {
    return this.storage.get(key);
  }
 
  set(key: string, data: string) {
    this.storage.set(key, data);
  }

}
```



