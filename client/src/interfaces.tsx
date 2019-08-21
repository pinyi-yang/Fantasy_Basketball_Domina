export interface IUser {
  yahooId: string;
  name: string;
  avatar: string;
  _id?: string;
  rivalries?: ITeam[];
  watchPlayers?: IPlayer[];
  accessToken?: string;
}

export interface ITeam {
  _id?: string;
  owner_yahooId: string;
  key: string;
  name: string;
  logo: string;
  rank?: number;
  wins?: string;
  losses?: string;
  ties?: string;
  percentage?: string;
  score?: number;
}

export interface IStat {
  "FG%": string;
  "FT%": string;
  "3PTM": string;
  "PTS": string;
  "REB": string;
  "AST": string;
  "ST": string;
  "BLK": string;
  "TO": string;
  "FGM/A": string;
  "FTM/A": string;
}

export interface ITeamScore extends ITeam {
  stat: IStat
}

export interface IMatchup {
  teams: ITeam[]
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

export interface ILeagueInfo {
  standings: ITeam[],
  scoreboard: IMatchup[]
}