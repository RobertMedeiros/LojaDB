"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Feedback from "@/components/Feedback";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { apiFetch } from "@/lib/api";
import type { Cliente, Status } from "@/lib/types";

type ClienteForm = {
  nome: string;
  email: string;
  telefone: string;
  ativo: Status;
};

const emptyForm: ClienteForm = { nome: "", email: "", telefone: "", ativo: "S" };

export default function ClientesPage() {
  const [items, setItems] = useState<Cliente[]>([]);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [form, setForm] = useState<ClienteForm>(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setItems(await apiFetch<Cliente[]>("/api/Clientes"));
    } catch {
      setError("Não foi possível carregar os clientes.");
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

  function openEdit(item: Cliente) {
    setEditing(item);
    setForm({
      nome: item.nome,
      email: item.email,
      telefone: item.telefone ?? "",
      ativo: item.ativo,
    });
    setModalOpen(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      clienteID: editing?.clienteID ?? 0,
      nome: form.nome.trim(),
      email: form.email.trim(),
      telefone: form.telefone.trim() || null,
      dataCadastro: editing?.dataCadastro ?? new Date().toISOString(),
      ativo: form.ativo,
    };

    try {
      if (editing) {
        await apiFetch<void>(`/api/Clientes/${editing.clienteID}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch<Cliente>("/api/Clientes", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      setSuccess("Cliente salvo com sucesso.");
      await load();
    } catch {
      setError("Não foi possível salvar o cliente. O e-mail deve ser único.");
    }
  }

  async function remove(item: Cliente) {
    if (!confirm(`Excluir o cliente “${item.nome}”?`)) return;

    try {
      await apiFetch<void>(`/api/Clientes/${item.clienteID}`, { method: "DELETE" });
      setSuccess("Cliente excluído com sucesso.");
      await load();
    } catch {
      setError("Não foi possível excluir o cliente. Ele pode possuir pedidos vinculados.");
    }
  }

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Gerencie os clientes cadastrados na loja."
        action={<button className="button primary" onClick={openNew}>Novo cliente</button>}
      />

      <Feedback message={error} />
      <Feedback message={success} type="success" />

      <section className="card table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Cadastro</th><th>Status</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td className="empty" colSpan={7}>Nenhum cliente cadastrado.</td></tr>
              ) : items.map((item) => (
                <tr key={item.clienteID}>
                  <td>{item.clienteID}</td>
                  <td><strong>{item.nome}</strong></td>
                  <td>{item.email}</td>
                  <td>{item.telefone || "—"}</td>
                  <td>{new Date(item.dataCadastro).toLocaleDateString("pt-BR")}</td>
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
        <Modal title={editing ? "Editar cliente" : "Novo cliente"} onClose={() => setModalOpen(false)}>
          <form onSubmit={submit} className="form-grid">
            <label className="field">
              <span>Nome</span>
              <input maxLength={50} required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </label>
            <label className="field">
              <span>E-mail</span>
              <input type="email" maxLength={50} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className="field">
              <span>Telefone</span>
              <input maxLength={20} value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
            </label>
            <label className="field">
              <span>Status</span>
              <select value={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.value as Status })}>
                <option value="S">Ativo</option>
                <option value="N">Inativo</option>
              </select>
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
