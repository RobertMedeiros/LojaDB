"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Feedback from "@/components/Feedback";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { apiFetch } from "@/lib/api";
import type { Categoria, Status } from "@/lib/types";

type CategoriaForm = {
  nome: string;
  descricao: string;
  ativo: Status;
};

const emptyForm: CategoriaForm = { nome: "", descricao: "", ativo: "S" };

export default function CategoriasPage() {
  const [items, setItems] = useState<Categoria[]>([]);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [form, setForm] = useState<CategoriaForm>(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setItems(await apiFetch<Categoria[]>("/api/Categorias"));
    } catch {
      setError("Não foi possível carregar as categorias.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item: Categoria) {
    setEditing(item);
    setForm({ nome: item.nome, descricao: item.descricao, ativo: item.ativo });
    setModalOpen(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (editing) {
        await apiFetch<void>(`/api/Categorias/${editing.categoriaID}`, {
          method: "PUT",
          body: JSON.stringify({ categoriaID: editing.categoriaID, ...form }),
        });
      } else {
        await apiFetch<Categoria>("/api/Categorias", {
          method: "POST",
          body: JSON.stringify({ categoriaID: 0, ...form }),
        });
      }

      setModalOpen(false);
      setSuccess("Categoria salva com sucesso.");
      await load();
    } catch {
      setError("Não foi possível salvar a categoria. Confira os dados preenchidos.");
    }
  }

  async function remove(item: Categoria) {
    if (!confirm(`Excluir a categoria “${item.nome}”?`)) return;

    try {
      await apiFetch<void>(`/api/Categorias/${item.categoriaID}`, { method: "DELETE" });
      setSuccess("Categoria excluída com sucesso.");
      await load();
    } catch {
      setError("Não foi possível excluir a categoria. Ela pode estar vinculada a produtos.");
    }
  }

  return (
    <>
      <PageHeader
        title="Categorias"
        description="Organize os produtos da loja por categoria."
        action={<button className="button primary" onClick={openNew}>Nova categoria</button>}
      />

      <Feedback message={error} />
      <Feedback message={success} type="success" />

      <section className="card table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>ID</th><th>Nome</th><th>Descrição</th><th>Status</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td className="empty" colSpan={5}>Nenhuma categoria cadastrada.</td></tr>
              ) : items.map((item) => (
                <tr key={item.categoriaID}>
                  <td>{item.categoriaID}</td>
                  <td><strong>{item.nome}</strong></td>
                  <td>{item.descricao}</td>
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
        <Modal title={editing ? "Editar categoria" : "Nova categoria"} onClose={() => setModalOpen(false)}>
          <form onSubmit={submit} className="form-grid">
            <label className="field">
              <span>Nome</span>
              <input maxLength={50} required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
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
              <textarea maxLength={50} required value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
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
