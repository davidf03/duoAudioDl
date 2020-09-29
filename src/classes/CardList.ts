import type { iCardGroup, iCard } from "../interfaces/iCards";

export interface iLists {
  [key:string]:iCardGroup[];
}

interface iCardStructure {
  cardIndex:number;
  groupIndex:number;
  lng:string;
}

export class CardList {
  public cardList:iLists;

  constructor () {
    this.cardList = {};
  }

  public getLngs (): string[] {
    return Object.keys(this.cardList);
  }
  public getGroups (lng:string): iCardGroup[] {
    return this.cardList[lng] ?? [];
  }
  public hasCard (audioUrl:string): boolean {
    return !!this.getCardStructure(audioUrl);
  }
  public getCard (audioUrl:string): iCard {
    const cs:iCardStructure = this.getCardStructure(audioUrl);
    if (!cs) return null;
    return this.cardList[cs.lng][cs.groupIndex].cards[cs.cardIndex];
  }
  public addCard (card:iCard, groupName:string, lng:string): boolean {
    this.cardList[lng] ??= [] as iCardGroup[];
    const cs:iCardStructure = this.getCardStructure(card.audioUrl);
    if (!!cs) {
      this.reprioritizeCard(cs);
      return false;
    }
    this.cardList[lng][this.getGroupIndex(groupName, lng)].cards.unshift(card);
    return true;
  }
  public updateCard (card:iCard): void {
    const cs:iCardStructure = this.getCardStructure(card.audioUrl);
    this.cardList[cs.lng][cs.groupIndex].cards[cs.cardIndex] = card;
  }
  public clearCard (audioUrl:string): iCard {
    const cs:iCardStructure = this.getCardStructure(audioUrl);
    if (!cs) return null;
    const cards:iCard[] = this.cardList[cs.lng][cs.groupIndex].cards;
    const card:iCard = cards.splice(cs.cardIndex, 1)[0];
    cards.length === 0 && this.cardList[cs.lng].splice(cs.groupIndex, 1);
    return card;
  }

  private getCardStructure (audioUrl:string): iCardStructure {
    for (let lng of Object.keys(this.cardList))
      for (let g = 0; g < this.cardList[lng].length; g++)
        for (let c = 0; c < this.cardList[lng][g].cards.length; c++)
          if (this.cardList[lng][g].cards[c].audioUrl === audioUrl) return {
            cardIndex: c,
            groupIndex: g,
            lng
          };
    return null;
  }

  private getGroupIndex (groupName:string, lng:string): number {
    this.cardList[lng] ??= [] as iCardGroup[];
    let groupIndex = this.cardList[lng].findIndex((g:iCardGroup): boolean => g.name === groupName);
    if (groupIndex !== -1) return groupIndex;
    this.cardList[lng].unshift({
      name: groupName,
      cards: [] as iCard[]
    } as iCardGroup);
    return 0;
  }

  private reprioritizeCard (cs:iCardStructure): void {
    this.cardList[cs.lng][cs.groupIndex].cards.unshift(
      this.cardList[cs.lng][cs.groupIndex].cards.splice(cs.cardIndex, 1)[0]
    );
    this.cardList[cs.lng].unshift(
      this.cardList[cs.lng].splice(cs.groupIndex, 1)[0]
    );
  }
}
