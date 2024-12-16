import styles from './css/Input.module.css'

function Input({
    text,
    type,
    name,
    id,
    placeholder,
    handleOnChange,
    value,
}){
    return (
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}:</label>
            <input 
                type={type}
                name={name}
                id={id ? id : name}
                placeholder={placeholder}
                onChange={handleOnChange}
                value={value}
            />
        </div>
    )
}

export default Input