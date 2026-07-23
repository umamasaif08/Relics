const CIVILIZATION_RULES = [
  { civilization: 'Egyptian', match: (a) => /egypt/i.test(a.department) || /egypt/i.test(a.culture) },
  { civilization: 'Greek', match: (a) => /greek/i.test(a.culture) || /greek/i.test(a.period) },
  { civilization: 'Roman', match: (a) => /roman/i.test(a.culture) || /roman/i.test(a.period) },
  {
    civilization: 'Asian',
    match: (a) =>
      /japan|chinese|korean|indian|asian|tibet|nepal|thai|vietnam|persia|iran|islamic/i.test(
        `${a.culture} ${a.country} ${a.region}`,
      ),
  },
  {
    civilization: 'Islamic',
    match: (a) => /islamic|persian|iran|arab|ottoman|mughal/i.test(`${a.culture} ${a.period}`),
  },
  {
    civilization: 'African',
    match: (a) => /africa|kongo|yoruba|benin|ethiopia/i.test(`${a.culture} ${a.country}`),
  },
  {
    civilization: 'American',
    match: (a) => /american|united states|mexico|peru|native/i.test(`${a.culture} ${a.country}`),
  },
  {
    civilization: 'European',
    match: (a) =>
      /europe|french|italian|dutch|spanish|german|british|english|flanders|venetian|roman/i.test(
        `${a.culture} ${a.period}`,
      ),
  },
];

function deriveCivilization(raw) {
  for (const rule of CIVILIZATION_RULES) {
    if (rule.match(raw)) return rule.civilization;
  }
  return raw.culture || raw.department || 'Unknown';
}

function deriveEra(objectDate, period) {
  const text = `${objectDate || ''} ${period || ''}`.toLowerCase();

  if (/21st|20th|19th century|18th century|1700|1800|1900|2000/.test(text)) return 'Modern';
  if (/16th|17th century|1500|1600|1700|renaissance|baroque/.test(text)) return 'Renaissance & Baroque';
  if (/medieval|middle ages|byzantine|12th|13th|14th|15th century|1000|1100|1200|1300|1400/.test(text))
    return 'Medieval';
  if (/ancient|bce|bc|dynasty|republic|empire|pharaoh|classical|500|600|700|800|900/.test(text))
    return 'Ancient';
  if (/early|late|century/.test(text)) return 'Historical';

  return period || objectDate || 'Unknown Era';
}

function deriveCategory(raw) {
  return raw.classification || raw.objectName || raw.department || 'Artifact';
}

/**
 * @param {Record<string, unknown>} raw Met API object response
 * @returns {import('../types').Artifact | null}
 */
export function mapMetObjectToArtifact(raw) {
  if (!raw?.isPublicDomain || !raw?.primaryImage) return null;

  // 1. Department Allowlist Filter
  const dept = (raw.department || '').trim().toLowerCase();
  const allowedDepts = [
    'islamic art',
    'asian art',
    'the costume institute',
    'costume institute',
    'musical instruments',
    'american decorative arts',
    'the american wing',
    'ancient near eastern art',
    'ancient west asian art',
  ];
  if (!allowedDepts.includes(dept)) return null;

  // 2. Sub-filter: "Asian Art" must be ceramics/textiles only, and exclude paintings/prints/drawings/scrolls
  if (dept === 'asian art') {
    const classification = (raw.classification || '').toLowerCase();
    const medium = (raw.medium || '').toLowerCase();
    const objectName = (raw.objectName || '').toLowerCase();
    const contentText = `${classification} ${medium} ${objectName}`;

    const isCeramic = /ceramic|porcelain|pottery|clay|stoneware|earthenware|terracotta/i.test(contentText);
    const isTextile = /textile|silk|wool|cotton|tapestry|fabric|embroidery|robe|kimono|carpet|rug|satin|brocade|velvet|weaving/i.test(contentText);
    const isPainting = /painting|paint|print|drawing|scroll/i.test(contentText);

    if (!(isCeramic || isTextile) || isPainting) return null;
  }

  // 3. Safety Net: Exclude if classification contains "Nude" or "Erotic" (only if classification exists)
  if (raw.classification) {
    const classification = raw.classification.trim().toLowerCase();
    if (classification.includes('nude') || classification.includes('erotic')) return null;
  }

  // 4. Keywords Safety Net: Exclude if title or tags contain unwanted keywords
  const keywords = ['nude', 'erotic', 'torture', 'human remains', 'weapon'];
  if (raw.title) {
    const title = raw.title.trim().toLowerCase();
    if (keywords.some((kw) => title.includes(kw))) return null;
  }

  if (Array.isArray(raw.tags)) {
    const hasUnwantedTag = raw.tags.some((t) => {
      if (!t?.term) return false;
      const term = t.term.trim().toLowerCase();
      return keywords.some((kw) => term.includes(kw));
    });
    if (hasUnwantedTag) return null;
  }


  const culture = raw.culture || '';
  const period = raw.period || '';
  const objectDate = raw.objectDate || '';

  return {
    id: raw.objectID,
    title: raw.title || 'Untitled',
    culture,
    civilization: deriveCivilization({
      culture,
      period,
      department: raw.department || '',
      country: raw.country || '',
      region: raw.region || '',
    }),
    period,
    era: deriveEra(objectDate, period),
    category: deriveCategory(raw),
    medium: raw.medium || '',
    objectDate,
    primaryImage: raw.primaryImage,
    additionalImages: raw.additionalImages || [],
    department: raw.department || '',
    country: raw.country || '',
    dimensions: raw.dimensions || '',
    creditLine: raw.creditLine || '',
    objectURL: raw.objectURL || '',
    dynasty: raw.dynasty || '',
    reign: raw.reign || '',
    artistDisplayName: raw.artistDisplayName || '',
  };
}
