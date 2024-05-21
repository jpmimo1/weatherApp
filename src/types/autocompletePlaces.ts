export interface AutocompletePlaces {
  results: Result[];
  query:   Query;
}

export interface Query {
  text:   string;
  parsed: Parsed;
}

export interface Parsed {
  country:       string;
  expected_type: string;
}

export interface Result {
  datasource:    Datasource;
  country:       string;
  country_code:  string;
  lon:           number;
  lat:           number;
  name?:         string;
  result_type:   string;
  formatted:     string;
  address_line1: string;
  address_line2: string;
  category:      string;
  timezone:      Timezone;
  plus_code:     string;
  rank:          Rank;
  place_id:      string;
  bbox:          Bbox;
  region?:       string;
  state?:        string;
  city?:         string;
  state_code?:   string;
  county?:       string;
  village?:      string;
  ref?:          string;
}

export interface Bbox {
  lon1: number;
  lat1: number;
  lon2: number;
  lat2: number;
}

export interface Datasource {
  sourcename:  string;
  attribution: string;
  license:     string;
  url:         string;
}

export interface Rank {
  importance:             number;
  confidence:             number;
  match_type:             string;
  confidence_city_level?: number;
}

export interface Timezone {
  name:               string;
  offset_STD:         string;
  offset_STD_seconds: number;
  offset_DST:         string;
  offset_DST_seconds: number;
}
