// src/scripts/python-playground.js

document.addEventListener("DOMContentLoaded", () => {
  const vfs = {
    "main.py":
      "# Selamat datang di Python Playground!\n# Tulis kode Anda di sini:\n\nprint('Halo dari Python Web!')\nnama = input('Siapa nama Anda? ')\nprint(f'Selamat belajar, {nama}!')\n",
  };

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

  const runBtn = document.getElementById("run-btn");
  const runText = document.getElementById("run-text");
  const outputTerminal = document.getElementById("output-terminal");
  const terminalContainer = document.getElementById("terminal-container");
  const tabsContainer = document.getElementById("tabs-container");
  const addTabBtn = document.getElementById("add-tab-btn");

  // DOM Modal Tambah/Edit
  const fileModal = document.getElementById("file-modal");
  const modalInput = document.getElementById("modal-input");
  const modalTitle = document.getElementById("modal-title");
  const modalError = document.getElementById("modal-error");
  const modalCancel = document.getElementById("modal-cancel");
  const modalSave = document.getElementById("modal-save");

  // DOM Modal Hapus
  const deleteModal = document.getElementById("delete-modal");
  const deleteModalText = document.getElementById("delete-modal-text");
  const deleteCancel = document.getElementById("delete-cancel");
  const deleteConfirm = document.getElementById("delete-confirm");

  let modalMode = "add";
  let fileToRename = "";
  let fileToDelete = "";

  const editor = CodeMirror.fromTextArea(
    document.getElementById("code-editor"),
    {
      mode: "python",
      theme: "dracula",
      lineNumbers: true,
      indentUnit: 4,
      matchBrackets: true,
    },
  );
  editor.setSize("100%", "100%");
  editor.setValue(vfs[activeTab]);

  function renderTabs() {
    tabsContainer.innerHTML = "";

    Object.keys(vfs).forEach((filename) => {
      const isMain = filename === "main.py";
      const isActive = filename === activeTab;

      const tabEl = document.createElement("div");
      tabEl.className = `group flex items-center gap-2 px-4 py-2 font-mono text-sm font-bold border-r-4 border-white cursor-pointer shrink-0 transition-colors ${isActive ? "bg-white text-black" : "bg-[#1e1e1e] text-neutral-400 hover:bg-[#00e5ff] hover:text-black"}`;

      const titleEl = document.createElement("span");
      titleEl.textContent = filename;
      tabEl.appendChild(titleEl);

      if (!isMain) {
        tabEl.title = "Klik Ganda untuk Ubah Nama";
        tabEl.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          openModal("rename", filename);
        });
      }

      if (!isMain) {
        const delBtn = document.createElement("button");
        delBtn.innerHTML = "×";
        delBtn.className = `text-xl leading-none font-black ml-1 ${isActive ? "text-black hover:text-[#ff0055]" : "text-neutral-500 group-hover:text-[#ff0055]"}`;
        delBtn.title = "Hapus Modul";
        delBtn.onclick = (e) => {
          e.stopPropagation();
          openDeleteModal(filename);
        };
        tabEl.appendChild(delBtn);
      }

      tabEl.onclick = () => switchTab(filename);
      tabsContainer.appendChild(tabEl);
    });
  }

  function switchTab(targetTab) {
    if (activeTab === targetTab) return;
    vfs[activeTab] = editor.getValue();
    activeTab = targetTab;
    editor.setValue(vfs[activeTab]);
    renderTabs();
  }

  function openDeleteModal(filename) {
    fileToDelete = filename;
    deleteModalText.innerHTML = `Apakah Anda yakin ingin menghapus modul <br><strong class="text-white bg-black px-1">${filename}</strong> ?`;
    deleteModal.classList.remove("hidden");
  }

  deleteCancel.onclick = () => {
    deleteModal.classList.add("hidden");
  };

  deleteConfirm.onclick = () => {
    delete vfs[fileToDelete];
    if (activeTab === fileToDelete) {
      activeTab = "main.py";
      editor.setValue(vfs[activeTab]);
    }
    renderTabs();
    deleteModal.classList.add("hidden");
  };

  function openModal(mode, oldName = "") {
    modalMode = mode;
    fileToRename = oldName;
    modalError.classList.add("hidden");

    if (mode === "add") {
      modalTitle.innerText = "Tambah Modul Baru";
      modalInput.value = "";
    } else {
      modalTitle.innerText = "Ubah Nama Modul";
      modalInput.value = oldName;
    }

    fileModal.classList.remove("hidden");
    modalInput.focus();
  }

  function closeModal() {
    fileModal.classList.add("hidden");
    modalInput.value = "";
  }

  function showError(msg) {
    modalError.innerText = msg;
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

    if (vfs[name] !== undefined && name !== fileToRename) {
      showError(`Modul dengan nama '${name}' sudah ada!`);
      return;
    }

    if (modalMode === "add") {
      vfs[activeTab] = editor.getValue();
      vfs[name] = "# Modul: " + name + "\n\n";
      activeTab = name;
      editor.setValue(vfs[activeTab]);
    } else {
      if (activeTab === fileToRename) vfs[activeTab] = editor.getValue();
      vfs[name] = vfs[fileToRename];
      delete vfs[fileToRename];
      if (activeTab === fileToRename) activeTab = name;
    }

    closeModal();
    renderTabs();
  }

  addTabBtn.addEventListener("click", () => openModal("add"));
  modalCancel.addEventListener("click", closeModal);
  modalSave.addEventListener("click", saveModal);
  modalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveModal();
    if (e.key === "Escape") closeModal();
  });

  function printToTerminal(text) {
    outputTerminal.textContent += text;
    terminalContainer.scrollTop = terminalContainer.scrollHeight;
  }

  function skulptRead(x) {
    if (
      Sk.builtinFiles === undefined ||
      Sk.builtinFiles["files"][x] === undefined
    ) {
      let filename = x.replace(/^.\//, "");
      if (vfs[filename]) return vfs[filename];
      throw "File tidak ditemukan: '" + filename + "'";
    }
    return Sk.builtinFiles["files"][x];
  }

  function skulptInput(promptText) {
    return new Promise((resolve) => {
      printToTerminal(promptText);
      const inputEl = document.createElement("input");
      inputEl.type = "text";
      inputEl.className = "terminal-input";

      const wrapper = document.createElement("span");
      wrapper.appendChild(inputEl);
      outputTerminal.appendChild(wrapper);

      inputEl.focus();
      inputEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          const userInput = inputEl.value;
          wrapper.remove();
          printToTerminal(userInput + "\n");
          resolve(userInput);
        }
      });
    });
  }

  runBtn.addEventListener("click", async () => {
    vfs[activeTab] = editor.getValue();

    runBtn.disabled = true;
    runBtn.classList.add("opacity-75");
    runText.innerText = "RUNNING";
    outputTerminal.textContent = "";

    Sk.configure({
      output: printToTerminal,
      read: skulptRead,
      inputfun: skulptInput,
      inputfunTakesPrompt: true,
    });

    try {
      await Sk.misceval.asyncToPromise(() =>
        Sk.importMainWithBody("<stdin>", false, vfs["main.py"], true),
      );
    } catch (err) {
      printToTerminal("\n[ERROR]: " + err.toString() + "\n");
    } finally {
      runBtn.disabled = false;
      runBtn.classList.remove("opacity-75");
      runText.innerText = "RUN";
    }
  });

  renderTabs();
});
