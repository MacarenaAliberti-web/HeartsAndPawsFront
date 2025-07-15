"use client";

import { useEffect, useState } from "react";
import {
  getTotalMascotas,
  getTotalDonaciones,
  getTotalAdopcionesAceptadas,
  getTodosUser,
  getTotalOrganizacionesAprobadas,
  getTodosOng,
} from "../../services/adminconexion";

type Usuario = {
  id: string;
  nombre: string;
  email: string;
  pais: string;
  rol: string;
  externalId: string | null;
};

type ONG = {
  id: string;
  nombre: string;
  email: string;
  pais: string;
};

export default function DashboardResumen() {
  const [stats, setStats] = useState({
    organizations: 0,
    pets: 0,
    donations: 0,
    adoptions: 0,
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [orgs, setOrgs] = useState<ONG[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          organizationsCount,
          pets,
          donations,
          adoptions,
          usuariosRes,
          ultimasOrganizaciones,
        ] = await Promise.all([
          getTotalOrganizacionesAprobadas(),
          getTotalMascotas(),
          getTotalDonaciones(),
          getTotalAdopcionesAceptadas(),
          getTodosUser(),
          getTodosOng(),
        ]);

        let usuariosData: Usuario[] = [];
        if (usuariosRes) {
          usuariosData = await usuariosRes.json();
        }

        let organizacion: ONG[] = [];
        if (ultimasOrganizaciones) {
          organizacion = await ultimasOrganizaciones.json();
          console.log("Datos de organizaciones:", organizacion);
        }

        const organizaciones = organizacion.filter(
          (o: ONG) => o.nombre.toLowerCase() !== ""
        );

        const usuariosActivos = usuariosData.filter(
          (u: Usuario) => u.rol?.toLowerCase() === "usuario"
        );

        setStats({
          organizations: organizationsCount,
          pets,
          donations,
          adoptions,
        });
        setUsuarios(usuariosActivos.slice(0, 6));

        setOrgs(organizaciones.slice(0, 6));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos del resumen");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) return <p className="text-pink-600">Cargando resumen...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">
        Resumen del Panel de Administración
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <ResumenCard
          title="Organizaciones Aprobadas"
          value={stats.organizations}
        />
        <ResumenCard title="Mascotas Registradas" value={stats.pets} />
        <ResumenCard title="Adopciones Completadas" value={stats.adoptions} />
        <ResumenCard title="Donaciones Totales" value={`$${stats.donations}`} />
      </div>

      {/* Tabla de Organizaciones */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-pink-700 mb-4">
          Últimas Organizaciones Registradas
        </h2>
        <TablaSimple data={orgs} />
      </div>

      {/* Tabla de Usuarios */}
      <div>
        <h2 className="text-2xl font-semibold text-pink-700 mb-4">
          Últimos Usuarios Registrados
        </h2>
        <TablaSimple data={usuarios} />
      </div>
    </div>
  );
}

type ResumenCardProps = {
  title: string;
  value: string | number;
};

function ResumenCard({ title, value }: ResumenCardProps) {
  return (
    <div className="bg-pink-100 text-pink-800 border border-pink-200 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-200">
      <h4 className="text-sm font-semibold uppercase tracking-wide">{title}</h4>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

type TablaSimpleProps = {
  data: (Usuario | ONG)[];
};

function TablaSimple({ data }: TablaSimpleProps) {
  return (
    <div className="overflow-x-auto bg-white border border-pink-200 rounded-lg shadow">
      <table className="min-w-full divide-y divide-pink-200">
        <thead className="bg-pink-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-pink-700 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-pink-700 uppercase tracking-wider">
              Email
            </th>
            {"rol" in data[0] && (
              <th className="px-4 py-3 text-left text-xs font-semibold text-pink-700 uppercase tracking-wider">
                País
              </th>
            )}
            {"rol" in data[0] && (
              <th className="px-4 py-3 text-left text-xs font-semibold text-pink-700 uppercase tracking-wider">
                Origen
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-pink-100">
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3 text-sm text-gray-800">{item.nombre}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{item.email}</td>
              {"rol" in item && (
                <td className="px-4 py-3 text-sm text-gray-600">{item.pais}</td>
              )}
              {"rol" in item && (
                <td className="px-4 py-3 text-sm">
                  {item.externalId ? (
                    <span className="text-green-600 font-medium">Supabase</span>
                  ) : (
                    <span className="text-blue-600 font-medium">Local</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
