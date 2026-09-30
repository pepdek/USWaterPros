export type Location = { slug: string; name: string; state: string; cities: string[]; facts: string[]; blurb: string };

// ponytail: facts are general, not measured. Verify against each utility's annual water quality report before ads.
export const LOCATIONS: Location[] = [
  { slug: 'kitsap-county', name: 'Kitsap County', state: 'WA', cities: ['Bremerton', 'Silverdale', 'Port Orchard', 'Poulsbo', 'Bainbridge Island'],
    blurb: 'Most Kitsap homes rely on groundwater, from public wells or private ones. Find the right filtration for yours.',
    facts: ['Kitsap County has no large river or reservoir supply, so drinking water comes mainly from groundwater.', 'Groundwater can carry dissolved minerals and iron that cause staining and scale.', 'Homes on private wells are responsible for their own testing.'] },
  { slug: 'pierce-county', name: 'Pierce County', state: 'WA', cities: ['Tacoma', 'Lakewood', 'Puyallup', 'Gig Harbor', 'University Place'],
    blurb: 'From city water in Tacoma to private wells out in the county, compare local pros who know the area.',
    facts: ['Pierce County water comes from a mix of surface sources, groundwater and private wells.', 'City water is treated and tested, but can still taste of chlorine and pick up metals from older pipes.', 'Homes on private wells are responsible for their own testing.'] },
];
