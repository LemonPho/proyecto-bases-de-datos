import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDonaciones, getGastos } from "./fetch";
import CrearDonacion from "./CrearDonacion";
import CrearGasto from "./CrearGasto";

const TIPO_COLORES = {
  monetaria: "bg-green-100 text-green-700",
  especie: "bg-blue-100 text-blue-700",
  servicio: "bg-purple-100 text-purple-700",
};

function formatMonto(valor) {
  if (valor === null || valor === undefined) return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(valor);
}

export default function FinanzasAdmin() {
  const [tab, setTab] = useState("donaciones");

  const [donaciones, setDonaciones] = useState([]);
  const [gastos, setGastos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [isDonacionOpen, setIsDonacionOpen] = useState(false);
  const [isGastoOpen, setIsGastoOpen] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    setErrorMessage("");

    const [donRes, gasRes] = await Promise.all([getDonaciones(), getGastos()]);

    setDonaciones(donRes.data);
    setGastos(gasRes.data);

    if (donRes.errorMessage || gasRes.errorMessage) {
      setErrorMessage(donRes.errorMessage || gasRes.errorMessage);
    }

    setLoading(false);
  }

  const totalDonaciones = donaciones.reduce(
    (acc, d) => acc + (parseFloat(d.monto_o_valor) || 0),
    0
  );
  const totalGastos = gastos.reduce(
    (acc, g) => acc + (parseFloat(g.monto) || 0),
    0
  );
  const balance = totalDonaciones - totalGastos;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/admin"
              className="text-sm font-semibold text-slate-400 hover:text-slate-600"
            >
              ← Volver al dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-800">
              Finanzas
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Donaciones recibidas y gastos operativos.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              tab === "donaciones"
                ? setIsDonacionOpen(true)
                : setIsGastoOpen(true)
            }
            className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 active:scale-95"
          >
            {tab === "donaciones" ? "+ Nueva donación" : "+ Nuevo gasto"}
          </button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-black uppercase tracking-widest text-green-600">
              Donaciones
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-800">
              {formatMonto(totalDonaciones)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {donaciones.length} registros
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-black uppercase tracking-widest text-red-600">
              Gastos
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-800">
              {formatMonto(totalGastos)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {gastos.length} registros
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Balance
            </p>
            <p
              className={`mt-2 text-2xl font-extrabold ${
                balance >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {formatMonto(balance)}
            </p>
          </div>
        </div>

        <div className="mb-5 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("donaciones")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              tab === "donaciones"
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            Donaciones
          </button>
          <button
            type="button"
            onClick={() => setTab("gastos")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              tab === "gastos"
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            Gastos
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          {loading ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">
              Cargando...
            </div>
          ) : errorMessage ? (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
              <button
                type="button"
                onClick={fetchAll}
                className="mt-4 rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
              >
                Reintentar
              </button>
            </div>
          ) : tab === "donaciones" ? (
            donaciones.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-400">
                No hay donaciones registradas.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-black">Donante</th>
                      <th className="px-6 py-4 font-black">Refugio</th>
                      <th className="px-6 py-4 font-black">Tipo</th>
                      <th className="px-6 py-4 font-black">Monto/Valor</th>
                      <th className="px-6 py-4 font-black">Detalle</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {donaciones.map((d) => (
                      <tr key={d.id} className="transition hover:bg-blue-50">
                        <td className="px-6 py-4">
                          <Link
                            to={`/admin/finanzas/donacion/${d.id}`}
                            className="font-extrabold text-slate-800 hover:text-blue-700"
                          >
                            {d.donante?.contacto?.nombre || "Sin nombre"}
                          </Link>
                          <p className="mt-1 text-xs text-slate-400">
                            ID: {d.id.slice(0, 8)}...
                          </p>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {d.refugio?.nombre || "Sin refugio"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                              TIPO_COLORES[d.tipo_donacion] ??
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {d.tipo_donacion}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {formatMonto(d.monto_o_valor)}
                        </td>
                        <td className="max-w-xs px-6 py-4 text-slate-500">
                          {d.detalle || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : gastos.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">
              No hay gastos registrados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-black">Concepto</th>
                    <th className="px-6 py-4 font-black">Refugio</th>
                    <th className="px-6 py-4 font-black">Monto</th>
                    <th className="px-6 py-4 font-black">Fecha</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {gastos.map((g) => (
                    <tr key={g.id} className="transition hover:bg-red-50">
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/finanzas/gasto/${g.id}`}
                          className="font-extrabold text-slate-800 hover:text-red-700"
                        >
                          {g.concepto}
                        </Link>
                        <p className="mt-1 text-xs text-slate-400">
                          ID: {g.id.slice(0, 8)}...
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {g.refugio?.nombre || "Sin refugio"}
                      </td>
                      <td className="px-6 py-4 font-bold text-red-700">
                        {formatMonto(g.monto)}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {g.fecha_gasto}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CrearDonacion
        isOpen={isDonacionOpen}
        onClose={() => setIsDonacionOpen(false)}
        onCreated={() => fetchAll()}
      />

      <CrearGasto
        isOpen={isGastoOpen}
        onClose={() => setIsGastoOpen(false)}
        onCreated={() => fetchAll()}
      />
    </div>
  );
}
