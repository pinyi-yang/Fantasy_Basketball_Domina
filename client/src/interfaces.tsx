export interface IUser {
  yahooId: string;
  name: string;
  avatar: string;
  _id?: string;
  rivalries?: ITeam[];
  wathPlayers?: IPlayer[]
}

export interface ITeam {
  key: string;
  _id?: string
}

export interface IPlayer {
  key: string;
  firstName: string;
  lastName: string;
  positions: string;
  headshot?: string;
  _id?: string
}