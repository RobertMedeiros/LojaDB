"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Feedback from "@/components/Feedback";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { apiFetch } from "@/lib/api";
import type { Categoria, Produto, Status } from "@/lib/types";

type ProdutoForm = {
  nome: string;
  descricao: string;
  categoriaID: string;
  preco: string;
  estoque: string;
  ativo: Status;
};

const emptyForm: ProdutoForm = {
  nome: "",
  descricao: "",
  categoriaID: "",
  preco: "",
  estoque: "0",
  ativo: "S",
};

export default function ProdutosPage() {
  const [items, setItems] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [form, setForm] = useState<ProdutoForm>(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [produtos, cats] = await Promise.all([
        apiFetch<Produto[]>("/api/Produtos"),
        apiFetch<Categoria[]>("/api/Categorias"),
      ]);
      setItems(produtos);
      setCategorias(cats);
    } catch {
      setError("Não foi possível carregar os produtos.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openNew() {
    if (categorias.length === 0) {
      setError("Cadastre uma categoria antes de cadastrar produtos.");
      return;
    }
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item: Produto) {
    setEditing(item);
    setForm({
      nome: item.nome,
      descricao: item.descricao ?? "",
      categoriaID: String(item.categoriaID),
      preco: String(item.preco),
      estoque: String(item.estoque),
      ativo: item.ativo,
    });
    setModalOpen(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      produtoID: editing?.produtoID ?? 0,
      categoriaID: Number(form.categoriaID),
      nome: form.nome.trim(),
      descricao: form.descricao.trim() || null,
      preco: Number(form.preco),
      estoque: Number(form.estoque),
      dataCadastro: editing?.dataCadastro ?? new Date().toISOString(),
      ativo: form.ativo,
    };

    try {
      if (editing) {
        await apiFetch<void>(`/api/Produtos/${editing.produtoID}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch<Produto>("/api/Produtos", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      setSuccess("Produto salvo com sucesso.");
      await load();
    } catch {
      setError("Não foi possível salvar o produto. Confira preço, estoque e categoria.");
    }
  }

  async function remove(item: Produto) {
    if (!confirm(`Excluir o produto “${item.nome}”?`)) return;

    try {
      await apiFetch<void>(`/api/Produtos/${item.produtoID}`, { method: "DELETE" });
      setSuccess("Produto excluído com sucesso.");
      await load();
    } catch {
      setError("Não foi possível excluir o produto. Ele pode estar vinculado a itens de pedido.");
    }
  }

  function categoriaNome(id: number) {
    return categorias.find((categoria) => categoria.categoriaID === id)?.nome ?? `#${id}`;
  }

  return (
    <>
      <PageHeader
        title="Produtos"
        description="Controle catálogo, preço, categoria e estoque."
        action={<button className="button primary" onClick={openNew}>Novo produto</button>}
      />

      <Feedback message={error} />
      <Feedback message={success} type="success" />

      <section className="card table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>ID</th><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Status</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td className="empty" colSpan={7}>Nenhum produto cadastrado.</td></tr>
              ) : items.map((item) => (
                <tr key={item.produtoID}>
                  <td>{item.produtoID}</td>
                  <td>
                    <strong>{item.nome}</strong>
                    {item.descricao && <small className="subline">{item.descricao}</small>}
                  </td>
                  <td>{categoriaNome(item.categoriaID)}</td>
                  <td>{Number(item.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                  <td>{item.estoque}</td>
                  <td><StatusBadge status={item.ativo} /></td>
                  <td className="actions">
                    <button className="button small secondary" onClick={() => openEdit(item)}>Editar</button>
                    <button className="button small danger" onClick={() => void remove(item)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <Modal title={editing ? "Editar produto" : "Novo produto"} onClose={() => setModalOpen(false)}>
          <form onSubmit={submit} className="form-grid">
            <label className="field">
              <span>Nome</span>
              <input maxLength={100} required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </label>
            <label className="field">
              <span>Categoria</span>
              <select required value={form.categoriaID} onChange={(e) => setForm({ ...form, categoriaID: e.target.value })}>
                <option value="">Selecione...</option>
                {categorias.map((categoria) => (
                  <option key={categoria.categoriaID} value={categoria.categoriaID}>{categoria.nome}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Preço</span>
              <input type="number" min="0.01" step="0.01" required value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} />
            </label>
            <label className="field">
              <span>Estoque</span>
              <input type="number" min="0" step="1" required value={form.estoque} onChange={(e) => setForm({ ...form, estoque: e.target.value })} />
            </label>
            <label className="field">
              <span>Status</span>
              <select value={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.value as Status })}>
                <option value="S">Ativo</option>
                <option value="N">Inativo</option>
              </select>
            </label>
            <label className="field full">
              <span>Descrição</span>
              <textarea maxLength={500} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
            </label>
            <div className="form-actions full">
              <button className="button secondary" type="button" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className="button primary" type="submit">Salvar</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
