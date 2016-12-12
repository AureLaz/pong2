//Donne la bonne requette d'animation à la page.
var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60)
};
//Fonction qui récupère les touches du clavier saisies
var keysDown = {};
window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});
window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});
//Création de mon canvas 
var canvas = document.createElement('canvas');
var width = 900;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
window.onload = function () {
    document.body.appendChild(canvas);
    animate(recharge);
};
//Fonction qui va recharger tous les éléments
var recharge = function () {
    update();
    render();
    animate(recharge);
};
//Fonction qui uptade la position de mes éléments
var update = function () {
    balle.update(ordinateur.raquette, joueur.raquette);
    joueur.update();
    ordinateur.update(balle);
};
//fonction qui prend la taille la position et la couleur des éléments
var render = function () {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
    joueur.render();
    ordinateur.render();
    balle.render();
};
//Fonction qui modifie la position de la raquette de l'ordinateur en fonction de la position du milieu de la balle
Ordinateur.prototype.update = function (ball) {
    var y_pos = balle.y - 30;
    var diff = -((this.raquette.y + (this.raquette.width / 2)) - y_pos);
    //Vitesse maximale au top
    if (diff < 0 && diff < -5) {
        diff = -6;
    }
    //Vitesse maximale au bottom
    else if (diff > 0 && diff > 5) {
        diff = 6;
    }
    this.raquette.move(0, diff);
    if (this.raquette.y < 0) {
        this.raquette.y = 0;
    }
    else if (this.raquette.y + this.raquette.width > 900) {
        this.raquette.y = 900 - this.raquette.width;
    }
};
//Fonction qui modifie la position de la raquette en fonction de la touche appuyée
Joueur.prototype.update = function () {
    for (var key in keysDown) {
        var value = Number(key);
        //Déplacement vers le haut
        if (value == 40) {
            this.raquette.move(0, +6);
            //Déplacement vers le bas
        }
        else if (value == 38) {
            this.raquette.move(0, -6);
        }
        else {
            this.raquette.move(0, 0);
        }
    }
};
Raquette.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    //Si il se trouve tout en haut
    if (this.y < 0) {
        this.y = 0;
        this.y_speed = 0;
    }
    //Si il se trouve tout en bas
    else if (this.y + this.height > 600) {
        this.y = 600 - this.height;
        this.y_speed = 0;
    }
};
//Fonction qui initialise une raquette
function Raquette(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}
//Fonction qui prend la taile la position et la couleur de la raquette
Raquette.prototype.render = function () {
    context.fillStyle = "#FFFFFF";
    context.fillRect(this.x, this.y, this.width, this.height);
};
//Crée la raquette pour le joueur
function Joueur() {
    this.raquette = new Raquette(20, 230, 10, 70);
}
//Crée la raquette pour l'ordinateur
function Ordinateur() {
    this.raquette = new Raquette(870, 230, 10, 70);
}
//Rend la raquette joueur visible
Joueur.prototype.render = function () {
    this.raquette.render();
};
//Rend la raquette ordinateur visible
Ordinateur.prototype.render = function () {
    this.raquette.render();
};
//Fonction qui initialise la balle
function Balle(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 3;
    this.y_speed = 0;
    this.radius = 7;
}
//Fonction qui prend la position du centre de la balle le radius sa couleur 
Balle.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "#FFFFFF";
    context.fill();
};
//Création des variables
var joueur = new Joueur();
var ordinateur = new Ordinateur();
var balle = new Balle(450, 283);
//Fonction qui change le x et le y avec la vitesse et les colisions
Balle.prototype.update = function (raquette1, raquette2) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x + 7;
    var top_y = this.y + 7;
    var bottom_x = this.x - 7;
    var bottom_y = this.y - 7;
    //Rebond quand la balle touche le haut et le bas de l'ecran
    if (this.y - 7 < 0) {
        this.y = 7;
        this.y_speed = -this.y_speed;
    }
    else if (this.y + 7 > 600) {
        this.y = 593;
        this.y_speed = -this.y_speed;
    }
    //Quand la balle sort à droite et à gauche retour au milieu du terrain
    if (this.x < 0) {
        this.x_speed = 3;
        this.y_speed = 0;
        this.x = 450;
        this.y = 283;
    }
    else if (this.x > 900) {
        this.x_speed = -3;
        this.y_speed = 0;
        this.x = 450;
        this.y = 283;
    }
    //Si on se trouve du côté de l'ordinateur
    if (top_x > 450) {
        if (top_x >= raquette1.x && top_y < (raquette1.y + raquette1.height) && bottom_y > raquette1.y) {
            this.x_speed = -3;
            this.y_speed += (raquette1.y_speed / 2);
            this.x += this.x_speed;
        }
    }
    //Si on se trouve du côté du joueur
    if (top_x < 37) {
        if (top_x > raquette2.x && top_y < (raquette2.y + raquette2.height) && bottom_y > raquette2.y) {
            this.x_speed = 3;
            this.y_speed += (raquette2.y_speed / 2);
            this.x += this.x_speed;
        }
    }
};