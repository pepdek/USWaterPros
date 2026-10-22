// Verified-by-search links. Spot-check each before launch; several publishers block automated fetches.
export const SOURCES = {
  epaLead: ['EPA: lead in drinking water', 'https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water'],
  epaDbp: ['EPA: disinfectants and byproducts rules', 'https://www.epa.gov/dwreginfo/stage-1-and-stage-2-disinfectants-and-disinfection-byproducts-rules'],
  wqa: ['WQA knowledge base', 'http://my.wqa.org/kb'],
  usgs: ['USGS: hardness of water', 'https://www.usgs.gov/special-topics/water-science-school/science/hardness-water'],
  epaWells: ['EPA: private drinking water wells', 'https://www.epa.gov/privatewells'],
  mdhPfas: ['Minnesota Dept. of Health: PFAS home treatment', 'https://www.health.state.mn.us/communities/environment/hazardous/topics/pfashometreat.html'],
  kphWells: ['Kitsap Public Health: private wells', 'https://www.kitsappublichealth.org/dwos/privatewells'],
  tpchdTest: ['Tacoma-Pierce County Health Dept: test your water', 'https://tpchd.org/homes/drinking-water/testing/'],
  tpchdWells: ['Tacoma-Pierce County Health Dept: individual wells', 'https://tpchd.org/homes/drinking-water/individual-wells/'],
  thurstonLab: ['Thurston County: drinking water lab', 'https://www.thurstoncountywa.gov/departments/public-health-and-social-services/environmental-health/water/water-lab'],
  laceyWater: ['City of Lacey: water quality', 'https://cityoflacey.org/lacey-water-quality-continues-to-meet-state-and-federal-standards/'],
  olympiaWsp: ['City of Olympia: water system plan', 'https://www.codepublishing.com/WA/Olympia/wsp/OlympiaWSP01.html'],
  tpuSource: ['Tacoma Public Utilities: water source', 'https://www.mytpu.org/about-tpu/services/water/water-source/100-years-clean-reliable-water/'],
} as const;

export type SourceId = keyof typeof SOURCES;
