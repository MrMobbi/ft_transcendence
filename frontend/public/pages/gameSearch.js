import { getLang } from "../js/utils/getLang.js";

export default function gameSearch() {
    const lang = getLang();

    let langdict = JSON.parse(`{
        "FR": {
            "pendinggames": "Jeux en Attente",
            "gamecreation": "Créer un Jeu",
            "createlocal": "Créer un Jeu en Local",
            "createremote": "Créer un Jeu en Remote",
            "createtournament": "Créer un Tournois",
            "search": "Chercher un Jeu"
        },
        "EN": {
            "pendinggames": "Pending Parties",
            "gamecreation": "Game Creation",
            "createlocal": "Create Local",
            "createremote": "Create Remote",
            "createtournament": "Create Tournament",
            "search": "Search Game"
        },
        "PT": {
            "pendinggames": "Jogos pendentes",
            "gamecreation": "Criação de jogos",
            "createlocal": "Criar local",
            "createremote": "Criar Remoto",
            "createtournament": "Criar torneio",
            "search": "Procurar jogo"
		}
    }`);

    return `<div class="row">
        <div class="col-md-6 text-center">
            <h1>${langdict[lang]['pendinggames']}</h1>
            <input type="text" id="game-search" class="form-control mb-3" placeholder="${langdict[lang]['search']}">
            <ul id="game-list" class="list-group"></ul>
        </div>
        <div class="col-md-6 text-center">
            <h2>${langdict[lang]['gamecreation']}</h2>
            <ul id="game-create" class="list-group">
            <li class="list-group-item d-flex justify-content-center align-items-center">
                <button type="button" href="/localroom" class="btn btn-primary" id="create-local-game">${langdict[lang]['createlocal']}</button>
            </li>
            <li class="list-group-item d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-primary" id="create-remote-game">${langdict[lang]['createremote']}</button>
            </li>
            <li class="list-group-item d-flex justify-content-center align-items-center">
                <button type="button" class="btn btn-primary" id="create-tournament">${langdict[lang]['createtournament']}</button>
            </ul>
        </div>
    </div>`;
}
