export interface IUser {
  yahooId: string;
  name: string;
  avatar: string;
  _id?: string;
  rivalries?: ITeam[];
  wathPlayers?: IPlayer[];
  accessToken?: string;
}

export interface ITeam {
  key: string;
  _id?: string;
}

export interface IPlayer {
  key: string;
  firstName: string;
  lastName: string;
  positions: string;
  headshot?: string;
  _id?: string;
}

export interface ILeague {
  key: string;
  name: string;
  logo: string;
  totalWeeks: string;
  week: string;
  season: string;
}