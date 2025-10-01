/**
 * fileLoader.js
 * Módulo responsável por carregar arquivos PDB
 */

/**
 * Carrega um arquivo PDB de uma URL
 * @param {string} url - URL do arquivo PDB
 * @param {Function} onSuccess - Callback chamado quando o arquivo é carregado
 * @param {Function} onError - Callback chamado em caso de erro
 */
function loadPDB(url, onSuccess, onError) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      if (onSuccess) onSuccess(data);
    })
    .catch((error) => {
      console.error("Erro ao carregar arquivo PDB:", error);
      if (onError) onError(error);
    });
}

/**
 * Manipula seleção de arquivo do computador
 * @param {Event} event - Evento de mudança do input file
 * @param {Function} onSuccess - Callback chamado quando o arquivo é carregado
 */
function handleFileSelect(event, onSuccess) {
  const file = event.target.files[0];
  if (file && file.name.toLowerCase().endsWith(".pdb")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      if (onSuccess) onSuccess(contents, file.name);
    };
    reader.readAsText(file);
  } else {
    alert("Por favor, selecione apenas arquivos .pdb");
  }
}

/**
 * Configura os listeners do seletor de arquivos
 * @param {Function} onLoadCallback - Callback quando uma molécula é carregada
 */
function setupFileSelector(onLoadCallback) {
  // Listener para carregar arquivo do computador
  document.getElementById("fileInput").addEventListener(
    "change",
    (event) => {
      handleFileSelect(event, (contents, fileName) => {
        if (onLoadCallback) {
          onLoadCallback(contents, fileName);
        }
      });
    },
    false
  );

  // Botão de carregar arquivo
  document.getElementById("loadButton").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput.files.length > 0) {
      const event = { target: fileInput };
      handleFileSelect(event, (contents, fileName) => {
        if (onLoadCallback) {
          onLoadCallback(contents, fileName);
        }
      });
    } else {
      alert("Por favor, selecione um arquivo PDB primeiro!");
    }
  });

  // Listener para carregar molécula do projeto
  document.getElementById("loadProjectButton").addEventListener("click", () => {
    const select = document.getElementById("projectMolecules");
    const value = select.value;
    if (value) {
      const selectedName = select.options[select.selectedIndex].text;
      loadPDB(
        value,
        (data) => {
          if (onLoadCallback) {
            onLoadCallback(data, selectedName);
          }
        },
        (error) => {
          alert("Erro ao carregar molécula: " + error.message);
        }
      );
    } else {
      alert("Por favor, selecione uma molécula do projeto primeiro!");
    }
  });
}

// Exportar funções
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    loadPDB,
    handleFileSelect,
    setupFileSelector,
  };
}
