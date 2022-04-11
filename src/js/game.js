import Card from "./card";
import Player from "./player";

export default class Game {
    cardsDeck = [];
    players;
    winners = [];
    idIndex = 0;
    arrayOfPlayerId = [];
    acitvePlayerId = null;
    isEndGame = false;

    #suits = ['♣', '♠', '♥', '♦'];
    #highCards = ['J', 'Q', 'K', 'A'];

    constructor(players = []) {
        this.players = players;
        this.fullId();
        this.setNextPlayerId();
        this.createCardsDeck();
        this.firstHand();
    }

    fullId() {
        this.players.forEach(player => {
            this.arrayOfPlayerId.push(player.getPlayerId);
        })
    }

    checkEndGame() {
        this.players.forEach(player => this.isEndGame = player.isStand);
    }

    //todo: изменить способ установки активного id. Пропускать id игрока, который уже закончил игру
    setNextPlayerId() {
        if (this.idIndex >= this.arrayOfPlayerId.length) {
            this.idIndex = 0;
        }
        this.acitvePlayerId = this.arrayOfPlayerId[this.idIndex++];
    }

    createCardsDeck() {
        this.#suits.forEach((suit) => {
            for (let i = 2; i <= 10; i++) {
                this.cardsDeck.push(new Card(`${i}`, suit, i));
            }
            this.#highCards.forEach(card => {
                this.cardsDeck.push(new Card(`${card}`, suit, card === 'A' ? 11 : 10));

            })
        });

        // this.cardsDeck = [...this.cardsDeck, ...this.cardsDeck,...this.cardsDeck];
        this.cardsDeck = this.cardsDeck.sort(() => 0.5 - Math.random());
    }

    moveWinner(player) {
        //todo: изменить метод. Дублируются игроки в массив winner. Можно в методе сделать проверку, агрументом передавать игрока и пушить его в winner
       if (player.isStand && !player.isLose) {
           this.winners.push(player);
       }

        // this.winners = this.winners.concat(this.players.filter(player => player.isStand && !player.isLose));
        // this.players = this.players.filter(player => !player.isStand && !player.isLose);
    }

    defineWinner() {
        if (this.winners.length === 1) {
            return;
        }
        if (this.winners.length > 1) {
            this.winners = this.winners.sort((a, b) => {
                return b.getPlayerScore - a.getPlayerScore;
            });
            this.winners = this.winners.filter(player => player.getPlayerScore === this.winners[0].getPlayerScore);
        }
    }

    firstHand() {
        this.players.forEach(player => {
            player.cards.push(this.cardsDeck.shift());
            player.cards.push(this.cardsDeck.shift());
            player.updatePlayer();
            this.moveWinner(player);
            // todo: под вопросом
            if (player.getPlayerScore === 21) {
                this.setNextPlayerId();
            }
        });
        // this.moveWinner(); \\\
        this.defineWinner();
        this.checkEndGame();
    }

    hit(playerId) {
        this.players.forEach(player => {
            if (player.getPlayerId === playerId) {
                player.cards.push(this.cardsDeck.shift());
                player.updatePlayer();
                this.moveWinner(player);
                if (player.getPlayerScore > 21) {
                    this.setNextPlayerId();
                }
            }
        });
        // this.moveWinner(); \\\\\
        this.defineWinner();
        // this.setNextPlayerId();
        this.checkEndGame();
    }

    stand(playerId) {
        this.players.forEach(player => {
            if (player.getPlayerId === playerId) {
                player.isStand = true;
                player.updatePlayer();
                this.moveWinner(player);
            }
        });
        // this.moveWinner(); \\\
        this.defineWinner();
        this.setNextPlayerId();
        this.checkEndGame();
    }


}