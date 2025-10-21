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
      try {
        let contents = e.target.result;

        // Normalizar quebras de linha para garantir compatibilidade
        contents = contents.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

        // Verificar se o conteúdo não está vazio
        if (!contents.trim()) {
          throw new Error("Arquivo PDB vazio ou inválido");
        }

        console.log("📁 Arquivo carregado:", file.name);
        console.log("📊 Tamanho do arquivo:", contents.length, "caracteres");

        // Verificar se contém dados PDB válidos
        const hasAtomRecords = /^(ATOM|HETATM)/m.test(contents);
        if (!hasAtomRecords) {
          console.warn("⚠️ Nenhum registro ATOM/HETATM encontrado no arquivo");
        }

        if (onSuccess) onSuccess(contents, file.name);
      } catch (error) {
        console.error("❌ Erro ao processar arquivo:", error);
        alert("Erro ao processar arquivo: " + error.message);
      }
    };

    reader.onerror = () => {
      console.error("❌ Erro ao ler arquivo");
      alert(
        "Erro ao ler o arquivo. Verifique se o arquivo não está corrompido.",
      );
    };

    // Usar readAsText com encoding UTF-8 explícito
    reader.readAsText(file, "UTF-8");
  } else {
    alert("Por favor, selecione apenas arquivos .pdb");
  }
}

/**
 * Valida se o conteúdo PDB é válido
 * @param {string} pdbContent - Conteúdo do arquivo PDB
 * @returns {boolean} - True se válido
 */
function validatePDBContent(pdbContent) {
  if (!pdbContent || typeof pdbContent !== "string") {
    return false;
  }

  // Verificar se contém pelo menos um registro ATOM ou HETATM
  const atomPattern = /^(ATOM|HETATM)\s+\d+/m;
  return atomPattern.test(pdbContent);
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
        // Validar conteúdo antes de passar para o callback
        if (validatePDBContent(contents)) {
          console.log("✅ Arquivo PDB válido:", fileName);
          if (onLoadCallback) {
            onLoadCallback(contents, fileName);
          }
        } else {
          console.error("❌ Arquivo PDB inválido:", fileName);
          alert("O arquivo selecionado não parece ser um arquivo PDB válido.");
        }
      });
    },
    false,
  );

  // Botão de carregar arquivo
  document.getElementById("loadButton").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput.files.length > 0) {
      const event = { target: fileInput };
      handleFileSelect(event, (contents, fileName) => {
        if (validatePDBContent(contents)) {
          console.log("✅ Arquivo PDB válido:", fileName);
          if (onLoadCallback) {
            onLoadCallback(contents, fileName);
          }
        } else {
          console.error("❌ Arquivo PDB inválido:", fileName);
          alert("O arquivo selecionado não parece ser um arquivo PDB válido.");
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
      console.log("🌐 Carregando do projeto:", selectedName);
      loadPDB(
        value,
        (data) => {
          if (validatePDBContent(data)) {
            console.log("✅ Molécula do projeto carregada:", selectedName);
            if (onLoadCallback) {
              onLoadCallback(data, selectedName);
            }
          } else {
            console.error("❌ Dados PDB inválidos do projeto:", selectedName);
            alert("Os dados da molécula do projeto parecem estar corrompidos.");
          }
        },
        (error) => {
          console.error("❌ Erro ao carregar molécula do projeto:", error);
          alert("Erro ao carregar molécula: " + error.message);
        },
      );
    } else {
      alert("Por favor, selecione uma molécula do projeto primeiro!");
    }
  });
}
