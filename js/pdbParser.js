/**
 * pdbParser.js
 * Módulo responsável por fazer o parsing de arquivos PDB
 */

/**
 * Lista de elementos químicos com 2 letras
 */
const TWO_LETTER_ELEMENTS = [
  "HE",
  "LI",
  "BE",
  "NE",
  "NA",
  "MG",
  "AL",
  "SI",
  "CL",
  "AR",
  "CA",
  "SC",
  "TI",
  "CR",
  "MN",
  "FE",
  "CO",
  "NI",
  "CU",
  "ZN",
  "GA",
  "GE",
  "AS",
  "SE",
  "BR",
  "KR",
  "RB",
  "SR",
  "ZR",
  "NB",
  "MO",
  "TC",
  "RU",
  "RH",
  "PD",
  "AG",
  "CD",
  "IN",
  "SN",
  "SB",
  "TE",
  "XE",
  "CS",
  "BA",
  "LA",
  "CE",
  "PR",
  "ND",
  "PM",
  "SM",
  "EU",
  "GD",
  "TB",
  "DY",
  "HO",
  "ER",
  "TM",
  "YB",
  "LU",
  "HF",
  "TA",
  "RE",
  "OS",
  "IR",
  "PT",
  "AU",
  "HG",
  "TL",
  "PB",
  "BI",
  "PO",
  "AT",
  "RN",
  "FR",
  "RA",
  "AC",
  "TH",
  "PA",
  "NP",
  "PU",
  "AM",
  "CM",
  "BK",
  "CF",
  "ES",
  "FM",
  "MD",
  "NO",
  "LR",
];

/**
 * Extrai o símbolo do elemento químico de uma linha PDB
 * @param {string} line - Linha do arquivo PDB
 * @returns {string} - Símbolo do elemento químico
 */
function extractElement(line) {
  // Primeiro tenta colunas 77-78 (padrão PDB oficial)
  let element = line.substring(76, 78).trim();

  if (!element) {
    // Pega o nome do átomo (colunas 13-16) e remove números e espaços
    const atomName = line.substring(12, 16).trim();
    // Extrai apenas as letras do elemento (remove números e espaços)
    element = atomName.replace(/[0-9]/g, "").trim();

    // Verifica se é um elemento de 2 letras
    const elementUpper = element.toUpperCase();
    if (
      elementUpper.length >= 2 &&
      TWO_LETTER_ELEMENTS.includes(elementUpper.substring(0, 2))
    ) {
      element = elementUpper.substring(0, 2);
      // Converte para formato correto: primeira maiúscula, segunda minúscula
      element = element.charAt(0) + element.charAt(1).toLowerCase();
    } else {
      // Elemento de 1 letra
      element = elementUpper.substring(0, 1);
    }
  }

  return element;
}

/**
 * Faz o parsing de um arquivo PDB
 * @param {string} data - Conteúdo do arquivo PDB
 * @returns {Object} - Objeto contendo atoms e connections
 */
function parsePDB(data) {
  const lines = data.split("\n");
  const atoms = [];
  const connections = new Map();

  lines.forEach((line) => {
    if (line.startsWith("ATOM") || line.startsWith("HETATM")) {
      const atomId = parseInt(line.substring(6, 11).trim());
      const x = parseFloat(line.substring(30, 38));
      const y = parseFloat(line.substring(38, 46));
      const z = parseFloat(line.substring(46, 54));
      const element = extractElement(line);
      const isHetatm = line.startsWith("HETATM");

      atoms.push({ id: atomId, x, y, z, element, isHetatm });
    } else if (line.startsWith("CONECT")) {
      const parts = line
        .substring(6)
        .trim()
        .split(/\s+/)
        .map((n) => parseInt(n));
      const atomId = parts[0];
      const connectedAtoms = parts.slice(1);
      connections.set(atomId, connectedAtoms);
    }
  });

  return { atoms, connections };
}

// Exportar funções
if (typeof module !== "undefined" && module.exports) {
  module.exports = { parsePDB, extractElement };
}
