// Controle de Gastos
// Conceitos praticados: objetos, reduce/filter/sort, Intl, localStorage, Blob (exportar CSV).

const CHAVE = "controle-gastos-v1";

const form = document.getElementById("form");
const lista = document.getElementById("lista");
const grafico = document.getElementById("grafico");
const filtroTipo = document.getElementById("filtro-tipo");
const campoData = document.getElementById("data");

let transacoes = carregar();

// ---------- Utilidades ----------
const moeda = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function formatarData(iso) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function hojeISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // ajusta para o fuso local
  return d.toISOString().slice(0, 10);
}

// ---------- Armazenamento ----------
function carregar() {
  try { return JSON.parse(localStorage.getItem(CHAVE)) || []; }
  catch (e) { return []; }
}
function salvar() { localStorage.setItem(CHAVE, JSON.stringify(transacoes)); }

// ---------- Cálculos ----------
function somar(tipo) {
  return transacoes
    .filter((t) => t.tipo === tipo)
    .reduce((total, t) => total + t.valor, 0);
}

function despesasPorCategoria() {
  const mapa = {};
  transacoes
    .filter((t) => t.tipo === "despesa")
    .forEach((t) => { mapa[t.categoria] = (mapa[t.categoria] || 0) + t.valor; });
  return Object.entries(mapa).sort((a, b) => b[1] - a[1]); // maior gasto primeiro
}

// ---------- Renderização ----------
function renderizarResumo() {
  const receitas = somar("receita");
  const despesas = somar("despesa");
  const saldo = receitas - despesas;

  document.getElementById("total-receitas").textContent = moeda(receitas);
  document.getElementById("total-despesas").textContent = moeda(despesas);
  const el = document.getElementById("saldo");
  el.textContent = moeda(saldo);
  el.className = saldo >= 0 ? "verde" : "vermelho";
}

function renderizarGrafico() {
  grafico.innerHTML = "";
  const dados = despesasPorCategoria();
  if (dados.length === 0) {
    grafico.innerHTML = '<p class="vazio">Sem despesas registradas.</p>';
    return;
  }
  const maximo = dados[0][1];
  dados.forEach(([categoria, total]) => {
    const linha = document.createElement("div");
    linha.className = "barra-linha";

    const nome = document.createElement("span");
    nome.textContent = categoria;

    const fundo = document.createElement("div");
    fundo.className = "barra-fundo";
    const barra = document.createElement("div");
    barra.className = "barra";
    barra.style.width = (total / maximo) * 100 + "%";
    fundo.appendChild(barra);

    const valor = document.createElement("span");
    valor.className = "valor-barra";
    valor.textContent = moeda(total);

    linha.append(nome, fundo, valor);
    grafico.appendChild(linha);
  });
}

function renderizarLista() {
  lista.innerHTML = "";
  const tipo = filtroTipo.value;
  const itens = transacoes
    .filter((t) => tipo === "todas" || t.tipo === tipo)
    .sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id); // mais recentes primeiro

  if (itens.length === 0) {
    lista.innerHTML = '<li class="vazio">Nenhuma transação.</li>';
    return;
  }

  itens.forEach((t) => {
    const li = document.createElement("li");
    li.className = t.tipo;

    const info = document.createElement("div");
    info.className = "info";
    const desc = document.createElement("div");
    desc.textContent = t.descricao;
    const detalhe = document.createElement("small");
    detalhe.textContent = `${t.categoria} • ${formatarData(t.data)}`;
    info.append(desc, detalhe);

    const valor = document.createElement("span");
    valor.className = "valor";
    valor.textContent = (t.tipo === "despesa" ? "- " : "+ ") + moeda(t.valor);

    const apagar = document.createElement("button");
    apagar.textContent = "✕";
    apagar.title = "Remover";
    apagar.addEventListener("click", () => remover(t.id));

    li.append(info, valor, apagar);
    lista.appendChild(li);
  });
}

function renderizar() {
  renderizarResumo();
  renderizarGrafico();
  renderizarLista();
}

// ---------- Ações ----------
function remover(id) {
  if (!confirm("Remover esta transação?")) return;
  transacoes = transacoes.filter((t) => t.id !== id);
  salvar();
  renderizar();
}

function exportarCSV() {
  if (transacoes.length === 0) { alert("Não há transações para exportar."); return; }
  const cabecalho = "Data;Descrição;Tipo;Categoria;Valor\n";
  const linhas = transacoes.map((t) =>
    [t.data, '"' + t.descricao.replace(/"/g, '""') + '"', t.tipo, t.categoria,
     t.valor.toFixed(2).replace(".", ",")].join(";")
  );
  const blob = new Blob(["\uFEFF" + cabecalho + linhas.join("\n")], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transacoes.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

// ---------- Eventos ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const valor = parseFloat(document.getElementById("valor").value);
  if (!(valor > 0)) return;

  transacoes.push({
    id: Date.now(),
    descricao: document.getElementById("descricao").value.trim(),
    valor,
    tipo: document.getElementById("tipo").value,
    categoria: document.getElementById("categoria").value,
    data: campoData.value,
  });
  salvar();
  form.reset();
  campoData.value = hojeISO();
  renderizar();
});

filtroTipo.addEventListener("change", renderizarLista);
document.getElementById("exportar").addEventListener("click", exportarCSV);

campoData.value = hojeISO();
renderizar();
