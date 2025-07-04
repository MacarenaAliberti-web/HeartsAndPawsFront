'use client'

import { useEffect, useState, useCallback } from 'react'
import { getFavoritosPorUsuario, putAgregarAFavoritos } from '@/services/favoritos'
import { iniciarDonacion, getDetalleDonacionPorCaso } from '@/services/donacion' // Importar getDetalleDonacionPorCaso
import MascotaCard from '@/components/adopcion/MascotaCard'
import MascotaModal from '@/components/adopcion/MascotaModal'
import DonarModal from '@/components/donacion/DonarModal'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'
import { Mascota } from '@/types/mascotas'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Imagen {
  url: string
}

interface MascotaFavorito {
  id?: string
  nombre: string
  imagenes?: Imagen[]
}

interface CasoFavorito {
  id: string
  titulo: string
  descripcion: string
  tipo: 'ADOPCION' | 'DONACION' | string
  mascotaId: string
  creado_en: string
  mascota: MascotaFavorito
}

interface Favorito {
  id: string
  usuarioId: string
  casoId: string
  caso: CasoFavorito
}

export default function MisFavoritos() {
  const { usuario } = useUsuarioAuth()
  const router = useRouter()
  const [favoritos, setFavoritos] = useState<Favorito[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  // Estado para mostrar modal de donación y casoId para donación
  const [donarModalVisible, setDonarModalVisible] = useState(false)
  const [casoDonacionId, setCasoDonacionId] = useState<string | null>(null)
  const [detalleDonacion, setDetalleDonacion] = useState<{ meta: number; recaudado: number } | null>(null)

  const fetchFavoritos = useCallback(async () => {
    if (!usuario) return
    setLoading(true)
    setError(null)
    try {
      const data = await getFavoritosPorUsuario(usuario.id)
      setFavoritos(data)
    } catch {
      setError('Error al cargar tus favoritos. Asegurate de estar logueado.')
    } finally {
      setLoading(false)
    }
  }, [usuario])

  useEffect(() => {
    fetchFavoritos()
  }, [fetchFavoritos])

  const handleEliminarFavorito = async (favorito: Favorito) => {
    if (!usuario) {
      toast.error('Debes estar logueado para quitar favoritos')
      return
    }
    try {
      await putAgregarAFavoritos(usuario.id, favorito.casoId)
      toast.success('Favorito eliminado')
      fetchFavoritos()
    } catch {
      toast.error('No se pudo eliminar el favorito')
    }
  }

  const handleConocerHistoria = (mascota: Mascota) => {
    setMascotaSeleccionada(mascota)
    setModalVisible(true)
  }

  // Al clickear en Adoptar o Donar en la card o modal
  const handleAdoptarODonar = async (casoId: string) => {
    const favorito = favoritos.find((f) => f.caso.id === casoId)
    if (!favorito) {
      toast.error('No se pudo encontrar el caso.')
      return
    }

    const tipo = favorito.caso.tipo.toUpperCase()
    const mascotaApi = favorito.caso.mascota
    if (!mascotaApi) return

    const mascota: Mascota = {
      id: mascotaApi.id ?? favorito.caso.mascotaId,
      casoId: favorito.caso.id,
      nombre: mascotaApi.nombre,
      tipo: tipo === 'ADOPCION' ? 'adopcion' : 'donacion',
      descripcion: favorito.caso.descripcion,
      imagenes: (mascotaApi.imagenes ?? []).map((img, idx) => ({
        id: img.url || String(idx),
        url: img.url,
      })),
    }

    if (mascota.tipo === 'adopcion') {
      toast.success(`¡Gracias por querer adoptar a ${mascota.nombre}! 🐶🐱`)
      setModalVisible(false) // Cerramos el modal si estaba abierto
      router.push(`/adoptar/formulario-adopcion?id=${mascota.casoId}`)
    } else {
      // Abrir modal para elegir monto en donación
      setCasoDonacionId(mascota.casoId)
      setDonarModalVisible(true)

      // Obtener detalle de donación
      try {
        const detalle = await getDetalleDonacionPorCaso(mascota.casoId)
        if (detalle) {
          setDetalleDonacion({
            meta: detalle.metaDonacion,
            recaudado: detalle.estadoDonacion,
          })
        } else {
          toast.error('No se pudo obtener la información de la donación.')
        }
      } catch (error) {
        console.error('Error al obtener detalle de donación:', error)
        toast.error('Ocurrió un error al cargar los datos de donación.')
      }
    }
  }

  const handleConfirmarDonacion = async (monto: number) => {
    if (!casoDonacionId || !usuario) {
      toast.error('Error: falta información para realizar la donación.')
      return
    }

    try {
      const data = await iniciarDonacion({
        usuarioId: usuario.id,
        casoId: casoDonacionId,
        monto,
      })

      if (data?.url) {
        window.location.href = data.url
      } else {
        toast.error('No se pudo generar el link de pago.')
      }
    } catch (error) {
      console.error('Error al iniciar la donación:', error)
      toast.error('Ocurrió un error al iniciar la donación.')
    }
  }

  return (
    <div className="flex min-h-screen bg-pink-50">
      {/* Sidebar */}
      <nav className="flex flex-col px-4 py-6 text-white bg-pink-600 w-60">
        <h2 className="mb-8 text-xl font-semibold text-center">Perfil del Usuario</h2>

        <button onClick={() => router.push('/dashboard/usuario')} className="text-left px-3 py-2 rounded hover:bg-pink-700">
          Principal
        </button>
        <button onClick={() => router.push('/usuario/adopciones')} className="text-left px-3 py-2 rounded hover:bg-pink-700">
          Mis Adopciones
        </button>
        <button onClick={() => router.push('/usuario/donaciones')} className="text-left px-3 py-2 rounded hover:bg-pink-700">
          Mis Donaciones
        </button>
        <button onClick={() => router.push('/usuario/favoritos')} className="text-left px-3 py-2 rounded bg-pink-700 font-semibold">
          Mis Favoritos
        </button>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6 text-pink-700 text-center">Mis Favoritos</h1>

        {loading && <p className="text-center text-gray-500 mt-10">⏳ Cargando tus favoritos...</p>}
        {error && <p className="text-center text-red-600 mt-10">{error}</p>}
        {!loading && !error && favoritos.length === 0 && (
          <p className="text-center text-gray-500 mt-10">📭 No tenés favoritos aún.</p>
        )}

        {!loading && !error && favoritos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 items-stretch">
            {favoritos.map((favorito) => {
              const { caso } = favorito
              const mascotaApi = caso.mascota
              if (!mascotaApi) return null

              const mascota: Mascota = {
                id: mascotaApi.id ?? caso.mascotaId,
                casoId: caso.id,
                nombre: mascotaApi.nombre,
                tipo: caso.tipo.toLowerCase() === 'adopcion' ? 'adopcion' : 'donacion',
                imagenes: (mascotaApi.imagenes ?? []).map((img, idx) => ({
                  id: img.url || String(idx),
                  url: img.url,
                })),
                descripcion: caso.descripcion,
              }

              return (
                <div key={favorito.id} className="relative mx-10 h-full">
                  <MascotaCard
                    mascota={mascota}
                    modo={mascota.tipo as 'adopcion' | 'donacion'}
                    onConocerHistoria={handleConocerHistoria}
                    onAdoptar={() => handleAdoptarODonar(mascota.casoId)}
                    mostrarFavorito={false} // No mostrar el corazón
                  />
                  <button
                    onClick={() => handleEliminarFavorito(favorito)}
                    aria-label="Quitar de favoritos"
                    className="absolute top-2 right-2 text-2xl hover:text-red-600 transition"
                    type="button"
                  >
                    🗑️
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal historia (MascotaModal) */}
        {mascotaSeleccionada && (
          <MascotaModal
            visible={modalVisible}
            mascota={mascotaSeleccionada}
            onClose={() => setModalVisible(false)}
            onAccion={handleAdoptarODonar}
            modo={mascotaSeleccionada.tipo === 'adopcion' ? 'adopcion' : 'donacion'}
          />
        )}

        {/* Modal donación para elegir monto */}
        <DonarModal
          visible={donarModalVisible}
          onClose={() => {
            setDonarModalVisible(false)
            setDetalleDonacion(null)
          }}
          onConfirm={handleConfirmarDonacion}
          meta={detalleDonacion?.meta ?? 0}
          recaudado={detalleDonacion?.recaudado ?? 0}
        />
      </main>
    </div>
  )
}
