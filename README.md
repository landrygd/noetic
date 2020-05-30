# Noetic

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)  [![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](http://forthebadge.com)

Noetic est une plateforme d'histoires interactives avec des tchats.
Son éditeur intégré permet via des commandes:
- de poser des questions pour laisser au joueur le choix de la poursuite de son aventure.
- de gérer des variables (précédé d'un "$") comme par exemple dans le message: "je m'apelle $nom"
- de jouer des sons, musiques, ambiances exemple: "/sound dog"
- et bien d'autres fonctionnalités...

## Pour commencer

La stucture du projet se présente sous la forme suivante:
- Le répertoire Ionic contient l'application Ionic
- Le répertoire www contient la landing page

Je vous invite à vous renseigner sur le fonctionnement des frameworks Angular, Ionic et d'avoir un bon niveau en javascript pour comprendre le projet

### Pré-requis

- Node v12+
- Ionic v5+
- Angular v9+
- Firebase v8+

### Installation

Il faut préalablement avoir installé [Node.js](https://nodejs.org/en/download/)
Puis installez les dépendances npm prérequis avec les commandes suivantes:
```bash
npm install -g @angular/cli
npm install -g @ionic/cli
ng add @angular/fire
npm i ngx-image-cropper
npm install @ngx-translate/core --save
ionic cordova plugin add cordova-sqlite-storage
npm install --save @ionic/storage
ionic cordova plugin add cordova-plugin-x-socialsharing
npm install @ionic-native/social-sharing
ionic cordova plugin add cordova-plugin-network-information
npm install @ionic-native/network
ionic cordova plugin add cordova-plugin-googleplus
npm install @ionic-native/google-plus
ionic cordova plugin add cordova-plugin-facebook4
npm install @ionic-native/facebook
ionic cordova plugin add cordova-plugin-local-notification
npm install @ionic-native/local-notifications
```

## Démarrage

Depuis la racine du projet, entrez les commandes suivantes:
```bash
cd ionic
ionic serve
```
Une fenêtre de votre navigateur devrait alors s'ouvrir automatiquement sur la page: http://localhost:8100/

## Fabriqué avec

* [Ionic](https://ionicframework.com/) - Framework pour application hybride (web, android, IOS, Windows, MacOS et Linux)
* [Angular](https://angular.io/) - Framework front-end
* [Node.js](https://nodejs.org/en/) - Développement en temps réel sur serveur local en JavaScript
* [Firebase](https://firebase.google.com/) - Backend noSQL
* [Cordova](https://cordova.apache.org/) - Exportation natif sur mobile
* [NWJS](https://nwjs.io/) - Exportation natif sur ordinateur
* [VSCode](https://code.visualstudio.com/) - Editeur de textes

## Contribuer

Si vous souhaitez contribuer, vous pouvez nous contacter sur le [serveur Discord de Blockup](https://discord.gg/FUmcynX).

## Versions
Listez les versions ici 
_exemple :_
**Dernière version stable :** 0.0.3
**Dernière version :** 5.1
Liste des versions : [Cliquer pour afficher](https://github.com/landry42/neotic/tags)

## Auteurs

* **Landry Valetoux** _alias_ [@landry42](https://github.com/landry42)

Lisez la liste des [contributeurs](https://github.com/landry42/neotic/contributors) pour voir qui à aidé au projet !


## License

Ce projet est sous licence ``MIT`` - voir le fichier [LICENSE.md](LICENSE.md) pour plus d'informations
