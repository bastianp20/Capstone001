import { Link } from 'react-router-dom'
import '../styles/global.css'
import './PanelPage.css'
import { mascotas, usuarios, veterinarias, refugios, mascotasEnAdopcion } from '../data'
import type { EstadoControl } from '../data/types'

const estadoLabel: Record<EstadoControl, string> = {
  al_dia: 'Al día',
  pendiente: 'Pendiente',
  atrasado: 'Atrasado',
}

function PanelPage() {
  return (
    <div className="panel">
      <div className="wrap panel-header">
        <Link to="/" className="panel-back">
          ← Volver al inicio
        </Link>
        <div className="panel-badge">Datos mockeados</div>
      </div>

      <div className="wrap">
        <h1 className="panel-title">Panel de datos</h1>
        <p className="panel-subtitle">
          Vista de prueba con datos falsos: mascotas y su historial médico, veterinarias
          y refugios con mascotas en adopción. Se reemplazará por datos reales cuando el
          backend esté conectado.
        </p>
      </div>

      <section className="wrap panel-section">
        <h2>Mascotas y su historial médico</h2>
        <div className="panel-grid">
          {mascotas.map((mascota) => {
            const dueno = usuarios.find((u) => u.id === mascota.duenoId)
            const veterinaria = veterinarias.find((v) => v.id === mascota.veterinariaId)
            return (
              <article className="panel-card" key={mascota.id}>
                <div className="panel-card-header">
                  <div>
                    <h3>{mascota.nombre}</h3>
                    <p className="panel-card-meta">
                      {mascota.raza} · {mascota.edad} años · {mascota.sexo === 'macho' ? 'Macho' : 'Hembra'} · {mascota.peso} kg
                    </p>
                  </div>
                </div>
                <p className="panel-card-line">
                  <strong>Dueño:</strong> {dueno?.nombre ?? 'Sin asignar'}
                </p>
                <p className="panel-card-line">
                  <strong>Veterinaria:</strong> {veterinaria?.nombre ?? 'Sin asignar'}
                </p>

                <div className="panel-historial">
                  {mascota.historial.map((registro) => (
                    <div className="panel-historial-row" key={registro.id}>
                      <div>
                        <div className="panel-historial-desc">{registro.descripcion}</div>
                        <div className="panel-historial-fecha">
                          {registro.fecha}
                          {registro.proximaFecha ? ` · próxima: ${registro.proximaFecha}` : ''}
                        </div>
                      </div>
                      <span className={`estado-pill estado-${registro.estado}`}>{estadoLabel[registro.estado]}</span>
                    </div>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="wrap panel-section">
        <h2>Veterinarias</h2>
        <div className="panel-list">
          {veterinarias.map((vet) => (
            <div className="panel-list-row" key={vet.id}>
              <div>
                <div className="panel-list-title">{vet.nombre}</div>
                <div className="panel-list-sub">
                  {vet.direccion}, {vet.comuna}
                </div>
              </div>
              <div className="panel-list-sub">{vet.telefono}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap panel-section">
        <h2>Refugios y mascotas en adopción</h2>
        {refugios.map((refugio) => (
          <div className="panel-refugio" key={refugio.id}>
            <div className="panel-refugio-header">
              <h3>{refugio.nombre}</h3>
              <span className="panel-list-sub">
                {refugio.comuna} · {refugio.telefono}
              </span>
            </div>
            <div className="panel-grid">
              {mascotasEnAdopcion
                .filter((mascota) => mascota.refugioId === refugio.id)
                .map((mascota) => (
                  <article className="panel-card" key={mascota.id}>
                    <div className="panel-card-header">
                      <div>
                        <h3>{mascota.nombre}</h3>
                        <p className="panel-card-meta">
                          {mascota.raza} · {mascota.edadAprox} años · {mascota.sexo === 'macho' ? 'Macho' : 'Hembra'}
                        </p>
                      </div>
                      <span className={`estado-pill ${mascota.disponible ? 'estado-al_dia' : 'estado-atrasado'}`}>
                        {mascota.disponible ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>
                    <p className="panel-card-line">{mascota.descripcion}</p>
                    <div className="panel-tags">
                      <span className="panel-tag">Energía: {mascota.perfil.nivelEnergia}</span>
                      <span className="panel-tag">Tamaño: {mascota.perfil.tamano}</span>
                      <span className="panel-tag">{mascota.perfil.aptoNinos ? 'Apto niños' : 'No apto niños'}</span>
                      <span className="panel-tag">{mascota.perfil.aptoOtrasMascotas ? 'Apto otras mascotas' : 'Mejor solo'}</span>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default PanelPage
