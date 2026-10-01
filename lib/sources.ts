// Verified-by-search links. Spot-check each before launch; several publishers block automated fetches.
export const SOURCES = {
  ewgRoundup: ['EWG: 100,000 cancer cases estimate', 'https://www.ewg.org/news-insights/news/ewg-news-roundup-920-ewg-estimates-100000-cancer-cases-stem-tap-water'],
  ewgMixtures: ['EWG: contaminant mixtures and cancer risk', 'https://www.ewg.org/tapwater/chemical-mixtures-may-interact-and-raise-cancer-risks.php'],
  ewgDb: ['EWG Tap Water Database', 'https://www.ewg.org/tapwater/state-of-american-drinking-water.php'],
  ewgDbUpdate: ['EWG: 2025 database update', 'https://www.ewg.org/news-insights/news-release/2025/02/ewg-tap-water-database-update-shows-hundreds-contaminants'],
  ewgMethod: ['EWG: methodology', 'https://www.ewg.org/tapwater/methodology.php'],
  ewgKids: ['EWG: drinking water and children’s health', 'https://www.ewg.org/research/drinking-water-and-childrens-health'],
  ewgAtrazine: ['EWG: atrazine in drinking water', 'https://www.ewg.org/research/hormone-disrupting-weed-killer-taints-drinking-water-millions-americans'],
  ncbiFert: ['NCBI Bookshelf: contaminants and fertility', 'https://www.ncbi.nlm.nih.gov/books/NBK576379/'],
  pmcOrgans: ['PMC: drinking water contaminants review', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10907308/'],
  epaLead: ['EPA: lead in drinking water', 'https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water'],
  niehs: ['NIEHS: endocrine disruptors', 'https://www.niehs.nih.gov/health/topics/agents/endocrine'],
  epaDbp: ['EPA: disinfectants and byproducts rules', 'https://www.epa.gov/dwreginfo/stage-1-and-stage-2-disinfectants-and-disinfection-byproducts-rules'],
  jaci: ['JACI 2016: chlorine and skin barrier', 'https://www.jacionline.org/article/S0091-6749(16)30187-7/fulltext'],
  nrdc: ['NRDC: drinking water', 'https://www.nrdc.org/issues/drinking-water'],
  wqa: ['WQA knowledge base', 'http://my.wqa.org/kb'],
  usgs: ['USGS: hardness of water', 'https://www.usgs.gov/special-topics/water-science-school/science/hardness-water'],
  epaWells: ['EPA: private drinking water wells', 'https://www.epa.gov/privatewells'],
  mdhPfas: ['Minnesota Dept. of Health: PFAS home treatment', 'https://www.health.state.mn.us/communities/environment/hazardous/topics/pfashometreat.html'],
  kphWells: ['Kitsap Public Health: private wells', 'https://www.kitsappublichealth.org/dwos/privatewells'],
  tpchdTest: ['Tacoma-Pierce County Health Dept: test your water', 'https://tpchd.org/homes/drinking-water/testing/'],
  tpchdWells: ['Tacoma-Pierce County Health Dept: individual wells', 'https://tpchd.org/homes/drinking-water/individual-wells/'],
  tpuSource: ['Tacoma Public Utilities: water source', 'https://www.mytpu.org/about-tpu/services/water/water-source/100-years-clean-reliable-water/'],
} as const;

export type SourceId = keyof typeof SOURCES;
