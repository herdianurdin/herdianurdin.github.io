// src/scripts/python-playground.js

document.addEventListener("DOMContentLoaded", () => {
  const vfs = Object.create(null);
  vfs["main.py"] =
    "# Selamat datang di Python Playground!\n# Tulis kode Anda di sini:\n\nprint('Halo dari Python Web!')\nnama = input('Siapa nama Anda? ')\nprint(f'Selamat belajar, {nama}!')\n";

  let activeTab = "main.py";

  const reservedNames = [
    "math",
    "time",
    "random",
    "turtle",
    "sys",
    "os",
    "re",
    "json",
    "datetime",
    "urllib",
    "string",
    "collections",
    "itertools",
    "functools",
    "main",
    "document",
    "window",
  ];

  const MAX_TERMINAL_OUTPUT = 100_000;
  const MAX_EXECUTION_MS = 10_000;
  const YIELD_INTERVAL_MS = 25;

  const runBtn = document.getElementById("run-btn");
  const runText = document.getElementById("run-text");
  const outputTerminal = document.getElementById("output-terminal");
  const terminalContainer = document.getElementById("terminal-container");
  const tabsContainer = document.getElementById("tabs-container");
  const addTabBtn = document.getElementById("add-tab-btn");

  const fileModal = document.getElementById("file-modal");
  const modalInput = document.getElementById("modal-input");
  const modalTitle = document.getElementById("modal-title");
  const modalError = document.getElementById("modal-error");
  const modalCancel = document.getElementById("modal-cancel");
  const modalSave = document.getElementById("modal-save");

  const deleteModal = document.getElementById("delete-modal");
  const deleteModalText = document.getElementById("delete-modal-text");
  const deleteCancel = document.getElementById("delete-cancel");
  const deleteConfirm = document.getElementById("delete-confirm");

  const guideModal = document.getElementById("modal-guide");
  const guideOpenBtn = document.getElementById("guide-open-btn");
  const guideCloseBtn = document.getElementById("guide-close-btn");

  const requiredElements = [
    runBtn,
    runText,
    outputTerminal,
    terminalContainer,
    tabsContainer,
    addTabBtn,
    fileModal,
    modalInput,
    modalTitle,
    modalError,
    modalCancel,
    modalSave,
    deleteModal,
    deleteModalText,
    deleteCancel,
    deleteConfirm,
  ];

  if (requiredElements.some((element) => !element)) {
    console.error("Python Playground: elemen antarmuka tidak lengkap.");
    return;
  }

  let modalMode = "add";
  let fileToRename = "";
  let fileToDelete = "";
  let terminalOutputLength = 0;
  let outputLimitShown = false;

  if (typeof window.CodeMirror !== "function") {
    runBtn.disabled = true;
    runText.textContent = "EDITOR GAGAL DIMUAT";
    outputTerminal.textContent =
      "Code editor gagal dimuat. Periksa koneksi internet lalu muat ulang halaman.";
    return;
  }

  if (!window.Sk || typeof window.Sk.configure !== "function") {
    runBtn.disabled = true;
    runText.textContent = "PYTHON GAGAL DIMUAT";
    outputTerminal.textContent =
      "Python runtime gagal dimuat. Periksa koneksi internet lalu muat ulang halaman.";
    return;
  }

  const editor = window.CodeMirror.fromTextArea(
    document.getElementById("code-editor"),
    {
      mode: "python",
      theme: "dracula",
      lineNumbers: true,
      indentUnit: 4,
      matchBrackets: true,
      lineWrapping: true,
      fixedGutter: false,
    },
  );
  editor.setSize("100%", "100%");
  editor.setValue(vfs[activeTab]);

  const cmTextarea = document.querySelector(".CodeMirror textarea");
  if (cmTextarea) {
    cmTextarea.setAttribute("aria-label", "Editor kode Python");
  }

  function showDialog(dialog) {
    if (dialog instanceof HTMLDialogElement && !dialog.open) {
      dialog.showModal();
    }
  }

  function closeDialog(dialog) {
    if (dialog instanceof HTMLDialogElement && dialog.open) {
      dialog.close();
    }
  }

  function renderTabs() {
    tabsContainer.replaceChildren();

    Object.keys(vfs).forEach((filename) => {
      const isMain = filename === "main.py";
      const isActive = filename === activeTab;

      const tabGroup = document.createElement("div");
      tabGroup.className =
        `flex items-stretch shrink-0 border-r-4 border-white ${isActive ? "bg-white text-black" : "bg-[#1e1e1e] text-neutral-400 hover:bg-[#00e5ff] hover:text-black"}`;

      const selectBtn = document.createElement("button");
      selectBtn.type = "button";
      selectBtn.className =
        "px-4 py-2 font-mono text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c6ff00] focus-visible:outline-offset-[-3px]";
      selectBtn.textContent = filename;
      selectBtn.setAttribute("aria-pressed", String(isActive));
      selectBtn.setAttribute(
        "aria-label",
        isActive ? `${filename}, file aktif` : `Buka file ${filename}`,
      );
      selectBtn.dataset.tab = filename;
      selectBtn.addEventListener("click", () => switchTab(filename));
      selectBtn.addEventListener("dblclick", (event) => {
        event.preventDefault();
        if (!isMain) openModal("rename", filename);
      });
      tabGroup.appendChild(selectBtn);

      if (!isMain) {
        const renameBtn = document.createElement("button");
        renameBtn.type = "button";
        renameBtn.textContent = "✎";
        renameBtn.className =
          "px-2 font-bold text-sm hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c6ff00]";
        renameBtn.title = "Ubah Nama Modul";
        renameBtn.setAttribute("aria-label", `Ubah nama modul ${filename}`);
        renameBtn.addEventListener("click", () =>
          openModal("rename", filename),
        );
        tabGroup.appendChild(renameBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "×";
        deleteBtn.className =
          "px-2 text-xl leading-none font-black hover:text-[#ff0055] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c6ff00]";
        deleteBtn.title = "Hapus Modul";
        deleteBtn.setAttribute("aria-label", `Hapus modul ${filename}`);
        deleteBtn.addEventListener("click", () =>
          openDeleteModal(filename),
        );
        tabGroup.appendChild(deleteBtn);
      }

      tabsContainer.appendChild(tabGroup);
    });
  }

  function switchTab(targetTab) {
    if (activeTab === targetTab || vfs[targetTab] === undefined) return;
    vfs[activeTab] = editor.getValue();
    activeTab = targetTab;
    editor.setValue(vfs[activeTab]);
    renderTabs();
    tabsContainer.querySelector(`[data-tab="${targetTab}"]`)?.focus();
  }

  function openDeleteModal(filename) {
    if (vfs[filename] === undefined || filename === "main.py") return;
    fileToDelete = filename;

    const filenameLabel = document.createElement("strong");
    filenameLabel.className = "text-white bg-black px-1";
    filenameLabel.textContent = filename;

    deleteModalText.replaceChildren(
      document.createTextNode("Apakah Anda yakin ingin menghapus modul "),
      document.createElement("br"),
      filenameLabel,
      document.createTextNode("?"),
    );
    showDialog(deleteModal);
  }

  deleteCancel.addEventListener("click", () => closeDialog(deleteModal));

  deleteConfirm.addEventListener("click", () => {
    if (fileToDelete && fileToDelete !== "main.py") {
      delete vfs[fileToDelete];
      if (activeTab === fileToDelete) {
        activeTab = "main.py";
        editor.setValue(vfs[activeTab]);
      }
      renderTabs();
    }
    closeDialog(deleteModal);
    fileToDelete = "";
    tabsContainer.querySelector('[data-tab="main.py"]')?.focus();
  });

  function openModal(mode, oldName = "") {
    modalMode = mode;
    fileToRename = oldName;
    modalError.textContent = "";
    modalError.classList.add("hidden");
    modalInput.removeAttribute("aria-invalid");

    if (mode === "add") {
      modalTitle.textContent = "Tambah Modul Baru";
      modalInput.value = "";
    } else {
      modalTitle.textContent = "Ubah Nama Modul";
      modalInput.value = oldName;
    }

    showDialog(fileModal);
    modalInput.focus();
  }

  function closeModal() {
    closeDialog(fileModal);
    modalInput.value = "";
    modalInput.removeAttribute("aria-invalid");
    modalError.textContent = "";
    modalError.classList.add("hidden");
  }

  function showError(message) {
    modalInput.setAttribute("aria-invalid", "true");
    modalError.textContent = message;
    modalError.classList.remove("hidden");
  }

  function saveModal() {
    let name = modalInput.value.trim().toLowerCase();

    if (!name) {
      showError("Nama modul tidak boleh kosong.");
      return;
    }

    name = name.replace(/\.py$/, "");

    if (!/^[a-z0-9_]+$/.test(name)) {
      showError("Gunakan huruf kecil, angka, dan garis bawah (_).");
      return;
    }

    if (reservedNames.includes(name)) {
      showError(`Nama '${name}' bentrok dengan library bawaan Python.`);
      return;
    }

    name += ".py";

    if (modalMode === "rename" && name === fileToRename) {
      closeModal();
      return;
    }

    if (vfs[name] !== undefined) {
      showError(`Modul dengan nama '${name}' sudah ada!`);
      return;
    }

    if (modalMode === "add") {
      vfs[activeTab] = editor.getValue();
      vfs[name] = `# Modul: ${name}\n\n`;
      activeTab = name;
      editor.setValue(vfs[activeTab]);
    } else {
      const oldContents = vfs[fileToRename];
      if (oldContents === undefined) {
        showError("Modul yang akan diubah namanya tidak ditemukan.");
        return;
      }

      vfs[name] = oldContents;
      delete vfs[fileToRename];
      if (activeTab === fileToRename) {
        activeTab = name;
        editor.setValue(vfs[activeTab]);
      }
    }

    closeModal();
    renderTabs();
    tabsContainer.querySelector(`[data-tab="${name}"]`)?.focus();
  }

  addTabBtn.addEventListener("click", () => openModal("add"));
  modalCancel.addEventListener("click", closeModal);
  modalSave.addEventListener("click", saveModal);
  modalInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveModal();
    }
  });
  modalInput.addEventListener("input", () => {
    modalInput.removeAttribute("aria-invalid");
    modalError.textContent = "";
    modalError.classList.add("hidden");
  });

  guideOpenBtn?.addEventListener("click", () => showDialog(guideModal));
  guideCloseBtn?.addEventListener("click", () => closeDialog(guideModal));

  [fileModal, deleteModal, guideModal].forEach((dialog) => {
    if (!(dialog instanceof HTMLDialogElement)) return;
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });
  });

  function appendTerminalText(text) {
    const lastNode = outputTerminal.lastChild;
    if (lastNode && lastNode.nodeType === Node.TEXT_NODE) {
      lastNode.appendData(text);
    } else {
      outputTerminal.appendChild(document.createTextNode(text));
    }
  }

  function printToTerminal(value) {
    const text = String(value);
    const remaining = Math.max(0, MAX_TERMINAL_OUTPUT - terminalOutputLength);
    const acceptedText = text.slice(0, remaining);

    if (acceptedText) {
      appendTerminalText(acceptedText);
      terminalOutputLength += acceptedText.length;
    }

    if (acceptedText.length < text.length && !outputLimitShown) {
      outputLimitShown = true;
      appendTerminalText(
        "\n[Output dihentikan setelah mencapai batas tampilan 100.000 karakter.]\n",
      );
    }

    terminalContainer.scrollTop = terminalContainer.scrollHeight;
  }

  function resetTerminal() {
    outputTerminal.replaceChildren();
    terminalOutputLength = 0;
    outputLimitShown = false;
  }

  function skulptRead(path) {
    const builtinFiles = window.Sk.builtinFiles?.files;
    if (!builtinFiles || builtinFiles[path] === undefined) {
      const filename = path.replace(/^\.\//, "");
      if (Object.hasOwn(vfs, filename)) return vfs[filename];
      throw new Error(`File tidak ditemukan: '${filename}'`);
    }
    return builtinFiles[path];
  }

  function skulptInput(promptText) {
    return new Promise((resolve) => {
      printToTerminal(promptText);
      const inputEl = document.createElement("input");
      inputEl.type = "text";
      inputEl.className = "terminal-input";
      inputEl.setAttribute(
        "aria-label",
        promptText ? `Input Python: ${promptText}` : "Input Python",
      );
      inputEl.autocomplete = "off";

      const wrapper = document.createElement("span");
      wrapper.appendChild(inputEl);
      outputTerminal.appendChild(wrapper);

      inputEl.focus();
      inputEl.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          const userInput = inputEl.value;
          wrapper.remove();
          printToTerminal(`${userInput}\n`);
          resolve(userInput);
        }
      });
    });
  }

  runBtn.addEventListener("click", async () => {
    vfs[activeTab] = editor.getValue();

    runBtn.disabled = true;
    runBtn.classList.add("opacity-75");
    runText.textContent = "MENJALANKAN";
    resetTerminal();

    window.Sk.configure({
      output: printToTerminal,
      read: skulptRead,
      inputfun: skulptInput,
      inputfunTakesPrompt: true,
      execLimit: MAX_EXECUTION_MS,
      yieldLimit: YIELD_INTERVAL_MS,
    });

    try {
      await window.Sk.misceval.asyncToPromise(() =>
        window.Sk.importMainWithBody("<stdin>", false, vfs["main.py"], true),
      );
    } catch (error) {
      const rawError = error?.toString?.() ?? "Kesalahan tidak diketahui";
      const isTimeLimitError =
        error?.tp$name === "TimeLimitError" ||
        /TimeLimitError|Program exceeded run time limit/i.test(rawError);
      const errorMessage = isTimeLimitError
        ? `\n[PROGRAM DIHENTIKAN] Batas waktu eksekusi ${MAX_EXECUTION_MS / 1000} detik tercapai.\n${rawError}\n`
        : `\n[ERROR]: ${rawError}\n`;

      if (outputLimitShown) {
        appendTerminalText(errorMessage);
        terminalContainer.scrollTop = terminalContainer.scrollHeight;
      } else {
        printToTerminal(errorMessage);
      }
    } finally {
      runBtn.disabled = false;
      runBtn.classList.remove("opacity-75");
      runText.textContent = "JALANKAN";
    }
  });

  renderTabs();
});
