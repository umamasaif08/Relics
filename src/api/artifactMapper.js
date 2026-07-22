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
