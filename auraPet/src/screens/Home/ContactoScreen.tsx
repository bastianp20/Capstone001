import { NavBar } from "../../components/NavBar"
import type { NavbarProps } from "../../interfaces"

export const ContactoScreen = ({onIngresar, onNavegar }: NavbarProps) => {
    return (
    <div >
        <NavBar vistaActiva="contacto" onNavegar={onNavegar} onIngresar={onIngresar}/>
        <h1> ¿Tienes dudas? Hablemos </h1>
         <br/>
         <p>Estamos para ayudarte a resolver cualquier consulta sobre auraPet</p>
    </div>
    )
}