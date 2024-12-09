import styles from './Container.module.css'

function Container({children}){
    return(
        <main className={styles.Container}>
            {children}
        </main>
    )
}

export default Container