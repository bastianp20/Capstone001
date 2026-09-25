

import styles from "../css/Modal.module.css";
import type { ConocenosModalProps } from "../interfaces";


export const ConocenosModal = ({onCerrar}: ConocenosModalProps) => {
    return (
        <div className={styles.overlay} onClick={onCerrar}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
            <h3 className={styles.title}> ¿Quienes Somos? </h3>
            <button className={styles.closeButton} onClick={onCerrar}>
                ×
            </button>
            </div>
            <div className={styles.content}>
                <p> Somos auraPet, una startup chilena recién emergiendo, con gran pasión por los animales </p>
                <p> XUPALO ALAN </p>
            </div>
        </div>
        </div>
    )
}