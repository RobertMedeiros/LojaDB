"use client";

import { useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Feedback from "@/components/Feedback";
import { apiFetch } from "@/lib/api";
import type { Categoria, Cliente, Produto } from "@/lib/types";

export default function DashboardPage() {
  const [counts, setCounts] = useState({ categorias: 0, produtos: 0, clientes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [categorias, produtos, clientes] = await Promise.all([
        apiFetch<Categoria[]>("/api/Categorias"),
        apiFetch<Produto[]>("/api/Produtos"),
        apiFetch<Cliente[]>("/api/Clientes"),
      ]);

      setCounts({
        categorias: categorias.length,
        produtos: produtos.length,
        clientes: clientes.length,
      });
    } catch {
      setError("Não foi possível acessar a API. Verifique se o backend .NET está rodando na porta configurada.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <PageHeader
        title="Visão geral"
        description="Acompanhe os principais cadastros da aplicação."
        action={
          <button className="button secondary" onClick={() => void load()}>
            Atualizar
          </button>
        }
      />

      <Feedback message={error} />

      <section className="metrics-grid">
        <Metric title="Categorias" value={loading ? "—" : counts.categorias} />
        <Metric title="Produtos" value={loading ? "—" : counts.produtos} />
        <Metric title="Clientes" value={loading ? "—" : counts.clientes} />
      </section>
    </>
  );
}

function Metric({ title, value }: { title: string; value: number | string }) {
  return (
    <article className="card metric-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>registros cadastrados</small>
    </article>
  );
}
